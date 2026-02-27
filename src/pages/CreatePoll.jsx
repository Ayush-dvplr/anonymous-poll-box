import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { createPoll } from "@/lib/polls";
import { getAuthUser } from "@/lib/auth";
import { Plus, X, Eye } from "lucide-react";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [anonymous, setAnonymous] = useState(true);
  const navigate = useNavigate();
  const user = getAuthUser();

  const addOption = () => {
    if (options.length < 8) setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validOptions = options.filter(o => o.trim());
    if (!question.trim() || validOptions.length < 2) return;
    createPoll(question.trim(), validOptions, user.email, anonymous);
    navigate("/");
  };

  return (
    <Layout>
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 font-heading text-3xl font-bold text-foreground">Create Poll</h1>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 card-shadow">
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Question</label>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="What do you want to ask?"
              required
            />
          </div>

          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Options</label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={`Option ${i + 1}`}
                    required
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="rounded-lg p-2.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 8 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-2 flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add option
              </button>
            )}
          </div>

          <div className="mb-6 flex items-center justify-between rounded-lg bg-muted p-3">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Eye className="h-4 w-4 text-muted-foreground" />
              Post Anonymously
            </div>
            <button
              type="button"
              onClick={() => setAnonymous(!anonymous)}
              className={`relative h-6 w-11 rounded-full transition-colors ${anonymous ? "bg-primary" : "bg-border"}`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-primary-foreground transition-transform shadow-sm ${
                  anonymous ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
          >
            Create Poll
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreatePoll;
