import React from "react";

interface Props {
  className?: string;
}

export const CalendarCircle: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M15.9998 29.3334C23.3636 29.3334 29.3332 23.3639 29.3332 16.0001C29.3332 8.63628 23.3636 2.66675 15.9998 2.66675C8.63604 2.66675 2.6665 8.63628 2.6665 16.0001C2.6665 23.3639 8.63604 29.3334 15.9998 29.3334Z"
        stroke="currentColor"
        strokeWidth="1.75"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.1865 7.77344V10.4401"
        stroke="currentColor"
        strokeWidth="1.75"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.813 7.77344V10.4401"
        stroke="currentColor"
        strokeWidth="1.75"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.04 13.52H21.96"
        stroke="currentColor"
        strokeWidth="1.75"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.9998 23.5602H13.9998C10.6665 23.5602 8.6665 21.1602 8.6665 18.2269V14.2269C8.6665 11.2936 10.6665 8.89355 13.9998 8.89355H17.9998C21.3332 8.89355 23.3332 11.2936 23.3332 14.2269V18.2269C23.3332 21.1602 21.3332 23.5602 17.9998 23.5602Z"
        stroke="currentColor"
        strokeWidth="1.75"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
