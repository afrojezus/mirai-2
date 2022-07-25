import { ButtonBase, ButtonBaseProps, SxProps, Theme } from "@mui/material";

export default (props: ButtonBaseProps & { bsx?: (theme: Theme) => any; }) => <ButtonBase sx={(theme) => ({
    background: theme.palette.primary.main,
    p: 1,
    borderRadius: 1,
    color: theme.palette.text.secondary,
    fontSize: theme.typography.button,
    textTransform: 'none',
    ...(props.bsx && props.bsx(theme))
})} {...props} onClick={props.onClick}>{props.children}</ButtonBase>;