# Stock Broker Client Web Dashboard

**Live Demo:** [https://cupi-client-web-dashboard-production.up.railway.app/](https://cupi-client-web-dashboard-production.up.railway.app/)

## Overview
A full-stack, real-time stock trading dashboard built with the **MERN Stack** (MongoDB, Express, React, Node.js). It simulates a live stock market environment where users can buy/sell stocks, track their portfolio, and view real-time price trends.

## Key Features
*   **Real-Time Updates**: Live stock prices updated instantly using **Socket.IO**.
*   **User Authentication**: Secure Signup & Login with data persistence in **MongoDB Atlas**.
*   **Portfolio Management**: Track holdings, balance, and total portfolio value dynamically.
*   **Transaction History**: Detailed log of all buy/sell actions.
*   **Interactive UI**: Modern, glassmorphism-inspired design with **Tailwind CSS** and live Sparkline charts.

## Tech Stack
*   **Frontend**: React, Vite, Tailwind CSS, Chart.js
*   **Backend**: Node.js, Express, Socket.IO
*   **Database**: MongoDB Atlas
*   **Deployment**: Railway (Full Stack)

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
    *(Replace `your_mongodb_connection_string_here` with your actual MongoDB Atlas URI)*
4.  Start the backend server:
    ```bash
    npm start
    ```
    *You should see "Server running on port 5000" and "MongoDB Connected".*

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
