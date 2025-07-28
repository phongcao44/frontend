import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../redux/slices/blogSlice";
import { Link } from "react-router-dom";

export default function Blog() {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (loading) return <p>Đang tải bài viết...</p>;
  if (error) return <p>Lỗi: {error}</p>;
console.log("blogs =", blogs);
  return (
   <div className="max-w-6xl mx-auto px-4 py-10">
  <h1 className="text-2xl font-bold mb-6">Bài viết mới nhất</h1>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {blogs.map((post) => (
      <Link key={post.id} to={`/blog/${post.id}`}>
        <div className="border rounded-lg p-2 hover:shadow transition duration-200 bg-white">
          <img
            src={post.image}
            alt={post.title}
            className="h-40 w-full object-cover rounded mb-3"
          />
          <h2 className="text-base font-medium leading-snug line-clamp-2">{post.title}</h2>
          <p className="text-xs text-gray-500 mt-1">
            {post.authorName} - {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </Link>
    ))}
  </div>
</div>
  );
}
