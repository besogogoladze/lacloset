import React, { useState } from "react";
import { Form, Input, Button, Alert, Typography } from "antd";
import OTPPage from "./OTPPage";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const { Title } = Typography;

function LoginPage() {
  const { loginMutation } = useAuth();
  const [form] = Form.useForm();

  const [showOTP, setShowOTP] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLocalError("");
    try {
      const res = await loginMutation.mutateAsync(values);
      setOtpEmail(res.email);
      setShowOTP(true);
    } catch (err) {
      setLocalError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        {!showOTP ? (
          <>
            <Title level={3} className="text-center mb-6">
              Login
            </Title>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleLogin}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Invalid email format!" },
                ]}
              >
                <Input
                  placeholder="Enter your email"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter your password"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              {localError && (
                <Alert
                  title={localError}
                  type="error"
                  showIcon
                  className="mb-4"
                />
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loginMutation.isPending}
                  className="rounded-lg"
                >
                  Login
                </Button>
              </Form.Item>

              <div className="flex flex-col gap-1 text-center">
                <Button
                  type="link"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm"
                >
                  Forgot Password?
                </Button>

                {/* <Button
                  type="link"
                  onClick={() => navigate("/signup")}
                  className="text-sm"
                >
                  Don’t have an account? Sign up
                </Button> */}
              </div>
            </Form>
          </>
        ) : (
          <OTPPage email={otpEmail} />
        )}
      </div>
    </div>
  );
}

export default LoginPage;
