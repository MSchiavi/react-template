import { theme } from "antd";
import { useAppDispatch } from "../hooks/redux";
import { setBackgroundColor } from "../slices/themeSlice";
import { useEffect } from "react";

const Holder = (props: { children?: React.ReactNode }) => {
    const { token } = theme.useToken();
    const { colorBgContainer } = token;
    const dispatch = useAppDispatch();
    useEffect(() => {
        handleBackgroundColor(colorBgContainer);
    }, [colorBgContainer]);
    const handleBackgroundColor = (backgroundColor: string) => {
        dispatch(setBackgroundColor(backgroundColor));
    };
    return <div style={{ background: colorBgContainer, minHeight: "100%" }}>{props.children}</div>;
};

export default Holder;
