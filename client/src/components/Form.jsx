import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

const emptyPost = {
  title: "",
  message: "",
  tags: "",
  image: null,
};

const Form = ({ currentId, setCurrentId }) => {
  const { user, posts, createPost, updatePost } = useContext(AppContext);

  const [postData, setPostData] = useState(emptyPost);
  const [imagePreview, setImagePreview] = useState("");

  const post = currentId ? posts.find((item) => item._id === currentId) : null;

  useEffect(() => {
    if (post) {
      setPostData({
        title: post.title || "",
        message: post.message || "",
        tags: post.tags?.join(", ") || "",
        image: null,
      });

      setImagePreview(post.image || "");
    } else {
      setPostData(emptyPost);
      setImagePreview("");
    }
  }, [post, currentId]);

  const clear = () => {
    setCurrentId(null);
    setPostData(emptyPost);
    setImagePreview("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setPostData((current) => ({
      ...current,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (event) => {
    setPostData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const tags = postData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const formData = new FormData();

    formData.append("title", postData.title);
    formData.append("message", postData.message);
    formData.append("name", user.name);
    formData.append("tags", JSON.stringify(tags));

    if (postData.image) {
      formData.append("image", postData.image);
    }

    if (currentId) {
      await updatePost(currentId, formData);
    } else {
      await createPost(formData);
    }

    clear();
  };

  if (!user) {
    return (
      <aside className="form-card auth-message">
        <h2>Share your memories</h2>

        <p>
          Please sign in to create your own memories and like other people's
          memories.
        </p>
      </aside>
    );
  }

  return (
    <aside className="form-card">
      <div className="form-heading">
        <div>
          <span className="eyebrow">MEMORIES</span>

          <h2>{currentId ? "Edit Memory" : "Create a Memory"}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Title</label>

          <input
            id="title"
            name="title"
            value={postData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="message">Message</label>

          <textarea
            id="message"
            name="message"
            rows="5"
            value={postData.message}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="tags">Tags</label>

          <input
            id="tags"
            name="tags"
            placeholder="travel, friends, summer"
            value={postData.tags}
            onChange={handleChange}
          />
        </div>

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Post preview" />
          </div>
        )}

        <label className="file-input">
          <span>
            {postData.image
              ? "New image selected ✓"
              : currentId && post?.image
                ? "Choose a new image"
                : "Choose an image"}
          </span>

          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        <div className="form-actions">
          <button className="btn btn-primary btn-full" type="submit">
            {currentId ? "Update Memory" : "Submit Memory"}
          </button>

          <button
            className="btn btn-danger btn-full"
            type="button"
            onClick={clear}
          >
            Clear
          </button>
        </div>
      </form>
    </aside>
  );
};

export default Form;
