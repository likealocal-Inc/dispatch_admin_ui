import ReactLoading from "react-loading";

export function Loading() {
  return (
    <div className='absolute flex flex-col items-center justify-center w-screen h-screen my-auto '>
      <ReactLoading
        type='spin'
        color='red'
        width={200}
        height={200}
      ></ReactLoading>
    </div>
  );
}
