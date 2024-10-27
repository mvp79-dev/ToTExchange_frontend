import { Button, Modal } from "antd";
import classNames from "classnames";
import { useState } from "react";
import { ZoomIcon } from "@/assets/icons";
import styles from "./style.module.scss";

interface IProps {
  images: string[];
  imageHover?: string;
  subItemImage?: string;
  setProductSub?: () => void;
}

function ProductIllustration({
  images,
  imageHover,
  subItemImage,
  setProductSub,
}: IProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [isShowPreviewImage, setIsShowPreviewImage] = useState(false);

  function showPreviewImage() {
    setIsShowPreviewImage(true);
  }

  function hidePreviewImageModal() {
    setIsShowPreviewImage(false);
  }

  return (
    <figure className={styles["illustration"]}>
      <figcaption className={classNames(styles["illustration__img-list"])}>
        {images.map((imageUrl, i) => (
          <img
            src={imageUrl}
            key={i}
            className={classNames(styles["illustration__thumbnail-img"], {
              [styles.active]: activeImage === i,
            })}
            onClick={() => {
              setProductSub && setProductSub();
              setActiveImage(i);
            }}
          />
        ))}
      </figcaption>

      <div className={styles["illustration__active-container"]}>
        <img
          src={
            imageHover
              ? imageHover
              : subItemImage
              ? subItemImage
              : images[activeImage]
          }
          alt=""
          width={500}
          height={500}
        />

        <Button
          icon={<ZoomIcon />}
          className={classNames(
            styles["illustration__zoom-btn"],
            styles["ant-btn"]
          )}
          onClick={showPreviewImage}
        />
      </div>
      <figcaption
        className={classNames(styles["illustration__img-mobileList"])}
      >
        {images.map((imageUrl, i) => (
          <img
            src={imageUrl}
            key={i}
            className={classNames(styles["illustration__thumbnail-img"], {
              [styles.active]: activeImage === i,
            })}
            onClick={() => {
              setProductSub && setProductSub();
              setActiveImage(i);
            }}
          />
        ))}
      </figcaption>

      <Modal
        open={isShowPreviewImage}
        onCancel={hidePreviewImageModal}
        footer={null}
        width="72.25rem"
        wrapClassName={styles["illustration__preview-modal__wrapper"]}
        className={styles["illustration__preview-modal"]}
      >
        <figure className={styles["illustration__preview-modal__container"]}>
          <div
            className={styles["illustration__preview-modal__active-img"]}
            style={{ backgroundImage: `url(${images[activeImage]})` }}
          />
          <figcaption
            className={styles["illustration__preview-modal__thumbnail-list"]}
          >
            <div>
              {images.map((link, i) => (
                <img
                  src={subItemImage ? subItemImage : link}
                  alt=""
                  key={i}
                  width={80}
                  height={80}
                  className={classNames(
                    styles["illustration__preview-modal__thumbnail-list__img"],
                    {
                      [styles.active]: activeImage === i,
                    }
                  )}
                  onClick={() => setActiveImage(i)}
                />
              ))}
            </div>
          </figcaption>
        </figure>
      </Modal>
    </figure>
  );
}

export default ProductIllustration;
