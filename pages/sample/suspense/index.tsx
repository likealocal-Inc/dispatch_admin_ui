import { Suspense, useState } from "react";
import GetImage from "./load_data";

export default function SampleSuspense() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button onClick={() => setShow(true)}>show</button>
      {show && (
        <>
          <div>
            <Suspense fallback={<p>Fast loading..</p>}>
              <GetImage slow={false} />
            </Suspense>
            <Suspense fallback={<p>Slow loading..</p>}>
              <GetImage slow={true} />
            </Suspense>
          </div>
        </>
      )}
    </>
  );
}
