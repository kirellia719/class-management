import "./style.scss";
import { Avatar, Breadcrumbs, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import useAuthStore from "../../store/authStore";
import useTitleStore from "../../store/titleStore";
import { useNavigate } from "react-router-dom";
const Navbar = ({ drawerWidth = 0, handleDrawerToggle = () => { } }) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { title, backButton } = useTitleStore();

    if (!user) return null; // Return null if user is not authenticated

    else return <>
        <div
            style={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
            }}
        >
            <Toolbar className="navbar">
                <div className="navbar-left">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {backButton &&
                            <IconButton color="primary" onClick={() => navigate(backButton)}><ArrowBackIosNewRoundedIcon sx={{ fontSize: 16, display: 'flex', alignItems: 'center' }} /></IconButton>

                        }
                        {title ? <b>{title}</b> : " "}
                    </Breadcrumbs>
                </div>


                <div className="navbar-right">
                    <div>
                        <Typography className="name">
                            {user.fullname}
                        </Typography>
                        <div className="career">{user.career == 1 ? "Giáo viên" : "Học sinh"}</div>
                    </div>
                    <Avatar src="/logo.jpg" className="avatar" />


                </div>

            </Toolbar>
        </div>
        <Breadcrumbs aria-label="breadcrumb" sx={{ display: { sm: 'none' }, backgroundColor: "transparent" }}>
            {backButton &&
                <IconButton color="primary" onClick={() => navigate(backButton)}><ArrowBackIosNewRoundedIcon sx={{ fontSize: 16, display: 'flex', alignItems: 'center' }} /></IconButton>
            }
            {title ? <b>{title}</b> : " "}
        </Breadcrumbs>
    </>
}

export default Navbar;