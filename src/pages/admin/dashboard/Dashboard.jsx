
// import Revenue from "./Revenue";

// function Dashboard() {
//   return
//      <div>Dashboard</div>
// }

import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card } from "antd";

export const RevenueChart = ({ data }) => (
  <Card title="Biểu Đồ Doanh Thu" bordered={false}>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => `${value.toLocaleString()} ₫`} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#722ed1"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

