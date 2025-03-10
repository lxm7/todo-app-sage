import React from "react";
import ReactDOM from "react-dom/client";
import CarbonProvider from "carbon-react/lib/components/carbon-provider";
import sageTheme from "carbon-react/lib/style/themes/sage";
import GlobalStyle from "carbon-react/lib/style/global-style";
import "carbon-react/lib/style/fonts.css";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const { worker } = await import("./mocks/browser");
  return worker.start();
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <CarbonProvider theme={sageTheme}>
      <GlobalStyle />
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </CarbonProvider>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
