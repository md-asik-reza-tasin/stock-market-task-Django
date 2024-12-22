import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  BarController,
  BarElement,
  PointElement,
  LineController,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  BarController,
  BarElement,
  PointElement,
  LineController,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartOfStockData({ stockData }) {
  // Filter stockData for unique dates
  const uniqueStockData = stockData.filter(
    (item, index, self) => index === self.findIndex((t) => t.date === item.date)
  );

  //   console.log(stockData);

  const chartData = {
    labels: uniqueStockData.map((item) => item.date),
    datasets: [
      {
        type: "line",
        label: "Close",
        data: uniqueStockData.map((item) => item.close),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y1",
      },
      {
        type: "bar",
        label: "Volume",
        data: uniqueStockData.map((item) =>
          parseInt(item.volume.toString().replace(/,/g, ""))
        ),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgb(153, 102, 255)",
        yAxisID: "y2",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y1: {
        type: "linear",
        display: true,
        position: "left",
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="mt-10">
      <Bar data={chartData} options={chartOptions}></Bar>
    </div>
  );
}
