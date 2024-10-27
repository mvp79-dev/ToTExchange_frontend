import HPTable, { PropsHpTable } from "@/components/common/HPTable";
import style from "./style.module.scss";

export default function TableAdmin(props: PropsHpTable) {
  return (
    <div className={style.tableAdmin}>
      <HPTable {...props} />
    </div>
  );
}
