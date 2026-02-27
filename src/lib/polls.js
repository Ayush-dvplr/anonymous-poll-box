const POLLS_KEY = "polls";
const VOTES_KEY = "votes";
const COMMENTS_KEY = "comments";

const getStore = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStore = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const createPoll = (question, options, createdBy, anonymous) => {
  const polls = getStore(POLLS_KEY);
  const poll = {
    id: Date.now().toString(),
    question,
    options: options.map((text, i) => ({ id: i, text, votes: 0 })),
    createdBy,
    anonymous,
    createdAt: new Date().toISOString(),
  };
  polls.unshift(poll);
  setStore(POLLS_KEY, polls);
  return poll;
};

export const getPolls = () => getStore(POLLS_KEY);

export const getPollById = (id) => {
  return getStore(POLLS_KEY).find(p => p.id === id) || null;
};

export const votePoll = (pollId, optionId, userEmail) => {
  const votes = getStore(VOTES_KEY);
  const already = votes.find(v => v.pollId === pollId && v.userEmail === userEmail);
  if (already) return false;

  votes.push({ pollId, optionId, userEmail });
  setStore(VOTES_KEY, votes);

  const polls = getStore(POLLS_KEY);
  const poll = polls.find(p => p.id === pollId);
  if (poll) {
    const opt = poll.options.find(o => o.id === optionId);
    if (opt) opt.votes += 1;
    setStore(POLLS_KEY, polls);
  }
  return true;
};

export const hasVoted = (pollId, userEmail) => {
  return getStore(VOTES_KEY).some(v => v.pollId === pollId && v.userEmail === userEmail);
};

export const getUserVote = (pollId, userEmail) => {
  const vote = getStore(VOTES_KEY).find(v => v.pollId === pollId && v.userEmail === userEmail);
  return vote ? vote.optionId : null;
};

export const getComments = (pollId) => {
  return getStore(COMMENTS_KEY).filter(c => c.pollId === pollId);
};

export const addComment = (pollId, text, userEmail, anonymous) => {
  const comments = getStore(COMMENTS_KEY);
  comments.push({
    id: Date.now().toString(),
    pollId,
    text,
    userEmail,
    anonymous,
    createdAt: new Date().toISOString(),
  });
  setStore(COMMENTS_KEY, comments);
};
