import React, { useEffect, useState } from "react";

export default function Notification({ message }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message || !visible) return null;

  return (
    <div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 text-black font-semibold"
      style={{ pointerEvents: "none", opacity: visible ? 1 : 0, transition: "opacity 0.5s ease" }}
    >
      {message}
    </div>
  );
}
