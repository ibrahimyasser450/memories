import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
import User from "../models/user.js";
import { v2 as cloudinary } from "cloudinary";

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: `No post with id: ${id}`,
      });
    }

    const post = await PostMessage.findById(id);

    if (!post) {
      return res.status(404).json({
        message: `No post with id: ${id}`,
      });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, message, tags } = req.body;
    const imageFile = req.file;

    const user = await User.findById(req.user.id);

    let parsedTags = [];

    if (tags) {
      parsedTags = JSON.parse(tags);
    }
    // uploading doctor image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      folder: "posts",
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;
    const imagePublicId = imageUpload.public_id;

    const newPostMessage = new PostMessage({
      title,
      name: user.name,
      message,
      tags: parsedTags,
      creator: req.user.id,
      createdAt: new Date().toISOString(),
      image: imageUrl,
      imagePublicId,
    });

    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(409).json({
      message: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, tags } = req.body;
    const imageFile = req.file;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: `No post with id: ${id}`,
      });
    }

    const post = await PostMessage.findById(id);

    if (!post) {
      return res.status(404).json({
        message: `No post with id: ${id}`,
      });
    }

    if (post.creator !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to update this post",
      });
    }

    let parsedTags = [];

    if (tags) {
      parsedTags = JSON.parse(tags);
    }

    post.title = title;
    post.message = message;
    post.tags = parsedTags;

    // Update image if a new one was uploaded
    if (imageFile) {
      // Delete old image from Cloudinary (if it exists)
      if (post.imagePublicId) {
        await cloudinary.uploader.destroy(post.imagePublicId);
      }

      // Upload new image
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        folder: "posts",
        resource_type: "image",
      });

      // Save new image data
      post.image = imageUpload.secure_url;
      post.imagePublicId = imageUpload.public_id;
    }

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: `No post with id: ${id}`,
      });
    }

    const post = await PostMessage.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        message: `No post with id: ${id}`,
      });
    }

    if (post.creator !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this post",
      });
    }

    res.status(200).json({
      message: "Post deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: `No post with id: ${id}`,
      });
    }

    const post = await PostMessage.findById(id);

    if (!post) {
      return res.status(404).json({
        message: `No post with id: ${id}`,
      });
    }

    const index = post.likes.findIndex((id) => id === String(req.user.id));

    if (index === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.user.id));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true },
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
