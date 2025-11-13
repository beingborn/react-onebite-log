import { useSession } from "@/store/session";
import { Navigate, Outlet } from "react-router";

export default function GusetOnlyLayout() {
    const session = useSession();

    if (session) return <Navigate to="/" replace={true} />;

    return <Outlet />;
}

/* 
    replace true를 통해 브라우저 기록을 날려서 
    뒤로가기가 되지 않게 설정
*/
