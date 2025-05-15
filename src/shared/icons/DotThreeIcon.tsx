import React from "react";

interface Props {
  className?: string;
}

export const DotThreeIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M21 15.6875C21.932 15.6875 22.6875 14.932 22.6875 14C22.6875 13.068 21.932 12.3125 21 12.3125C20.068 12.3125 19.3125 13.068 19.3125 14C19.3125 14.932 20.068 15.6875 21 15.6875ZM14 15.6875C14.932 15.6875 15.6875 14.932 15.6875 14C15.6875 13.068 14.932 12.3125 14 12.3125C13.068 12.3125 12.3125 13.068 12.3125 14C12.3125 14.932 13.068 15.6875 14 15.6875ZM7 15.6875C7.93198 15.6875 8.6875 14.932 8.6875 14C8.6875 13.068 7.93198 12.3125 7 12.3125C6.06802 12.3125 5.3125 13.068 5.3125 14C5.3125 14.932 6.06802 15.6875 7 15.6875Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.75"
      />
    </svg>
  );
};
