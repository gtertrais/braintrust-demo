import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const Timeline = ({ notifications, logo, company, total, totalBTRST }) => {
  const sortedRevenue = notifications.reduce(
    (sortedRevenue, notification) => {
      const notificationDate = notification["batch"];
      if (notificationDate in sortedRevenue) {
        sortedRevenue[notificationDate] = sortedRevenue[notificationDate] + parseFloat(notification["gross_total"]);
      } else {
        sortedRevenue[notificationDate] = parseFloat(notification["gross_total"]);
      }
      return sortedRevenue;
    },
    {}
  );

  const sortedXLabel = notifications.reduce(
    (sortedRevenue, notification) => {
      const notificationDate = notification["batch"];
      if (notificationDate in sortedRevenue) {
        sortedRevenue[notificationDate] = notification["batch__name"].replace('Network Fees', '');
      } else {
        sortedRevenue[notificationDate] = notification["batch__name"].replace('Network Fees', '');
      }
      return sortedRevenue;
    },
    {}
  );

  const sortedNotifications = notifications.reduce(
    (sortedNotifications, notification) => {
      const notificationDate = notification["batch"];
      if (notificationDate in sortedNotifications) {
        sortedNotifications[notificationDate]++;
      } else {
        sortedNotifications[notificationDate] = 1;
      }
      return sortedNotifications;
    },
    {}
  );


  const revenuePerContract = Object.values(sortedRevenue).map(function (n, i) { return (n / Object.values(sortedNotifications)[i]).toFixed(2); });

  const data = {
    labels: Object.values(sortedXLabel),
    datasets: [{
      type: 'line',
      label: "Fees Distributed",
      yAxisID: 'A',
      data: Object.values(sortedRevenue),
      backgroundColor: "rgb(5, 191, 58)",
      borderColor: "rgb(5, 191, 58, 0.2)",
    }, {
      type: 'line',
      label: 'Number of Contracts',
      yAxisID: 'B',
      data: Object.values(sortedNotifications),
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgba(255, 99, 132, 0.2)",
    }, {
      type: 'bar',
      label: 'Average Revenue Per Contract',
      yAxisID: 'C',
      data: Object.values(revenuePerContract),
      backgroundColor: "rgb(0, 25, 255, 0.1)",
      borderColor: "rgb(0, 25, 255, 0.2)",
    }]
  };


  const options = {
    type: 'scatter',

    scales: {
      A: {
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
        position: 'right',
        ticks: {
          color: "rgb(255, 99, 132)", // this here
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
          color: "rgb(0, 25, 255, 0.4)", // this here
        }
      }

    },
    plugins: {
      title: {
        display: true,
        text: 'Fee Revenue',
        fontSize: 25
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
    <>
      <Line data={data} options={options} height={500} width={1500} />
    </>
  );
};

export default Timeline;