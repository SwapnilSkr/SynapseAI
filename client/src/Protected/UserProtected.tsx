import { useAppSelector } from "@/state/hooks";
import { selectUser } from "@/state/slices/userSlice";

const UserProtected = (props: React.PropsWithChildren) => {
  const { user } = useAppSelector(selectUser);
  if (!user) return <div>You are not authenticated</div>;
  if (user && !user.verified) return <div>You are not verified</div>;
  return <div>{props.children}</div>;
};

export default UserProtected;
