import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { resendVerificationEmailAction } from "@/state/reducers/userReducer";
import { selectUser } from "@/state/slices/userSlice";
import * as Dialog from "@radix-ui/react-dialog";
import Spinner from "@/components/static/Spinner";

export default function EmailSent() {
  const dispatch = useAppDispatch();
  const router = useNavigate();
  const { user, loading } = useAppSelector(selectUser);

  if (loading) {
    return <Spinner className="w-full h-full" />;
  }

  return (
    <Dialog.Root open={true}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4">
          <div className="bg-white rounded-md shadow-lg px-4 py-6">
            <div className=" flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
              {user && user.verified ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-red-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <Dialog.Title className="text-lg font-medium text-gray-800 text-center mt-3">
              {" "}
              {user && user.verified
                ? "Email verified successfully"
                : "Verification Email Sent !"}
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm leading-relaxed text-center text-gray-500">
              {user && user.verified
                ? "Your email has already been verified. Click the button below to go to the Dashboard"
                : user && user.resentEmail
                  ? "Another verification email has been sent your email. If you don't see the email, check the spam folder. If you still can't find it, click the button below to resend the email again."
                  : " Please check your email to verify your account. If you don't see the email, check the spam folder. If you still can't find, click the button below to resend the email."}
            </Dialog.Description>
            <div className="items-center gap-2 mt-3 text-sm sm:flex">
              <Dialog.Close asChild>
                {user && user.verified ? (
                  <button className="w-full mt-2 p-2.5 flex-1 text-white bg-indigo-600 rounded-md outline-none  ring-indigo-600 ">
                    Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => dispatch(resendVerificationEmailAction())}
                    className="w-full mt-2 p-2.5 flex-1 text-white bg-indigo-600 rounded-md outline-none  ring-indigo-600 "
                  >
                    Resend Email
                  </button>
                )}
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  onClick={() => router("/")}
                  className="w-full mt-2 p-2.5 flex-1 text-white bg-black rounded-md outline-none "
                >
                  Home
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
