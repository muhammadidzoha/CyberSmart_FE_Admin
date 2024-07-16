import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";

const Dashboard = () => {
  const [statistics, setStatistics] = useState({ incoming: 0, outgoing: 0 });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/letterStatsMonthly"
        );
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching monthly statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Statistik Surat Masuk dan Keluar Bulan Ini",
    },
    xAxis: {
      categories: ["Surat Masuk", "Surat Keluar"],
    },
    yAxis: {
      title: {
        text: "Jumlah",
      },
      // tickInterval: 100
      tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    },
    series: [
      {
        name: "Jumlah",
        data: [statistics.incoming, statistics.outgoing],
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Dashboard;
