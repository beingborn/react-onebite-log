import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import { useUpdatePost } from "@/hooks/mutations/post/use-update-post";
import { generateErrorMessage } from "@/lib/error";
import { useOpenAlertModal } from "@/store/alert-modal";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { useSession } from "@/store/session";
import { ImageIcon, X } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";

type Image = {
    file: File;
    previewUrl: string;
};

export default function PostEditorModal() {
    const session = useSession();
    const openAlertModal = useOpenAlertModal();
    const [content, setContent] = useState("");
    const [images, setImages] = useState<Image[]>([]);

    const { mutate: createPost, isPending: isCreatePostPending } =
        useCreatePost({
            onSuccess: () => {
                toast.info("성공", {
                    position: "top-center",
                });

                postEditorModal.actions.close();
            },
            onError(error) {
                const message = generateErrorMessage(error);

                toast.error(message, {
                    position: "top-center",
                });
                setContent("");
            },
        });

    const { mutate: updatePost, isPending: isUpdatePostPending } =
        useUpdatePost({
            onSuccess: () => {
                postEditorModal.actions.close();
            },
            onError: (error) => {
                toast.error("포스트 수정에 실패했습니다", {
                    position: "top-center",
                });
            },
        });

    const postEditorModal = usePostEditorModal();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + "px";
        }
    }, [content]);

    useEffect(() => {
        if (!postEditorModal.isOpen) {
            images.forEach((image) => {
                URL.revokeObjectURL(image.previewUrl);
            });

            return;
        }

        if (postEditorModal.type === "CREATE") {
            setContent("");
            setImages([]);
        } else {
            setContent(postEditorModal.content);
            setImages([]);
        }

        textareaRef.current?.focus();
    }, [postEditorModal.isOpen]);

    const handleCloseModal = () => {
        if (content !== "" || images.length !== 0) {
            openAlertModal({
                title: "게시글 작성이 마무리 되지 않았습니다",
                description: "이 화면에서 나가면 작성중이던 내용이 사라집니다",
                onPositive: () => {
                    postEditorModal.actions.close();
                },
            });

            return;
        }

        postEditorModal.actions.close();
    };

    const handleSavePostClick = () => {
        if (content.trim() === "") return;
        if (!postEditorModal.isOpen) return;

        if (postEditorModal.type === "CREATE") {
            createPost({
                content,
                images: images.map((image) => image.file),
                userId: session!.user.id,
            });
        } else {
            if (content === postEditorModal.content) return;
            updatePost({
                id: postEditorModal.postId,
                content: content,
            });
        }
    };

    const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            files.forEach((file) => {
                setImages((prev) => [
                    ...prev,
                    { file, previewUrl: URL.createObjectURL(file) },
                ]);
            });
        }

        e.target.value = "";
    };

    const handleDeleteImage = (image: Image) => {
        setImages((prevImages) =>
            prevImages.filter((item) => item.previewUrl !== image.previewUrl),
        );

        URL.revokeObjectURL(image.previewUrl);
    };

    const isPending = isCreatePostPending || isUpdatePostPending;

    return (
        <Dialog open={postEditorModal.isOpen} onOpenChange={handleCloseModal}>
            <DialogContent className="max-h-[90vh]">
                <DialogTitle>포스트 작성</DialogTitle>
                <textarea
                    disabled={isPending}
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="max-h-125 min-h-25 focus:outline-none"
                    placeholder="무슨 일이 있었나요?"
                />
                <input
                    ref={fileInputRef}
                    onChange={handleSelectImage}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                />
                {postEditorModal.isOpen && postEditorModal.type === "EDIT" && (
                    <Carousel>
                        <CarouselContent>
                            {postEditorModal.imageUrl?.map((url, index) => (
                                <CarouselItem key={url}>
                                    <div className="relative inline-flex">
                                        <img
                                            src={url}
                                            alt={`${index}번째 미리보기`}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                )}

                {images.length > 0 && (
                    <Carousel>
                        <CarouselContent>
                            {images.map((image, index) => (
                                <CarouselItem key={image.previewUrl}>
                                    <div className="relative inline-flex">
                                        <img
                                            src={image.previewUrl}
                                            alt={`${index}번째 미리보기`}
                                        />
                                        <button
                                            onClick={() =>
                                                handleDeleteImage(image)
                                            }
                                            type="button"
                                            className="absolute top-2 right-2 cursor-pointer"
                                        >
                                            <X size="24" />
                                        </button>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                )}

                {postEditorModal.isOpen &&
                    postEditorModal.type === "CREATE" && (
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            disabled={isPending}
                        >
                            <ImageIcon />
                            이미지 추가
                        </Button>
                    )}

                <Button disabled={isPending} onClick={handleSavePostClick}>
                    저장
                </Button>
            </DialogContent>
        </Dialog>
    );
}
