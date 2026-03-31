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
      const msg = err.response?.data?.message || "პაროლის შეცვლა ვერ მოხერხდა";

      if (msg.includes("პაროლის აღდგენის კოდი ვერ მოიძებნა")) {
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
            {email ? "პაროლის აღდგენა" : "პაროლის შეცვლა"}
          </Title>

          {missingCode && (
            <Alert
              message="პაროლის აღდგენის კოდი ვერ მოიძებნა. გთხოვთ, მოითხოვოთ ახალი."
              type="warning"
              showIcon
              description={
                <Button size="small" type="primary" onClick={handleGoToForgot}>
                  პაროლის აღდგენის მოთხოვნა
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
                  {
                    required: true,
                    message: "გთხოვთ, შეიყვანეთ აღდგენის კოდი!",
                  },
                ]}
              >
                <Input
                  placeholder="შეიყვანეთ აღდგენის კოდი"
                  disabled={cooldown > 0 || missingCode}
                />
              </Form.Item>
            )}

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "გთხოვთ, შეიყვანეთ თქვენი ახალი პაროლი!",
                },
              ]}
            >
              <Input.Password
                placeholder="შეიყვანეთ თქვენი ახალი პაროლი"
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
                {cooldown > 0 ? `მოიცადეთ ${cooldown} წამი` : "პაროლის შეცვლა"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
}

export default PasswordResetFlow;
