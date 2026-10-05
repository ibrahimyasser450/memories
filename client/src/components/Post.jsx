import { useContext } from "react";

import Icon from "./Icon";
import { AppContext } from "../context/AppContext";

// to display time ago at post
const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

const Post = ({ post, setCurrentId }) => {
  const { user, likePost, deletePost } = useContext(AppContext);
  const currentUserId = user?._id;
  const isOwner = currentUserId === post.creator;
  const isLiked = post.likes?.includes(currentUserId);
  const likesCount = post.likes?.length || 0;

  return (
    <article className="post-card">
      <div
        className="post-image"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.2)), url(${post.image || "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"})`,
        }}
      >
        <div className="post-top">
          <div>
            <h3>{post.name}</h3>
            <span>{timeAgo(post.createdAt)}</span>
          </div>
          {isOwner && (
            <button
              className="icon-button glass"
              onClick={() => setCurrentId(post._id)}
              aria-label="Edit memory"
            >
              <Icon name="edit" />
            </button>
          )}
        </div>
      </div>

      <div className="post-body">
        <div className="post-tags">
          {post.tags?.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
        <h2>{post.title}</h2>
        <p>{post.message}</p>
      </div>

      <div className="post-actions">
        <button
          className={`action-button ${isLiked ? "liked" : ""}`}
          disabled={!user}
          onClick={() => likePost(post._id)}
        >
          <Icon name="like" size={18} />
          {isLiked
            ? `You${likesCount > 1 ? ` + ${likesCount - 1}` : ""}`
            : likesCount
              ? `${likesCount} Like${likesCount > 1 ? "s" : ""}`
              : "Like"}
        </button>

        {isOwner && (
          <button
            className="action-button delete-action"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this post?")
              ) {
                deletePost(post._id);
              }
            }}
          >
            <Icon name="trash" size={18} />
            Delete
          </button>
        )}
      </div>
    </article>
  );
};

export default Post;
