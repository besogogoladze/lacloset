import React, { useState } from "react";
import { Form, Input, Button, Alert, Typography } from "antd";
import OTPPage from "./OTPPage";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import img from "../assets/IMG_7788.JPEG";

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
    } catch {
      setLocalError("შესვლა ვერ მოხერხდა. გთხოვთ, სცადეთ თავიდან.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        {!showOTP ? (
          <>
            <img
              src={img}
              alt="Login"
              className="w-30 h-30 mx-auto mb-4 rounded-full object-fill"
            />
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
                label="ელფოსტა"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "გთხოვთ, შეიყვანეთ თქვენი ელფოსტა!",
                  },
                  {
                    type: "email",
                    message: "გთხოვთ, შეიყვანეთ სწორი ელფოსტა!",
                  },
                ]}
              >
                <Input
                  placeholder="შეიყვანეთ თქვენი ელფოსტა"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label="პაროლი"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "გთხოვთ, შეიყვანეთ თქვენი პაროლი!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="შეიყვანეთ თქვენი პაროლი"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              {localError && (
                <div className="mb-6">
                  <Alert title={localError} type="error" showIcon />
                </div>
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
                  შესვლა
                </Button>
              </Form.Item>

              <div className="flex flex-col gap-1 text-center">
                <Button
                  type="link"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm"
                >
                  დაგავიწყდათ პაროლი?
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
