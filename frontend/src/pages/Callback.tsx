import { useEffect } from "react";
import { getToken } from "../apis/UserApi";
import { useLocation, useNavigate } from "react-router-dom";

const Callback = () => {
    const navigate = useNavigate();
    const query = new URLSearchParams(useLocation().search);
    const userId = query.get('userId');

    useEffect(() => {
        const update = async() => {
            const data = await getToken(userId);

            if (data === "로그인") {
                navigate("/mypage")
            } else {
                alert("다시 로그인 해주세요.")
                navigate("/login")
            }
        }

        update();
    }, [])

    return null;
}

export default Callback;