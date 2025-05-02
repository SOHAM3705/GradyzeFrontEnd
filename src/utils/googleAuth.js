import axios from "axios";

const initializeGoogleLogin = ({ role, onSuccess, onError }) => {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const loadGsiScript = () => {
    if (window._gsiInitialized) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGSI;
    document.body.appendChild(script);
  };

  const initGSI = () => {
    if (!GOOGLE_CLIENT_ID || !window.google?.accounts?.id) {
      console.warn("❗ Google API or Client ID not found");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const res = await axios.post(`${API_BASE_URL}/api/auth/google`, {
            token: response.credential,
            role,
          });

          onSuccess(res.data);
        } catch (err) {
          onError(err);
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Remove existing button if any to avoid duplicates
    const buttonContainer = document.getElementById("gsi-button");
    if (buttonContainer) {
      buttonContainer.innerHTML = "";
      window.google.accounts.id.renderButton(buttonContainer, {
        theme: "outline",
        size: "large",
      });
    }

    window._gsiInitialized = true;
  };

  loadGsiScript();
};

export default initializeGoogleLogin;
