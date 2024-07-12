const Login = ({ show, handleLogin }) => {
  if (!show) {
    return null;
  }
  return (
    <div>
      <h2>login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input type="text" name="username" />
        </div>
        <div>
          password
          <input type="password" name="password" />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};
export default Login;
