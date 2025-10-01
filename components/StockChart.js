import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function StockChart({ stocks }) {
  const datasets = stocks.map((s) => {
    const dates = Object.keys(s.data).slice(0, 30).reverse(); // 30 ngày gần nhất
    const values = dates.map((d) => parseFloat(s.data[d]['4. close']));

    return {
      label: s.symbol,
      data: values,
      borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
      fill: false,
    };
  });

  return (
    <Line
      data={{
        labels: Object.keys(stocks[0]?.data || {})
          .slice(0, 30)
          .reverse(),
        datasets,
      }}
    />
  );
}
