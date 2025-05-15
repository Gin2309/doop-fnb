import Bar from "@/shared/models/Bar";
import { PropsWithoutRef } from "react";
import PosServiceWaiting from "./waiting";
import PosServiceOnBar from "./on-bar";
import PosServiceToServed from "./to-served";


export default function ServicePos(props: PropsWithoutRef<{
  activeKey: string;
  bar?: Bar;
}>) {
  const {
    activeKey,
    bar
  } = props;

  const renderPosService = () => {
    if (activeKey === "waiting") {
      return <PosServiceWaiting />
    } else if (activeKey === "serve") {
      return <PosServiceToServed />
    } else if (!!bar) {
      return <PosServiceOnBar bar={bar} />
    }
    return <></>
  }

  return <>
    {renderPosService()}
  </>
}
