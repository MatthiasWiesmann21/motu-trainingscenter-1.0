import React from 'react';

interface ClubyteLoaderProps {
    color: string;
    theme: string;
    className: string;
}

const ClubyteLoader = (
    { color, theme, className }: ClubyteLoaderProps
) => {
  return (
    <div className={className}>
    <div className="flex justify-center items-center h-full">
      <video
        src={`/ClubyteLoader-${color}-${theme}.webm`}
        autoPlay
        loop
        muted
        className="w-full h-full"
      />
    </div>
    </div>
  );
};

export default ClubyteLoader;
