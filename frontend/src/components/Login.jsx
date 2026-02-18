import { useState } from 'react';
import { login, signup } from '../api';
// tool for showing temporary popup messages
import { toast } from 'react-toastify';

export default function Login({ onLogin }) {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // to disable the button while loading
        setLoading(true);
        try {
            let data;
            if (isSignup) {
                await signup(name, email, password);
                toast.success('Account created! Logging in...');
                // Auto login after signup
                const res = await login(email, password);
                data = res.data;
            } else {
                const res = await login(email, password);
                data = res.data;
            }
            onLogin(data);
            toast.success(`Welcome ${isSignup ? '' : 'back'}, ${data.email}`);
        } catch (err) {
            console.error('Auth error:', err);
            toast.error(err.response?.data?.message || 'Authentication failed');
        } finally {
            // to enable the button after loading
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cupi-dark">
            <div className="w-full max-w-md p-8 glass rounded-2xl shadow-xl border border-white/5">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cupi-accent to-purple-500 mb-6 text-center">
                    {isSignup ? 'Create Account' : 'CUPI Broker'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {isSignup && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cupi-accent outline-none transition-all"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cupi-accent outline-none transition-all"
                            placeholder="user@cupi.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-cupi-accent outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-cupi-accent to-blue-600 hover:to-blue-500 rounded-lg font-bold text-white shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Enter Dashboard')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                        onClick={() => setIsSignup(!isSignup)}
                        className="text-cupi-accent hover:underline font-bold"
                    >
                        {isSignup ? 'Login' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
}
