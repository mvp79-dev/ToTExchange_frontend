import { CSSProperties, ReactNode, useRef, useState, useMemo } from "react";
import _throttle from "lodash/throttle";
import classNames from "classnames";

import "./cardAnimation.scss";

const CardAnimation = ({ children }: { children?: ReactNode }) => {
  const [style, setStyle] = useState("");
  const [animationContainerStyles, setAnimationContainerStyles] = useState<
    undefined | CSSProperties
  >();
  const [isAnimating, setIsAnimating] = useState(false);
  const rfAnimationTimeout = useRef<null | ReturnType<typeof setTimeout>>(null);
  const rfAnimationContainerEl = useRef<HTMLDivElement>(null);

  const handleCardHover = useMemo(() => {
    return _throttle((e: any) => {
      const $card = rfAnimationContainerEl.current as HTMLDivElement;
      const localX = e.pageX - $card.offsetLeft;
      const localY = e.pageY - $card.offsetTop;
      const pos = [localX, localY]; //[e.pageX, e.pageY];

      const [l, t] = pos;
      const h = $card.clientHeight;
      const w = $card.clientWidth;

      const px = Math.abs(Math.floor((100 / w) * l) - 100);
      const py = Math.abs(Math.floor((100 / h) * t) - 100);
      const pa = 50 - px + (50 - py);

      const lp = 50 + (px - 50) / 1.5;
      const tp = 50 + (py - 50) / 1.5;
      const px_spark = 50 + (px - 50) / 7;
      const py_spark = 50 + (py - 50) / 7;
      const p_opc = 20 + Math.abs(pa) * 1.5;
      const ty = ((tp - 50) / 2) * -1;
      const tx = ((lp - 50) / 1.5) * 0.5;

      const grad_pos = `background-position: ${lp}% ${tp}%;`;
      const sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`;
      const opc = `opacity: ${p_opc / 100};`;
      const tf = { transform: `rotateX(${ty}deg) rotateY(${tx}deg)` };

      const newStyle = `
      .cardAnimation:hover:before { ${grad_pos} }
      .cardAnimation:hover:after { ${sprk_pos} ${opc} }
      `;

      setAnimationContainerStyles(tf);
      setIsAnimating(true);
      setStyle(newStyle);

      if (e.type === "touchmove") {
        return false;
      }

      if (rfAnimationTimeout.current) {
        clearTimeout(rfAnimationTimeout.current);
        rfAnimationTimeout.current = null;
      }
    }, 10);
  }, []);

  const handleCardMouseOut = () => {
    setStyle("");
    setAnimationContainerStyles(undefined);
    rfAnimationTimeout.current = setTimeout(() => {
      setIsAnimating(false);
    }, 2500);
  };

  return (
    <>
      <div
        ref={rfAnimationContainerEl}
        style={animationContainerStyles}
        className={classNames("cardAnimation mewtwo", {
          animated: !isAnimating,
        })}
        onMouseMove={handleCardHover}
        onTouchMove={handleCardHover}
        onMouseOut={handleCardMouseOut}
        onTouchEnd={handleCardMouseOut}
        onTouchCancel={handleCardMouseOut}
      >
        <div>{children}</div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: style }}></style>
    </>
  );
};

export default CardAnimation;
