import classes from "./Login.module.css";
import { AiOutlineClose } from "react-icons/ai";
import { getCookie, setCookieAndTime } from "../../middleware/cookie";
import {
  Form,
  json,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { useEffect } from "react";

const AuthForm = ({ method }) => {
  const navigate = useNavigate();
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  useEffect(() => {
    const checkToken = async () => {
      const token = getCookie("token");
      if (token !== null) {
        return navigate("/");
      }
    };
    checkToken();
  }, []);
  return (
    <>
      <div className={classes.backdrop} />
      <div className={classes.login_box}>
        <div className={classes.exit}>
          <i>
            <AiOutlineClose />
          </i>
        </div>
        <Form method={method} className={classes.form}>
          <h1>Welcome back!</h1>
          <p>Take control of your productivity journey!</p>
          <div className={classes.login_box_input}>
            <input
              type="email"
              placeholder="test@example.com"
              id="email"
              name="email"
            />
            <input
              type="password"
              placeholder="abc12345!"
              name="password"
              id="password"
            />
            <button disabled={isSubmitting}>
              {isSubmitting ? `Loading...` : `Sign in`}
            </button>
          </div>
          <p>
            {`Don't have an account? `}
            <a href="">Sign up</a>
          </p>
        </Form>
      </div>
    </>
  );
};

export default AuthForm;

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  const login = {
    email: data.get("email"),
    password: data.get("password"),
  };
  let url = `http://localhost:3000/api/user/login`;
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(login),
  });
  if (!response.ok) {
    return redirect("/auth/login");
  } else {
    const resData = await response.json();
    setCookieAndTime("token", resData.token, 30);
  }
  return redirect("/");
}
