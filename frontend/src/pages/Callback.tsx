import { useEffect } from "react";
import { getToken } from "../apis/UserApi";
import { useNavigate } from "react-router-dom";

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const update = async() => {
            const data = await getToken();
            console.log(data)

            window.sessionStorage.setItem("token", data)
        }

        update();

        if (window.sessionStorage.getItem("token") != null) {
            navigate("/mypage")
        } else {
            alert("다시 로그인 해주세요.")
            navigate("/login")
        }
    }, [])

    return null;
}

export default Callback;