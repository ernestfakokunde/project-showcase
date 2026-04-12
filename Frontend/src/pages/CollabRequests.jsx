import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Topbar from "../components/layout/Topbar";

const CollabRequests = () => {
  const { authFetch, user } = useAuth();
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("incoming");

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === "incoming" ? "/api/requests/incoming" : "/api/requests/sent";
      const res = await authFetch(endpoint);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setRequests(data.requests || []);
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const res = await authFetch(`/api/requests/${requestId}/accept`, { method: "PUT" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: "accepted" } : r))
      );
      addToast("Request accepted!", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const handleDecline = async (requestId) => {
    try {
      const res = await authFetch(`/api/requests/${requestId}/decline`, { method: "PUT" });

      if (!res.ok) {
        throw new Error("Failed to decline");
      }

      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: "declined" } : r))
      );
      addToast("Request declined", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const handleCancel = async (requestId) => {
    try {
      const res = await authFetch(`/api/requests/${requestId}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to cancel");
      }

      setRequests((prev) => prev.filter((r) => r._id !== requestId));
      addToast("Request cancelled", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedRequests = requests.filter((r) => r.status === "accepted");
  const declinedRequests = requests.filter((r) => r.status === "declined");

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar variant="title" title="Collaboration Requests" />

      <div className="flex">
        <div className="w-full max-w-[680px] flex-1 border-r border-white/10">
          {/* Tabs */}
          <div className="border-b border-white/10 px-6 py-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("incoming")}
                className={`pb-2 text-sm font-medium border-b-2 transition ${
                  activeTab === "incoming"
                    ? "border-[#7f77dd] text-[#afa9ec]"
                    : "border-transparent text-white/40 hover:text-white/60"
                }`}
              >
                Incoming (Received)
              </button>
              <button
                onClick={() => setActiveTab("sent")}
                className={`pb-2 text-sm font-medium border-b-2 transition ${
                  activeTab === "sent"
                    ? "border-[#7f77dd] text-[#afa9ec]"
                    : "border-transparent text-white/40 hover:text-white/60"
                }`}
              >
                Sent (My Requests)
              </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="p-6 text-center text-white/40">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="p-6 text-center text-white/40">
              No {activeTab === "incoming" ? "incoming" : "sent"} requests
            </div>
          ) : (
            <div>
              {/* Pending Section */}
              {pendingRequests.length > 0 && (
                <div className="border-b border-white/10">
                  <div className="px-6 py-3 bg-white/5">
                    <h3 className="text-xs font-medium text-white/60 uppercase">
                      Pending ({pendingRequests.length})
                    </h3>
                  </div>
                  <div className="divide-y divide-white/10">
                    {pendingRequests.map((request) => (
                      <div key={request._id} className="p-6 hover:bg-white/5 transition">
                        {activeTab === "incoming" ? (
                          <>
                            <div className="mb-3 flex items-start justify-between">
                              <div>
                                <div className="text-sm font-medium text-white">
                                  @{request.from?.username} wants to join
                                </div>
                                <div className="mt-1 text-[13px] text-white/50">
                                  for "{request.project?.title}"
                                </div>
                              </div>
                              <span className="text-[10px] px-2 py-1 rounded-[3px] bg-yellow-500/20 text-yellow-400">
                                Pending
                              </span>
                            </div>
                            <div className="mb-4 rounded-[8px] bg-white/5 border border-white/10 p-3 space-y-2">
                              <div>
                                <p className="text-[10px] text-white/40 uppercase">Why they want to join</p>
                                <p className="text-xs text-white/60 mt-1">{request.pitch}</p>
                              </div>
                              {request.whatYouOffer && (
                                <div>
                                  <p className="text-[10px] text-white/40 uppercase">What they offer</p>
                                  <p className="text-xs text-white/60 mt-1">{request.whatYouOffer}</p>
                                </div>
                              )}
                              <div className="flex gap-3 pt-2 border-t border-white/10">
                                <div className="flex-1">
                                  <p className="text-[10px] text-white/40">Email</p>
                                  <a href={`mailto:${request.email}`} className="text-xs text-[#7f77dd] hover:text-[#afa9ec]">
                                    {request.email}
                                  </a>
                                </div>
                                {request.phone && (
                                  <div className="flex-1">
                                    <p className="text-[10px] text-white/40">Phone</p>
                                    <a href={`tel:${request.phone}`} className="text-xs text-[#7f77dd] hover:text-[#afa9ec]">
                                      {request.phone}
                                    </a>
                                  </div>
                                )}
                              </div>
                              {(request.socials?.github || request.socials?.linkedin || request.socials?.portfolio) && (
                                <div className="flex gap-2 pt-2 border-t border-white/10">
                                  {request.socials?.github && (
                                    <a href={request.socials.github} target="_blank" rel="noopener noreferrer" className="text-[11px] px-2 py-1 rounded-[3px] bg-white/5 text-white/60 hover:text-white">
                                      GitHub
                                    </a>
                                  )}
                                  {request.socials?.linkedin && (
                                    <a href={request.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-[11px] px-2 py-1 rounded-[3px] bg-white/5 text-white/60 hover:text-white">
                                      LinkedIn
                                    </a>
                                  )}
                                  {request.socials?.portfolio && (
                                    <a href={request.socials.portfolio} target="_blank" rel="noopener noreferrer" className="text-[11px] px-2 py-1 rounded-[3px] bg-white/5 text-white/60 hover:text-white">
                                      Portfolio
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAccept(request._id)}
                                className="flex-1 rounded-[6px] bg-green-500/20 px-3 py-2 text-xs font-medium text-green-400 hover:bg-green-500/30"
                              >
                                ✓ Accept
                              </button>
                              <button
                                onClick={() => handleDecline(request._id)}
                                className="flex-1 rounded-[6px] bg-red-500/20 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/30"
                              >
                                ✕ Decline
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="mb-3 flex items-start justify-between">
                              <div>
                                <div className="text-sm font-medium text-white">
                                  Requested to join "{request.project?.title}"
                                </div>
                                <div className="mt-1 text-[13px] text-white/50">
                                  Owner: @{request.owner?.username}
                                </div>
                              </div>
                              <span className="text-[10px] px-2 py-1 rounded-[3px] bg-yellow-500/20 text-yellow-400">
                                Pending
                              </span>
                            </div>
                            <div className="space-y-3 mb-4">
                              <div className="rounded-[8px] bg-white/5 border border-white/10 p-3">
                                <p className="text-[11px] text-white/40 mb-1">Why you want to join</p>
                                <p className="text-xs text-white/60">{request.pitch}</p>
                              </div>
                              {request.whatYouOffer && (
                                <div className="rounded-[8px] bg-white/5 border border-white/10 p-3">
                                  <p className="text-[11px] text-white/40 mb-1">What you offer</p>
                                  <p className="text-xs text-white/60">{request.whatYouOffer}</p>
                                </div>
                              )}
                              {request.email && (
                                <div className="rounded-[8px] bg-white/5 border border-white/10 p-3">
                                  <p className="text-[11px] text-white/40 mb-1">Email</p>
                                  <a href={`mailto:${request.email}`} className="text-xs text-blue-400 hover:text-blue-300">
                                    {request.email}
                                  </a>
                                </div>
                              )}
                              {request.phone && (
                                <div className="rounded-[8px] bg-white/5 border border-white/10 p-3">
                                  <p className="text-[11px] text-white/40 mb-1">Phone</p>
                                  <a href={`tel:${request.phone}`} className="text-xs text-blue-400 hover:text-blue-300">
                                    {request.phone}
                                  </a>
                                </div>
                              )}
                              {request.socials && (
                                <div className="rounded-[8px] bg-white/5 border border-white/10 p-3">
                                  <p className="text-[11px] text-white/40 mb-2">Social Links</p>
                                  <div className="flex flex-wrap gap-2">
                                    {request.socials.github && (
                                      <a href={request.socials.github} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 rounded bg-gray-600/20 text-gray-300 hover:text-gray-200">
                                        GitHub
                                      </a>
                                    )}
                                    {request.socials.linkedin && (
                                      <a href={request.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 rounded bg-blue-600/20 text-blue-300 hover:text-blue-200">
                                        LinkedIn
                                      </a>
                                    )}
                                    {request.socials.portfolio && (
                                      <a href={request.socials.portfolio} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 rounded bg-purple-600/20 text-purple-300 hover:text-purple-200">
                                        Portfolio
                                      </a>
                                    )}
                                    {request.socials.twitter && (
                                      <a href={request.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 rounded bg-cyan-600/20 text-cyan-300 hover:text-cyan-200">
                                        Twitter
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleCancel(request._id)}
                              className="w-full rounded-[6px] bg-white/5 px-3 py-2 text-xs font-medium text-white/50 hover:bg-white/10"
                            >
                              Cancel Request
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approved Section */}
              {approvedRequests.length > 0 && (
                <div className="border-b border-white/10">
                  <div className="px-6 py-3 bg-white/5">
                    <h3 className="text-xs font-medium text-white/60 uppercase">
                      Approved ({approvedRequests.length})
                    </h3>
                  </div>
                  <div className="divide-y divide-white/10">
                    {approvedRequests.map((request) => (
                      <div key={request._id} className="p-6 hover:bg-white/5 transition">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-medium text-green-400">
                              ✓ {activeTab === "incoming" ? "Accepted" : "Approved"}
                            </div>
                            <div className="mt-2 text-[13px] text-white/50">
                              {activeTab === "incoming"
                                ? `@${request.from?.username} joined your project`
                                : `You're now collaborating on "${request.project?.title}"`}
                            </div>
                          </div>
                          <a
                            href={`/project/${request.project?._id}`}
                            className="text-xs px-3 py-1 rounded-[4px] bg-[#7f77dd]/20 text-[#afa9ec] hover:bg-[#7f77dd]/30"
                          >
                            View Project
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Declined Section */}
              {declinedRequests.length > 0 && (
                <div>
                  <div className="px-6 py-3 bg-white/5">
                    <h3 className="text-xs font-medium text-white/60 uppercase">
                      Declined ({declinedRequests.length})
                    </h3>
                  </div>
                  <div className="divide-y divide-white/10">
                    {declinedRequests.map((request) => (
                      <div key={request._id} className="p-6 opacity-60 hover:opacity-80 transition">
                        <div className="text-sm font-medium text-red-400">
                          ✕ Declined
                        </div>
                        <div className="mt-2 text-[13px] text-white/50">
                          {activeTab === "incoming"
                            ? `You declined @${request.from?.username}'s request`
                            : `Your request was declined for "${request.project?.title}"`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="hidden w-[240px] border-l border-white/10 p-6 lg:block">
          <div className="rounded-[12px] bg-white/5 border border-white/10 p-4">
            <h3 className="text-xs font-medium text-white/60 mb-3 uppercase">Summary</h3>
            <div className="space-y-2 text-xs text-white/40">
              <div>📨 Pending: {pendingRequests.length}</div>
              <div>✅ Approved: {approvedRequests.length}</div>
              <div>❌ Declined: {declinedRequests.length}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CollabRequests;