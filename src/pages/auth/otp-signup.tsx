import { Meta } from "@/layouts/Meta";
import { OTP } from "@/modules/auth/otp-signup";

const Index = () => {
  return (
    <div>
      <Meta title="Doop - Web dashboard" description="Quên mật khẩu" />
      <OTP />
    </div>
  );
};

export default Index;
