import { IconButton, InputBase, Paper, PaperProps } from "@mui/material";
import * as Icons from '@mui/icons-material';
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";


export default (props: PaperProps) => {
    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const onChange = useCallback((e) => setValue(e.target.value), [value]);
    const onSubmit = useCallback((e) => {
        e.preventDefault();
        navigate(`explore?q=${value}`);
    }, [value]);

    return <Paper {...props} style={{ borderRadius: 99 }} elevation={0}>
        <form style={{ display: 'inline-flex' }} onSubmit={onSubmit}>
            <InputBase sx={{ pl: 2 }} onChange={onChange} value={value} fullWidth placeholder="Search anime" />
            <IconButton>
                <Icons.Search />
            </IconButton>
        </form>
    </Paper>
}