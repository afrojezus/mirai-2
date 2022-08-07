
import React, { useState } from "react";
import { Avatar } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";

const AvatarWrapper = ({ src, imgProps, ...props }) => {
    const [img, setImg] = useState(src);
    const onError = () => setImg(undefined);
    return <Avatar {...props} src={img ? img : undefined} imgProps={{ onError, ...imgProps }}>
        {!img && <AccountCircle />}
    </Avatar>;
};

export default AvatarWrapper;