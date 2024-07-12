import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    color: notification.type === "error" ? "red" : "green",
  };

  if (!notification.message) {
    return null;
  }

  return <div style={style}>{notification.message}</div>;
};

export default Notification;
