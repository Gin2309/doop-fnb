import { PropsWithChildren } from "react";

const PosItemCardContainer = (props: PropsWithChildren<{
  isLast?: boolean;
}>) => {
  const { isLast, children } = props;
  return <div className={!isLast ? "border-b border-dashed" : ""}>
    {children}
  </div>
}

export default PosItemCardContainer;