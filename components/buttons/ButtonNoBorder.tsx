import { MouseEventHandler } from "react";

interface ButtonNoBorderProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  label: any;
}
export default function ButtonNoBorder({
  onClick,
  label,
}: ButtonNoBorderProps) {
  return (
    <button
      onClick={onClick}
      type='button'
      className='px-4 py-2 m-2 font-bold bg-gray-200 rounded text-slate-800 hover:bg-gray-800 hover:text-white'
    >
      {label}
    </button>
  );
}
