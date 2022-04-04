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
  const sortedNotifications = notifications.reduce(
    (sortedNotifications, notification) => {
      const notificationDate = notification["batch"];
      if (notificationDate in sortedNotifications) {
        sortedNotifications[notificationDate] = sortedNotifications[notificationDate] + parseFloat(notification["gross_total"]);
      } else {
        sortedNotifications[notificationDate] = parseFloat(notification["gross_total"]);
      }
      return sortedNotifications;
    },
    {}
  );

  const sortedNotifications2 = notifications.reduce(
    (sortedNotifications, notification) => {
      const notificationDate = notification["batch"];
      if (notificationDate in sortedNotifications) {
        sortedNotifications[notificationDate] = notification["batch__name"].replace('Network Fees', '');
      } else {
        sortedNotifications[notificationDate] = notification["batch__name"].replace('Network Fees', '');
      }
      return sortedNotifications;
    },
    {}
  );

  const data = {
    labels: Object.values(sortedNotifications2),
    datasets: [
      {
        label: "Fees",
        data: Object.values(sortedNotifications),
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };


  const options = {
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, ticks) {
            return '$' + value;
          }
        }
      },
    },
    plugins: {
      tooltip: {
          callbacks: {
              label: function(context) {
                  let label = context.dataset.label || '';

                  if (label) {
                      label += ': ';
                  }
                  if (context.parsed.y !== null) {
                      label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                  }
                  return label;
              }
          }
      }
  }
  };
  return (
    <>
      <div className="header content">
        <img className="logo" src={logo ? logo : './logo512.png'} height='50px' />
        <h1 className="title">{company ? company : 'All Companies'}</h1>
      </div>
      <p className="title1">${total} in fees purchased {(total / totalBTRST).toFixed(2)} of BTRST</p>
      <Line data={data} options={options} height={500} width={1500} />
    </>
  );
};

export default Timeline;