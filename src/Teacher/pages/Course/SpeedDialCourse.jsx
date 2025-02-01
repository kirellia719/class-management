import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";

import ModalAddStudent from "./ModalAddStudent";

const SpeedDialCourse = () => {
   const actions = [
      { icon: <FileCopyIcon />, name: "Upload", onClick: () => setImportModal(true) },
      { icon: <SaveIcon />, name: "Save" },
   ];

   const [importModal, setImportModal] = useState(false);

   return (
      <>
         <SpeedDial
            ariaLabel="SpeedDial openIcon example"
            sx={{ position: "absolute", bottom: 16, right: 16 }}
            icon={<SpeedDialIcon openIcon={<EditIcon />} />}
         >
            {actions.map((action) => (
               <SpeedDialAction
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.name}
                  onClick={action.onClick}
               />
            ))}
         </SpeedDial>

         <ModalAddStudent open={importModal} onClose={() => setImportModal(false)} />
      </>
   );
};

export default SpeedDialCourse;
