import ReactLoading from "react-loading";

export function Loading() {
  return (
    <div className='absolute z-50 flex flex-col items-center justify-center w-screen h-screen my-auto bg-opacity-90 bg-slate-300'>
      <ReactLoading
        type='spin'
        color='red'
        width={200}
        height={200}
      ></ReactLoading>
    </div>
  );
}
