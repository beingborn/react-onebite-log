import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
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

    const { mutate: createPost, isPending: isCreatePostIsPending } =
        useCreatePost({
            onSuccess: () => {
                toast.info("성공", {
                    position: "top-center",
                });

                close();
            },
            onError(error) {
                const message = generateErrorMessage(error);

                toast.error(message, {
                    position: "top-center",
                });
                setContent("");
            },
        });

    const { isOpen, close } = usePostEditorModal();
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
        if (!isOpen) {
            images.forEach((image) => {
                URL.revokeObjectURL(image.previewUrl);
            });

            return;
        }
        textareaRef.current?.focus();
        setContent("");
    }, [isOpen]);

    const handleCloseModal = () => {
        if (content !== "" || images.length !== 0) {
            openAlertModal({
                title: "게시글 작성이 마무리 되지 않았습니다",
                description: "이 화면에서 나가면 작성중이던 내용이 사라집니다",
                onPositive: () => {
                    close();
                },
            });

            return;
        }

        close();
    };

    const handleCreatePostClick = () => {
        if (content.trim() === "") return;

        createPost({
            content,
            images: images.map((image) => image.file),
            userId: session!.user.id,
        });
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

    return (
        <Dialog open={isOpen} onOpenChange={handleCloseModal}>
            <DialogContent className="max-h-[90vh]">
                <DialogTitle>포스트 작성</DialogTitle>
                <textarea
                    disabled={isCreatePostIsPending}
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
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    disabled={isCreatePostIsPending}
                >
                    <ImageIcon />
                    이미지 추가
                </Button>
                <Button
                    disabled={isCreatePostIsPending}
                    onClick={handleCreatePostClick}
                >
                    저장
                </Button>
            </DialogContent>
        </Dialog>
    );
}
