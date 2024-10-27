import { Carousel } from "antd";
import { CarouselEffect } from "antd/es/carousel";
import { useRef } from "react";
import style from "./style.module.scss";

type Props = {
  children?: React.ReactNode;
  autoplay?: boolean;
  arrows?: boolean;
  effect?: CarouselEffect;
  className?: string;
  nextArrow?: JSX.Element;
  prevArrow?: JSX.Element;
  slidesToShow?: number;
  autoPlaySpeed?: number;
  responsive?: any;
  onAfterChangeChange?: (currentSlide: number) => void;
  dots?:
    | boolean
    | {
        className?: string;
      };
};

export default function HPCarousel({
  autoplay,
  arrows,
  effect,
  className,
  nextArrow,
  prevArrow,
  onAfterChangeChange,
  dots,
  children,
  slidesToShow = 1,
  autoPlaySpeed,
  responsive,
}: Props) {
  const slider = useRef(null);

  const handleAfterChangeChange = (currentSlide: number) => {
    onAfterChangeChange && onAfterChangeChange(currentSlide);
  };

  const SampleNextArrow = (props: any) => {
    const { className, onClick } = props;
    return (
      <div
        className={className}
        style={{
          color: "#8C8C8C",
          fontSize: "36px",
        }}
        onClick={onClick}
      >
        {nextArrow}
      </div>
    );
  };

  const SamplePrevArrow = (props: any) => {
    const { className, onClick } = props;
    return (
      <div
        className={className}
        style={{
          color: "#8C8C8C",
          fontSize: "36px",
        }}
        onClick={onClick}
      >
        {prevArrow}
      </div>
    );
  };

  const settings = {
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  return (
    <div className={style.hpCarousel}>
      <Carousel
        afterChange={handleAfterChangeChange}
        infinite={autoplay}
        autoplaySpeed={5000}
        speed={2500}
        autoplay={autoplay}
        arrows={arrows}
        effect={effect}
        className={className}
        {...settings}
        ref={slider}
        dots={dots}
        slidesToShow={slidesToShow}
        responsive={responsive}
      >
        {children}
      </Carousel>
    </div>
  );
}
