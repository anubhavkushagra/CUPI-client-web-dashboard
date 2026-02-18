import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import { socket } from './socket';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            socket.emit('register', JSON.parse(storedUser).id);
        }
    }, []);

    const handleLogin = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        setUser(userData);
        // Identify on socket
        socket.emit('register', userData.id);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
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
