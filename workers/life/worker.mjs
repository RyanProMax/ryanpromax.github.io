const base = '/api/life/';
const cookieName = '__Host-life_session';
const lifetime = 60 * 60 * 4;

function reply(status, body = null, extra = {}) {
  return new Response(body, {
    status,
    headers: {
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
      ...extra,
    },
  });
}

const utf8 = (value) => new TextEncoder().encode(value);
function hex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
function sessionKey(secret) {
  return crypto.subtle.importKey('raw', utf8(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

async function allowed(request, secret) {
  const value = request.headers
    .get('Cookie')
    ?.split(';')
    .map((v) => v.trim())
    .find((v) => v.startsWith(cookieName + '='))
    ?.slice(cookieName.length + 1);
  const match = /^(\d{10})\.([a-f0-9]{64})$/.exec(value ?? '');
  const now = Math.floor(Date.now() / 1000);
  if (!match || +match[1] <= now || +match[1] > now + lifetime) return false;
  const signature = Uint8Array.from(match[2].match(/../g), (v) => parseInt(v, 16));
  return crypto.subtle.verify('HMAC', await sessionKey(secret), signature, utf8(match[1]));
}

async function readPassword(request) {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let size = 0;
  let body = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return body + decoder.decode();
      size += value.byteLength;
      if (size > 512) {
        await reader.cancel();
        return null;
      }
      body += decoder.decode(value, { stream: true });
    }
  } catch {
    return null;
  }
}

async function passwordMatches(password, expected) {
  const digests = await Promise.all(
    [password, expected].map(
      async (v) => new Uint8Array(await crypto.subtle.digest('SHA-256', utf8(v)))
    )
  );
  return digests[0].reduce((difference, v, i) => difference | (v ^ digests[1][i]), 0) === 0;
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.host !== env.LIFE_HOST || !url.pathname.startsWith(base)) return reply(404);
    if (
      !env.LIFE_PASSWORD ||
      env.LIFE_PASSWORD.length < 16 ||
      !env.LIFE_SESSION_KEY ||
      env.LIFE_SESSION_KEY.length < 32 ||
      env.LIFE_SESSION_KEY === env.LIFE_PASSWORD
    )
      return reply(503);
    const path = url.pathname.slice(base.length);
    if (path === 'unlock' && request.method === 'POST') {
      if (request.headers.get('Origin') !== url.origin) return reply(403);
      const client = request.headers.get('CF-Connecting-IP');
      if (!client || !env.LIFE_LOGIN_LIMIT) return reply(503);
      if (!(await env.LIFE_LOGIN_LIMIT.limit({ key: client })).success) {
        return reply(429, null, { 'Retry-After': '60' });
      }
      const password = await readPassword(request);
      if (password === null || !(await passwordMatches(password, env.LIFE_PASSWORD)))
        return reply(401);
      const expires = String(Math.floor(Date.now() / 1000) + lifetime);
      const signature = hex(
        new Uint8Array(
          await crypto.subtle.sign('HMAC', await sessionKey(env.LIFE_SESSION_KEY), utf8(expires))
        )
      );
      return reply(204, null, {
        'Set-Cookie': `${cookieName}=${expires}.${signature}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${lifetime}`,
      });
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') return reply(405);
    if (!(path === 'entries' || /^photos\/[a-z0-9-]+\.webp$/.test(path))) return reply(404);
    if (!(await allowed(request, env.LIFE_SESSION_KEY))) return reply(401);
    const asset = await env.LIFE_ASSETS.fetch(
      new URL(path === 'entries' ? '/entries.json' : '/' + path, 'https://assets.local')
    );
    if (asset.status !== 200) return reply(404);
    return reply(200, request.method === 'HEAD' ? null : asset.body, {
      'Content-Type': path === 'entries' ? 'application/json; charset=utf-8' : 'image/webp',
    });
  },
};

export default worker;
