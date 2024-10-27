import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { Slide, ToastContainer } from "react-toastify";
import { WagmiConfig } from "wagmi";
import App from "./App";
import { wagmiClient } from "./app/common/connectors";
import store from "./app/store";
import "./i18n";
import i18n from "./i18n";
import reportWebVitals from "./reportWebVitals";
import "./styles/global.scss";
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from "./app/useSocket";
import { HistoryRouter } from "./app/HistoryRouter";
import { myHistory } from "./app/myHistory";
import { ToastProvider } from "./components/common/ToastMessage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <HistoryRouter history={myHistory}>
    <SocketProvider>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <WagmiConfig client={wagmiClient}>
            <ToastProvider>
              <App />
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </ToastProvider>
          </WagmiConfig>
        </Provider>
        <ToastContainer />
      </I18nextProvider>
    </SocketProvider>
  </HistoryRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
