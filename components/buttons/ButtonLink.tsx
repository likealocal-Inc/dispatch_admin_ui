import { useRouter } from "next/router";
import { MouseEventHandler } from "react";

interface ButtonLinkForPageProps {
  pageUrl: string;
  label: any;
}
export default function ButtonLinkForPage({
  pageUrl,
  label,
}: ButtonLinkForPageProps) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push(pageUrl);
      }}
      className='px-4 py-2 m-2 font-bold text-gray-800 rounded hover:bg-gray-800 hover:text-white'
    >
      {label}
    </button>
  );
}
