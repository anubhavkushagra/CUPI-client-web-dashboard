import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import { socket } from './socket';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // If we had a real persistence, we'd check local storage here
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        // Identify on socket
        socket.emit('register', userData.id);
    };

    const handleLogout = () => {
        setUser(null);
        socket.disconnect();
        socket.connect(); // Reconnect as fresh
    };

    return (
        <div className="min-h-screen">
            <ToastContainer position="top-right" theme="dark" />
            {!user ? (
                <Login onLogin={handleLogin} />
            ) : (
                <Dashboard user={user} onLogout={handleLogout} />
            )}
        </div>
    );
}

export default App;
