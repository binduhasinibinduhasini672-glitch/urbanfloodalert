import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to login');
        }
    };

    return (
        <div className="pt-24 min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">Welcome Back</h2>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md shadow-blue-500/20">
                        Sign In
                    </button>
                </form>
                <p className="mt-6 text-center text-slate-600 text-sm">
                    Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}
