import { getElapsedDuration } from "@/app/common/helper";
import { ERoutePath } from "@/app/constants/path";
import { useAppSelector } from "@/app/hooks";
import store from "@/app/store";
import HPPagination from "@/components/common/HPPagination";
import {
  defaultConditionReview,
  productAction,
} from "@/features/product/productSlice";
import { userServices } from "@/service/userService";
import { Button, Form, Input, Rate } from "antd";
import classNames from "classnames";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AvatarURL from "@/assets/icons/profile.svg";
import styles from "./styles.module.scss";

interface IProps {
  productName: string;
  className?: string;
}

interface ICommentForm {
  rating: number;
  comment: string;
  username: string;
  email: string;
  isSaveInfo: boolean;
}

function ProductReviews({ productName, className = "" }: IProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm<ICommentForm>();
  const {
    data,
    condition: conditionReview,
    totalItems,
  } = useAppSelector((state) => state.product.reviews);
  const { id: productId } = useParams();
  const { condition } = useAppSelector((state) => state.product.reviews);
  const { user } = useAppSelector((state) => state.user);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const reviewsRef = useRef<any>(null);
  const navigate = useNavigate();

  const createCommentHandler = async (formData: ICommentForm) => {
    if (!user) {
      navigate(ERoutePath.LOGIN);
      return;
    }
    setIsProcessing(true);
    const [res, error] = await userServices.reviewProduct({
      comments: formData.comment,
      star: formData.rating,
      productId: Number(productId),
    });
    if (error) {
      setIsProcessing(false);
      toast.error(t("products.reviewsError"));
    } else {
      store.dispatch(
        productAction.updateConditionReviews({
          ...condition,
          ...defaultConditionReview,
        })
      );
      form.resetFields();
      toast.success(t("products.reviewsSuccess"));
      setIsProcessing(false);
      reviewsRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const updatePaginationHandler = (page: number, pageSize: number) => {
    store.dispatch(
      productAction.updateConditionReviews({
        ...condition,
        productId: Number(productId),
        page,
        size: pageSize,
      })
    );
    reviewsRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={classNames(styles["comment"], className)} ref={reviewsRef}>
      <p className={styles["comment__section-title"]}>
        {t("products.reviews")}
      </p>
      <ul className={styles["comment-list"]}>
        {data.map((comment) => (
          <li key={comment.id} className={styles["comment__item"]}>
            <img
              src={comment.user.imageProfile || AvatarURL}
              alt=""
              width={60}
              height={60}
              className={styles["comment__item__user-avatar"]}
            />
            <div
              style={{
                width: "100%",
              }}
            >
              <div className={styles["comment__item__header"]}>
                <div className={styles["comment__item__user-info"]}>
                  <div>
                    <p className={styles["comment__item__username"]}>
                      {comment.user.name}
                    </p>
                    <p className={styles["comment__item__create-time"]}>
                      {getElapsedDuration(new Date(comment.createdAt))}
                    </p>
                  </div>
                  <Rate disabled allowHalf value={comment.star} />
                </div>
              </div>
              <p>{comment.comments}</p>
            </div>
          </li>
        ))}
      </ul>
      {data.length > 0 && (
        <div className={styles["comment-pagination"]}>
          <HPPagination
            currentPage={conditionReview.page}
            pageSize={conditionReview.size}
            totalItem={totalItems ?? 0}
            onChange={updatePaginationHandler}
            isShowTotalItems={false}
          />
        </div>
      )}

      {data.length <= 0 && (
        <p
          className={classNames(
            styles["comment__content-title"],
            styles["form-header"]
          )}
        >
          {t("products.comment_post_comment_title") + " " + productName}
        </p>
      )}
      <p className={classNames(styles["comment__note"], styles.note)}>
        {t("products.comment_post_comment_note")}
      </p>

      <div>
        <Form<ICommentForm>
          form={form}
          autoComplete="off"
          className={styles["comment__form"]}
          onFinish={createCommentHandler}
        >
          <Form.Item<ICommentForm>
            name="rating"
            label={t("products.comment_post_comment_rating")}
            rules={[{ required: true }]}
          >
            <Rate className={styles["rating"]} />
          </Form.Item>
          <Form.Item<ICommentForm> name="comment" rules={[{ required: true }]}>
            <Input.TextArea
              placeholder={t("products.comment_post_comment_comment")}
              className={styles["comment_content"]}
            />
          </Form.Item>
          {/* <Form.Item<ICommentForm>
            name="username"
            label={t("products.comment_post_comment_username")}
            labelCol={{ span: 24 }}
            rules={[{ required: true }]}
          >
            <Input placeholder={t("products.comment_post_comment_username")} />
          </Form.Item>
          <Form.Item<ICommentForm>
            name="email"
            label={t("products.comment_post_comment_email")}
            labelCol={{ span: 24 }}
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder={t("products.comment_post_comment_email")} />
          </Form.Item> */}

          {/* <Form.Item<ICommentForm> name="isSaveInfo" valuePropName="checked">
            <Checkbox>
              {t("products.comment_post_comment_save_user_info")}
            </Checkbox>
          </Form.Item> */}

          <Form.Item>
            <Button
              htmlType="submit"
              className={classNames(
                styles["comment__form__submit-btn"],
                "ant-btn-custom"
              )}
              disabled={isProcessing}
              loading={isProcessing}
            >
              {t("products.comment_post_comment_submit")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ProductReviews;
