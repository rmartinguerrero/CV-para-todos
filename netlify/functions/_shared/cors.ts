export function getCorsOrigin(): string {
  return process.env.URL || process.env.DEPLOY_URL || '*';
}

export function corsHeaders(methods = 'GET, OPTIONS'): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': getCorsOrigin(),
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': methods,
  };
}
