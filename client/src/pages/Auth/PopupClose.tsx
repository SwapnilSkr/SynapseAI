import { useEffect } from "react";

const PopupClose = () => {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        { success: true, message: "Google authentication successful" },
        import.meta.env.VITE_REACT_CLIENT_URL
      );
    }
    window.close();
  }, []);

  return (
    <div>
      <p>Authentication successful. You can close this window.</p>
    </div>
  );
};

export default PopupClose;
