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

  const [statiscal, setStatiscal] = useState([]);
  useEffect(() => {
    const id = localStorageService.get("USER").userDTO.id;
    const getStatiscalByMonth = async () => {
      try {
        const response = await orderService.getStatiscalByMonth(id, 2023);
        console.log(response);
        setStatiscal(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getStatiscalByMonth();
  }, []);

  return (
    <div className="w-full h-full ">
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
        <XAxis dataKey="year" /> {/* Assuming "day" is the property in your data for the day within the month */}
        <YAxis
          width={100}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <CartesianGrid strokeDasharray="4 4" />
        <Tooltip
          labelFormatter={(label) => `Ngày ${label}`}
          formatter={(value) => formatCurrency(value)}
        />
        <Area
          type="monotone"
          dataKey="reallyReceived"
          name="Thống kê sau thuế"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="totalRevenue"
          name="Thống kê trước thuế"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
        <Legend />
      </AreaChart>
    </div>
  );
}
