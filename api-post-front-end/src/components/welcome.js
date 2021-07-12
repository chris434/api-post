import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Login from "./login.js";

function Welcome() {
  const [link, setLink] = useState();

  const changeLink = (path) => {
    path ? setLink(false) : setLink(true);
  };

  return (
    <section className="auth-container">
      <h1> welcome to api post </h1>
      <nav>
        <Link
          className={link ? "active auth-link" : "auth-link"}
          onClick={() => changeLink(false)}
          to="/signup">
          signup
        </Link>
        <Link
          className={!link ? "active auth-link" : "auth-link"}
          to="/login"
          onClick={() => changeLink(true)}>
          login
        </Link>
      </nav>

      <Route
        exact
        path={"/login"}
        render={(props) => (
          <Login {...props} page={false} pageTitle={"login"} />
        )}
      />
      <Route
        exact
        path={"/signup"}
        render={(props) => (
          <Login {...props} page={true} pageTitle={"signup"} />
        )}
      />
    </section>
  );
}
export default Welcome;
