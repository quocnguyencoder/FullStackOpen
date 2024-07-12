import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/currentUserReducer";

const UserInfo = () => {
  const user = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <p data-testid="logged-in-user-info">{user.name} logged in</p>
      <button data-testid="logout-button" onClick={handleLogout}>
        logout
      </button>
    </div>
  );
};
export default UserInfo;
