import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";

const ApexChart = () => {
  const imgResult = useSelector((state) => state?.dataSlice?.imgResult || {});

  const [chartData, setChartData] = useState({
    series: [
      {
        data: [0, 0], // Default values
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 250,
        width: "100%",
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          horizontal: true,
          barHeight: "14%",
          colors: {
            ranges: [
              {
                from: 0,
                to: 100,
                color: "#FFA500",
              },
            ],
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val}%`,
      },
      xaxis: {
        categories: ["Real", "Fake"],
      },
    },
  });

  useEffect(() => {
    if (
      imgResult?.real_percentage !== undefined &&
      imgResult?.fake_percentage !== undefined
    ) {
      setChartData((prevData) => ({
        ...prevData,
        series: [
          {
            data: [
              imgResult?.real_percentage || 0,
              imgResult?.fake_percentage || 0,
            ],
          },
        ],
      }));
    }
  }, [imgResult]);

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={250}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
