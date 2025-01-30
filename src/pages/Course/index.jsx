import "./style.scss";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState } from "react";
import ListStudent from "./ListStudent";

function CustomTabPanel(props) {
   const { children, value, index, ...other } = props;

   return (
      <div
         role="tabpanel"
         hidden={value !== index}
         id={`simple-tabpanel-${index}`}
         aria-labelledby={`simple-tab-${index}`}
         {...other}
      >
         {value === index && <>{children}</>}
      </div>
   );
}

function a11yProps(index) {
   return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
   };
}

export default function BasicTabs() {
   const [value, setValue] = useState(0);

   const handleChange = (event, newValue) => {
      setValue(newValue);
   };

   return (
      <div className="Course">
         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
               value={value}
               onChange={handleChange}
               aria-label="basic tabs example"
               variant="scrollable"
               scrollButtons
               allowScrollButtonsMobile
            >
               <Tab label="Danh sách học sinh" {...a11yProps(0)} />
               <Tab label="Item Two" {...a11yProps(1)} />
               <Tab label="Item Three" {...a11yProps(2)} />
            </Tabs>
         </Box>
         <CustomTabPanel value={value} index={0} className="course-panel">
            <ListStudent />
         </CustomTabPanel>
         <CustomTabPanel value={value} index={1} className="course-panel">
            Item Two
         </CustomTabPanel>
         <CustomTabPanel value={value} index={2} className="course-panel">
            Item Three
         </CustomTabPanel>
      </div>
   );
}
