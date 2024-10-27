import React from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";
import style from "./style.module.scss";

export interface IDataSimpleLineChart {
  name: string;
  value1: number;
  value2?: number;
}

type Props = {
  hideYAxis?: boolean;
  hideXAxis?: boolean;
  color1?: string;
  color2?: string;
  data: IDataSimpleLineChart[];
  legends: string[];
};

interface IPayloadLegend {
  color: string;
  value: string;
  payload: {
    value: string;
  };
}

interface IPayloadTooltip {
  color: string;
  value: string;
  name: string;
}

export function formatNumberToShortScale(number: number) {
  if (number >= 1e12) {
    if (number % 1e12 === 0) {
      return number / 1e12 + "T";
    } else {
      return (number / 1e12).toFixed(1) + "T";
    }
  } else if (number >= 1e9) {
    if (number % 1e9 === 0) {
      return number / 1e9 + "B";
    } else {
      return (number / 1e9).toFixed(1) + "B";
    }
  } else if (number >= 1e6) {
    if (number % 1e6 === 0) {
      return number / 1e6 + "M";
    } else {
      return (number / 1e6).toFixed(1) + "M";
    }
  } else if (number >= 1000) {
    if (number % 1000 === 0) {
      return number / 1000 + "K";
    } else {
      return (number / 1000).toFixed(1) + "K";
    }
  }
  return number.toString();
}

export default function SimpleLineChart(props: Props) {
  const renderLegend = (el: any) => {
    const { payload } = el;
    return (
      <div className={style.renderLegend}>
        {(payload as IPayloadLegend[]).map((entry, index) => (
          <div className={style.wrapDot} key={index}>
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
          {/* {(payload as IPayloadTooltip[]).map((el, index) => (
            <p
              key={index}
              className="label"
            >{`${props.legends[index]} : ${el.value}`}</p>
          ))} */}
        </div>
      );
    }

    return <></>;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={props.data}>
        <CartesianGrid vertical={false} strokeDasharray="0 0" />
        <XAxis
          dataKey="name"
          tick={{
            fontFamily: "Be Vietnam Pro",
            fontSize: 14,
            color: "#1F1F1F",
          }}
          axisLine={false}
          tickLine={false}
          tickSize={16}
          hide={props.hideXAxis}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickSize={16}
          tick={{
            fontFamily: "Be Vietnam Pro",
            fontSize: 14,
            color: "#7B91B0",
          }}
          hide={props.hideYAxis}
          tickFormatter={(value: any, index: number) =>
            value === 0 ? "" : formatNumberToShortScale(value)
          }
        />
        <Tooltip content={renderTooltip} />
        <Legend content={renderLegend} verticalAlign="bottom" />
        <Line
          type="monotone"
          dataKey="value1"
          stroke={props.color1 ?? "#FAAD14"}
          strokeWidth={5}
          dot={{ r: 0 }}
        />
        <Line
          type="monotone"
          dataKey="value2"
          stroke={props.color2 ?? "#9DCA00"}
          strokeWidth={5}
          dot={{ r: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
