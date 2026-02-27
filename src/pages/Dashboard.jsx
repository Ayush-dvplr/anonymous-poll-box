import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PollCard from "@/components/PollCard";
import { getPolls } from "@/lib/polls";
import { Plus, Inbox } from "lucide-react";

const Dashboard = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    setPolls(getPolls());
  }, []);

  return (
    <Layout>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Polls</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {polls.length} poll{polls.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <Link
          to="/create"
          className="flex items-center gap-1.5 rounded-lg gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Poll
        </Link>
      </div>

      {polls.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <Inbox className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="font-heading text-lg font-semibold text-foreground">No polls yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Create your first poll to get started</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {polls.map((poll, i) => (
            <PollCard key={poll.id} poll={poll} index={i} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
