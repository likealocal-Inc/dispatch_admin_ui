import { MouseEventHandler } from "react";

interface Button01Props {
  onClick: MouseEventHandler<HTMLButtonElement>;
  label: any;
  css?: any;
}
export default function Button02({ onClick, label, css }: Button01Props) {
  return (
    <button
      onClick={onClick}
      type='button'
      className={
        `inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out ` +
        css
      }
    >
      {label}
    </button>
  );
}
