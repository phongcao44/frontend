import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogDetail } from "../../redux/slices/blogSlice";

export default function BlogDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { blogDetail } = useSelector((state) => state.blogs);

    useEffect(() => {
        dispatch(fetchBlogDetail(id));
    }, [dispatch, id]);

    if (!blogDetail) return <p>Đang tải chi tiết bài viết...</p>;

    const { title, authorName, createdAt, image, content } = blogDetail;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-gray-600 mb-4">
                {authorName} - {new Date(createdAt).toLocaleDateString()}
            </p>
            <img
                src={image}
                alt={title}
                className="w-1/2 max-w-sm max-h-80 object-cover mb-6 rounded"
            />


            <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
}
