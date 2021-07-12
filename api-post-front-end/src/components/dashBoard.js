import Cookie from "universal-cookie";
import { useHistory } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../components/context/user-context";
function DashBoard() {
  const { setIsLoggedIn } = useContext(UserContext);
  const history = useHistory();
  const logOut = () => {
    const cookie = new Cookie();
    cookie.remove("Authorization");
    setIsLoggedIn({ path: "/login", logged: false });
    history.push("/login");
  };
  return (
    <>
      <h1>dash board</h1>
      <button onClick={logOut}>logOut</button>
    </>
  );
}
export default DashBoard;
