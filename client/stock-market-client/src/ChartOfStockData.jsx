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
  const uniqueStockData = stockData.filter(
    (item, index, self) => index === self.findIndex((t) => t.date === item.date)
  );

  uniqueStockData.sort((a, b) => new Date(a.date) - new Date(b.date));

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
    maintainAspectRatio: false,
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
    <div
      className="mt-10"
      style={{ position: "relative", height: "400px", width: "100%" }}
    >
      <Bar data={chartData} options={chartOptions}></Bar>
    </div>
  );
}
