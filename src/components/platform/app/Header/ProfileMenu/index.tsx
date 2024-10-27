import * as React from "react";
import styles from "./style.module.scss";
import classNames from "classnames";
import type { MenuItemType } from "antd/es/menu/hooks/useItems";
import { NavLink } from "react-router-dom";

interface IProps {
  items: (MenuItemType & { action?: () => void })[];
  render: (props: { onClick: () => void }) => void;
}

function ProfileMenu({ render, items }: IProps) {
  const [isShowMenuDropdown, setIsShowMenuDropdown] = React.useState(false);

  const hideMenuDropdown = () => {
    setIsShowMenuDropdown(false);
  };

  const toggleMenuDropdown = () => {
    setIsShowMenuDropdown((isShow) => !isShow);
  };

  return (
    <>
      {render({ onClick: toggleMenuDropdown })}
      <div
        className={classNames(styles["profile-menu__menu"], {
          [styles.active]: isShowMenuDropdown,
        })}
      >
        <ul className={styles["profile-menu__menu__list"]}>
          {items.map((item) => (
            <li key={item.key}>
              <NavLink
                onClick={
                  item.action
                    ? (event) => {
                        event.nativeEvent.stopImmediatePropagation();
                        item.action!();
                      }
                    : undefined
                }
                to={item.key as string}
                className={({ isActive }) =>
                  classNames(styles["profile-menu__menu__item-label"], {
                    [styles.active]: isActive,
                  })
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      {isShowMenuDropdown && (
        <div
          className={styles["profile-menu__backdrop"]}
          onClick={hideMenuDropdown}
        ></div>
      )}
    </>
  );
}

export default ProfileMenu;
