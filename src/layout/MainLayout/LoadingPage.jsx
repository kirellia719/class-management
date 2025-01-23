import "./style.scss"

import { CircularProgress } from "@mui/material";

const LoadingPage = () => {
    return <div className="LoadingPage">
        <div className="background"></div>
        <div className="loading">
            <CircularProgress />
        </div>
    </div>
}

export default LoadingPage;