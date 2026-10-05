import { useState, useContext, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import AuthInput from "../components/AuthInput";
import { toast } from "react-toastify";

const Backend_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const { signIn, signUp, googleSignIn } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const error = searchParams.get("error");

    if (!error) return;

    if (error === "google-account") {
      toast.error(
        "This account was created with Google. Please sign in with Google.",
      );
    }

    if (error === "local-account") {
      toast.error(
        "This email is already registered with email and password. Please sign in with your email and password.",
      );
    }

    // Remove ?error=... from URL
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isSignup) await signUp(formData);
      else await signIn({ email: formData.email, password: formData.password });
      navigate("/");
    } catch {
      // AppContext already displays the API error.
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      await googleSignIn(response.credential);
      navigate("/");
    } catch {
      // AppContext already displays the API error.
    }
  };

  const handleGithubLogin = () => {
    window.location.href = `${Backend_URL}/user/github`;
  };

  const switchMode = () => {
    setIsSignup((current) => !current);
    setFormData(initialForm);
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">M</div>
          <span className="eyebrow">WELCOME TO MEMORIES</span>
          <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p>
            {isSignup
              ? "Start sharing the moments that matter."
              : "Sign in to continue sharing your memories."}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="auth-row">
              <AuthInput
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                half
              />
              <AuthInput
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                half
              />
            </div>
          )}
          <AuthInput
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <AuthInput
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {isSignup && (
            <AuthInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          )}

          <button
            className="btn btn-primary btn-full auth-submit"
            type="submit"
          >
            {isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {}}
            width="100%"
          />
        </div>
        <div className="github">
          <button
            type="button"
            className="github-login"
            onClick={handleGithubLogin}
          >
            <svg className="github-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.13c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.35.78 1.04.78 2.1v3.11c0 .3.21.66.79.55A10.99 10.99 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
              />
            </svg>

            <span>Continue with GitHub</span>
          </button>
        </div>

        <button className="switch-auth" type="button" onClick={switchMode}>
          {isSignup
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
      </section>
    </main>
  );
};

export default Login;
