import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Key } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 flex items-center justify-between px-6 py-4 fixed w-full z-10 top-0">
            <Link to="/" className="text-xl font-extrabold text-blue-600 flex items-center gap-2">
                <Home className="w-6 h-6" />
                UrbanFlood
            </Link>
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
                        <button onClick={logout} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium">
                            <Key className="w-4 h-4" /> Login
                        </Link>
                        <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-md shadow-blue-500/20">
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
