import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './worker.mjs';

test('Life assets are readable only with an unexpired server-issued session', async () => {
  let reads = 0;
  let remaining = 4;
  const host = 'https://ryanzh.me';
  const password = 'test-fixture-not-a-real-password';
  const env = {
    LIFE_HOST: 'ryanzh.me',
    LIFE_PASSWORD: password,
    LIFE_SESSION_KEY: 'test-only-session-key-not-for-production',
    LIFE_LOGIN_LIMIT: {
      async limit() {
        return { success: remaining-- > 0 };
      },
    },
    LIFE_ASSETS: {
      async fetch() {
        reads++;
        return new Response('private-test-only');
      },
    },
  };
  const send = (path, options) => worker.fetch(new Request(host + path, options), env);
  const login = (body, origin = host) =>
    send('/api/life/unlock', {
      method: 'POST',
      body,
      headers: { Origin: origin, 'CF-Connecting-IP': '192.0.2.1' },
    });
  for (const path of ['/api/life/entries', '/api/life/photos/a.webp']) {
    const res = await send(path);
    assert.equal(res.status, 401);
    assert.equal(await res.text(), '');
    assert.match(res.headers.get('Cache-Control'), /no-store/);
  }
  assert.equal((await send('/entries.json')).status, 404);
  assert.equal((await send('/api/life/entries.json')).status, 404);
  assert.equal((await login(password, 'https://other.example')).status, 403);
  assert.equal((await login('wrong')).status, 401);
  assert.equal((await login('z'.repeat(513))).status, 401);
  assert.equal(reads, 0);
  const ok = await login(password);
  assert.equal(ok.status, 204);
  const setCookie = ok.headers.get('Set-Cookie');
  assert.match(setCookie, /HttpOnly; Secure; SameSite=Strict/);
  const Cookie = setCookie.split(';')[0];
  assert.equal(
    (await send('/api/life/entries', { headers: { Cookie: Cookie + '0' } })).status,
    401
  );
  assert.equal(
    (
      await send('/api/life/entries', {
        headers: { Cookie: Cookie.replace(/=\d+\./, '=1000000000.') },
      })
    ).status,
    401
  );
  for (const path of ['/api/life/entries', '/api/life/photos/a.webp']) {
    const res = await send(path, { headers: { Cookie } });
    assert.equal(res.status, 200);
    assert.equal(await res.text(), 'private-test-only');
    assert.match(res.headers.get('Cache-Control'), /no-store/);
  }
  assert.equal(reads, 2);
  assert.equal((await login('wrong')).status, 401);
  assert.equal((await login(password)).status, 429);
  const unavailable = await worker.fetch(new Request(host + '/api/life/entries'), {
    ...env,
    LIFE_SESSION_KEY: '',
  });
  assert.equal(unavailable.status, 503);
});
