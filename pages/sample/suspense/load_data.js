import { use, useEffect, useState } from "react";
import { getRandomImage } from "../../../libs/utils";

export default function GetImage({ slow }) {
  const [img, setImg] = useState("");

  useEffect(() => {
    const _img = slow ? getRandomImage({ delay: 2000 }) : getRandomImage({});

    _img.then((d) => {
      setImg(d.url);
    });
  }, []);

  return (
    <div>
      <p>{slow ? "Slow" : "Fast"} component rendered</p>
      <blockquote>
        <img src={img} />
      </blockquote>
    </div>
  );
}
