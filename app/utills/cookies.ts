export function setJwtCookie(jwt: string) {
  return `jwt=${jwt}; HttpOnly; Path=/; SameSite=Lax; Secure`;
}

export function getJwtFromRequest(request: Request) {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;

  const match = cookie.match(/jwt=([^;]+)/);
  return match ? match[1] : null;
}

export function clearJwtCookie() {
  return `jwt=; HttpOnly; Path=/; SameSite=Lax; Secure; Max-Age=0`;
}

export function isJwtExpired(jwt: string | null): boolean {
  if (!jwt) return true;
  try {
    const payload = JSON.parse(
      Buffer.from(jwt.split('.')[1], 'base64url').toString(),
    );
    return payload.exp < Date.now() / 1000;
  } catch {
    return true;
  }
}
