import { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HistoryData {
  time: string;
}

interface MultiLineChartProps<T extends HistoryData> {
  data: T[];
  lines: { key: string; color: string; label: string }[];
  isNetworkData?: boolean;
}

export default function MultiLineChart<T extends HistoryData>({
  data,
  lines,
  isNetworkData = false,
}: MultiLineChartProps<T>) {
  const [xAxisInterval, setXAxisInterval] = useState<number>(40);
  const [fontSize, setFontSize] = useState<number>(12);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateChartDimensions = () => {
      if (chartContainerRef.current) {
        const width = chartContainerRef.current.offsetWidth;

        if (width < 350) {
          setXAxisInterval(50);
          setFontSize(10);
        } else {
          setXAxisInterval(40);
          setFontSize(12);
        }
      }
    };

    const observer = new ResizeObserver(updateChartDimensions);
    if (chartContainerRef.current) observer.observe(chartContainerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <ResponsiveContainer ref={chartContainerRef} width="100%" aspect={1.8}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          interval={xAxisInterval}
          tick={{ fontSize, fill: "#374151", fontWeight: "bold" }}
        />
        <YAxis
          domain={isNetworkData ? [0.001, 10000] : [0, 100]}
          scale={isNetworkData ? "log" : "auto"}
          tick={{ fontSize, fill: "#374151", fontWeight: "bold" }}
        />
        <Tooltip />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="linear"
            dataKey={line.key}
            name={line.label}
            stroke={line.color}
            strokeWidth={1}
            dot={{ r: 0, strokeWidth: 1, stroke: "black", fill: "#FFAD61" }}
            activeDot={{
              r: 0,
              strokeWidth: 1,
              stroke: "black",
              fill: "#FF7A00",
            }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
