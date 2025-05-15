import React, { ReactNode } from "react";
import Image, { StaticImageData } from "next/image";

interface EmptyStateProps {
  imageSrc: string | StaticImageData;
  title: string;
  description?: string;
  button?: ReactNode;
}

export function EmptyState({
  imageSrc,
  title,
  description,
  button,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center my-[30px]">
      <Image src={imageSrc} alt="No data" />
      <span className="text-[30px] font-semibold py-[10px] text-center">
        {title}
      </span>
      {description && (
        <p className="text-[#333] mb-[20px] text-center">
          {description.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      )}
      <>{button}</>
    </div>
  );
}
