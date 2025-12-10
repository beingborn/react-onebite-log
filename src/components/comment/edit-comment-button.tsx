import type { CommentEntity } from "@/types";

export default function EditCommentButton(props: CommentEntity) {
    const handleEditComment = () => {};

    return (
        <button
            onClick={handleEditComment}
            className="cursor-pointer hover:underline"
        >
            수정
        </button>
    );
}
