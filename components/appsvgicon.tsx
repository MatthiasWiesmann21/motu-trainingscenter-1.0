import React from 'react';
import Image from 'next/image';

const AppSVGIcon = ({ icon, customclass }: { icon: string, customclass: string }) => {
    const iconImport = require(`../assets/icons/${icon}.svg`) as string;

    return (
        <Image className={`${customclass} max-w-fit`} src={iconImport} alt={icon} width={24} height={24} />
    );
};

export default AppSVGIcon;
