const CommentSection = ({ comments = [], currentUser, onSubmit }) => {
  const initials = (currentUser?.initials || currentUser?.username?.slice(0, 2) || "SL").toUpperCase();

  return (
    <div className="mt-5">
      <div className="mb-2 text-[13px] font-medium uppercase tracking-[0.5px] text-white/50">
        Comments ({comments.length})
      </div>
      <div className="mb-4 flex gap-[10px]">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#7f77dd]/25 text-[11px] font-medium text-[#afa9ec]">
          {initials}
        </div>
        <textarea
          className="h-[70px] flex-1 resize-none rounded-[9px] border border-white/10 bg-[#111118] px-3 py-2 text-[12px] text-white/60 outline-none"
          placeholder="Share your thoughts or ask a question..."
        />
      </div>

      {comments.length ? (
        comments.map((comment) => (
          <div key={comment._id || comment.text} className="mb-[14px] flex gap-[10px]">
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#7f77dd]/25 text-[11px] font-medium text-[#afa9ec]">
              {(comment.author?.initials || comment.author?.username?.slice(0, 2) || "SL").toUpperCase()}
            </div>
            <div className="flex-1 rounded-[9px] border border-white/10 bg-[#111118] px-3 py-2">
              <div className="text-[12px] font-medium text-white">
                @{comment.author?.username || "stacker"}
                {comment.isOwner ? <span className="text-[10px] text-[#7f77dd]/70"> - Owner</span> : null}
              </div>
              <div className="text-[12px] text-white/45">{comment.text}</div>
              <div className="mt-1 text-[11px] text-white/20">{comment.createdAt}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-[12px] text-white/30">No comments yet - be the first</div>
      )}
    </div>
  );
};

export default CommentSection;
