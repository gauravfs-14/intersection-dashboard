"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// Custom tooltip for consistent styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border rounded-md shadow-md p-2 text-sm">
        <p className="font-medium">{`Year: ${label}`}</p>
        <p className="text-[#6366f1]">{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

interface LineChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  height?: number;
}

export default function LineChart({
  data,
  title,
  height = 220,
}: LineChartProps) {
  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <CardHeader className="pb-2 pt-4 px-4 text-center">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 flex-1 flex items-center justify-center">
        <div className="w-full" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 20, left: 5, bottom: 30 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 10 }}
                height={60}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#colorValue)"
                activeDot={{
                  r: 6,
                  stroke: "#6366f1",
                  strokeWidth: 2,
                  fill: "#fff",
                }}
                animationDuration={1200}
                animationBegin={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
