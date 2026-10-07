const baseUrl = 'http://localhost:5000/api/auth';
const randomEmail = `testuser_${Date.now()}@example.com`;
const mockPass = 'securePassword123';
let token = null;

async function runTests() {
    console.log("1. Testing Registration...");
    const regRes = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Test User',
            email: randomEmail,
            password: mockPass,
            confirmPassword: mockPass
        })
    });
    if (regRes.status !== 201) throw new Error(`Registration failed: ${await regRes.text()}`);
    console.log("Registration Passed!");

    console.log("2. Testing Login...");
    const loginRes = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: randomEmail,
            password: mockPass,
        })
    });
    if (loginRes.status !== 200) throw new Error(`Login failed: ${await loginRes.text()}`);
    const loginData = await loginRes.json();
    token = loginData.token;
    if (!token) throw new Error(`Login passed but token is missing!`);
    console.log("Login Passed!");

    console.log("3. Testing GET /me...");
    const meRes = await fetch(`${baseUrl}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (meRes.status !== 200) throw new Error(`/me failed: ${await meRes.text()}`);
    const meData = await meRes.json();
    if (meData.password_hash) throw new Error(`/me returned password_hash which shouldn't happen!`);
    console.log("/me Passed! User endpoint behaves correctly.");

    console.log("4. Testing Duplicate Registration...");
    const dupRegRes = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Test User 2',
            email: randomEmail,
            password: mockPass,
            confirmPassword: mockPass
        })
    });
    if (dupRegRes.status !== 400) throw new Error(`Duplicate Registration should be 400, got ${dupRegRes.status}`);
    console.log("Duplicate Registration Passed (Rejected correctly)!");

    console.log("5. Testing Invalid Login...");
    const badLoginRes = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: randomEmail,
            password: "wrongPassword456",
        })
    });
    if (badLoginRes.status !== 400) throw new Error(`Invalid Login should be 400, got ${badLoginRes.status}`);
    console.log("Invalid Login Passed (Rejected correctly)!");

    console.log("ALL TESTS PASSED SUCCESSFULLY");
}

runTests().catch(e => {
    console.error("TEST FAILED:", e.message);
    process.exit(1);
});
