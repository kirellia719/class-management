import "./style.scss"

import { Avatar, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';

import sidebar from "../../utils/sidebar";
import useAuthStore from "../../store/authStore";

const Sidebar = () => {
    const location = useLocation().pathname;
    const navigate = useNavigate();

    const { logout } = useAuthStore();

    const handleLogout = () => {
        // Logout logic here
        logout();
    };
    return <div className="sidebar">
        <Toolbar className="sidebar-header" onClick={() => navigate("/")}>
            <Avatar src="logo.jpg" alt="Class" />
            <div className="webname">Youth</div>
        </Toolbar>
        <Divider />
        <List className="siderbar-body">
            {sidebar.map((item) => {
                const Icon = item.icon;
                return (
                    <ListItem key={item.id} disablePadding onClick={() => navigate(item.link)} className={`nav-item ${location == item.link ? "active" : ""}`}>
                        <ListItemButton>
                            <ListItemIcon className="nav-icon">
                                <Icon />
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
        <Divider />
        <div className="sidebar-footer">
            <ListItem onClick={handleLogout}>
                <ListItemButton>
                    <ListItemIcon>
                        <LogoutIcon className="logout-icon" />
                    </ListItemIcon>
                    <ListItemText primary={"Đăng xuất"} />
                </ListItemButton>
            </ListItem>
        </div>
    </div>
}

export default Sidebar;