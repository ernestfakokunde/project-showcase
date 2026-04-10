import { useMemo } from "react";
import Topbar from "../components/layout/Topbar";
import NotifItem from "../components/notifications/NotifItem";

const tabs = [
  { key: "all", label: "All" },
  { key: "requests", label: "Join requests" },
  { key: "activity", label: "Activity" },
  { key: "following", label: "Following" },
];

const Notifications = ({ notifications = [], activeTab = "all", onTabChange, onAccept, onDecline, onMarkAllRead }) => {
  const grouped = useMemo(() => groupNotifications(notifications), [notifications]);
  const counts = useMemo(() => countByType(notifications), [notifications]);

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar variant="title" title="Notifications" onMarkAllRead={onMarkAllRead} />

      <div className="mx-auto max-w-[640px] px-7 py-6">
        <div className="mb-5 flex border-b border-white/10">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            const count = tab.key === "all" ? notifications.length : tab.key === "requests" ? counts.requests : undefined;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange?.(tab.key)}
                className={`-mb-px flex items-center gap-1 border-b-2 px-4 py-2 text-[13px] ${
                  isActive
                    ? "border-[#7f77dd] text-[#afa9ec]"
                    : "border-transparent text-white/35"
                }`}
              >
                {tab.label}
                {typeof count === "number" ? (
                  <span className="rounded-full bg-[#7f77dd]/20 px-1.5 text-[10px] text-[#afa9ec]">
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {notifications.length === 0 ? (
          <div className="rounded-[12px] border border-white/10 bg-[#111118] p-6 text-center text-sm text-white/40">
            You're all caught up
          </div>
        ) : (
          Object.entries(grouped).map(([label, items]) => (
            <div key={label} className="mb-4">
              <div className="mb-2 text-[11px] uppercase tracking-[0.6px] text-white/25">{label}</div>
              <div className="space-y-2">
                {items.map((item) => (
                  <NotifItem
                    key={item._id || item.id}
                    {...item}
                    onAccept={() => onAccept?.(item)}
                    onDecline={() => onDecline?.(item)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

const groupNotifications = (notifications) => {
  const groups = { Today: [], Yesterday: [], Older: [] };

  notifications.forEach((item) => {
    if (item.group) {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
      return;
    }

    const label = typeof item.createdAt === "string" && item.createdAt.toLowerCase().includes("yesterday") ? "Yesterday" : "Today";
    groups[label].push(item);
  });

  return Object.fromEntries(Object.entries(groups).filter(([, items]) => items.length));
};

const countByType = (notifications) => {
  return notifications.reduce(
    (acc, item) => {
      if (item.type === "join_request") acc.requests += 1;
      if (item.type === "follow") acc.following += 1;
      if (["like", "comment", "accepted", "rejected"].includes(item.type)) acc.activity += 1;
      return acc;
    },
    { requests: 0, following: 0, activity: 0 }
  );
};

export default Notifications;
