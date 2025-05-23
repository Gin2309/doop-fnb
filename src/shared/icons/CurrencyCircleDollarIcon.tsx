import React from "react";

interface Props {
  className?: string;
}

export const CurrencyCircleDollarIcon: React.FC<Props> = ({ className }) => {
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
        d="M14 18.375V20.125M14 7.875V9.625M11.375 18.375H15.3125C15.8927 18.375 16.4491 18.1445 16.8593 17.7343C17.2695 17.3241 17.5 16.7677 17.5 16.1875C17.5 15.6073 17.2695 15.0509 16.8593 14.6407C16.4491 14.2305 15.8927 14 15.3125 14H12.6875C12.1073 14 11.5509 13.7695 11.1407 13.3593C10.7305 12.9491 10.5 12.3927 10.5 11.8125C10.5 11.2323 10.7305 10.6759 11.1407 10.2657C11.5509 9.85547 12.1073 9.625 12.6875 9.625H16.625M24.5 14C24.5 19.799 19.799 24.5 14 24.5C8.20101 24.5 3.5 19.799 3.5 14C3.5 8.20101 8.20101 3.5 14 3.5C19.799 3.5 24.5 8.20101 24.5 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
