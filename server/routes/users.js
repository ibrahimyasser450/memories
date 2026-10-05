import express from "express";

import {
  signin,
  signup,
  googleLogin,
  githubLogin,
  githubLoginCallback,
  getCurrentUser,
  logout,
} from "../controllers/user.js";

import authUser from "../middleware/authUser.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/google", googleLogin);
router.get("/github", githubLogin);
router.get("/github/callback", githubLoginCallback);
router.get("/me", authUser, getCurrentUser);

export default router;
