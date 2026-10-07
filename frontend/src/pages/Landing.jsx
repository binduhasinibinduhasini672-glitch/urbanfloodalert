import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div className="pt-24 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
            <div className="max-w-3xl text-center space-y-8 glass p-12 rounded-3xl">
                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                    Smarter <span className="text-blue-600">Urban Flood</span> Alerts
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Report water levels, drainage status, and rainfall to instantly calculate flood risks in your area. Powered by AI explanations.
                </p>
                <div className="flex items-center justify-center gap-4 pt-4">
                    <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-xl shadow-blue-500/30">
                        Start Reporting
                    </Link>
                    <Link to="/login" className="bg-white hover:bg-slate-50 text-slate-800 px-8 py-3 rounded-full font-semibold text-lg transition-all border border-slate-200 shadow-sm hover:shadow-md">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
