import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useAuthUser } from "../../services/hooks/useAuthUser";
import { UserOutlined, LogoutOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Dropdown, Typography } from "antd";

const { Text } = Typography;

function Header() {
  const { logout, isLoggingOut } = useAuth();
  const { data: user } = useAuthUser();

  const userMenuItems = [
    {
      key: "email",
      label: <Text className="text-gray-500 text-sm">{user?.email}</Text>,
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "change-password",
      icon: <LockOutlined />,
      label: <Link to="/change-password">Change Password</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: logout,
      disabled: isLoggingOut,
    },
  ];
  return (
    <header className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left — Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-gray-800 hover:text-blue-600 transition"
        >
          La<span className="text-blue-600">Closet</span>
        </Link>

        {/* Right — Actions */}
        <div className="flex items-center gap-4">
          {/* User */}
          {user && (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button
                type="text"
                icon={<UserOutlined />}
                className="flex items-center gap-1"
              >
                <span className="hidden sm:inline text-gray-700">Account</span>
              </Button>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
