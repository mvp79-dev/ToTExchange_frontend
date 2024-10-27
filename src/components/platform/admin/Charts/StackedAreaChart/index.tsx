import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import style from "./style.module.scss";
import { formatNumberToShortScale } from "../SimpleLineChart";

export interface IDataStackedAreaChart {
  name: string;
  value1?: number;
  value2?: number;
}

type Props = {
  color1?: string;
  color2?: string;
  data: IDataStackedAreaChart[];
  hideYAxis?: boolean;
  hideXAxis?: boolean;
  legends: string[];
};

interface IPayloadChart {
  color: string;
  value: string;
  name: string;
}

const DEFAULT_LABEL_VALUE1 = 0;
const DEFAULT_LABEL_VALUE2 = 1;

export default function StackedAreaChart(props: Props) {
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
            <span>{props.legends[index]}</span>
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
          <p className="label">{`${props.legends[1]} : ${payload[1].value}`}</p>
          <p className="label">{`${props.legends[0]} : ${payload[0].value}`}</p>
        </div>
      );
    }

    return <></>;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={props.data}>
        {/* line ke  */}
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis
          hide={props.hideXAxis}
          dataKey="name"
          tick={{
            fontFamily: "Be Vietnam Pro",
            fontSize: 14,
            color: "#1F1F1F",
          }}
          axisLine={false}
          tickLine={false}
          tickSize={18}
        />
        <YAxis
          hide={props.hideYAxis}
          axisLine={false}
          tickLine={false}
          type="number"
          tick={{
            fontFamily: "Be Vietnam Pro",
            fontSize: 14,
            color: "#595959",
          }}
          tickSize={10}
          tickCount={5}
          tickFormatter={(value: any, index: number) =>
            value === 0 ? "" : formatNumberToShortScale(value)
          }
        />
        {/* chu thich */}
        <Legend content={renderLegend} />
        <Tooltip content={renderTooltip} />
        <defs>
          <linearGradient
            id="colorUv1"
            x1="0.497089"
            y1="0.0546875"
            x2="0.497089"
            y2="165.248"
          >
            <stop stopColor={props.color1 ?? "#1677FF"} stopOpacity={0.7} />
            <stop offset="1%" stopColor="#fff" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={props.color2 ?? "#FAAD14"}
              stopOpacity={1}
            />
            <stop
              offset="100%"
              stopColor={props.color2 ?? "#FAAD14"}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <Area
          type="monotone"
          dataKey="value1"
          stackId="1"
          stroke={props.color1 ?? "#1677FF"}
          activeDot={{
            stroke: props.color1 ?? "#1677FF",
            strokeWidth: 2,
            r: 5,
          }}
          fill="url(#colorUv1)"
        />

        <Area
          type="monotone"
          dataKey="value2"
          stackId="1"
          stroke={props.color2 ?? "#FAAD14"}
          activeDot={{
            stroke: props.color2 ?? "#FAAD14",
            strokeWidth: 2,
            r: 5,
          }}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
