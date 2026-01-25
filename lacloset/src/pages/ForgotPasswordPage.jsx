import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConfigProvider, Form, Input, Button, Card } from "antd";
import { useAuth } from "../context/AuthContext";

function ForgotPasswordPage() {
  const { forgotPasswordMutation } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleForgot = async (values) => {
    setLoading(true);
    try {
      await forgotPasswordMutation.mutateAsync({
        email: values.email,
      });
      setCooldown(30); // start cooldown
      navigate("/reset-password", { state: { email: values.email } });
    } catch (err) {
      // errors handled in mutation
      err.error("Failed to send reset code, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1890ff" } }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#f0f2f5",
          padding: "20px",
        }}
      >
        <Card style={{ width: 400, padding: "40px" }}>
          <Form layout="vertical" onFinish={handleForgot}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Enter your email" disabled={cooldown > 0} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                disabled={cooldown > 0}
              >
                {cooldown > 0 ? `Wait ${cooldown}s` : "Send Reset Code"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
}

export default ForgotPasswordPage;
