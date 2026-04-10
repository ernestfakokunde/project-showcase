import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [notifCount, setNotifCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  const value = useMemo(
    () => ({ notifCount, setNotifCount, requestCount, setRequestCount }),
    [notifCount, requestCount]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);

export default AppContext;
