import React, { useState, useEffect } from "react";
import {
  ConfigProvider,
  Form,
  Input,
  Button,
  Card,
  Alert,
  Typography,
} from "antd";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
const { Title } = Typography;

function ChangePasswordPage() {
  const [step, setStep] = useState("request"); // "request" or "verify"
  const [cooldown, setCooldown] = useState(0);
  const [missingCode, setMissingCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { sendCodeMutation, verifyMutation } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // 📨 Send code handler
  const handleSendCode = async () => {
    setLoading(true);
    try {
      await sendCodeMutation.mutateAsync();
      setStep("verify");
      setCooldown(10); // optional cooldown before resending
      setMissingCode(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify code handler
  const handleVerify = async (values) => {
    setLoading(true);
    try {
      await verifyMutation.mutateAsync({
        providedCode: values.code.toString(),
        newPassword: values.newPassword,
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#1890ff", borderRadius: 8 },
      }}
    >
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
            {step === "request" ? "Change Password" : "Verify Password Change"}
          </Title>

          {missingCode && (
            <Alert
              message="No password change code found. Please request a new one."
              type="warning"
              showIcon
              style={{ marginBottom: "20px" }}
              action={
                <Button
                  size="small"
                  type="primary"
                  onClick={() => setStep("request")}
                >
                  Request Again
                </Button>
              }
            />
          )}

          {step === "request" ? (
            <Button
              type="primary"
              block
              onClick={handleSendCode}
              loading={loading}
              disabled={cooldown > 0}
            >
              {cooldown > 0 ? `Wait ${cooldown}s` : "Send Code"}
            </Button>
          ) : (
            <Form layout="vertical" onFinish={handleVerify}>
              <Form.Item
                label="Verification Code"
                name="code"
                rules={[{ required: true, message: "Please enter the code" }]}
              >
                <Input placeholder="Enter 6-digit code" />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: "Please enter your new password" },
                  { min: 8, message: "Password must be at least 8 characters" },
                ]}
              >
                <Input.Password placeholder="Enter new password" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  disabled={cooldown > 0}
                >
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </div>
    </ConfigProvider>
  );
}

export default ChangePasswordPage;
