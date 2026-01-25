// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, Form, Input, Button, Select, Typography, Alert } from "antd";
// import { MailOutlined, LockOutlined } from "@ant-design/icons";
// import { useAuth } from "../context/AuthContext";

// const { Title, Text } = Typography;
// const { Option } = Select;

// function SignupPage() {
//   const { signupMutation } = useAuth();
//   const navigate = useNavigate();
//   const [error, setError] = useState("");

//   const handleSignup = async (values) => {
//     setError("");
//     try {
//       await signupMutation.mutateAsync(values);
//       navigate("/");
//     } catch (err) {
//       setError(err.response?.data?.message || "Signup failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <div className="w-full max-w-md">
//         <Card variant={false} className="rounded-2xl shadow-2xl">
//           <div className="text-center mb-6">
//             <Title level={2} className="mb-1!">
//               Create Account
//             </Title>
//             <Text type="secondary">Join us and start your journey 🚀</Text>
//           </div>

//           {error && (
//             <Alert title={error} type="error" showIcon className="mb-4" />
//           )}

//           <Form layout="vertical" onFinish={handleSignup} requiredMark={false}>
//             <Form.Item
//               label="Email"
//               name="email"
//               rules={[
//                 { required: true, message: "Please enter your email" },
//                 { type: "email", message: "Invalid email address" },
//               ]}
//             >
//               <Input
//                 size="large"
//                 prefix={<MailOutlined />}
//                 placeholder="you@example.com"
//                 className="rounded-lg"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Password"
//               name="password"
//               rules={[
//                 { required: true, message: "Please enter your password" },
//                 { min: 6, message: "Minimum 6 characters" },
//               ]}
//             >
//               <Input.Password
//                 size="large"
//                 prefix={<LockOutlined />}
//                 placeholder="••••••••"
//                 className="rounded-lg"
//               />
//             </Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               size="large"
//               block
//               loading={signupMutation.isLoading}
//               className="mt-2 rounded-lg bg-blue-600 hover:bg-blue-700"
//             >
//               Sign Up
//             </Button>
//           </Form>

//           <div className="text-center mt-6 text-sm">
//             <span className="text-gray-600">Already have an account?</span>{" "}
//             <button
//               onClick={() => navigate("/login")}
//               className="text-blue-600 font-medium hover:underline"
//             >
//               Login
//             </button>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }

// export default SignupPage;
