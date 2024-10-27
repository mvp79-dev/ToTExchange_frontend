import { TFunction } from "i18next";
import thumbnail_1 from "../../assets/images/mock/home/section-heath-1.jpg";
import thumbnail_2 from "../../assets/images/mock/home/section-heath-2.jpg";
import article_2 from "../../assets/images/mock/home/article-2.jpg";
import article_3 from "../../assets/images/mock/home/article-3.jpg";
import article_4 from "../../assets/images/mock/home/article-4.jpg";

import thumbnail_3 from "../../assets/images/mock/home/section-heath-3.jpg";
import thumbnail_4 from "../../assets/images/mock/home/section-heath-4.jpg";
import thumbnail_5 from "../../assets/images/mock/home/thumbnail_4.jpeg";

export const sectionInfoList = (t: TFunction<"translation", undefined>) => [
  {
    thumbnail: thumbnail_3,
    title: "Chuyên gia dinh dưỡng",
    content:
      "Miễn phí giao hàng nội thành bán kinh 5km với mỗi hóa đơn trên 500.000đ",
    link: "",
  },
  {
    thumbnail: thumbnail_2,
    title: "Chuyên gia dinh dưỡng",
    content:
      "Miễn phí giao hàng nội thành bán kinh 5km với mỗi hóa đơn trên 500.000đ",
    link: "",
  },
  {
    thumbnail: thumbnail_4,
    title: "Chuyên gia dinh dưỡng",
    content:
      "Miễn phí giao hàng nội thành bán kinh 5km với mỗi hóa đơn trên 500.000đ",
    link: "",
  },
];

export const sectionStrategy = (t: TFunction<"translation", undefined>) => [
  {
    content: t("homePage.sectionStrategy.desc1"),
  },
  {
    content: t("homePage.sectionStrategy.desc2"),
  },
  {
    content: t("homePage.sectionStrategy.desc3"),
  },
  {
    content: t("homePage.sectionStrategy.desc4"),
  },
  {
    content: t("homePage.sectionStrategy.desc5"),
  },
  {
    content: t("homePage.sectionStrategy.desc6"),
  },
  {
    content: t("homePage.sectionStrategy.desc7"),
  },
  {
    content: t("homePage.sectionStrategy.desc8"),
  },
];

export const sectionAchievement = (t: TFunction<"translation", undefined>) => [
  {
    title: t("homePage.sectionAchievement.item1.title"),
    description: t("homePage.sectionAchievement.item1.description"),
  },
  {
    title: t("homePage.sectionAchievement.item2.title"),
    description: t("homePage.sectionAchievement.item2.description"),
  },
  {
    title: t("homePage.sectionAchievement.item3.title"),
    description: t("homePage.sectionAchievement.item3.description"),
  },
];

export const sectionHealth = (t: TFunction<"translation", undefined>) => [
  {
    id: 1,
    title: "1 in 4 people who eat healthy meals blow it on snacks, study says",
    content:
      "If you’re eating healthier meals these days, congratulations — but what do you snack on? By choosing ultraprocessed and sugary snacks, 1 in 4 of us may be undoing all the benefits of healthy eating, according to a new study.",
    date: "17/09/2023",
    thumbnail: thumbnail_1,
    link: "https://edition.cnn.com/2023/09/15/health/snacking-healthy-eating-wellness/index.html",
  },
  {
    id: 2,
    title:
      "Blueberries have joined green beans in this year’s Dirty Dozen list",
    content:
      "Blueberries, beloved by nutritionists for their anti-inflammatory properties, have joined fiber-rich green beans in this year’s Dirty Dozen of nonorganic produce with the most pesticides, according to the Environmental Working Group, a nonprofit environmental health organization.",
    date: "17/09/2023",
    thumbnail: article_2,
    link: "https://edition.cnn.com/2023/03/15/health/dirty-dozen-produce-pesticides-2023-wellness/index.html",
  },
  {
    id: 3,
    title:
      "Mediterranean diet during pregnancy improved 2-year-olds’ cognitive, social abilities",
    content:
      "Mothers who followed the Mediterranean diet while pregnant improved their children’s cognitive, social and emotional development at age 2 compared with children whose mothers did not follow the diet, according to a new randomized clinical trial.",
    date: "17/09/2023",
    thumbnail: article_3,
    link: "https://edition.cnn.com/2023/08/22/health/mediterranean-diet-pregnancy-child-development-wellness/index.html",
  },
  {
    id: 4,
    title:
      "A heart condition may affect 1 in 4 women after menopause, study finds",
    content:
      "About 1 in 4 women may experience irregular heartbeats after menopause, with insomnia and stressful life events being contributing factors, a new study has found.",
    date: "17/09/2023",
    thumbnail: article_4,
    link: "https://edition.cnn.com/2023/08/30/health/stress-insomnia-atrial-fibrillation-older-women-wellness/index.html",
  },
];
