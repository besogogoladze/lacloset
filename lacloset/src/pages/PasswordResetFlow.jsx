import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ConfigProvider,
  Form,
  Input,
  Button,
  Card,
  Typography,
  Alert,
} from "antd";
import { useAuth } from "../context/AuthContext";

const { Title } = Typography;

function PasswordResetFlow() {
  const { resetPasswordMutation } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; // exists if forgot password

  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [missingCode, setMissingCode] = useState(false);

  // Cooldown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleReset = async (values) => {
    setLoading(true);
    try {
      if (email) {
        await resetPasswordMutation.mutateAsync({
          email,
          providedCode: values.code.toString(),
          newPassword: values.newPassword,
        });
      } else {
        await resetPasswordMutation.mutateAsync({
          newPassword: values.newPassword,
        });
      }
      setCooldown(10);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Reset failed, please try again";

      if (msg.includes("No password reset code found")) {
        setMissingCode(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToForgot = () => {
    navigate("/forgot-password");
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
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "24px" }}
          >
            {email ? "Reset Password" : "Change Password"}
          </Title>

          {missingCode && (
            <Alert
              message="No reset code found. Please request a new one."
              type="warning"
              showIcon
              description={
                <Button size="small" type="primary" onClick={handleGoToForgot}>
                  Go to Forgot Password
                </Button>
              }
              style={{ marginBottom: "20px" }}
            />
          )}

          <Form layout="vertical" onFinish={handleReset}>
            {email && (
              <Form.Item
                label="Reset Code"
                name="code"
                rules={[
                  { required: true, message: "Please input the reset code!" },
                ]}
              >
                <Input
                  placeholder="Enter reset code"
                  disabled={cooldown > 0 || missingCode}
                />
              </Form.Item>
            )}

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please input your new password!" },
              ]}
            >
              <Input.Password
                placeholder="Enter new password"
                disabled={cooldown > 0 || missingCode}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                disabled={cooldown > 0 || missingCode}
              >
                {cooldown > 0 ? `Wait ${cooldown}s` : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
}

export default PasswordResetFlow;
