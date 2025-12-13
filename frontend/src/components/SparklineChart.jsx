import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler
);

export default function SparklineChart({ history, color }) {
    const data = {
        labels: history.map((_, i) => i),
        datasets: [
            {
                data: history,
                borderColor: color,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 100);
                    gradient.addColorStop(0, color + '40'); // 25% opacity
                    gradient.addColorStop(1, color + '00'); // 0% opacity
                    return gradient;
                },
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
        scales: {
            x: { display: false },
            y: { display: false },
        },
        animation: { duration: 0 } // Disable for realtime performance
    };

    return (
        <div className="h-16 w-32">
            <Line data={data} options={options} />
        </div>
    );
}
