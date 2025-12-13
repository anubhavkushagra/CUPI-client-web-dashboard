const User = require('./models/User');

let ioInstance;

const initSocket = (io) => {
    ioInstance = io;

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Identify user
        socket.on('register', async (userId) => {
            socket.userId = userId;
            socket.join(userId);
            try {
                const user = await User.findById(userId);
                if (user) {
                    socket.emit('portfolio-update', user.portfolio);
                    socket.emit('balance-update', user.balance);
                    socket.emit('subscriptions-update', user.subscriptions);
                    // Send history
                    socket.emit('history-update', user.transactions);
                }
            } catch (err) {
                console.error('Socket Register Error:', err);
            }
        });

        socket.on('subscribe', async ({ userId, ticker }) => {
            try {
                // Ensure unique subscription
                await User.findByIdAndUpdate(userId, {
                    $addToSet: { subscriptions: ticker }
                });

                // Fetch updated user to sync
                const user = await User.findById(userId);
                io.to(userId).emit('subscriptions-update', user.subscriptions);
            } catch (err) {
                console.error('Subscribe Error:', err);
            }
        });

        socket.on('unsubscribe', async ({ userId, ticker }) => {
            try {
                await User.findByIdAndUpdate(userId, {
                    $pull: { subscriptions: ticker }
                });
                const user = await User.findById(userId);
                io.to(userId).emit('subscriptions-update', user.subscriptions);
            } catch (err) {
                console.error('Unsubscribe Error:', err);
            }
        });

        socket.on('trade', async ({ userId, action, ticker, quantity, price }) => {
            try {
                const user = await User.findById(userId);
                if (!user) return;

                const cost = quantity * price;

                if (action === 'BUY') {
                    if (user.balance >= cost) {
                        user.balance -= cost;

                        // Portfolio Map handling
                        const currentQty = user.portfolio.get(ticker) || 0;
                        user.portfolio.set(ticker, currentQty + quantity);

                        // Add transaction
                        user.transactions.push({ action, ticker, quantity, price });

                        await user.save();
                    } else {
                        socket.emit('error', 'Insufficient balance');
                        return;
                    }
                } else if (action === 'SELL') {
                    const currentQty = user.portfolio.get(ticker) || 0;
                    if (currentQty >= quantity) {
                        user.balance += cost;

                        const newQty = currentQty - quantity;
                        if (newQty === 0) {
                            user.portfolio.delete(ticker);
                        } else {
                            user.portfolio.set(ticker, newQty);
                        }

                        // Add transaction
                        user.transactions.push({ action, ticker, quantity, price });

                        await user.save();
                    } else {
                        socket.emit('error', 'Insufficient holdings');
                        return;
                    }
                }

                // Sync updates
                io.to(userId).emit('portfolio-update', user.portfolio);
                io.to(userId).emit('balance-update', user.balance);
                io.to(userId).emit('history-update', user.transactions); // Send updated history
                io.to(userId).emit('trade-success', `Successfully ${action} ${quantity} ${ticker}`);

            } catch (err) {
                console.error('Trade Error:', err);
                socket.emit('error', 'Trade failed');
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};

module.exports = { initSocket };
