async function test() {
  try {
    const ts = Date.now();
    const email = `test${ts}@example.com`;
    console.log('Registering user...');
    
    let res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: email,
        password: 'password123',
        phone: '1234567890',
        address: '123 Test St',
        role: 'user'
      })
    });
    
    if (!res.ok) throw new Error(await res.text());
    
    console.log('User registered successfully');

    console.log('Attempting login...');
    res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: 'password123'
      })
    });
    
    if (!res.ok) throw new Error(await res.text());
    console.log('Login successful:', await res.json());
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
