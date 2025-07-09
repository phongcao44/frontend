import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, Select, Empty } from "antd";
import { getRevenueByYear, getRevenueByMonth } from "../../../services/dashboardService";

const { Option } = Select;

const RevenueChartCombined = () => {
  const [data, setData] = useState([]);
  const [viewType, setViewType] = useState("year");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res = [];
        if (viewType === "year") {
          res = await getRevenueByYear(year);
        } else {
          res = await getRevenueByMonth(month, year);
        }

        const transformed = res.map(item => ({
          date: item.time,
          revenue: item.totalRevenue,
        }));
        setData(transformed);
      } catch (error) {
        setData([]); // fallback empty on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewType, month, year]);

  const noDataMessage = `Không có doanh thu trong ${viewType === "month" ? `tháng ${month}` : `năm ${year}`}`;

  return (
    <Card
      loading={loading}
      title={
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <span>
            Biểu đồ Doanh Thu Theo {viewType === "year" ? "Năm" : "Tháng"}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <Select value={viewType} onChange={setViewType} style={{ width: 120 }}>
              <Option value="year">Theo Năm</Option>
              <Option value="month">Theo Tháng</Option>
            </Select>
            {viewType === "month" && (
              <Select value={month} onChange={setMonth} style={{ width: 100 }}>
                {[...Array(12)].map((_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    Tháng {i + 1}
                  </Option>
                ))}
              </Select>
            )}
            <Select value={year} onChange={setYear} style={{ width: 100 }}>
              {[2023, 2024, 2025].map((y) => (
                <Option key={y} value={y}>
                  {y}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      }
    >
      {data.length === 0 ? (
        <div style={{ padding: 24 }}>
          <Empty description={noDataMessage} />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} ₫`} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#1890ff"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default RevenueChartCombined;
