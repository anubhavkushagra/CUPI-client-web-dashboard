/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cupi-dark': '#0f172a',
                'cupi-card': '#1e293b',
                'cupi-accent': '#38bdf8',
                'cupi-green': '#10b981',
                'cupi-red': '#ef4444'
            }
        },
    },
    plugins: [],
}
