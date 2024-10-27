import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import style from "./style.module.scss";
import { formatNumberToShortScale } from "../SimpleLineChart";

interface IPayloadTooltip {
  color: string;
  value: string;
  name: string;
}

type TProps = {
  data: Array<{
    name: string;
    value1: number;
    value2: number;
  }>;
  legend: string[];
  hideYAxis?: boolean;
  hideXAxis?: boolean;
  color1?: string;
  color2?: string;
};

interface IPayloadChart {
  color: string;
  value: string;
  name: string;
}
const DEFAULT_LABEL_VALUE1 = 0;
const DEFAULT_LABEL_VALUE2 = 1;

export default function SimpleBarChart({
  data,
  legend,
  hideYAxis,
  hideXAxis,
  color1,
  color2,
}: TProps) {
  const renderLegend = (el: any) => {
    const { payload } = el;
    return (
      <div className={style.renderLegend}>
        {(payload as IPayloadChart[]).map((entry, index) => (
          <div key={index}>
            <div
              style={{ backgroundColor: entry.color }}
              className={style.dot}
            ></div>
            <span>{legend[index]}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderTooltip = (content: any) => {
    const { active, payload, label } = content;
    if (active && payload && payload.length) {
      return (
        <div className={style.customTooltip}>
          <p className="label">{`${legend[1]} : ${payload[1].value}`}</p>
          <p className="label">{`${legend[0]} : ${payload[0].value}`}</p>
        </div>
      );
    }

    return <></>;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          hide={hideXAxis}
          axisLine={false}
          tickLine={false}
          tickSize={20}
          tick={{
            fontFamily: "Be Vietnam Pro",
            fontSize: 14,
            color: "#595959",
          }}
        />
        <YAxis
          hide={hideYAxis}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value: any, index: number) =>
            value === 0 ? "" : `$  ${formatNumberToShortScale(value)}`
          }
          tickSize={10}
          tick={{
            fontFamily: "Be Vietnam Pro",
            fontSize: 14,
            color: "#595959",
          }}
        />
        <Tooltip content={renderTooltip} />
        <Legend content={renderLegend} />
        <CartesianGrid strokeDasharray="2 0" />
        <Bar dataKey="value1" stackId="a" fill={color1} />
        <Bar dataKey="value2" stackId="a" fill={color2} />
      </BarChart>
    </ResponsiveContainer>
  );
}
