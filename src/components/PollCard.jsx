import { Link } from "react-router-dom";
import { MessageCircle, Users, Eye, Clock } from "lucide-react";

const PollCard = ({ poll, index }) => {
  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
  const date = new Date(poll.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      to={`/poll/${poll.id}`}
      className="group block rounded-xl border border-border bg-card p-5 card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 60}ms`, animation: "slide-up 0.4s ease-out backwards" }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-heading text-lg font-semibold text-card-foreground leading-snug group-hover:text-primary transition-colors">
          {poll.question}
        </h3>
        {poll.anonymous && (
          <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            <Eye className="mr-1 inline h-3 w-3" />
            Anon
          </span>
        )}
      </div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {poll.options.slice(0, 3).map((opt) => (
          <span key={opt.id} className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
            {opt.text}
          </span>
        ))}
        {poll.options.length > 3 && (
          <span className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">
            +{poll.options.length - 3} more
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {date}
        </span>
      </div>
    </Link>
  );
};

export default PollCard;
