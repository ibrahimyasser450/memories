import express from "express";

import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  likePost,
  deletePost,
} from "../controllers/posts.js";
import authUser from "../middleware/authUser.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", authUser, upload.single("image"), createPost);
router.patch("/:id", authUser, upload.single("image"), updatePost);
router.delete("/:id", authUser, deletePost);
router.patch("/:id/likePost", authUser, likePost);

export default router;
