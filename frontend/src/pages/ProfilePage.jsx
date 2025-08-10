import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage({ onLogin }) {
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
        // Login: fetch user info with userId
        const res = await fetch("http://localhost:8080/api/users/" + username);
        if (!res.ok) throw new Error("Failed to fetch user info");
        const userData = await res.json();
        onLogin(userData);
        navigate("/strategies");
      } else {
        // Sign up: create user and get user info including userId
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

  const buttonText = userExists ? "Login" : "Sign Up";

  return (
    <div>
      <h1>Welcome</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="off"
          />
        </label>
        <button type="submit">{buttonText}</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

export default ProfilePage;
