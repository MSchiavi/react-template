import { Button, Card, Col, Form, Input, Row, Typography } from "antd";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { clearRegisterMessages, getLoggedIn, getRegisterError, getRegisterMessage, login, register } from "../slices/accountSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface IRegisterForm {
    email: string;
    password: string;
}
export default function Register() {
    const dispatch = useAppDispatch();
    const source = axios.CancelToken.source();
    const loggedIn = useAppSelector(getLoggedIn);
    const navigate = useNavigate();
    const registerMessage = useAppSelector(getRegisterMessage);
    const registerError = useAppSelector(getRegisterError);

    useEffect(() => {
        dispatch(clearRegisterMessages());
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

    const onRegisterFinish = (fieldsValue: IRegisterForm) => {
        dispatch(clearRegisterMessages());
        const email = fieldsValue["email"];
        const password = fieldsValue["password"];
        dispatch(register({ email, password, cancelToken: source.token }));
    };

    return (
        <Row style={{ width: "100%", height: "100%" }}>
            <Col span={24} style={{ alignSelf: "center", padding: 25, marginBottom: "15%" }}>
                <div style={{ width: "25%", marginLeft: "auto", marginRight: "auto", marginTop: "10%" }}>
                    <Card title="LOGIN TEMPLATE">
                        <Form name="loginForm" onFinish={onRegisterFinish} layout="vertical">
                            <Form.Item label="Email" name="email">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Password" name="password">
                                <Input.Password />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">
                                Register
                            </Button>
                        </Form>
                        {registerError ? <Text>{registerError}</Text> : <></>}
                        {registerMessage ? <Text>{registerMessage}</Text> : <></>}
                    </Card>
                </div>
            </Col>
        </Row>
    );
}
