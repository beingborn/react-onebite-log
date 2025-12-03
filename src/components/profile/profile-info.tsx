import defaultAvatar from "@/assets/default-avatar.jpg";
import useProfileData from "@/hooks/queries/use-profile-data";
import { useSession } from "@/store/session";
import Fallback from "../post/fallback";
import Loader from "../post/loader";
import EditProfileButton from "./edit-profile-button";

export default function ProfileInfo({ userId }: { userId: string }) {
    const session = useSession();

    const {
        data: profile,
        error: fetchProfileError,
        isPending: isFetchingProfilePending,
    } = useProfileData(userId);

    if (fetchProfileError) return <Fallback />;
    if (isFetchingProfilePending) return <Loader />;

    const isMine = session?.user.id === userId;

    return (
        <div className="flex flex-col items-center justify-center gap-5">
            <img
                src={profile.avatar_url || defaultAvatar}
                className="h-30 w-30 rounded-full object-cover"
            />
            <div className="flex flex-col items-center gap-2">
                <h3 className="text-xl font-bold">{profile.nickname}</h3>
                <p className="text-muted-foreground">{profile.bio}</p>
            </div>
            {isMine && <EditProfileButton />}
        </div>
    );
}
