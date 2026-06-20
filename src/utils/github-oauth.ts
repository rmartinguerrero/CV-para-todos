// src/utils/github-oauth.ts
/**
 * Utilidad para manejar la autenticación OAuth con GitHub
 * y las operaciones relacionadas con CV.
 */

export interface GithubUser {
  username: string;
  token?: string;
}

export interface DeployResponse {
  success: boolean;
  message: string;
  repository: string;
  webUrl: string;
  updateResults: any[];
}

export interface LoadResumeResponse {
  authenticated: boolean;
  data: any;
  source?: string;
  message?: string;
}

class GitHubOAuthClient {
  private readonly API_BASE = '/.netlify/functions';

  /**
   * Obtiene el usuario autenticado desde las cookies (solo disponible en servidor)
   * En el cliente, siempre retorna null.
   */
  getCurrentUser(): GithubUser | null {
    // En el navegador, no podemos acceder a cookies HttpOnly
    // pero podemos verificar si hay una cookie de usuario visible
    const userCookie = document.cookie.split(';')
      .find(c => c.trim().startsWith('github_user='));

    if (userCookie) {
      const username = userCookie.split('=')[1];
      return { username };
    }
    return null;
  }

  /**
   * Redirige al usuario al flujo de login de GitHub
   */
  async login(): Promise<void> {
    try {
const response = await fetch(`${this.API_BASE}/auth-login`, {
        method: 'POST',
        credentials: 'include'
      });

      // El endpoint retorna un 302, el navegador seguirá automáticamente
      // Si llegamos aquí sin error, la redirección funcionó
    } catch (error) {
      console.error('Error al iniciar login:', error);
      throw error;
    }
  }

  /**
   * Carga los datos del CV guardados del usuario
   */
  async loadResume(lang: string = 'es'): Promise<LoadResumeResponse> {
    try {
      const response = await fetch(
        `${this.API_BASE}/load-resume?lang=${encodeURIComponent(lang)}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al cargar el CV');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al cargar CV:', error);
      throw error;
    }
  }

  /**
   * Guarda/despliega el CV del usuario
   */
  async deploy(
    langs: string[],
    resumeData: any,
    sourceRepo?: string
  ): Promise<DeployResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/deploy`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          langs,
          resumeData,
          sourceRepo
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al desplegar');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en deploy:', error);
      throw error;
    }
  }

  /**
   * Verifica si el usuario está autenticado con GitHub
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Logout: limpia las cookies del usuario (simulado, Netlify lo maneja)
   */
  async logout(): Promise<void> {
    // En una app real, habría un endpoint /api/auth/logout
    // Por ahora, instruimos al usuario a limpiar cookies manualmente
    document.cookie = 'github_token=; Max-Age=0; Path=/';
    document.cookie = 'github_user=; Max-Age=0; Path=/';
  }
}

// Exportar instancia singleton
export const githubOAuth = new GitHubOAuthClient();
