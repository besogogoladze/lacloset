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
      setError(err.response?.data?.message || "Invalid Code");
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
          Enter Code
        </Title>
        <p style={{ color: "#888" }}>
          A verification code was sent to <strong>{email}</strong>
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleVerify}
          autoComplete="off"
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: "Please enter the code!" }]}
          >
            <Input placeholder="Enter the 6-digit code" maxLength={6} />
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
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </ConfigProvider>
  );
}

export default OTPPage;
