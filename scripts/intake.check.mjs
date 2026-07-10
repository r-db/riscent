// intake.check.mjs — gate for the post-verification intake chat (written RED first).
//   node scripts/intake.check.mjs [base]   (default https://riscent.com)
// Proves the route exists and enforces the verified-phone gate without burning SMS:
//   1. unverified phone → 403 (route missing → 404 → RED)
//   2. junk payload → 400
import assert from 'node:assert';

const BASE = process.argv[2] || 'https://riscent.com';
const post = (path, data) => fetch(`${BASE}${path}`, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data),
}).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));

// 1. unverified phone is refused — the verified-phone gate is the security boundary
const unverified = await post('/api/book/intake', {
  phone: '5555550123',
  messages: [{ role: 'user', content: 'hello' }],
});
assert.strictEqual(unverified.status, 403, `expected 403 for unverified phone, got ${unverified.status}: ${JSON.stringify(unverified.body)}`);

// 2. malformed payload is rejected
const junk = await post('/api/book/intake', { nonsense: true });
assert.strictEqual(junk.status, 400, `expected 400 for junk payload, got ${junk.status}`);

console.log(`INTAKE GATE: PASS (2/2) against ${BASE}`);
