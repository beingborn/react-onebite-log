import defaultAvatar from "@/assets/default-avatar.jpg";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUpdateProfile } from "@/hooks/mutations/profile/use-update-profile";
import useProfileData from "@/hooks/queries/use-profile-data";
import { useProfileEditorModal } from "@/store/profile-editor-modal";
import { useSession } from "@/store/session";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import Fallback from "../post/fallback";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type Image = {
    file: File;
    previewUrl: string;
};

export default function ProfileEditorModal() {
    const session = useSession();

    const {
        data: profile,
        error: fetchProfileError,
        isPending: isFetchProfilePending,
    } = useProfileData(session?.user.id);

    const store = useProfileEditorModal();
    const {
        isOpen,
        actions: { close },
    } = store;

    const [avatarImage, setAvatarImage] = useState<Image | null>(null);
    const [nickname, setNickname] = useState("");
    const [bio, setBio] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];

        if (avatarImage) {
            URL.revokeObjectURL(avatarImage.previewUrl);
        }

        setAvatarImage({
            file,
            previewUrl: URL.createObjectURL(file),
        });
    };

    const { mutate: updateProfile, isPending: isUpdateProfilePending } =
        useUpdateProfile({
            onSuccess: () => {
                close();
            },
            onError: (error) => {
                toast.error("프로필 수정에 실패했습니다", {
                    position: "top-center",
                });
            },
        });

    useEffect(() => {
        if (!isOpen) {
            if (avatarImage?.previewUrl)
                URL.revokeObjectURL(avatarImage.previewUrl);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && profile) {
            setNickname(profile.nickname);
            setBio(profile.bio);
            setAvatarImage(null);
        }
    }, [profile, isOpen]);

    const handleUpdateClick = () => {
        if (nickname.trim() === "") return;

        updateProfile({
            userId: session!.user.id,
            nickname,
            bio,
            avatarImageFile: avatarImage?.file,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="flex flex-col gap-5">
                <DialogTitle>프로필 수정하기</DialogTitle>
                {fetchProfileError && <Fallback />}
                {isFetchProfilePending && <Fallback />}
                {!fetchProfileError && !isFetchProfilePending && (
                    <>
                        <div className="flex flex-col gap-2">
                            <p className="text-muted-foreground">
                                프로필 이미지
                            </p>
                            <Input
                                disabled={isUpdateProfilePending}
                                onChange={handleSelectImage}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                            />
                            <button
                                type="button"
                                className="cursor-pointer"
                                onClick={() => {
                                    if (fileInputRef.current)
                                        fileInputRef.current.click();
                                }}
                            >
                                <img
                                    className="h-20 w-20 rounded-full object-cover"
                                    src={
                                        avatarImage?.previewUrl ||
                                        profile.avatar_url ||
                                        defaultAvatar
                                    }
                                    alt="프로필 이미지"
                                />
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-muted-foreground">닉네임</p>
                            <Input
                                disabled={isUpdateProfilePending}
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-muted-foreground">소개</p>
                            <Input
                                disabled={isUpdateProfilePending}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </div>
                        <Button
                            disabled={isUpdateProfilePending}
                            onClick={handleUpdateClick}
                            className="cursor-pointer"
                        >
                            수정하기
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
