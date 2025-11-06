import Post from "../models/Post.js";

export const getPosts = async (req, res) => {
  const posts = await Post.find().populate("category");
  res.json(posts);
};

export const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate("category");
  res.json(post);
};

export const createPost = async (req, res) => {
  const post = await Post.create(req.body);
  res.status(201).json(post);
};

export const updatePost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(post);
};

export const deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
};
