import { Meta } from "@/layouts/Meta";
import { ChangePassword } from "@/modules/auth/change-password";

const Index = () => {
  return (
    <div>
      <Meta title="Doop - Web dashboard" description="Quên mật khẩu" />
      <ChangePassword />
    </div>
  );
};

export default Index;
