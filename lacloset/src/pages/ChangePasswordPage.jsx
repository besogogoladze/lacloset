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
            {step === "request" ? "პაროლის შეცვლა" : "პაროლის შეცვლის დადასტურება"}
          </Title>

          {missingCode && (
            <Alert
              message="კოდი არასწორია ან ვადაგასულია. გთხოვთ, სცადეთ თავიდან."
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
              {cooldown > 0 ? `მოიცადეთ ${cooldown} წამი` : "კოდის გაგზავნა"}
            </Button>
          ) : (
            <Form layout="vertical" onFinish={handleVerify}>
              <Form.Item
                label="ვერიფიკაციის კოდი"
                name="code"
                rules={[{ required: true, message: "გთხოვთ, შეიყვანეთ ვერიფიკაციის კოდი" }]}
              >
                <Input placeholder="შეიყვანეთ 6 ციფრიანი კოდი" />
              </Form.Item>

              <Form.Item
                label="ახალი პაროლი"
                name="newPassword"
                rules={[
                  { required: true, message: "გთხოვთ, შეიყვანეთ ახალი პაროლი" },
                  { min: 8, message: "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს" },
                ]}
              >
                <Input.Password placeholder="შეიყვანეთ ახალი პაროლი" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  disabled={cooldown > 0}
                >
                  პაროლის შეცვლა
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
