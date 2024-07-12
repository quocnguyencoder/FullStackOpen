import { useContext } from "react";
import NotificationContext from "../contexts/NotificationContext";
import { useEffect } from "react";

const Notification = () => {
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };
  const [notification, notificationDispatch] = useContext(NotificationContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      notificationDispatch({ type: "CLEAR" });
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  });

  if (!notification) return null;

  return <div style={style}>{notification}</div>;
};

export default Notification;
