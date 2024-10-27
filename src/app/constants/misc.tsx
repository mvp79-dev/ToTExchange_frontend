import iconUSLanguage from "@/assets/icons/icon-us-language.svg";
import iconVietnamese from "@/assets/images/vietnamese.jpg";
import { EKeyTranslations } from "@/interfaces/common";
import type { MenuItemType } from "antd/es/menu/hooks/useItems";

export type TMultiLangItem = Omit<MenuItemType, "key"> & {
  key: EKeyTranslations;
};

export const menuItemLanguage: TMultiLangItem[] = [
  {
    label: "Eng (US)",
    key: EKeyTranslations.en,
    icon: <img src={iconUSLanguage} alt="" width={24} height={24} />,
  },
  {
    label: "Vietnamese",
    key: EKeyTranslations.vi,
    icon: <img src={iconVietnamese} alt="" width={24} height={24} />,
  },
];
