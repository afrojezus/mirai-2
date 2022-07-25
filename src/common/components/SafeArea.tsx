import { Box, useMediaQuery } from "@mui/material";
import { ReactNode } from "react";

interface SafeArea {
    children: ReactNode;
    disableGutters?: boolean;
    top?: ReactNode;
    disableVerticalGutter?: boolean;

    transparent?: boolean;
}

/**
 * SafeArea - the main content of the UI chrome
 * children (required) - content within the safe area
 * disableGutters - disable guttering between layout elements and the children
 * top - content between app bar and the rest of the safe area
 */
export default ({ children, disableGutters = false, top = null, disableVerticalGutter = false, transparent = false }: SafeArea) => {
    const isMobile = useMediaQuery('(max-width: 480px)');
    return <Box sx={(theme) => ({
        ...(top ? {
            padding: 0
        } : { padding: disableGutters ? 0 : 2, pt: disableVerticalGutter ? 0 : undefined }),
        marginTop: `${(theme.mixins.toolbar.minHeight as number) + (isMobile ? 0 : 8)}px`,
        marginLeft: isMobile ? 0 : 9,
        marginBottom: isMobile ? `${(theme.mixins.toolbar.minHeight as number)}px` : undefined,
        display: 'inline-flex',
        flexFlow: 'column nowrap',
        background: transparent ? 'transparent' : theme.palette.background.paper,
        borderTopLeftRadius: isMobile ? 0 : theme.shape.borderRadius,
        flex: 1,
        overflowY: 'scroll',
        minHeight: 'inherit',
        maxHeight: 'inherit',
        overflowX: 'hidden'
    })}>
        {top}
        {top ? <Box sx={{ display: 'inherit', flexFlow: 'inherit' }}>{children}</Box> : children}
    </Box>;
};