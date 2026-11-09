// This prevents the router from making authentication decisions before session verification finishes.

import { useEffect, useState } from "react";
import { initializeAuth } from "../../features/auth/authBootstrap";

function AuthInitializer({ children }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initializeAuth();
      setIsReady(true);
    };

    initialize();
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted">Loading CodeRoom...</p>
      </div>
    );
  }

  return children;
}

export default AuthInitializer;