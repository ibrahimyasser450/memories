import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import validator from "validator";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import User from "../models/user.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
  return JWT.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
};

const setAuthCookie = (res, userId) => {
  const token = generateToken(userId);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 60 * 60 * 1000),
  });
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({
        success: false,
        message:
          "This account was created with Google. Please sign in with Google.",
      });
    }

    if (user.authProvider === "github") {
      return res.status(400).json({
        success: false,
        message:
          "This account was created with GitHub. Please sign in with GitHub.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    setAuthCookie(res, user._id);

    const result = {
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture || null,
    };

    return res.status(200).json({ result });
  } catch (error) {
    console.log("error at signin function at userController at server:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !confirmPassword || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing Details",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validate password strength
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords don't match",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
    };

    // Create user
    const user = await User.create(userData);

    setAuthCookie(res, user._id);

    const result = {
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture || null,
    };

    return res.status(201).json({ result });
  } catch (error) {
    console.log("error at signup function at userController at server:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({
    success: true,
  });
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify Google credential
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    let user;

    // User already exists
    if (existingUser) {
      // Account was created with email/password
      if (existingUser.authProvider === "local") {
        return res.status(400).json({
          success: false,
          message:
            "This email is already registered with email and password. Please sign in with your email and password.",
        });
      }

      // Account was created with GitHub
      if (existingUser.authProvider === "github") {
        return res.status(400).json({
          success: false,
          message:
            "This account was created with GitHub. Please sign in with GitHub.",
        });
      }

      // Account was created with Google
      user = existingUser;
    } else {
      // Create new Google account
      const userData = {
        name,
        email,
        authProvider: "google",
      };

      if (picture) {
        userData.picture = picture;
      }

      user = await User.create(userData);
    }

    setAuthCookie(res, user._id);

    // Do NOT send token to frontend
    return res.status(200).json({
      result: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture || null,
      },
    });
  } catch (error) {
    console.log("error at googleLogin:", error);

    return res.status(401).json({
      success: false,
      message: error.message || "Google authentication failed",
    });
  }
};

export const githubLogin = (req, res) => {
  const githubUrl = new URL("https://github.com/login/oauth/authorize");

  githubUrl.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID);

  githubUrl.searchParams.set("redirect_uri", process.env.GITHUB_CALLBACK_URL);

  githubUrl.searchParams.set("scope", "read:user user:email");

  res.redirect(githubUrl.toString());
};

export const githubLoginCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "GitHub authorization code is required",
      });
    }

    // Exchange GitHub authorization code for GitHub access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      },
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    const { access_token, error, error_description } = tokenResponse.data;

    if (!access_token) {
      return res.status(401).json({
        success: false,
        message:
          error_description || error || "Failed to get GitHub access token",
      });
    }

    // Get GitHub user information
    const { data: githubUser } = await axios.get(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    // Get GitHub emails
    const { data: emails } = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    // Get primary verified email
    const primaryEmail = emails.find(
      (email) => email.primary && email.verified,
    );

    const email = primaryEmail?.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "No verified email found on GitHub account",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    let user;

    // User already exists
    if (existingUser) {
      // Account was created with email/password
      if (existingUser.authProvider === "local") {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=local-account`,
        );
      }

      // Account was created with Google
      if (existingUser.authProvider === "google") {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=google-account`,
        );
      }

      // Account was created with GitHub
      user = existingUser;
    } else {
      // User doesn't exist → create a new GitHub account
      const userData = {
        name: githubUser.name || githubUser.login,
        email,
        authProvider: "github",
      };

      if (githubUser.avatar_url) {
        userData.picture = githubUser.avatar_url;
      }

      user = await User.create(userData);
    }

    setAuthCookie(res, user._id);

    // Redirect back to frontend
    return res.redirect(process.env.FRONTEND_URL);
  } catch (error) {
    console.log("error at githubLoginCallback:", error);

    return res.status(401).json({
      success: false,
      message:
        error.response?.data?.error_description ||
        error.response?.data?.message ||
        error.message ||
        "GitHub authentication failed",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({ result: user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
