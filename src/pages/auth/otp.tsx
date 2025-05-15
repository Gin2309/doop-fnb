import { Meta } from "@/layouts/Meta";
import { OTPChangePassword } from "@/modules/auth/otp";

const Index = () => {
  return (
    <div>
      <Meta title="Doop - Web dashboard" description="Quên mật khẩu" />
      <OTPChangePassword />
    </div>
  );
};

export default Index;
