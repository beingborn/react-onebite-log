import { useOpenProfileEditorModal } from "@/store/profile-editor-modal";
import { Button } from "../ui/button";

export default function EditProfileButton() {
    const openProfileEditorModal = useOpenProfileEditorModal();

    return (
        <Button
            onClick={openProfileEditorModal}
            type="button"
            variant={"secondary"}
        >
            프로필 수정
        </Button>
    );
}
