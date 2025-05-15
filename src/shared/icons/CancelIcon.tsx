import React from "react";

interface Props {
  className?: string;
}

export const CancelIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r="8" fill="#EA4F3B" />
      <path
        d="M5.08334 5.08325L10.9167 10.9166M10.9167 5.08325L5.08334 10.9166"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
