import usePosts from "../hooks/usePosts";

export default function PostList() {
  const { posts, loading } = usePosts();
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>All Posts</h1>
      {posts.map(post => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
