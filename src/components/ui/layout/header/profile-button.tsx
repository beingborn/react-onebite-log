import { signOut } from "@/api/auth";
import defaultAvatar from "@/assets/default-avatar.jpg";
import useProfileData from "@/hooks/queries/use-profile-data";
import { useSession } from "@/store/session";
import { PopoverClose } from "@radix-ui/react-popover";
import { Link } from "react-router";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";

export default function ProfileButton({ userId }: { userId?: string }) {
    const session = useSession();
    const { data: profile } = useProfileData(session?.user.id);

    if (!profile) return;

    return (
        <Popover>
            <PopoverTrigger className="cursor-pointer">
                <img
                    className="h-6 w-6 rounded-full object-cover"
                    src={profile?.avatar_url || defaultAvatar}
                    alt={`${profile ? profile.nickname : "익명"}님의 프로필 이미지`}
                />
            </PopoverTrigger>
            <PopoverContent className="flex w-40 flex-col p-0">
                <PopoverClose
                    asChild
                    className="hover:bg-muted cursor-pointer px-4 py-3 text-sm"
                >
                    <Link to={`/profile/${session?.user.id}`}>
                        <span>프로필</span>
                    </Link>
                </PopoverClose>
                <PopoverClose
                    onClick={signOut}
                    asChild
                    className="hover:bg-muted cursor-pointer px-4 py-3 text-sm"
                >
                    <span>로그아웃</span>
                </PopoverClose>
            </PopoverContent>
        </Popover>
    );
}
