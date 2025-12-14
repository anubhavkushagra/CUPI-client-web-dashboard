# Stock Broker Client Web Dashboard

**Live Demo:** [https://cupi-client-web-dashboard-production.up.railway.app/](https://cupi-client-web-dashboard-production.up.railway.app/)

## Overview
A full-stack, real-time stock trading dashboard built with the **MERN Stack**. It simulates a live stock market environment where users can buy/sell stocks, track their portfolio, and view real-time price trends.

## ⭐ Key Highlights & Extra Features
*   **Virtual Stock Trading Engine**: A custom-built trading logic allows users to buy/sell stocks with virtual currency. It calculates total holdings, updates cash balance instantly, and prevents invalid trades (e.g., insufficient funds).
*   **Real-Time Data Streams**: Uses **Socket.IO** to push stock price updates to all connected clients simultaneously with low latency.
*   **Transaction History**: Persistent logging of every trade for audit capability.

## 🚀 Deployment Strategy & Challenges
Deploying a Real-Time application presents unique challenges compared to standard websites.

### The Challenge: WebSockets & Serverless
Initially considered **Vercel** for the backend, but Vercel uses **Serverless Functions** which are designed to shut down immediately after a response. This architecture kills **Persistent Connections** (WebSockets/Socket.IO), breaking the real-time ticker and trading features.

### The Solution: Railway for Persistence
To solve this, I deployed the backend on **Railway**, which provides persistent containers that allow the Socket.IO server to stay alive 24/7. This ensures:
1.  **Uninterrupted Data Flow**: Prices stream continuously.
2.  **Instant Synchronization**: Portfolio updates reflect immediately across devices.
3.  **Low Latency**: Direct WebSocket connection without polling.

## Key Features
*   **Real-Time Updates**: Live stock prices updated instantly.
*   **User Authentication**: Secure Signup & Login with data persistence in **MongoDB Atlas**.
*   **Portfolio Management**: Track holdings, balance, and total portfolio value dynamically.
*   **Interactive UI**: Modern, glassmorphism-inspired design with **Tailwind CSS**.

## Tech Stack
*   **Frontend**: React, Vite, Tailwind CSS, Chart.js
*   **Backend**: Node.js, Express, Socket.IO
*   **Database**: MongoDB Atlas
*   **Deployment**: Railway (Backend & Frontend)

---

## 🛠️ Installation & Local Setup

Follow these steps to run the project locally on your machine.

### Prerequisites
*   Node.js installed (v16+ recommended).
*   A MongoDB Atlas Connection String (or local MongoDB).

### 1. Clone the Repository
```bash
git clone https://github.com/anubhavkushagra/CUPI-client-web-dashboard.git
cd CUPI-client-web-dashboard
```

### 2. Backend Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` folder:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string_here
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```

### 3. Frontend Setup
1.  Open a **new terminal** and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend` folder:
    ```env
    VITE_API_URL=http://localhost:5000
    ```
4.  Start the React development server:
    ```bash
    npm run dev
    ```

### 4. Running the App
*   Open your browser and go to the link shown in the terminal (usually `http://localhost:5173`).
*   Sign up for a new account and start trading!

---
*Built by Anubhav Kushagra*
