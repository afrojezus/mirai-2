import { Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SafeArea from "../common/components/SafeArea";
import { useAppDispatch, useAppSelector } from "../common/hooks";
import { miniturizePlayer, showPlayer } from "../features/player/playerSlice";

export default () => {
    return <SafeArea transparent>
    </SafeArea>;
};