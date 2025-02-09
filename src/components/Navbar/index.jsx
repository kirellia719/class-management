import "./style.scss";
import { Avatar, Breadcrumbs, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import useAuthStore from "../../store/authStore";
import useTitleStore from "../../store/titleStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AvatarPicker from "./AvatarPicker";
import env from "env";

function stringToColor(string) {
   let hash = 0;
   let i;

   /* eslint-disable no-bitwise */
   for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
   }

   let color = "#";

   for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
   }
   /* eslint-enable no-bitwise */

   return color;
}

function stringAvatar(name) {
   const arrName = name.split(" ");
   return {
      sx: {
         bgcolor: stringToColor(name),
      },
      children: `${arrName[0][0]}${arrName[arrName.length - 1][0]}`,
   };
}
const Navbar = ({ drawerWidth = 0, handleDrawerToggle = () => { } }) => {
   const navigate = useNavigate();
   const { user } = useAuthStore();
   const { title, backButton } = useTitleStore();

   const [openAvatar, setOpenAvatar] = useState(false)

   if (!user) return null; // Return null if user is not authenticated
   else
      return (
         <>
            <div
               style={{
                  width: { sm: `calc(100% - ${drawerWidth}px)` },
                  ml: { sm: `${drawerWidth}px` },
               }}
            >
               <AvatarPicker open={openAvatar} onClose={() => setOpenAvatar(false)} />
               <Toolbar className="navbar">
                  <div className="navbar-left">
                     <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                     >
                        <MenuIcon />
                     </IconButton>
                     <Breadcrumbs aria-label="breadcrumb" sx={{ display: { xs: "none", sm: "block" } }}>
                        {backButton && (
                           <IconButton color="primary" onClick={() => navigate(backButton)}>
                              <ArrowBackIosNewRoundedIcon
                                 sx={{ fontSize: 16, display: "flex", alignItems: "center" }}
                              />
                           </IconButton>
                        )}
                        {title ? <b>{title}</b> : " "}
                     </Breadcrumbs>
                  </div>

                  <div className="navbar-right">
                     <div>
                        <Typography className="name">{user.fullname}</Typography>
                        <div className="career">{user.career == 1 ? "Giáo viên" : "Học sinh"}</div>
                     </div>
                     <div onClick={() => setOpenAvatar(true)}>
                        {user.avatar ? <Avatar src={`${env.BE_URL}${user.avatar}`} /> : <Avatar className="avatar" {...stringAvatar(user.fullname)} />}
                     </div>

                  </div>
               </Toolbar>
            </div>
            <Breadcrumbs aria-label="breadcrumb" sx={{ display: { sm: "none" }, backgroundColor: "transparent" }}>
               {backButton && (
                  <IconButton color="primary" onClick={() => navigate(backButton)}>
                     <ArrowBackIosNewRoundedIcon sx={{ fontSize: 16, display: "flex", alignItems: "center" }} />
                  </IconButton>
               )}
               {title ? <b>{title}</b> : " "}
            </Breadcrumbs>
         </>
      );
};

export default Navbar;
