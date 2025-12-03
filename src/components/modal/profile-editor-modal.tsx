import defaultAvatar from "@/assets/default-avatar.jpg";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import useProfileData from "@/hooks/queries/use-profile-data";
import { useProfileEditorModal } from "@/store/profile-editor-modal";
import { useSession } from "@/store/session";
import Fallback from "../post/fallback";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
                            <button type="button" className="cursor-pointer">
                                <img
                                    className="h-20 w-20 rounded-full object-cover"
                                    src={profile.avatar_url || defaultAvatar}
                                    alt="프로필 이미지"
                                />
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-muted-foreground">닉네임</p>
                            <Input />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-muted-foreground">소개</p>
                            <Input />
                        </div>
                        <Button className="cursor-pointer">수정하기</Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
