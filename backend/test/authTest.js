import app from '../src/app.js';
import http from 'http';

const PORT = 5055;

async function runInternalAuthTests() {
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`\n🧪 [TEST RUNNER] Test Server started on port ${PORT}`);

  const baseUrl = `http://localhost:${PORT}/api/auth`;

  let passed = 0;
  let failed = 0;

  async function assert(testName, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${testName}:`, err.message);
      failed++;
    }
  }

  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@beautypals.com`,
    password: 'Password@123',
    fullName: 'Nguyen Van Test',
  };

  let authToken = '';
  let resetToken = '';

  // 1. Health check
  await assert('Health Check API returns status 200', async () => {
    const res = await fetch(`http://localhost:${PORT}/api/health`);
    const data = await res.json();
    if (res.status !== 200 || data.status !== 'ok') {
      throw new Error(`Unexpected health response: ${JSON.stringify(data)}`);
    }
  });

  // 2. Register new user
  await assert('POST /api/auth/register creates a new user', async () => {
    const res = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const data = await res.json();
    if (res.status !== 201 || !data.success || !data.data.token) {
      throw new Error(`Registration failed: ${JSON.stringify(data)}`);
    }
    authToken = data.data.token;
  });

  // 3. Register duplicate email fails
  await assert('POST /api/auth/register fails on duplicate email', async () => {
    const res = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const data = await res.json();
    if (res.status !== 409 || data.success) {
      throw new Error(`Expected 409 conflict, got ${res.status}: ${JSON.stringify(data)}`);
    }
  });

  // 4. Login with email
  await assert('POST /api/auth/login succeeds with valid credentials', async () => {
    const res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account: testUser.email,
        password: testUser.password,
      }),
    });
    const data = await res.json();
    if (res.status !== 200 || !data.success || !data.data.token) {
      throw new Error(`Login failed: ${JSON.stringify(data)}`);
    }
    authToken = data.data.token;
  });

  // 5. Login with invalid password fails
  await assert('POST /api/auth/login rejects invalid password', async () => {
    const res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account: testUser.email,
        password: 'WrongPassword!',
      }),
    });
    const data = await res.json();
    if (res.status !== 401 || data.success) {
      throw new Error(`Expected 401 unauthorized, got ${res.status}`);
    }
  });

  // 6. Get profile /api/auth/me with Bearer token
  await assert('GET /api/auth/me returns profile for authenticated user', async () => {
    const res = await fetch(`${baseUrl}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    const data = await res.json();
    if (res.status !== 200 || !data.success || data.data.email !== testUser.email) {
      throw new Error(`Profile fetch failed: ${JSON.stringify(data)}`);
    }
  });

  // 7. Forgot Password
  await assert('POST /api/auth/forgot-password issues reset token', async () => {
    const res = await fetch(`${baseUrl}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email }),
    });
    const data = await res.json();
    if (res.status !== 200 || !data.success || !data.data.resetToken) {
      throw new Error(`Forgot password failed: ${JSON.stringify(data)}`);
    }
    resetToken = data.data.resetToken;
  });

  // 8. Reset Password with token
  const newPassword = 'NewSecretPassword@2026';
  await assert('POST /api/auth/reset-password changes user password', async () => {
    const res = await fetch(`${baseUrl}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: resetToken,
        newPassword,
      }),
    });
    const data = await res.json();
    if (res.status !== 200 || !data.success) {
      throw new Error(`Reset password failed: ${JSON.stringify(data)}`);
    }
  });

  // 9. Login with new password
  await assert('POST /api/auth/login works with newly updated password', async () => {
    const res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account: testUser.email,
        password: newPassword,
      }),
    });
    const data = await res.json();
    if (res.status !== 200 || !data.success) {
      throw new Error(`Re-login failed: ${JSON.stringify(data)}`);
    }
  });

  console.log(`\n====================================================`);
  console.log(`  📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`====================================================\n`);

  server.close();
  process.exit(failed > 0 ? 1 : 0);
}

runInternalAuthTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
