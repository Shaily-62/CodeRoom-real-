import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { testBackendConnection } from "./services/testApi";

function App() {
  useEffect(() => {
    testBackendConnection();
  }, []);

  return <AppRouter />;
}

export default App;