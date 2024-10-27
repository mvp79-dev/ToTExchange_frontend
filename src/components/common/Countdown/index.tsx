import { useLayoutEffect, useState } from "react";

type Props = {
  counter: number;
  onEndCountdown?: (value: boolean) => void;
  className?: string;
};

export default function Countdown({
  counter,
  onEndCountdown,
  className,
}: Props) {
  const [countdown, setCountdown] = useState<number>();

  useLayoutEffect(() => {
    if (counter < 0) return;
    const interval = setInterval(function () {
      counter--;
      if (counter <= 0) {
        setCountdown(-1);
        onEndCountdown && onEndCountdown(true);
        clearInterval(interval);
        return;
      } else {
        onEndCountdown && onEndCountdown(false);
        setCountdown(counter);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={className}>
      {!countdown || (Number(countdown || 0) > 0 && formatTime(countdown))}
    </div>
  );
}
