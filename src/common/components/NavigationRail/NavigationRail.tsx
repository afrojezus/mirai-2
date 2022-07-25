// Try to cater to the Material design spec on desktop screen sizes
// Based on this demo: https://codesandbox.io/s/navigation-rail-demo-ub1s9?file=%2FNavigationRail.tsx

import React from "react";
import { BottomNavigation } from "@mui/material";
import type { BottomNavigationProps } from "@mui/material";

interface NavigationRailProps extends BottomNavigationProps {
    disableDivider?: boolean;
}

const NavigationRail: React.FC<NavigationRailProps> = ({
    disableDivider = false,
    className,
    ...props
}) => {
    return (
        <BottomNavigation
            {...props}
            sx={(theme) => ({
                flexDirection: "column",
                justifyContent: "flex-start",
                position: 'fixed',
                background: 'transparent',
                top: 0,
                left: 0,
                bottom: 0,
                width: 72,
                height: "unset",
                boxSizing: 'border-box',
                padding: `${theme.spacing(1)} 0px`,
                ...(!disableDivider && {
                    borderRight: `1px solid ${theme.palette.divider}`
                })
            })}

        />
    );
};

export default NavigationRail;