import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfigProvider, Form, Input, Button, Alert, Typography } from "antd";
import { useAuth } from "../context/AuthContext";

const { Title } = Typography;

function OTPPage({ email }) {
  const { verifyCodeMutation } = useAuth();
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (values) => {
    try {
      setLoading(true);
      await verifyCodeMutation.mutateAsync({
        email,
        providedCode: values.code,
      });
      setError("");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "კოდი არასწორია");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 8,
        },
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          შეიყვანეთ კოდი
        </Title>
        <p style={{ color: "#888" }}>
          ვერიფიკაციის კოდი გამოგზავნილია <strong>{email}</strong>-ზე
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleVerify}
          autoComplete="off"
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="კოდი"
            name="code"
            rules={[{ required: true, message: "გთხოვთ, შეიყვანეთ კოდი!" }]}
          >
            <Input placeholder="შეიყვანეთ 6 ციფრიანი კოდი" maxLength={6} />
          </Form.Item>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {loading ? "ვერიფიკაციის შემოწმება..." : "დადასტურება"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </ConfigProvider>
  );
}

export default OTPPage;
