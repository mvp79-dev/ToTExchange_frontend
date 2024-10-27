import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { InputNumber } from "antd";
import styles from "./styles.module.scss";

interface IProps {
  value: number;
  onReduceOneItem: () => void;
  onAddOneItem: () => void;
  onChange: (value: number | null) => void;
}

function QuantityInput({ value, onAddOneItem, onChange, onReduceOneItem }: IProps) {
  return (
    <InputNumber
      addonBefore={<MinusOutlined onClick={onReduceOneItem} />}
      addonAfter={<PlusOutlined onClick={onAddOneItem} />}
      value={value}
      controls={false}
      onChange={onChange}
      className={styles["quantity-input"]}
    />
  );
}

export default QuantityInput;
