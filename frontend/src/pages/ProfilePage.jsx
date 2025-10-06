import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage({ onLogin, onDelete }) {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState(null);
  const [userExists, setUserExists] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username.trim()) {
      setUserExists(null);
      return;
    }

    const controller = new AbortController();

    const checkUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/users/" + username, {
          signal: controller.signal,
        });
        setUserExists(res.ok);
      } catch {
        setUserExists(null);
      }
    };

    checkUser();

    return () => controller.abort();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!username.trim()) {
      setStatus("Please enter a username.");
      return;
    }

    try {
      if (userExists) {
        const res = await fetch("http://localhost:8080/api/users/" + username);
        if (!res.ok) throw new Error("Failed to fetch user info");
        const userData = await res.json();
        onLogin(userData);
        navigate("/strategies");
      } else {
        const createRes = await fetch("http://localhost:8080/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        if (!createRes.ok) throw new Error("Failed to sign up");
        const newUserData = await createRes.json();
        onLogin(newUserData);
        navigate("/strategies");
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${username}" and all related data? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/users/${username}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      onDelete(); // Clear logged-in user state
      navigate("/"); // Redirect to login or home page
    } catch (error) {}
  };

  const buttonText = userExists ? "Login" : "Sign Up";

  return (
    <div className="page-container page-container-no-nav">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h1 className="profile-title">QuantiLabs</h1>
            <p className="profile-subtitle">
              Your Quantitative Trading Platform
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username:</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="off"
                placeholder="Enter your username"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full">
              {buttonText}
            </button>
          </form>

          {userExists && (
            <div className="mt-4">
              <button
                onClick={handleDelete}
                className="btn btn-danger btn-lg w-full"
              >
                Delete User
              </button>
            </div>
          )}

          {status && (
            <div
              className={`mt-4 ${
                status.includes("Error") ? "error" : "success"
              }`}
            >
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
