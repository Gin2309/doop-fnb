import { Meta } from "@/layouts/Meta";
import { SignIn } from "@/modules/auth/sign-in";

const Index = () => {
  return (
    <div>
      <Meta title="Doop - Web dashboard" description="đăng Nhập" />
      <SignIn />
    </div>
  );
};

export default Index;
