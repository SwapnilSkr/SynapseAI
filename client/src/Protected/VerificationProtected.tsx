import { useAppSelector } from "@/state/hooks";
import { selectUser } from "@/state/slices/userSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VerificationProtected = (props: React.PropsWithChildren) => {
  const router = useNavigate();
  const { user } = useAppSelector(selectUser);
  useEffect(() => {
    if (!user) {
      router("/login");
    } else if (user && !user.verified) {
      router("/verification-status");
    }
  }, [user, router]);
  return <div>{props.children}</div>;
};

export default VerificationProtected;
