import "./style.scss";
import { AppBar, Avatar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import useAuthStore from "../../store/authStore";
const Navbar = ({ drawerWidth = 0, handleDrawerToggle = () => { } }) => {
    const { user } = useAuthStore();


    if (!user) return null; // Return null if user is not authenticated

    else return <AppBar
        position="fixed"
        sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: "white",
            color: '#000'
        }}
    >
        <Toolbar className="navbar">
            <div className="navbar-left">
                {" "}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
            </div>


            <div className="navbar-right">
                <div>
                    <Typography className="name">
                        {user.fullname}
                    </Typography>
                    <div className="career">{user.career == 1 ? "Giáo viên" : "Học sinh"}</div>
                </div>
                <Avatar src="logo.jpg" className="avatar" />


            </div>
        </Toolbar>
    </AppBar>
}

export default Navbar;