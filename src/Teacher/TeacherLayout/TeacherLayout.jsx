import { useState } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Route, Routes } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import teacherSidebar from "../teacherSidebar";


const drawerWidth = 250;

const TeacherLayout = (props) => {
   const { window } = props;
   const [mobileOpen, setMobileOpen] = useState(false);
   const [isClosing, setIsClosing] = useState(false);
   const handleDrawerClose = () => {
      setIsClosing(true);
      setMobileOpen(false);
   };

   const handleDrawerTransitionEnd = () => {
      setIsClosing(false);
   };

   const handleDrawerToggle = () => {
      if (!isClosing) {
         setMobileOpen(!mobileOpen);
      }
   };

   const drawer = <Sidebar sidebar={teacherSidebar} />;
   // Remove this const when copying and pasting into your project.
   const container = window !== undefined ? () => window().document.body : undefined;

   return (
      <Box sx={{ display: "flex", height: "100%" }}>
         <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
               container={container}
               variant="temporary"
               open={mobileOpen}
               onTransitionEnd={handleDrawerTransitionEnd}
               onClose={handleDrawerClose}
               ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
               }}
               sx={{
                  display: { xs: "block", sm: "none" },
                  "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
               }}
            >
               {drawer}
            </Drawer>
            <Drawer
               variant="permanent"
               sx={{
                  display: { xs: "none", sm: "block" },
                  "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
               }}
               open
            >
               {drawer}
            </Drawer>
         </Box>
         <Box
            style={{
               width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
               display: "flex",
               flexGrow: 1,
               flexDirection: "column",
               overflowY: "auto",
            }}
         >
            <Navbar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
            <Box sx={{ flexGrow: 1, overflowY: "auto", backgroundColor: "#f1f4f9" }}>
               <Routes>
                  {teacherSidebar.map(s => {
                     const Element = s.element;
                     return <Route key={s.link}
                        path={s.link}
                        element={< Element />}
                     />
                  })}
               </Routes>
            </Box>
         </Box>
      </Box >
   );
};

export default TeacherLayout;
