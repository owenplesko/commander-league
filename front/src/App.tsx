import "./App.css";
import { authClient } from "./lib/authClient";
import { orpc } from "./lib/client";

function App() {
  return (
    <div>
      <button
        onClick={() => {
          authClient.signIn.social({
            provider: "discord",
            callbackURL: "http://localhost:5173",
          });
        }}
      >
        signUp
      </button>
      <button
        onClick={() => {
          orpc.collection.ping();
        }}
      >
        ping
      </button>
    </div>
  );
}

export default App;
