import Image from "next/image";

export default function Banner() {
  return (
    <div className="w-full">
      <Image
        src="/images/banner.png"
        alt="Banner"
        layout="responsive"
        width={1200}
        height={300}
        className="w-full "
      />
    </div>
  );
}
