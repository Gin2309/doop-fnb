import { ReactNode } from "react";
import PostHeader from "./Header";

type ILayoutProps = {
  meta: ReactNode;
  title?: string | ReactNode;
  children: ReactNode;
};

export default function PostLayout(props: ILayoutProps) {
  return (
    <div className="h-screen">
      {props.meta}

      <div className="flex grow flex-col h-full ">
        <PostHeader />

        <div className="main-content grow flex-1 ">{props.children}</div>
      </div>
    </div>
  );
}
