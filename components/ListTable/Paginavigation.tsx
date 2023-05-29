import { useEffect, useState } from "react";

interface PaginavigationProps {
  page: number;
  setPage: Function;
  call: Function;
  size: number;
  totalCount: number;
}

export default function PaginavigationWidget({
  page,
  setPage,
  call,
  size,
  totalCount,
}: PaginavigationProps) {
  // 페이지 숫자 출력 개수 리미트
  const pageLimit = 10;

  //
  const [pageNavigationLocation, setPageNavigationLocation] = useState(0);

  const moveNavigationLocation = async (location: number) => {
    setPageNavigationLocation(pageNavigationLocation + location);
    const newPageNum = (pageNavigationLocation + location) * pageLimit;
    await setPage(newPageNum);
    await movePage(newPageNum);
  };

  const movePage = async (movePage: number) => {
    await setPage(movePage);
    await call({
      size,
      page: movePage,
    });
  };
  useEffect(() => {}, []);

  return (
    <div className='pt-3 text-center'>
      <nav aria-label='Page navigation example'>
        <ul className='inline-flex items-center -space-x-px'>
          {/* 이전페이 이동 */}
          {
            page >= pageLimit ? (
              <li>
                <a
                  onClick={() => {
                    moveNavigationLocation(-1);
                  }}
                  className='block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  <span className='sr-only'>Previous</span>
                  <svg
                    aria-hidden='true'
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                </a>
              </li>
            ) : (
              ""
            )
            // (
            //   <li>
            //     <div className='block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 '>
            //       <span className='sr-only'>Previous</span>
            //       <svg
            //         aria-hidden='true'
            //         className='w-5 h-5'
            //         fill='currentColor'
            //         viewBox='0 0 20 20'
            //         xmlns='http://www.w3.org/2000/svg'
            //       >
            //         <path
            //           fillRule='evenodd'
            //           d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
            //           clipRule='evenodd'
            //         ></path>
            //       </svg>
            //     </div>
            //   </li>
            // )
          }
          {/* 숫자리스트 */}
          {Array.from(Array(pageLimit), (_, i) => {
            const _temp = i + pageNavigationLocation * pageLimit;
            if (Math.ceil(totalCount / size) < _temp + 1) return;
            return page !== _temp ? (
              <li key={i}>
                <a
                  href=''
                  onClick={() => movePage(_temp)}
                  className='px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  {_temp + 1}
                </a>
              </li>
            ) : (
              <li key={i}>
                <a
                  aria-current='page'
                  className='z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                >
                  {_temp + 1}
                </a>
              </li>
            );
          })}

          {/* 이후페이지 */}
          {
            (page + 1) * size + pageLimit < totalCount &&
            pageLimit * (pageNavigationLocation + 1) * size < totalCount ? (
              <li>
                <a
                  href='#'
                  onClick={() => {
                    moveNavigationLocation(1);
                  }}
                  className='block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  <span className='sr-only'>Next</span>
                  <svg
                    aria-hidden='true'
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                </a>
              </li>
            ) : (
              ""
            )
            // (
            //   <li>
            //     <div className='block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 '>
            //       <span className='sr-only'>Next</span>
            //       <svg
            //         aria-hidden='true'
            //         className='w-5 h-5'
            //         fill='currentColor'
            //         viewBox='0 0 20 20'
            //         xmlns='http://www.w3.org/2000/svg'
            //       >
            //         <path
            //           fillRule='evenodd'
            //           d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
            //           clipRule='evenodd'
            //         ></path>
            //       </svg>
            //     </div>
            //   </li>
            // )
          }
        </ul>
      </nav>
    </div>
  );
}
