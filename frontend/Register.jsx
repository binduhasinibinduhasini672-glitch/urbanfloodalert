import React, { useState } from 'react';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Safe string extraction (no React child object error)
                const message = typeof data.error === 'string' ? data.error :
                    typeof data.message === 'string' ? data.message :
                        JSON.stringify(data.error || data || 'Registration failed');
                setErrorMsg(message);
                setLoading(false);
                return;
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user || {}));
                window.location.href = '/dashboard';
            } else {
                window.location.href = '/login';
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Cannot connect to backend server. Ensure backend is running on port 5000.');
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#111827', color: '#fff', fontFamily: 'sans-serif' }}>
            <form onSubmit={handleRegister} style={{ backgroundColor: '#1f2937', padding: '2rem', borderRadius: '8px', width: '320px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>Register</h2>

                {errorMsg && (
                    <div style={{ backgroundColor: '#ef4444', color: '#fff', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem', wordBreak: 'break-word' }}>
                        {errorMsg}
                    </div>
                )}

                <div style={{ marginBottom: '0.75rem' }}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #374151', backgroundColor: '#374151', color: '#fff', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #374151', backgroundColor: '#374151', color: '#fff', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password (min 6 characters)"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #374151', backgroundColor: '#374151', color: '#fff', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #374151', backgroundColor: '#374151', color: '#fff', boxSizing: 'border-box' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>
        </div>
    );
}