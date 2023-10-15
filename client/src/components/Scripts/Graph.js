import React from "react";
import {
  Chart,
  Title,
  LinearScale,
  BarController,
  CategoryScale,
  LineController,
  PointElement,
  Tooltip,
  TimeScale,
  TimeSeriesScale,
  LineElement,
} from "chart.js"; // Dodaj TimeScale i TimeSeriesScale
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

Chart.register(
  Title,
  LinearScale,
  CategoryScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  BarController,
  TimeScale,
  TimeSeriesScale
);
const summarizeTransactionsByMonth = (data) => {
  // Grupowanie transakcji po miesiącach i obliczanie sumy wartości
  const summaryData = {};
  data.forEach((transaction) => {
    const orderDate = new Date(transaction.orderDate);
    const yearMonth = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    if (summaryData[yearMonth]) {
      summaryData[yearMonth] += transaction.totalPrice;
    } else {
      summaryData[yearMonth] = transaction.totalPrice;
    }
  });

  // Konwersja danych na format, który może być używany przez wykres
  const labels = Object.keys(summaryData);
  const values = Object.values(summaryData);

  return { labels, values };
};

const Graph = ({ data }) => {
  const { labels, values } = summarizeTransactionsByMonth(data);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Wysokość transakcji",
        data: values,
        backgroundColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
          tooltipFormat: "yyyy",
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Data transakcji",
        },
      },
      y: {
        title: {
          display: true,
          text: "Zarobki",
        },
      },
    },
  };

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Graph;
