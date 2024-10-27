import { IGenealogyBinaryTree } from "@/interfaces/referral";
import { PlaySquareOutlined, ProfileOutlined } from "@ant-design/icons";
import { truncateText } from "@/app/common/helper";
import styles from "./styles.module.scss";
import HPCopyText from "@/components/common/HPCopyText";
import IconNFTVip from "@/assets/icons/iconNFTVip.svg";
import IconMemberShip from "@/assets/icons/membership.png";
import React from "react";
import classNames from "classnames";
import IconTreeUserActive from "@/assets/icons/tree_user_active.svg";
import IconTreeUserCancel from "@/assets/icons/tree_user_cancel.svg";
import IconTreeUserNewEnrollment from "@/assets/icons/tree_user_new_enrollment.svg";
import IconTreeUserPersonal from "@/assets/icons/tree_user_personaly_sponsored.svg";
import { EGenealogyType } from "@/interfaces/user";
import { useTranslation } from "react-i18next";

interface IProps {
  nodeInfo: IGenealogyBinaryTree | null;
  loadMoreChildren?: (userId: number) => void;
}

function ReferralTreeNode({ nodeInfo, loadMoreChildren }: IProps) {
  const [hasGetChildren, setHasGetChildren] = React.useState(false);
  const { t } = useTranslation();

  const isVipMember = React.useMemo(() => {
    if (!nodeInfo) {
      return false;
    }

    if (!nodeInfo.user.nftVipExpiration) {
      return false;
    }

    const expireTime = new Date(nodeInfo.user.nftVipExpiration);

    return expireTime.getTime() > Date.now();
  }, [nodeInfo]);

  function getNodeDescendances() {
    setHasGetChildren(true);
    loadMoreChildren!(nodeInfo!.user.id);
  }

  if (!nodeInfo) {
    return (
      <div className={classNames(styles["tree-node"], styles["empty"])}>
        <p>{t("genealogy.Available")}</p>
      </div>
    );
  }

  return (
    <div className={styles["tree-node"]}>
      <div className={styles["tree-node__header"]}>
        <div className={styles["tree-node__name"]}>
          <ProfileOutlined />
          <p>{nodeInfo.user.name}</p>
        </div>
        <div className={styles["tree-node__bags"]}>
          {nodeInfo.user.boughtNft && (
            <img src={IconMemberShip} alt="" width={24} height={24} />
          )}
          {isVipMember && (
            <img src={IconNFTVip} alt="" width={24} height={24} />
          )}
        </div>
      </div>
      {nodeInfo.user.refCode && (
        <p className={styles["tree-node__text"]}>
          {truncateText(String(nodeInfo.user.refCode))}
          <HPCopyText content={String(nodeInfo.user.refCode)} />
        </p>
      )}

      <div className={styles["tree-node__footer"]}>
        {nodeInfo.user.type === EGenealogyType.ACTIVE && (
          <img src={IconTreeUserActive} width={24} height={24} />
        )}
        {nodeInfo.user.type === EGenealogyType.CANCEL && (
          <img src={IconTreeUserCancel} width={24} height={24} />
        )}
        {nodeInfo.user.type === EGenealogyType.NEW_ENROLLMENT && (
          <img src={IconTreeUserNewEnrollment} width={24} height={24} />
        )}
        {nodeInfo.user.type === EGenealogyType.PERSONALLY_SPONSORED && (
          <img src={IconTreeUserPersonal} width={24} height={24} />
        )}

        {loadMoreChildren && nodeInfo.user.hasChildren && !hasGetChildren && (
          <div
            className={styles["tree-node__expand-icon"]}
            onClick={getNodeDescendances}
          >
            <PlaySquareOutlined />
          </div>
        )}
      </div>
    </div>
  );
}

export default ReferralTreeNode;
