import { useEffect } from "react";
import { useAppDispatch } from "@/state/hooks";
import { verifyEmailAction } from "@/state/reducers/userReducer";
import EmailSent from "./EmailSent";

const VerifyEmail = () => {
  const dispatch = useAppDispatch();
  const query = new URLSearchParams(window.location.search);
  const token = query.get("token");

  useEffect(() => {
    if (token) {
      dispatch(verifyEmailAction(token));
    }
  }, [token, dispatch]);

  return <EmailSent />;
};

export default VerifyEmail;
