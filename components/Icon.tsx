'use client';

import { ComponentPropsWithoutRef } from 'react';

import { ICON_FACTORY, Icons } from '@/constants/icon';

type IconProps = ComponentPropsWithoutRef<'svg'> & {
    type: Icons;
    color?: string;
    customClassName?: string;
};

const Icon = ({ type, color, customClassName, ...props }: IconProps) => {
    const SvgIcon = ICON_FACTORY[type];

    return <SvgIcon fill={color} className={customClassName} {...props} />;
};

export default Icon;
