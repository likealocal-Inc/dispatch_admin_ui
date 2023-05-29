import { MouseEventHandler } from "react";

interface Button01Props {
  onClick: MouseEventHandler<HTMLButtonElement>;
  label: any;
  bgColor?: string;
}
export default function Button01({ onClick, label }: Button01Props) {
  return (
    <button
      onClick={onClick}
      type='button'
      className={`inline-block px-6 py-2.5 bg-gray-700 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-950 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-950 active:shadow-lg transition duration-150 ease-in-out`}
    >
      {label}
    </button>
  );
}
