import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
);

const StatusDistribution = ({ notifications, logo, company }) => {
    const sortedNotifications = notifications.reduce(
        (sortedNotifications, notification) => {
            const notificationDate = notification["job_title"];
            if (notificationDate in sortedNotifications) {
                sortedNotifications[notificationDate]++;
            } else {
                sortedNotifications[notificationDate] = 1;
            }
            return sortedNotifications;
        },
        {}
    );

    const revenuePerJob = notifications.reduce(
        (revenuePerJob, notification) => {
            const notificationDate = notification["job_title"];
            if (notificationDate in revenuePerJob) {
                revenuePerJob[notificationDate] = revenuePerJob[notificationDate] + parseFloat(notification["gross_total"]);
            } else {
                revenuePerJob[notificationDate] = parseFloat(notification["gross_total"]);
            }
            return revenuePerJob;
        },
        {}
    );

    const averageRevenuePerJob = Object.values(revenuePerJob).map(function (n, i) { return (n / Object.values(sortedNotifications)[i]).toFixed(2); });

    const data = {
        labels: Object.keys(sortedNotifications),
        datasets: [

            {
                type: 'bar',
                label: "Revenue per Profession",
                yAxisID: 'A',
                data: Object.values(revenuePerJob),

                backgroundColor: "rgb(5, 191, 58, 0.4)",
                borderColor: "rgb(5, 191, 58, 1)",
            },
            {
                type: 'bar',
                label: "Number of contract per Profession",
                yAxisID: 'B',
                data: Object.values(sortedNotifications),

                backgroundColor: "rgb(255, 99, 132, 0.4)",
                borderColor: "rgb(255, 99, 132, 1)",
            },
            {
                type: 'scatter',
                label: "Average Revenue per Profession per Contract",
                yAxisID: 'C',
                data: Object.values(averageRevenuePerJob),
                borderWidth: 1,
                backgroundColor: "rgb(0, 51, 255, 1)",
                borderColor: "rgb(0, 51, 255, 1)",
            },
        ],
    };

    const options = {
    

        scales: {


            A: {
                beginAtZero: false,
                position: 'left',
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, ticks) {
                        return '$' + value;
                    },
                    color: "rgb(5, 191, 58)", // this here
                }
            },
            B: {
                beginAtZero: true,
                position: 'right',
                ticks: {
                    color: "rgb(255, 99, 132, 1)", // this here
                    stepSize: 1
                }
            },
            C: {
                beginAtZero: false,
                position: 'right',
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, ticks) {
                        return '$' + value;
                    },
                    color: "rgb(0, 51, 255, 1)", // this here
                }
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Profession Distribution'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            if (context.dataset.yAxisID === 'A' || context.dataset.yAxisID === 'C') {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                            } else {
                                label += context.parsed.y;
                            }
                        }
                        return label;
                    }
                }
            }
        }
    };

    return (
        <Bar data={data} options={options} />
    );
};

export default StatusDistribution;