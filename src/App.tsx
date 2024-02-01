import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { ConfigProvider, FloatButton, Layout, Menu, Typography, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { checkSession, getDarkMode, getLoggedIn, logout, setDarkMode } from "./slices/accountSlice";
import { BulbFilled, BulbOutlined, UserOutlined } from "@ant-design/icons";
import { getBackgroundColor } from "./slices/themeSlice";
import Holder from "./components/Holder";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import axios from "axios";
import Home from "./pages/Home";
import Register from "./pages/Register";

const { Text } = Typography;

const { defaultAlgorithm, darkAlgorithm } = theme;
function App() {
    const dispatch = useAppDispatch();
    const darkMode = useAppSelector(getDarkMode);
    const backgroundColor = useAppSelector(getBackgroundColor);
    const loggedIn = useAppSelector(getLoggedIn);
    const navigate = useNavigate();
    const location = useLocation();
    const source = axios.CancelToken.source();

    const [currentKey, setCurrentKey] = useState<string>("home");

    const headerStyle: React.CSSProperties = {
        textAlign: "center",
        color: "#fff",
        height: 64,
        lineHeight: "64px",
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: backgroundColor,
    };

    const contentStyle: React.CSSProperties = {
        textAlign: "center",
        lineHeight: "calc(100% - 64px - 48px)",
        color: "#fff",
        backgroundColor: backgroundColor,
        flex: 1,
    };

    const footerStyle: React.CSSProperties = {
        textAlign: "center",
        color: "#fff",
        backgroundColor: backgroundColor,
        height: 48,
    };

    const layoutStyle = {
        // overflow: "hidden",
        width: "100%",
        maxWidth: "100%",
        minHeight: "100vh",
        display: "flex",
    };

    const handleDarkMode = useCallback(() => {
        dispatch(setDarkMode(!darkMode));
    }, [darkMode, dispatch]);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        signal.addEventListener("abort", () => {
            source.cancel("Request was cancelled");
            return () => {
                controller.abort();
            };
        });
    }, [source]);

    useEffect(() => {
        dispatch(checkSession({ cancelToken: source.token }));
    }, []);

    useEffect(() => {
        switch (location.pathname) {
            case "/":
                setCurrentKey("home");
                break;
            case "/login":
                setCurrentKey("login");
                break;
            default:
                setCurrentKey("home");
        }
    }, [location]);

    const onClick = useCallback(
        (e: any) => {
            switch (e.key) {
                case "home":
                    navigate("/");
                    break;
                case "login":
                    navigate("/login");
                    break;
                case "logout":
                    dispatch(logout({ cancelToken: source.token }));
                    break;
                case "profile":
                    navigate("/profile");
                    break;
                default:
                    navigate("/");
            }
            setCurrentKey(e.key);
        },
        [navigate]
    );

    return (
        <ConfigProvider theme={{ algorithm: darkMode ? darkAlgorithm : defaultAlgorithm }}>
            <Layout style={layoutStyle}>
                <Header style={headerStyle}>
                    <Menu onClick={onClick} selectedKeys={[currentKey]} mode="horizontal">
                        <Menu.Item key="home">
                            <Text> Home </Text>
                        </Menu.Item>
                        {loggedIn && (
                            <Menu.SubMenu title={"Person's Name Goes here"} icon={<UserOutlined />} style={{ marginLeft: "auto" }}>
                                <Menu.ItemGroup>
                                    <Menu.Item key="profile">Profile</Menu.Item>
                                    <Menu.Item key="logout">Logout</Menu.Item>
                                </Menu.ItemGroup>
                            </Menu.SubMenu>
                        )}
                        {!loggedIn && (
                            <Menu.Item key="login" style={{ marginLeft: "auto" }} icon={<UserOutlined />}>
                                <Text>Login</Text>
                            </Menu.Item>
                        )}
                    </Menu>
                </Header>
                <Content style={contentStyle}>
                    <Routes>
                        <Route path="" element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="profile" element={<Profile />} />
                    </Routes>
                </Content>
                <Footer style={footerStyle}>Footer</Footer>
            </Layout>
            <Holder>
                <FloatButton icon={darkMode ? <BulbFilled style={{ color: "yellow" }} /> : <BulbOutlined />} onClick={handleDarkMode} />
            </Holder>
        </ConfigProvider>
    );
}

export default App;
