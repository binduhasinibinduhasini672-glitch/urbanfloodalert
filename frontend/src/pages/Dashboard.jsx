import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="pt-24 min-h-screen bg-slate-50 px-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Hello, {user?.email}</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-md shadow-blue-500/20">
                    + New Report
                </button>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 min-h-[400px] flex items-center justify-center text-slate-500">
                Reports will appear here.
            </div>
        </div>
    );
}
