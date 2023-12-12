import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { localStorageService } from "../../services/localStorageService";
import { orderService } from "../../services/orderService";
import { InputNumber } from 'antd';

export default function StatisticalManager() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

  const calculateMonthlyTotal = (data) => {
    const monthlyTotal = {};

    data.forEach((item) => {
      const month = item.month;

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
    getStatiscalByYear(selectedYear);
  }, [selectedYear]);

  const getStatiscalByYear = async (year) => {
    const id = localStorageService.get("USER").userDTO.id;

    try {
      const response = await orderService.getStatiscalByYear(id, year);

      const sortedUniqueStatiscal = calculateMonthlyTotal(response.data);
      const sanitizedStatiscal = sortedUniqueStatiscal.map((item) => ({
        ...item,
        month: Number(item.month),
        reallyReceived: Number(item.reallyReceived),
        totalRevenue: Number(item.totalRevenue),
        tax: Math.abs(Number(item.reallyReceived) - Number(item.totalRevenue))
      }));
      setStatiscal(sanitizedStatiscal);
    } catch (error) {
      console.error("Error fetching statistical data:", error);
    }
  };

  const totalRevenueBeforeTax = statiscal.reduce((acc, item) => acc + item.totalRevenue, 0);
  const totalRevenueAfterTax = statiscal.reduce((acc, item) => acc + item.reallyReceived, 0);
  const sortedStatiscal = statiscal.sort((a, b) => a.month - b.month);

  return (
    <div className="w-[1100px] h-full">
      <div className="justify-between flex">
        <div className="mb-5">
          <h1 className="font-medium text-3xl">Thống kê của bạn</h1>
        </div>
        <div className="mb-5">
          <div className="justify-between flex">
            <div className="mx-5">
              <h1 className="font-bold">Tổng doanh thu</h1>
              <p className="text-green-400 font-semibold">
                + {formatCurrency(totalRevenueAfterTax)}
              </p>
            </div>
            <div>
              <h1 className="font-bold">Thuế đã trả</h1>
              <p className="text-red-400 font-semibold">
                - {formatCurrency(totalRevenueBeforeTax - totalRevenueAfterTax)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-5">
        <label htmlFor="year">Năm: </label>
        <InputNumber
          id="year"
          value={selectedYear}
          onChange={(value) => setSelectedYear(value)}
        />
      </div>
      <BarChart width={1100} height={605} data={sortedStatiscal} className="mx-auto">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tickFormatter={(label) => `Tháng ${label}`} />
        <YAxis width={100} tickFormatter={(value) => formatCurrency(value)} />
        <Tooltip
          labelClassName="mag"
          labelFormatter={(label) => `Tháng ${label}`}
          formatter={(value) => formatCurrency(value)}
        />
        <Bar
          dataKey="reallyReceived"
          name="Doanh thu sau thuế"
          fill="#65B741"
        />
        <Bar
          dataKey="totalRevenue"
          name="Doanh thu trước thuế"
          fill="#EF4040"
        />
        <Bar
          dataKey="tax"
          name="Thuế của Panther"
          fill="#E3651D"
        />
        <Legend iconType="plainline" />
      </BarChart>
    </div>
  );
}
