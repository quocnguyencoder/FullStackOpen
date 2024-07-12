import { useDispatch } from "react-redux";
import { login } from "../reducers/currentUserReducer";
import Notification from "./Notification";
import useField from "../hooks/useField";

const LoginForm = () => {
  const dispatch = useDispatch();
  const username = useField("text");
  const password = useField("password");

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login(username.value, password.value));
  };

  return (
    <div>
      <h2>login</h2>
      <Notification />
      <form onSubmit={handleLogin} data-testid="login-form">
        <div>
          username
          <input data-testid="username-input" {...username} />
        </div>
        <div>
          password
          <input data-testid="password-input" {...password} />
        </div>
        <button data-testid="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  );
};
export default LoginForm;
