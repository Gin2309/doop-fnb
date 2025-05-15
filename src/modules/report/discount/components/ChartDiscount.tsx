import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import React from 'react';

// Register các component cần thiết cho chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ChartDataItem = {
    label: string;
    value: number;
    // color: string;
};

type ChartProps = {
    data: ChartDataItem[];
};

function generateColorPalette(n: number) {
    const colors: string[] = [];
    for (let i = 0; i < n; i++) {
        const hue = Math.floor((360 / n) * i); // chia đều hue
        const saturation = 70 + Math.random() * 30; // độ bão hòa: 70-100%
        const lightness = 50 + Math.random() * 10; // độ sáng: 50-60%
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
}

const ChartDiscount: React.FC<ChartProps> = ({ data }) => {
    const colors = generateColorPalette(data.length);
    const chartData = {
        labels: data.map((item) => item.label),
        datasets: [
            {
                data: data.map((item) => item.value),
                backgroundColor: colors,
                borderRadius: 0, // bo góc thanh
                barThickness: 40,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const, // chuyển thành bar ngang
        responsive: true,
        layout: {
            padding: {
                left: 70, // ✅ padding trái 70px
            },
        },
        scales: {
            x: {
                ticks: {
                    callback: (value: number) => {
                        if (value >= 1000) {
                            return `${value / 1000}k`;
                        }
                        return value;
                    },
                    color: '#666',
                    font: {
                        size: 14,
                        weight: '400',
                    },
                },
                grid: {
                    drawBorder: false,
                },
            },
            y: {
                ticks: {
                    color: '#666',
                    font: {
                        size: 14,
                        weight: '400',
                    },
                },
                grid: {
                    drawBorder: false,
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                display: false, // ẩn legend
            },
        },
    };

    // @ts-ignore
    return <Bar data={chartData} options={options} height={data.length ? 32 * data.length : 32} />;
};

export default ChartDiscount;
