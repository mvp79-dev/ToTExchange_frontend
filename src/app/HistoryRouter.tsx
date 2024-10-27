import React, { ReactNode } from "react";
import { useLayoutEffect, useState } from "react";
// eslint-disable-next-line no-redeclare
import { History } from "history";
import { Router } from "react-router-dom";

export interface BrowserRouterProps {
  basename?: string;
  children?: React.ReactNode;
  history: History;
}
export function HistoryRouter({
  basename,
  children,
  history,
}: BrowserRouterProps) {
  let [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      // eslint-disable-next-line react/no-children-prop
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}
