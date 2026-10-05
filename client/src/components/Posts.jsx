import { useContext } from "react";
import { AppContext } from "../context/AppContext";

import Post from "./Post";

const Posts = ({ setCurrentId }) => {
  const { posts, loadingPosts } = useContext(AppContext);

  if (loadingPosts) {
    return (
      <div className="posts-grid">
        <div className="loading-card">Loading memories...</div>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="empty-state">
        <h2>No memories yet</h2>
        <p>Be the first person to share one.</p>
      </div>
    );
  }

  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <Post key={post._id} post={post} setCurrentId={setCurrentId} />
      ))}
    </div>
  );
};

export default Posts;
