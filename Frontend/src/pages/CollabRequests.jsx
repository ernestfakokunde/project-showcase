import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useSocket } from "../context/SocketContext";
import { useToast } from "../context/ToastContext";
import Topbar from "../components/layout/Topbar";

const CollabRequests = () => {
  const { authFetch } = useAuth();
  const { refreshCounts } = useApp();
  const { socket } = useSocket();
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("incoming");
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchRequests({ showLoader: false, showToast: false });
      }
    }, 15000);

    const handleFocus = () => fetchRequests({ showLoader: false, showToast: false });
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchRequests({ showLoader: false, showToast: false });
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [activeTab]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleRequestsUpdated = () => {
      fetchRequests({ showLoader: false, showToast: false });
      refreshCounts();
    };

    socket.on("requests:updated", handleRequestsUpdated);

    return () => {
      socket.off("requests:updated", handleRequestsUpdated);
    };
  }, [activeTab, refreshCounts, socket]);

  const fetchRequests = async ({ showLoader = true, showToast = true } = {}) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const endpoint = activeTab === "incoming" ? "/api/requests/incoming" : "/api/requests/sent";
      const res = await authFetch(endpoint);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to load requests");
      }

      setRequests(data.requests || []);
      setPageError("");
    } catch (error) {
      if (showLoader) {
        setRequests([]);
        setPageError(error.message || "Failed to load requests");
      }

      if (showToast) {
        addToast(error.message || "Failed to load requests", "error");
      }
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const res = await authFetch(`/api/requests/${requestId}/accept`, { method: "PUT" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to accept request");
      }

      setRequests((prev) =>
        prev.map((request) => (request._id === requestId ? { ...request, status: "accepted" } : request))
      );
      refreshCounts();
      addToast("Request accepted", "success");
    } catch (error) {
      addToast(error.message || "Failed to accept request", "error");
    }
  };

  const handleDecline = async (requestId) => {
    try {
      const res = await authFetch(`/api/requests/${requestId}/decline`, { method: "PUT" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to decline request");
      }

      setRequests((prev) =>
        prev.map((request) => (request._id === requestId ? { ...request, status: "declined" } : request))
      );
      refreshCounts();
      addToast("Request declined", "success");
    } catch (error) {
      addToast(error.message || "Failed to decline request", "error");
    }
  };

  const handleCancel = async (requestId) => {
    try {
      const res = await authFetch(`/api/requests/${requestId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to cancel request");
      }

      setRequests((prev) => prev.filter((request) => request._id !== requestId));
      refreshCounts();
      addToast("Request cancelled", "success");
    } catch (error) {
      addToast(error.message || "Failed to cancel request", "error");
    }
  };

  const pendingRequests = requests.filter((request) => request.status === "pending");
  const approvedRequests = requests.filter((request) => request.status === "accepted");
  const declinedRequests = requests.filter((request) => request.status === "declined");

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar
        variant="title"
        title="Collaboration Requests"
        subtitle={activeTab === "incoming" ? "Requests sent to your projects" : "Requests you have sent"}
      />

      <div className="flex">
        <div className="w-full max-w-[720px] flex-1 border-r border-white/10">
          <div className="border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex gap-3 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("incoming")}
                className={`rounded-[8px] px-4 py-2 text-sm font-medium transition ${
                  activeTab === "incoming"
                    ? "bg-[#7f77dd] text-white"
                    : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                Incoming
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sent")}
                className={`rounded-[8px] px-4 py-2 text-sm font-medium transition ${
                  activeTab === "sent"
                    ? "bg-[#7f77dd] text-white"
                    : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                Sent
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center text-white/40">Loading requests...</div>
          ) : pageError ? (
            <div className="p-6">
              <div className="rounded-[12px] border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                <div className="font-medium">Could not load requests</div>
                <div className="mt-1 text-red-200/80">{pageError}</div>
                <button
                  type="button"
                  onClick={() => fetchRequests()}
                  className="mt-3 rounded-[8px] bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/15"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-6 text-center text-white/40">
              No {activeTab === "incoming" ? "incoming" : "sent"} requests yet
            </div>
          ) : (
            <div>
              {pendingRequests.length > 0 ? (
                <RequestSection
                  title={`Pending (${pendingRequests.length})`}
                  requests={pendingRequests}
                  activeTab={activeTab}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onCancel={handleCancel}
                />
              ) : null}

              {approvedRequests.length > 0 ? (
                <RequestSection
                  title={`Approved (${approvedRequests.length})`}
                  requests={approvedRequests}
                  activeTab={activeTab}
                  variant="approved"
                />
              ) : null}

              {declinedRequests.length > 0 ? (
                <RequestSection
                  title={`Declined (${declinedRequests.length})`}
                  requests={declinedRequests}
                  activeTab={activeTab}
                  variant="declined"
                />
              ) : null}
            </div>
          )}
        </div>

        <div className="hidden w-[260px] border-l border-white/10 p-6 lg:block">
          <div className="rounded-[12px] border border-white/10 bg-white/5 p-4">
            <h3 className="text-xs font-medium uppercase text-white/60">Summary</h3>
            <div className="mt-3 space-y-2 text-xs text-white/40">
              <div>Pending: {pendingRequests.length}</div>
              <div>Approved: {approvedRequests.length}</div>
              <div>Declined: {declinedRequests.length}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const RequestSection = ({
  title,
  requests,
  activeTab,
  variant = "pending",
  onAccept,
  onDecline,
  onCancel,
}) => (
  <div className="border-b border-white/10">
    <div className="px-4 sm:px-6 py-3 bg-white/5">
      <h3 className="text-xs font-medium uppercase text-white/60">{title}</h3>
    </div>

    <div className="divide-y divide-white/10">
      {requests.map((request) => (
        <div key={request._id} className="p-4 sm:p-6 hover:bg-white/5 transition">
          {variant === "pending" ? (
            activeTab === "incoming" ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-white">
                      @{request.from?.username || "user"} wants to join
                    </div>
                    <div className="mt-1 text-[13px] text-white/50">
                      {request.project?.title || "your project"}
                    </div>
                  </div>
                  <span className="rounded-[6px] bg-yellow-500/15 px-2 py-1 text-[10px] text-yellow-300">
                    Pending
                  </span>
                </div>

                <RequestDetails request={request} />

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onAccept?.(request._id)}
                    className="flex-1 rounded-[8px] bg-green-500/15 px-3 py-2 text-xs font-medium text-green-300 hover:bg-green-500/25"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => onDecline?.(request._id)}
                    className="flex-1 rounded-[8px] bg-red-500/15 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/25"
                  >
                    Decline
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-white">
                      Requested to join "{request.project?.title || "project"}"
                    </div>
                    <div className="mt-1 text-[13px] text-white/50">
                      Owner: @{request.owner?.username || "owner"}
                    </div>
                  </div>
                  <span className="rounded-[6px] bg-yellow-500/15 px-2 py-1 text-[10px] text-yellow-300">
                    Pending
                  </span>
                </div>

                <RequestDetails request={request} />

                <button
                  type="button"
                  onClick={() => onCancel?.(request._id)}
                  className="mt-4 w-full rounded-[8px] border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 hover:bg-white/10"
                >
                  Cancel request
                </button>
              </>
            )
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className={`text-sm font-medium ${
                  variant === "approved" ? "text-green-300" : "text-red-300"
                }`}>
                  {variant === "approved" ? "Approved" : "Declined"}
                </div>
                <div className="mt-2 text-[13px] text-white/50">
                  {variant === "approved"
                    ? activeTab === "incoming"
                      ? `@${request.from?.username || "user"} joined your project`
                      : `You're now collaborating on "${request.project?.title || "this project"}"`
                    : activeTab === "incoming"
                      ? `You declined @${request.from?.username || "user"}'s request`
                      : `Your request was declined for "${request.project?.title || "this project"}"`}
                </div>
              </div>

              {variant === "approved" && request.project?._id ? (
                <a
                  href={`/project/${request.project._id}`}
                  className="rounded-[7px] bg-[#7f77dd]/20 px-3 py-2 text-xs text-[#afa9ec] hover:bg-[#7f77dd]/30"
                >
                  View project
                </a>
              ) : null}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const RequestDetails = ({ request }) => (
  <div className="mt-4 rounded-[12px] border border-white/10 bg-white/5 p-4">
    <div>
      <p className="text-[10px] uppercase text-white/40">Pitch</p>
      <p className="mt-1 text-xs text-white/65">{request.pitch}</p>
    </div>

    {request.whatYouOffer ? (
      <div className="mt-3">
        <p className="text-[10px] uppercase text-white/40">What they offer</p>
        <p className="mt-1 text-xs text-white/65">{request.whatYouOffer}</p>
      </div>
    ) : null}

    {(request.email || request.phone) ? (
      <div className="mt-3 flex flex-wrap gap-4 border-t border-white/10 pt-3">
        {request.email ? (
          <div>
            <p className="text-[10px] uppercase text-white/40">Email</p>
            <a href={`mailto:${request.email}`} className="mt-1 block text-xs text-[#afa9ec] hover:text-white">
              {request.email}
            </a>
          </div>
        ) : null}

        {request.phone ? (
          <div>
            <p className="text-[10px] uppercase text-white/40">Phone</p>
            <a href={`tel:${request.phone}`} className="mt-1 block text-xs text-[#afa9ec] hover:text-white">
              {request.phone}
            </a>
          </div>
        ) : null}
      </div>
    ) : null}

    {(request.socials?.github || request.socials?.linkedin || request.socials?.portfolio || request.socials?.twitter) ? (
      <div className="mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-3">
        {request.socials?.github ? (
          <a href={request.socials.github} target="_blank" rel="noopener noreferrer" className="rounded-[7px] bg-white/5 px-2 py-1 text-[11px] text-white/60 hover:text-white">
            GitHub
          </a>
        ) : null}
        {request.socials?.linkedin ? (
          <a href={request.socials.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-[7px] bg-white/5 px-2 py-1 text-[11px] text-white/60 hover:text-white">
            LinkedIn
          </a>
        ) : null}
        {request.socials?.portfolio ? (
          <a href={request.socials.portfolio} target="_blank" rel="noopener noreferrer" className="rounded-[7px] bg-white/5 px-2 py-1 text-[11px] text-white/60 hover:text-white">
            Portfolio
          </a>
        ) : null}
        {request.socials?.twitter ? (
          <a href={request.socials.twitter} target="_blank" rel="noopener noreferrer" className="rounded-[7px] bg-white/5 px-2 py-1 text-[11px] text-white/60 hover:text-white">
            Twitter
          </a>
        ) : null}
      </div>
    ) : null}
  </div>
);

export default CollabRequests;
