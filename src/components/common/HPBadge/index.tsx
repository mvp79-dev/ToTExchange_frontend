import { Badge } from "antd";
import { ReactNode } from "react";
import style from "./style.module.scss";

type Props = { count?: number; children: ReactNode };

export default function HPBadge({ count, children }: Props) {
  return (
    <Badge className={style.hpBadge} count={count}>
      {children}
    </Badge>
  );
}
