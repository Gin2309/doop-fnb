import React from "react";

interface Props {
  className?: string;
}

export const GameIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.76 16.6133L8.69336 20.6799"
        stroke="currentColor"
        strokeWidth="1.5"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.7334 16.6533L12.8001 20.72"
        stroke="currentColor"
        strokeWidth="1.5"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.04 18.6667H18.0534"
        stroke="currentColor"
        strokeWidth="2"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.2932 18.6667H23.3065"
        stroke="currentColor"
        strokeWidth="2"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.6667 21.3067V21.28"
        stroke="currentColor"
        strokeWidth="2"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.6667 16.0533V16.0266"
        stroke="currentColor"
        strokeWidth="2"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.0001 29.3333H20.0001C26.6667 29.3333 29.3334 26.6667 29.3334 20V17.3333C29.3334 10.6667 26.6667 8 20.0001 8H12.0001C5.33341 8 2.66675 10.6667 2.66675 17.3333V20C2.66675 26.6667 5.33341 29.3333 12.0001 29.3333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.3466 2.66675L17.3332 4.01341C17.3199 4.74675 16.7332 5.33341 15.9999 5.33341H15.9599C15.2266 5.33341 14.6399 5.93341 14.6399 6.66675C14.6399 7.40008 15.2399 8.00008 15.9732 8.00008H17.3066"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
