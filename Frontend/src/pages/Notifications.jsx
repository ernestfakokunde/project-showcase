import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Topbar from "../components/layout/Topbar";

const Notifications = () => {
  const { authFetch } = useAuth();
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await authFetch("/api/notifications");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setNotifications(data.notifications || []);
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notifId) => {
    try {
      const res = await authFetch(`/api/notifications/${notifId}/read`, { method: "PUT" });

      if (!res.ok) {
        throw new Error("Failed to mark as read");
      }

      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, read: true } : n))
      );
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const handleDelete = async (notifId) => {
    try {
      const res = await authFetch(`/api/notifications/${notifId}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      setNotifications((prev) => prev.filter((n) => n._id !== notifId));
      addToast("Deleted", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const getNotificationMessage = (notif) => {
    switch (notif.type) {
      case "join_request":
        return `@${notif.from?.username} requested to join "${notif.project?.title}"`;
      case "accepted":
        return `Your pitch was accepted for "${notif.project?.title}"!`;
      case "declined":
        return `Your pitch was declined for "${notif.project?.title}"`;
      case "like":
        return `@${notif.from?.username} liked your project "${notif.project?.title}"`;
      case "comment":
        return `@${notif.from?.username} commented on "${notif.project?.title}"`;
      case "follow":
        return `@${notif.from?.username} started following you`;
      default:
        return "New notification";
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      join_request: "📨",
      accepted: "✅",
      declined: "❌",
      like: "❤️",
      comment: "💬",
      follow: "👥",
    };
    return icons[type] || "🔔";
  };

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar variant="title" title="Notifications" />

      <div className="flex">
        <div className="w-full max-w-[680px] flex-1 border-r border-white/10">
          {loading ? (
            <div className="p-6 text-center text-white/40">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-white/40">No notifications yet</div>
          ) : (
            <div className="divide-y divide-white/10">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`p-6 ${notif.read ? "bg-[#09090e]" : "bg-[#7f77dd]/5"} border-l-4 ${
                    notif.read ? "border-transparent" : "border-[#7f77dd]"
                  } hover:bg-white/5 transition group`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl flex-shrink-0">{getNotificationIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{getNotificationMessage(notif)}</p>
                      <p className="text-xs text-white/30 mt-1">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif._id)}
                          className="text-xs px-3 py-1 rounded-[4px] bg-[#7f77dd]/20 text-[#afa9ec] hover:bg-[#7f77dd]/30"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif._id)}
                        className="text-xs px-3 py-1 rounded-[4px] bg-white/5 text-white/50 hover:bg-white/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Action Button for specific types */}
                  {notif.type === "accepted" && (
                    <a
                      href={`/project/${notif.project?._id}`}
                      className="mt-3 inline-block text-xs px-4 py-2 rounded-[6px] bg-[#7f77dd] text-white hover:bg-[#7f77dd]/90"
                    >
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="hidden w-[240px] border-l border-white/10 p-6 lg:block">
          <div className="rounded-[12px] bg-white/5 border border-white/10 p-4">
            <h3 className="text-xs font-medium text-white/60 mb-3 uppercase">Notifications</h3>
            <p className="text-xs text-white/40">
              {notifications.filter((n) => !n.read).length} unread
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Notifications;
