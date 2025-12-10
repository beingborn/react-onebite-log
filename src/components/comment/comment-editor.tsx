import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComment } from "@/hooks/mutations/comment/use-create-comment";
import { useUpdateComment } from "@/hooks/mutations/comment/use-update-comment";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type CreateMode = {
    type: "CREATE";
    postId: number;
};

type EditMode = {
    type: "EDIT";
    commentId: number;
    initialContent: string;
    onClose: () => void;
};

type Props = CreateMode | EditMode;

export default function CommentEditor(props: Props) {
    const [content, setContent] = useState("");

    useEffect(() => {
        if (props.type === "EDIT") {
            setContent(props.initialContent);
        }
    }, []);

    const { mutate: updateComment, isPending: isUpdateCommentPending } =
        useUpdateComment({
            onSuccess: () => {
                (props as EditMode).onClose();
            },
            onError: () => {
                toast.error("댓글 수정에 실패했습니다.", {
                    position: "top-center",
                });
            },
        });

    const { mutate: createComment, isPending: isCreateCommentPending } =
        useCreateComment({
            onSuccess: () => {
                setContent("");
            },
            onError: () => {
                toast.error("댓글 작성에 실패했습니다.", {
                    position: "top-center",
                });
            },
        });

    const handleSubmitClick = () => {
        if (content.trim() === "") return;

        if (props.type === "CREATE") {
            createComment({
                postId: props.postId,
                content,
            });
        } else {
            updateComment({
                id: props.commentId,
                content,
            });
        }
    };

    const handleCancleClick = () => {
        (props as EditMode).onClose();
    };

    const isPending = isCreateCommentPending || isUpdateCommentPending;

    return (
        <div className="flex flex-col gap-2">
            <Textarea
                value={content}
                disabled={isPending}
                onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
                {props.type === "EDIT" && (
                    <Button
                        disabled={isPending}
                        variant={"outline"}
                        onClick={handleCancleClick}
                    >
                        취소
                    </Button>
                )}
                <Button disabled={isPending} onClick={handleSubmitClick}>
                    작성
                </Button>
            </div>
        </div>
    );
}
