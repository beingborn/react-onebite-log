import defaultAvatar from "@/assets/default-avatar.jpg";
import { useDeleteComment } from "@/hooks/mutations/comment/use-delete-comment";
import { useOpenAlertModal } from "@/store/alert-modal";
import { useSession } from "@/store/session";
import type { Comment } from "@/types";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { formatTimeAgo } from "./../../lib/time";
import CommentEditor from "./comment-editor";

export default function CommentItem(props: Comment) {
    const openAlertModal = useOpenAlertModal();
    const session = useSession();
    const userId = session?.user.id;
    const isMine = props.author.id === userId;

    const [isEditing, setIsEditing] = useState(false);

    const toggleIsEditing = () => {
        setIsEditing(!isEditing);
    };

    const { mutate: deleteComment, isPending: isDeleteCommentPending } =
        useDeleteComment({
            onError: () => {
                toast.error("댓글 삭제에 실패했습니다", {
                    position: "top-center",
                });
            },
        });

    const handleDeleteCLick = () => {
        openAlertModal({
            title: "댓글 삭제",
            description:
                "삭제된 댓글 되돌릴 수 없습니다. 정말 삭제하시겠습니까?",
            onPositive: () => {
                deleteComment(props.id);
            },
        });
    };

    return (
        <div className={"flex flex-col gap-8 border-b pb-5"}>
            <div className="flex items-start gap-4">
                <Link to={"#"}>
                    <div className="flex aspect-square h-full flex-col overflow-hidden rounded-full">
                        <img
                            className="h-10 w-10 object-cover"
                            src={props.author.avatar_url || defaultAvatar}
                        />
                    </div>
                </Link>
                <div className="flex w-full flex-col gap-2">
                    <div className="font-bold">{props.author.nickname}</div>
                    {isEditing ? (
                        <CommentEditor
                            type={"EDIT"}
                            commentId={props.id}
                            initialContent={props.content}
                            onClose={toggleIsEditing}
                        />
                    ) : (
                        <div>{props.content}</div>
                    )}

                    <div className="text-muted-foreground flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="cursor-pointer hover:underline">
                                댓글
                            </div>
                            <div className="bg-border h-[13px] w-[2px]"></div>
                            <div>{formatTimeAgo(props.created_at)}</div>
                        </div>
                        {isMine && (
                            <div className="flex items-center gap-2">
                                <button
                                    disabled={isDeleteCommentPending}
                                    className="cursor-pointer hover:underline"
                                    onClick={toggleIsEditing}
                                >
                                    수정
                                </button>
                                <div className="bg-border h-[13px] w-[2px]"></div>
                                <button
                                    disabled={isDeleteCommentPending}
                                    className="cursor-pointer hover:underline"
                                    onClick={handleDeleteCLick}
                                >
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
