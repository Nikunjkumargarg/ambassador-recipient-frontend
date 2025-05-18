import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function userLogoutConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unblock = window.history.pushState;

    // Monkey patch history.pushState to listen for navigation to "/"
    window.history.pushState = function (...args) {
      const [, , url] = args;

      if (url === "/") {
        const confirmed = window.confirm("Are you sure you want to log out?");
        if (confirmed) {
          localStorage.clear();
          unblock.apply(window.history, args); // Proceed with original push
          window.location.href = "/"; // Force reload for full logout effect
        } else {
          return; // Cancel navigation
        }
      } else {
        unblock.apply(window.history, args);
      }
    };

    return () => {
      window.history.pushState = unblock; // Restore original behavior
    };
  }, [location.pathname, navigate]);
}
