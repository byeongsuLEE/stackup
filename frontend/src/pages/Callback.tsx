import { useEffect } from "react";
import { freelanceMypage, getToken } from "../apis/UserApi";
import { useLocation, useNavigate } from "react-router-dom";

const Callback = () => {
    const navigate = useNavigate();
    const query = new URLSearchParams(useLocation().search);
    const userId = query.get('userId');

    useEffect(() => {
        const update = async() => {
            const tokenData = await getToken(userId);
            const infoData = await freelanceMypage();

            if (tokenData !== "로그인") {
                navigate("/login")

            } else if (infoData == null) {
                navigate("/signup/freelancer")
                
            } else {
                window.location.replace('/');
            }
            
        }

        update();
    }, [])

    return null;
}

export default Callback;