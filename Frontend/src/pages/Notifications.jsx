import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useSocket } from "../context/SocketContext";
import { useToast } from "../context/ToastContext";
import Topbar from "../components/layout/Topbar";

const Notifications = () => {
  const { authFetch } = useAuth();
  const { notifCount, setNotifCount, refreshCounts } = useApp();
  const { socket } = useSocket();
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    fetchNotifications();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchNotifications({ showLoader: false, showToast: false });
      }
    }, 15000);

    const handleFocus = () => fetchNotifications({ showLoader: false, showToast: false });
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchNotifications({ showLoader: false, showToast: false });
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleNotificationsUpdated = () => {
      fetchNotifications({ showLoader: false, showToast: false });
      refreshCounts();
    };

    socket.on("notifications:updated", handleNotificationsUpdated);

    return () => {
      socket.off("notifications:updated", handleNotificationsUpdated);
    };
  }, [refreshCounts, socket]);

  const fetchNotifications = async ({ showLoader = true, showToast = true } = {}) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const res = await authFetch("/notifications");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to load notifications");
      }

      setNotifications(data.notifications || []);
      setPageError("");
    } catch (error) {
      if (showLoader) {
        setNotifications([]);
        setPageError(error.message || "Failed to load notifications");
      }

      if (showToast) {
        addToast(error.message || "Failed to load notifications", "error");
      }
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  const handleMarkAsRead = async (notifId) => {
    try {
      const res = await authFetch(`/notifications/${notifId}/read`, { method: "PUT" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to mark as read");
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notifId ? { ...notification, read: true } : notification
        )
      );
      setNotifCount((prev) => Math.max(0, prev - 1));
      refreshCounts();
    } catch (error) {
      addToast(error.message || "Failed to mark as read", "error");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await authFetch("/notifications/read-all", { method: "PUT" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to mark all as read");
      }

      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
      setNotifCount(0);
      refreshCounts();
      addToast("All notifications marked as read", "success");
    } catch (error) {
      addToast(error.message || "Failed to mark all as read", "error");
    }
  };

  const handleDelete = async (notifId) => {
    try {
      const res = await authFetch(`/notifications/${notifId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to delete notification");
      }

      const deletedNotification = notifications.find((notification) => notification._id === notifId);
      setNotifications((prev) => prev.filter((notification) => notification._id !== notifId));

      if (deletedNotification && !deletedNotification.read) {
        setNotifCount((prev) => Math.max(0, prev - 1));
      }

      refreshCounts();
      addToast("Notification deleted", "success");
    } catch (error) {
      addToast(error.message || "Failed to delete notification", "error");
    }
  };

  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case "join_request":
        return `@${notification.from?.username || "user"} requested to join "${notification.project?.title || "your project"}"`;
      case "accepted":
        return `Your request was accepted for "${notification.project?.title || "this project"}"`;
      case "declined":
        return `Your request was declined for "${notification.project?.title || "this project"}"`;
      case "like":
        return `@${notification.from?.username || "user"} liked "${notification.project?.title || "your project"}"`;
      case "comment":
        return `@${notification.from?.username || "user"} commented on "${notification.project?.title || "your project"}"`;
      case "follow":
        return `@${notification.from?.username || "user"} started following you`;
      default:
        return "You have a new notification";
    }
  };

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar
        variant="title"
        title="Notifications"
        subtitle={notifCount > 0 ? `${notifCount} unread` : "Activity from your network"}
        onMarkAllRead={notifCount > 0 ? handleMarkAllRead : undefined}
      />

      <div className="flex">
        <div className="w-full max-w-[720px] flex-1 border-r border-white/10">
          {loading ? (
            <div className="p-6 text-center text-white/40">Loading notifications...</div>
          ) : pageError ? (
            <div className="p-6">
              <div className="rounded-[12px] border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                <div className="font-medium">Could not load notifications</div>
                <div className="mt-1 text-red-200/80">{pageError}</div>
                <button
                  type="button"
                  onClick={() => fetchNotifications()}
                  className="mt-3 rounded-[8px] bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/15"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-white/40">No notifications yet</div>
          ) : (
            <div className="divide-y divide-white/10">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-5 sm:p-6 transition ${
                    notification.read ? "bg-[#09090e]" : "bg-[#7f77dd]/5"
                  } hover:bg-white/5`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-full text-xs font-medium ${
                      notification.type === "join_request"
                        ? "bg-green-500/15 text-green-300"
                        : notification.type === "accepted"
                          ? "bg-green-500/15 text-green-300"
                          : notification.type === "declined"
                            ? "bg-red-500/15 text-red-300"
                            : notification.type === "follow"
                              ? "bg-amber-500/15 text-amber-300"
                              : "bg-[#7f77dd]/15 text-[#afa9ec]"
                    }`}>
                      {notification.from?.username?.slice(0, 2).toUpperCase() || "SL"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-white">{getNotificationMessage(notification)}</p>
                          <p className="mt-1 text-xs text-white/30">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read ? (
                          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#7f77dd]" />
                        ) : null}
                      </div>

                      {notification.project?.title ? (
                        <div className="mt-3 inline-flex rounded-[7px] border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/55">
                          {notification.project.title}
                        </div>
                      ) : null}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {!notification.read ? (
                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="rounded-[7px] bg-[#7f77dd]/20 px-3 py-2 text-xs text-[#afa9ec] hover:bg-[#7f77dd]/30"
                          >
                            Mark as read
                          </button>
                        ) : null}

                        {notification.type === "accepted" && notification.project?._id ? (
                          <a
                            href={`/project/${notification.project._id}`}
                            className="rounded-[7px] bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/15"
                          >
                            View project
                          </a>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => handleDelete(notification._id)}
                          className="rounded-[7px] border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/55 hover:bg-white/10"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden w-[260px] border-l border-white/10 p-6 lg:block">
          <div className="rounded-[12px] border border-white/10 bg-white/5 p-4">
            <h3 className="text-xs font-medium uppercase text-white/60">Overview</h3>
            <div className="mt-3 space-y-2 text-xs text-white/40">
              <div>Unread: {notifications.filter((notification) => !notification.read).length}</div>
              <div>Total: {notifications.length}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Notifications;
