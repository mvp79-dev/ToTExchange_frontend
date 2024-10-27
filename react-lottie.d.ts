import { EventListener, LottieProps, Options } from "@types/react-lottie";

declare module "lottie-react" {
  declare class Lottie extends React.Component<LottieProps, any> {}
  export default Lottie;
}
