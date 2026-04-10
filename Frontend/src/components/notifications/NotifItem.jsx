const NotifItem = ({
  type,
  from,
  project,
  pitch,
  comment,
  read = false,
  createdAt,
  onAccept,
  onDecline,
}) => {
  const isUnread = !read;
  const avatarInitials = (from?.initials || from?.username?.slice(0, 2) || "SL").toUpperCase();

  return (
    <div
      className={`relative flex gap-3 rounded-[12px] border px-[14px] py-[14px] ${
        isUnread ? "border-[#7f77dd]/20 bg-[#7f77dd]/5" : "border-white/10 bg-[#111118]"
      }`}
    >
      {isUnread ? <span className="absolute right-[14px] top-[16px] h-1.5 w-1.5 rounded-full bg-[#7f77dd]" /> : null}

      {type === "join_request" || type === "comment" || type === "like" ? (
        <div className={`flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-medium ${avatarClass(type)}`}>
          {avatarInitials}
        </div>
      ) : type === "follow" ? (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(186,117,23,0.15)]">
          <FollowIcon className="h-4 w-4 text-[#ef9f27]" />
        </div>
      ) : type === "accepted" ? (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(29,158,117,0.15)]">
          <AcceptIcon className="h-4 w-4 text-[#5dcaa5]" />
        </div>
      ) : type === "rejected" ? (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(216,90,48,0.15)]">
          <RejectIcon className="h-4 w-4 text-[#f0997b]" />
        </div>
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7f77dd]/20 text-[12px] text-[#afa9ec]">
          {avatarInitials}
        </div>
      )}

      <div className="flex-1">
        <div className="text-[13px] leading-[1.5] text-white/65">
          <strong className="text-white">@{from?.username || "stacker"}</strong> {messageForType(type)}
        </div>
        {project?.title ? <span className="mt-[5px] inline-block rounded-[5px] bg-white/5 px-2 py-[1px] text-[11px] text-white/40">{project.title}</span> : null}

        {type === "join_request" && pitch ? (
          <div className="mt-2 rounded-[8px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-[12px] leading-[1.5] text-white/40">
            {pitch}
          </div>
        ) : null}

        {type === "accepted" ? (
          <div className="mt-2 rounded-[7px] border border-[rgba(29,158,117,0.2)] bg-[rgba(29,158,117,0.08)] px-2.5 py-[7px] text-[12px] text-[#5dcaa5]/80">
            Community links are now unlocked - GitHub and Discord available in the project page.
          </div>
        ) : null}

        {type === "comment" && comment ? (
          <div className="mt-2 rounded-[8px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-[12px] leading-[1.5] text-white/40">
            {comment}
          </div>
        ) : null}

        {type === "join_request" ? (
          <div className="mt-[10px] flex gap-[7px]">
            <button
              type="button"
              onClick={onAccept}
              className="rounded-[7px] bg-[#1d9e75] px-[14px] py-[5px] text-[11px] font-medium text-white"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={onDecline}
              className="rounded-[7px] border border-white/10 bg-white/5 px-[14px] py-[5px] text-[11px] text-white/40"
            >
              Decline
            </button>
            <button
              type="button"
              className="rounded-[7px] border border-[#7f77dd]/25 bg-[#7f77dd]/10 px-[14px] py-[5px] text-[11px] text-[#afa9ec]"
            >
              View full pitch
            </button>
          </div>
        ) : null}

        {createdAt ? <div className="mt-1 text-[11px] text-white/25">{createdAt}</div> : null}
      </div>
    </div>
  );
};

const avatarClass = (type) => {
  if (type === "join_request") return "bg-[rgba(29,158,117,0.2)] text-[#5dcaa5]";
  if (type === "comment") return "bg-[rgba(216,90,48,0.2)] text-[#f0997b]";
  if (type === "like") return "bg-[rgba(127,119,221,0.2)] text-[#afa9ec]";
  return "bg-[rgba(127,119,221,0.2)] text-[#afa9ec]";
};

const messageForType = (type) => {
  if (type === "join_request") return "sent a request to join your project";
  if (type === "accepted") return "accepted your request to join";
  if (type === "rejected") return "declined your request";
  if (type === "like") return "and 2 others liked your project";
  if (type === "comment") return "commented on your project";
  if (type === "follow") return "started following you";
  return "";
};

const AcceptIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const RejectIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const FollowIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 14s1-4 5-4" stroke="currentColor" strokeWidth="1.2" />
    <path d="M11 8v4M9 10h4" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export default NotifItem;
