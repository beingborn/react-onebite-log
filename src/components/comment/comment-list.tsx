import CommentItem from "@/components/comment/comment-item";
import { useCommentsData } from "@/hooks/mutations/comment/use-comments-data";
import Fallback from "../post/fallback";
import Loader from "../post/loader";

export default function CommentList({ postId }: { postId: number }) {
    const {
        data: comments,
        error: fetchCommentsError,
        isPending: isFetchCommentsPending,
    } = useCommentsData(postId);

    if (fetchCommentsError) return <Fallback />;

    if (isFetchCommentsPending) return <Loader />;

    return (
        <div className="flex flex-col gap-5">
            {comments.map((comment) => (
                <CommentItem key={comment.id} {...comment} />
            ))}
        </div>
    );
}
