"use client";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from "recharts";

export default function GasFeeCorrelationChart({ data }) {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-center text-sky-600 mb-2">Gas Usage vs Base Fee</h3>
      
        <LineChart data={data} width={750} height={400}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
          dataKey="blockNumber" 
          tick={{ fontSize: 12 }}
          />
          
          <YAxis
            yAxisId="left"
            label={{ value: "Gas Ratio (%)", angle: -90, position: "insideLeft" }}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "Base Fee (wei) ", angle: 90, position: "insideRight", dx: 2 }}
            width={100}
            tick={{ fontSize: 12 }}
          />

          <Tooltip />
          <Legend />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="gasRatio"
            stroke="#8884d8"
            name="Gas Ratio (%)"
            dot={{ r: 3 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="baseFeePerGas"
            stroke="#82ca9d"
            name="Base Fee"
            dot={{ r: 3 }}
          />
        </LineChart>
    </div>
  );
}
