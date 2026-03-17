import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff, Github } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    const res = await login(email, password);

    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BG */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 justify-center"
          style={{ marginBottom: 40, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background:
                "linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={22} color="#fff" />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: "-0.03em",
            }}
          >
            FlowMind
          </span>
        </div>

        <div
          className="glass-card"
          style={{ padding: 36, borderColor: "var(--border-bright)" }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 26,
              fontWeight: 800,
              marginBottom: 6,
              letterSpacing: "-0.02em",
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 14,
              marginBottom: 28,
            }}
          >
            Sign in to your workspace
          </p>

          {error && (
            <div
              style={{
                background: "rgba(244,63,94,0.1)",
                border: "1px solid rgba(244,63,94,0.2)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "var(--accent-rose)",
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={14}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ paddingLeft: 36 }}
                />
              </div>
            </div>

            <div>
              <div
                className="flex justify-between items-center"
                style={{ marginBottom: 6 }}
              >
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Password
                </label>
                <a
                  href="#"
                  style={{
                    fontSize: 12,
                    color: "var(--accent-cyan)",
                    textDecoration: "none",
                  }}
                >
                  Forgot?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <Lock
                  size={14}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ paddingLeft: 36, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    padding: 0,
                  }}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              style={{
                marginTop: 8,
                height: 44,
                justifyContent: "center",
                fontSize: 15,
              }}
              disabled={loading || !email || !password}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(0,0,0,0.3)",
                      borderTopColor: "rgba(0,0,0,0.8)",
                      borderRadius: "50%",
                      animation: "spin-slow 0.7s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Signing in...
                </span>
              ) : (
                <>
                  <span>Sign in</span> <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3" style={{ margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              or continue with
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <button
            className="btn btn-ghost w-full"
            style={{ height: 40, justifyContent: "center" }}
          >
            <Github size={15} /> GitHub
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            No account?{" "}
            <Link
              to="/register"
              style={{
                color: "var(--accent-cyan)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Create one free
            </Link>
          </p>
        </div>

        {/* Quick demo */}
        {/* <div
          style={{
            marginTop: 16,
            textAlign: "center",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          Demo: use any email + password to sign in
        </div> */}
      </div>
    </div>
  );
}
