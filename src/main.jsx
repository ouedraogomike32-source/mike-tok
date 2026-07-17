import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "../App.jsx";
import AuthScreen from "../components/AuthScreen.jsx";
import "./index.css";

function Root() {
  const [user, setUser] = useState(null);

  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: "#000" }}>
        <div className="relative w-full max-w-[420px] h-[100vh] max-h-[900px] overflow-hidden">
          <AuthScreen onAuthenticated={(u) => setUser(u)} />
        </div>
      </div>
    );
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
