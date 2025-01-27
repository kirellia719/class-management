import "./style.scss";
import { Avatar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import useAuthStore from "../../store/authStore";
const Navbar = ({ drawerWidth = 0, handleDrawerToggle = () => { } }) => {
    const { user } = useAuthStore();


    if (!user) return null; // Return null if user is not authenticated

    else return <div
        style={{
            zIndex: 10,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: "white",
            color: '#000',
            boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'
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
                <Avatar src="/logo.jpg" className="avatar" />


            </div>
        </Toolbar>
    </div>
}

export default Navbar;