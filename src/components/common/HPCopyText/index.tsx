import React, { ReactNode } from "react";
import HPTooltip from "../HPTooltip";
import { CopyOutlined } from "@ant-design/icons";

interface IProps {
  content?: string;
  icon?: string | ReactNode;
  children?: ReactNode;
}

const HPCopyText: React.FC<IProps> = ({ content, icon, children = null }) => {
  const [title, setTitle] = React.useState("Copy");

  const handleClick = () => {
    setTitle("Copied");
    navigator.clipboard.writeText(content || "");
    setTimeout(() => setTitle("Copy"), 3000);
  };

  return (
    <HPTooltip
      title={title}
      width={60}
      icon={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          {icon ?? <CopyOutlined />}
          {children}
        </div>
      }
    />
  );
};

export default HPCopyText;
