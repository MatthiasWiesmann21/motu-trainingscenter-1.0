import React from 'react';

interface AppSVGIconProps {
    icon: string;
    customclass: string;
}

const AppSVGIcon: React.FC<AppSVGIconProps> = ({ icon, customclass }) => {
    return (
        <img
            className={`${customclass} max-w-fit`}
            src={`/icons/${icon}.svg`}
            alt={icon}
            width={24}
            height={24}
            style={{ width: '24px', height: '24px' }}
        />
    );
};

export default AppSVGIcon;
