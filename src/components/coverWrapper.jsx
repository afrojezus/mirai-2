import React, { useState } from "react";
import classnames from "classnames";
import { Fade, Paper } from "@material-ui/core";
import { Movie } from "@material-ui/icons";

const CoverWrapper = ({ src, className, big = false, ...props }) => {
    const [img, setImg] = useState(src);
    const onError = () => setImg(undefined);
    return <Paper className={classnames("loadIn", className)} style={{ display: "flex", height: big ? 210 : undefined, width: big ? undefined : 64, position: "relative" }}>
        <img alt="" src={img ? img : undefined} style={{
            width: "100%",
            height: "100%",
            maxHeight: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            margin: "auto",
            opacity: img ? 1 : 0
        }} onError={onError} />
        <Fade in={!img}><Movie style={{ margin: "auto", color: "white", pointerEvents: "none", zIndex: 10, transform: big ? "scale(4)" : undefined }} /></Fade>
    </Paper>;
};

export default CoverWrapper;