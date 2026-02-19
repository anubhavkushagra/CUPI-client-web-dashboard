import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.log('Socket connecting to:', URL);

export const socket = io(URL, {
    autoConnect: true, // Auto connect
});
