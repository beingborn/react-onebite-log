import CommentEditor from "@/components/comment/comment-editor";
import CommentList from "@/components/comment/comment-list";
import PostItem from "@/components/post/post-item";
import { Navigate, useParams } from "react-router";

export default function PostDetailPage() {
    const params = useParams();
    const postId = params.postId;

    if (!postId) return <Navigate to={"/"} />;

    return (
        <div className="flex flex-col gap-5">
            <PostItem type="DETAIL" postId={Number(postId)} />
            <p className="text-xl font-bold">댓글</p>
            <CommentEditor postId={Number(postId)} />
            <CommentList postId={Number(postId)} />
        </div>
    );
}
