import React, { useEffect, useState } from "react";
import {
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
} from "recharts";
import { localStorageService } from "../../services/localStorageService";
import { orderService } from "../../services/orderService";

export default function StatisticalManager() {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

  const calculateMonthlyTotal = (data) => {
    const monthlyTotal = {};

    data.forEach((item) => {
      const month = item.month; // Assuming "month" is the property in your data for the month

      if (!monthlyTotal[month]) {
        monthlyTotal[month] = {
          month,
          reallyReceived: 0,
          totalRevenue: 0,
        };
      }

      monthlyTotal[month].reallyReceived += item.reallyReceived;
      monthlyTotal[month].totalRevenue += item.totalRevenue;
    });

    return Object.values(monthlyTotal);
  };

  const [statiscal, setStatiscal] = useState([]);

  useEffect(() => {
    const id = localStorageService.get("USER").userDTO.id;

    const getStatiscalByYear = async () => {
      try {
        const response = await orderService.getStatiscalByYear(id, 2023);

        const sortedUniqueStatiscal = calculateMonthlyTotal(response.data);
        setStatiscal(sortedUniqueStatiscal);
      } catch (error) {
        console.log(error);
      }
    };

    getStatiscalByYear();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="mb-5">
        <h1 className="font-medium text-3xl">Thống kê của bạn</h1>
      </div>
      <AreaChart width={1140} height={605} data={statiscal} className="mx-auto">
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tickFormatter={(label) => `Tháng ${label}`} />
        <YAxis width={100} tickFormatter={(value) => formatCurrency(value)} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          labelClassName="mag"
          labelFormatter={(label) => `Tháng ${label}`}
          formatter={(value) => formatCurrency(value)}
        />
        <Area
          type="monotone"
          dataKey="reallyReceived"
          name="Thống kê sau thuế"
          stackId="1"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="totalRevenue"
          name="Thống kê trước thuế"
          stroke="#82ca9d"
          stackId="1"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
        <Legend />
      </AreaChart>
    </div>
  );
}
