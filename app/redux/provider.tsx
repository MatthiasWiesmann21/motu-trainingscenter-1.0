import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";

const PG = ({ children }: any) => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  
  const persistedUser = useSelector((state: any) => state?.user);
  useEffect(() => {
    const getUser = async () => {
      console.log("Whats in provider" , session , status , persistedUser)
      if (status !== "authenticated") {
        return;
      }
      try {
        if (persistedUser) {
          if (JSON.stringify(persistedUser) === JSON.stringify(session.user)) {
            return;
          } else {
            dispatch({ type: "SetUser", payload: session.user });
          }
        } else {
          dispatch({ type: "SetUser", payload: session.user });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
  
    getUser();
  }, [status]);
  // return <></>
  return <>{children}</>;
};

export const Providers = ({ children }: any) => (
  <Provider store={store}>
    <PG>{children}</PG>
  </Provider>
);
