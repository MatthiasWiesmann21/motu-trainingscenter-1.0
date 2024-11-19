import React from 'react';
import Image from 'next/image';

const AppSVG = ({ svg, customclass }: { svg: string, customclass: string }) => {
    const svgPath = `../assets/svg/${svg}.svg`;
    const svgImport = require(`../assets/svg/${svg}.svg`) as string;


    return (
        <Image className={`${customclass} max-w-fit`} src={svgImport} alt={svg} />
    );
};

export default AppSVG;
