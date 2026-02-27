import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuthUser, logout } from "@/lib/auth";
import { BarChart3, Plus, LogOut } from "lucide-react";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getAuthUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
            </div>
            AnonPoll
          </Link>
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/create"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/create") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Plus className="h-4 w-4" />
              Create
            </Link>
            <div className="ml-2 h-6 w-px bg-border" />
            <span className="ml-2 hidden text-xs text-muted-foreground sm:inline">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="ml-2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
