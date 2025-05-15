import { Meta } from "@/layouts/Meta";
import { ForgotPassword } from "@/modules/auth/forgot-password";

const Index = () => {
  return (
    <div>
      <Meta title="Doop - Web dashboard" description="Quên mật khẩu" />
      <ForgotPassword />
    </div>
  );
};

export default Index;
