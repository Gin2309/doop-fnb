import { Meta } from "@/layouts/Meta";
import { SignUp } from "@/modules/auth/sign-up";

const Index = () => {
  return (
    <div>
      <Meta title="Doop - Web dashboard" description="đăng ký" />
      <SignUp />
    </div>
  );
};

export default Index;
