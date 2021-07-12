import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Cookie from "universal-cookie";
import Welcome from "./components/welcome.js";
import DashBoard from "./components/dashBoard.js";
import UserContext from "./components/context/user-context.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState({
    path: "/singup",
    logged: true,
  });

  const checkLoggedIN = () => {
    const cookie = new Cookie();
    if (cookie.get("Authorization"))
      return setIsLoggedIn({ path: "/dashboard", logged: true });
    return setIsLoggedIn({ logged: false });
  };
  useEffect(() => {
    checkLoggedIN();
  }, []);

  return (
    <div className="app">
      <Router>
        <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
          {isLoggedIn.logged ? (
            <Switch>
              <Route exact path={"/dashBoard"} component={DashBoard} />
            </Switch>
          ) : (
            <>
              <Welcome />
              <Redirect to={"/login"} />
            </>
          )}
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
