import { CloseOutlined } from "@ant-design/icons";
import { Drawer, DrawerProps } from "antd";
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  iconClose?: boolean;
  children?: React.ReactNode;
  placement?: DrawerProps["placement"];
  className?: string;
} & DrawerProps;

export default function HPDrawer({
  open,
  onClose,
  title,
  children,
  iconClose = true,
  placement = "right",
  className = "",
  ...resProps
}: Props) {
  return (
    <Drawer
      className={className}
      title={
        <>
          <span>{title}</span>
          <div style={{ opacity: 0.7 }}>
            {iconClose && <CloseOutlined onClick={onClose} />}
          </div>
        </>
      }
      placement={placement}
      closable={false}
      onClose={onClose}
      open={open}
      {...resProps}
    >
      {children}
    </Drawer>
  );
}
