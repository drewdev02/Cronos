import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from "recharts";

interface StatisticsBarProps {
  title: string;
  data: any[];
  xKey: string;
  yKey: string;
  color: string;
  label: string;
}

export function StatisticsBar({ title, data, xKey, yKey, color, label }: StatisticsBarProps) {
  return (
    <div>
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      <ChartContainer config={{ [yKey]: { label, color } }}>
        <BarChart data={data}>
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={yKey} fill={color}>
            <LabelList dataKey={yKey} position="top" />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
