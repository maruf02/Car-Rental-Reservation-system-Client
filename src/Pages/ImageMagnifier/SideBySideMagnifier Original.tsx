import React, { useRef, useState } from "react";

interface MagnifierProps {
  imageUrl: string;
}

const SideBySideMagnifier: React.FC<MagnifierProps> = ({ imageUrl }) => {
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const magnifierRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top, width, height } =
      magnifierRef.current!.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setBackgroundPosition(`${x}% ${y}%`);
  };

  const handleMouseEnter = () => {
    setIsZoomVisible(true);
  };

  const handleMouseLeave = () => {
    setIsZoomVisible(false);
  };

  return (
    <div className="relative flex border border-gray-300">
      <div
        ref={magnifierRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-full overflow-hidden border-r border-gray-300 "
      >
        <img
          src={imageUrl}
          alt="Product"
          className="w-full h-full object-cover pointer-events-none "
        />
      </div>
      <div
        className={`absolute left-[30%] top-[100%] w-[300px] h-[300px] bg-no-repeat bg-cover z-10 ${
          isZoomVisible ? "block" : "hidden"
        }`}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: backgroundPosition,
          backgroundSize: "300%",
        }}
      />
    </div>
  );
};

export default SideBySideMagnifier;
