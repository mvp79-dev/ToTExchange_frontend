import { Col, Row, Segmented } from "antd";
import TreeView from "./TreeView";
import iconTreeUserActive from "@/assets/icons/tree_user_active.svg";
import iconTreeUserCancel from "@/assets/icons/tree_user_cancel.svg";
import iconTreeUserNewEnrollment from "@/assets/icons/tree_user_new_enrollment.svg";
import iconTreeUserPersonal from "@/assets/icons/tree_user_personaly_sponsored.svg";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GraphicalView from "./GraphicalView";
import { useSearchParams } from "react-router-dom";

import style from "./style.module.scss";

export enum EActiveTabGenealogy {
  Tree = "Tree",
  Graphical = "Graphical",
}

export default function GenealogyPage() {
  const [activeTab, setActiveTab] = useState<EActiveTabGenealogy>(
    EActiveTabGenealogy.Tree
  );
  const { t } = useTranslation();
  const [queries, setSearchParams] = useSearchParams();

  const genealogyType = queries.get("type");

  const notes = [
    {
      label: t("productManagement.active"),
      icon: iconTreeUserActive,
    },
    {
      label: t("genealogy.Deactivated"),
      icon: iconTreeUserCancel,
    },
    {
      label: t("genealogy.New Enrollment"),
      icon: iconTreeUserNewEnrollment,
    },
    {
      label: t("genealogy.Personaly Sponsored"),
      icon: iconTreeUserPersonal,
    },
  ];

  useEffect(() => {
    const typeGenealogy = genealogyType;

    if (
      typeGenealogy === EActiveTabGenealogy.Tree ||
      typeGenealogy === EActiveTabGenealogy.Graphical
    ) {
      setActiveTab(typeGenealogy);
    } else {
      setActiveTab(EActiveTabGenealogy.Tree);
    }
  }, [genealogyType]);

  return (
    <>
      <div className={style.genealogyPage}>
        <div className={style.header}>
          <h3>{t("genealogy.title")}</h3>
          <Segmented
            className={style.tab}
            options={[
              {
                label: t("genealogy.textTreeView"),
                value: EActiveTabGenealogy.Tree,
              },
              {
                label: t("genealogy.textGraphicalView"),
                value: EActiveTabGenealogy.Graphical,
              },
            ]}
            value={activeTab}
            onChange={(tab) => {
              setSearchParams({ type: tab as EActiveTabGenealogy });
              setActiveTab(tab as EActiveTabGenealogy);
            }}
          />
        </div>
        <Row gutter={[30, 0]}>
          <Col xs={0} md={8} span={6}>
            <Row gutter={[0, 30]}>
              {/* {activeTab === EActiveTabGenealogy.Graphical && (
                <Col span={24}>
                  <Input.Search
                    className={style.searchBox}
                    placeholder={t("genealogy.Enter keyword")}
                    enterButton={t("myOrder.btn.search")}
                    size="large"
                  />
                </Col>
              )} */}
              {/* <Col span={24}>
                <div className={style.checkBox}>
                  <span>{t("genealogy.titleCheckBox")}</span>
                  <Radio.Group
                    onChange={onChange}
                    className={style.treeTypeOption}
                    value={genealogyTreeOption}
                    options={[
                      {
                        label: t("genealogy.textBinary"),
                        value: ECheckBox.Binary,
                      },
                      {
                        label: t("genealogy.textSponsor"),
                        value: ECheckBox.Sponsor,
                      },
                    ]}
                  />
                </div>
              </Col> */}
              <Col span={24}>
                <div className={style.note}>
                  <span>{t("genealogy.titleLegend")}</span>
                  {notes.map((note) => (
                    <div key={note.label}>
                      <img src={note.icon} style={{ width: 24, height: 25 }} />
                      <span>{note.label}</span>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={16} span={18}>
            <div className={style.content}>
              {activeTab === EActiveTabGenealogy.Tree && <TreeView />}
              {activeTab === EActiveTabGenealogy.Graphical && <GraphicalView />}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
