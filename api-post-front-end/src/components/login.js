import { useState, useContext } from "react";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";
import axios from "./axios";
import UserContext from "../components/context/user-context.js";
function Login(props) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  const history = useHistory();

  const onChange = (e) => {
    console.log(form);
    setForm((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = (data) => {
    let isTrue = true;
    setErrors({ name: "", email: "", password: "" });
    Object.keys(data).forEach(function (key) {
      if (!data[key]) {
        isTrue = false;
        setErrors((state) => ({ ...state, [key]: `${key} required` }));
      }

      if (props.page && data[key]) {
        const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (key === "email" && !emailReg.test(data.email)) {
          isTrue = false;
          setErrors((state) => ({ ...state, ["email"]: `invalid email` }));
        }
        if (key === "password" && data.password.length <= 8) {
          isTrue = false;
          setErrors((state) => ({
            ...state,
            ["password"]: `must password be 8 characters or more`,
          }));
        }
      }
    });
    return isTrue;
  };

  const submitForm = async (e) => {
    e.preventDefault();

    let isValid;
    let formData;
    if (props.page) {
      formData = form;
      isValid = validate(formData);
    } else {
      formData = { email: form.email, password: form.password };
      isValid = validate(formData);
    }

    if (isValid) {
      axios
        .post(props.pageTitle, formData)
        .then((res) => {
          const cookie = new Cookies();
          cookie.set("Authorization", `bearer ${res.data.token}`);
          setIsLoggedIn({ logged: true });
          history.push("/dashboard");
        })
        .catch((e) => {
          const error = e.response.data;
          setErrors((state) => ({
            ...state,
            [error.errorType]: error.message,
          }));
          console.log(errors);
        });
    }
  };

  return (
    <div>
      <h2>{props.pageTitle}</h2>
      <form onSubmit={submitForm} className="auth-form">
        {props.page ? (
          <>
            <div>
              <label htmlFor="name">name</label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={(e) => onChange(e)}
              />
            </div>
            <small className="error">{errors.name}</small>
          </>
        ) : null}
        <div>
          <label htmlFor="email">email</label>
          <input
            id="email"
            name="email"
            type="text"
            onChange={(e) => onChange(e)}
          />
        </div>
        <small className="error">{errors.email}</small>

        <div>
          <label htmlFor="password">password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={(e) => onChange(e)}
          />
          <br />
        </div>
        <small className="error">{errors.password}</small>

        <input className="login" type="submit" value={props.pageTitle} />
      </form>
    </div>
  );
}
export default Login;
