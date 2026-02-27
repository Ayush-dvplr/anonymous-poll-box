import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getPollById, votePoll, hasVoted, getUserVote, getComments, addComment } from "@/lib/polls";
import { getAuthUser } from "@/lib/auth";
import { ArrowLeft, Eye, Check, Send, MessageCircle, Clock } from "lucide-react";

const PollDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getAuthUser();
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentAnon, setCommentAnon] = useState(true);

  const refresh = () => {
    const p = getPollById(id);
    if (!p) { navigate("/"); return; }
    setPoll(p);
    setVoted(hasVoted(id, user.email));
    setUserVote(getUserVote(id, user.email));
    setComments(getComments(id));
  };

  useEffect(() => { refresh(); }, [id]);

  if (!poll) return null;

  const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);

  const handleVote = (optionId) => {
    if (voted) return;
    votePoll(poll.id, optionId, user.email);
    refresh();
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(poll.id, commentText.trim(), user.email, commentAnon);
    setCommentText("");
    refresh();
  };

  const date = new Date(poll.createdAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <Layout>
      <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to polls
      </button>

      <div className="rounded-xl border border-border bg-card p-6 card-shadow mb-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h1 className="font-heading text-2xl font-bold text-card-foreground">{poll.question}</h1>
          {poll.anonymous && (
            <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              <Eye className="mr-1 inline h-3 w-3" />Anonymous
            </span>
          )}
        </div>
        <div className="mb-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{date}</span>
          <span>{totalVotes} vote{totalVotes !== 1 ? "s" : ""}</span>
          {!poll.anonymous && <span>by {poll.createdBy}</span>}
        </div>

        <div className="space-y-2.5">
          {poll.options.map((opt) => {
            const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
            const isSelected = userVote === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                disabled={voted}
                className={`relative w-full overflow-hidden rounded-lg border text-left transition-all ${
                  voted
                    ? isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background"
                    : "border-border bg-background hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                }`}
              >
                {voted && (
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                    <span className="text-sm font-medium text-foreground">{opt.text}</span>
                  </div>
                  {voted && (
                    <span className="text-sm font-semibold text-muted-foreground">{pct}%</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comments */}
      <div className="rounded-xl border border-border bg-card p-6 card-shadow">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
          <MessageCircle className="h-5 w-5 text-muted-foreground" />
          Comments ({comments.length})
        </h2>

        <form onSubmit={handleComment} className="mb-6">
          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Write a comment..."
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2.5 text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCommentAnon(!commentAnon)}
              className={`relative h-5 w-9 rounded-full transition-colors ${commentAnon ? "bg-primary" : "bg-border"}`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-primary-foreground transition-transform shadow-sm ${
                  commentAnon ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-xs text-muted-foreground">Comment anonymously</span>
          </div>
        </form>

        {comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No comments yet</p>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="rounded-lg bg-muted/50 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">
                    {c.anonymous ? "Anonymous User" : c.userEmail}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className="text-sm text-card-foreground">{c.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PollDetail;
