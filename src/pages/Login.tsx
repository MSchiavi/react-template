import { Button, Card, Col, Form, Input, Row, Typography } from "antd";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { clearLoginMessages, getLoggedIn, getLoginError, login } from "../slices/accountSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface ILoginForm {
    email: string;
    password: string;
}
export default function Login() {
    const dispatch = useAppDispatch();
    const source = axios.CancelToken.source();
    const loggedIn = useAppSelector(getLoggedIn);
    const navigate = useNavigate();
    const loginError = useAppSelector(getLoginError);

    useEffect(() => {
        dispatch(clearLoginMessages());
    }, [dispatch]);

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
        if (loggedIn) {
            navigate("/");
        }
    }, [navigate, loggedIn]);

    const handleRegister = () => {
        navigate("/register");
    };
    const onLoginFinish = (fieldsValue: ILoginForm) => {
        const email = fieldsValue["email"];
        const password = fieldsValue["password"];
        dispatch(login({ email, password, cancelToken: source.token }));
    };

    return (
        <Row style={{ width: "100%", height: "100%" }}>
            <Col span={24} style={{ alignSelf: "center", padding: 25, marginBottom: "15%" }}>
                <div style={{ maxWidth: "25%", marginLeft: "auto", marginRight: "auto", marginTop: "10%" }}>
                    <Card title="LOGIN TEMPLATE">
                        <Form name="loginForm" onFinish={onLoginFinish} layout="vertical">
                            <Form.Item label="Email" name="email">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Password" name="password">
                                <Input.Password />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                                Login
                            </Button>
                        </Form>
                        {loginError ? <Text>{loginError}</Text> : <></>}
                        <div style={{ marginTop: 20 }}>
                            <Text style={{ marginTop: 40 }}>{"Need an Account? "}</Text>
                            <Button onClick={handleRegister} type="primary">
                                Register
                            </Button>
                        </div>
                    </Card>
                </div>
            </Col>
        </Row>
    );
}
