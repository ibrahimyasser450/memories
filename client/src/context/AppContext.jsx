import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const initialPost = {
  title: "",
  message: "",
  tags: "",
  selectedFile: "",
};

const api = axios.create({ baseURL: API_URL, withCredentials: true });

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);

  const getCurrentUser = useCallback(async () => {
    try {
      const { data } = await api.get("/user/me");
      setUser(data.result);
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/user/logout");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  // logout if the token is invalid or expired
  const handleApiError = useCallback(
    (error, fallbackMessage) => {
      if (error.response?.status === 401) {
        logout();
      }

      const message = error.response?.data?.message || fallbackMessage;
      toast.error(message);
      throw error;
    },
    [logout],
  );

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);

    try {
      const { data } = await api.get("/posts");
      setPosts(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch posts");
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  // Fetch posts on initial load
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const signIn = async (formData) => {
    try {
      const { data } = await api.post("/user/signin", formData);
      setUser(data.result);
      toast.success("Logged in successfully");
      return data;
    } catch (error) {
      return handleApiError(error, "Something went wrong");
    }
  };

  const signUp = async (formData) => {
    try {
      const { data } = await api.post("/user/signup", formData);
      setUser(data.result);
      toast.success("Account created successfully");
      return data;
    } catch (error) {
      return handleApiError(error, "Something went wrong");
    }
  };

  // when logged in with Google, send the credential to the backend to verify and get the user data and token
  const googleSignIn = async (credential) => {
    try {
      const { data } = await api.post("/user/google", { credential });
      setUser(data.result);
      toast.success("Logged in successfully");
      return data;
    } catch (error) {
      return handleApiError(error, "Google login failed");
    }
  };

  const githubLogin = useCallback(() => {
    window.location.href = `${API_URL}/user/github`;
  }, []);

  const createPost = async (formData) => {
    try {
      const { data } = await api.post("/posts", formData);

      setPosts((current) => [...current, data]);

      toast.success("Post created successfully");

      return data;
    } catch (error) {
      return handleApiError(error, "Failed to create post");
    }
  };

  const updatePost = async (id, formData) => {
    try {
      const { data } = await api.patch(`/posts/${id}`, formData);

      setPosts((current) =>
        current.map((post) => (post._id === id ? data : post)),
      );

      toast.success("Post updated successfully");

      return data;
    } catch (error) {
      return handleApiError(error, "Failed to update post");
    }
  };

  const likePost = async (id) => {
    try {
      const { data } = await api.patch(`/posts/${id}/likePost`);
      setPosts((current) =>
        current.map((post) => (post._id === id ? data : post)),
      );
    } catch (error) {
      handleApiError(error, "Failed to like post");
    }
  };

  const deletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts((current) => current.filter((post) => post._id !== id));
      toast.success("Post deleted successfully");
    } catch (error) {
      handleApiError(error, "Failed to delete post");
    }
  };

  // useMemo is used to save array of the context value so that it only changes [create new array] when the dependencies change .
  const value = useMemo(
    () => ({
      user,
      posts,
      loadingPosts,
      loadingUser,
      googleClientId: GOOGLE_CLIENT_ID,
      initialPost,
      signIn,
      signUp,
      googleSignIn,
      githubLogin,
      logout,
      createPost,
      updatePost,
      likePost,
      deletePost,
      fetchPosts,
    }),
    [
      user,
      posts,
      loadingPosts,
      loadingUser,
      logout,
      getCurrentUser,
      githubLogin,
      fetchPosts,
    ], // dependencies for useMemo, so that the value only changes when these change
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
