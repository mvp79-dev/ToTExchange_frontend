import * as React from "react";
import { TMultiLangItem } from "@/app/constants/misc";
import { EKeyTranslations } from "@/interfaces/common";

import styles from "./styles.module.scss";
import classNames from "classnames";
import ExpandableContainer from "@/components/common/ExpandableContainer";

interface IProps {
  className?: string;
  activeLanguage: TMultiLangItem;
  languageList: TMultiLangItem[];
  onSwitchLanguage: (event: { key: EKeyTranslations }) => void;
}

function LanguageSwitcher({
  className,
  activeLanguage,
  languageList,
  onSwitchLanguage,
}: IProps) {
  function switchLanguageHandler(language: EKeyTranslations) {
    onSwitchLanguage({ key: language });
  }

  return (
    <div className={classNames(className, styles["language-switcher"])}>
      <ExpandableContainer
        maxHeight="360px"
        header={
          <div className={styles["language-switcher__active-language"]}>
            <div
              className={styles["language-switcher__active-language__label"]}
            >
              {activeLanguage.icon}
              <span>{activeLanguage.label}</span>
            </div>
          </div>
        }
      >
        <ul className={classNames(styles["language-switcher__language-list"])}>
          {languageList.map((item) => (
            <li key={item.key} onClick={() => switchLanguageHandler(item.key)}>
              <div
                className={styles["language-switcher__active-language__label"]}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </ExpandableContainer>
    </div>
  );
}

export default LanguageSwitcher;
