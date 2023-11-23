import axios from "axios";
import Notification from "../components/Notification/Notification";
import NotificationFooter from "../components/Notification/NotificationFooter";
import { useEffect, useState } from "react";
import NotificationEntity from "../lib/entities/Notification";
import EmptyContainer from "../components/Empty/Empty";

function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);

  const loadNotifications = async () => {
    const { data } = await axios.get("/api/notifications", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setNotifications(data);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <>
      {notifications.map(({ type, read, content, createdAt, link }) => (
        <Notification
          type={type}
          read={read}
          content={content}
          createdAt={createdAt}
          link={link}
        />
      ))}
      {notifications.length == 0 && (
        <EmptyContainer text="Notifications are empty." />
      )}
      <NotificationFooter />
    </>
  );
}

export default NotificationPage;
