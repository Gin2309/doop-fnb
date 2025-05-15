import React from "react";
import PosNoti from "@/modules/pos/Notificaiton";
import PostLayout from "@/layouts/PosLayout";
import { Meta } from "@/layouts/Meta";

const Notification = () => {
  return (
    <PostLayout meta={<Meta title="Doop - Web dashboard" description="Pos" />}>
      <PosNoti />
    </PostLayout>
  );
};

export default Notification;
