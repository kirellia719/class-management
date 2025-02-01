import { useState } from "react";
import { DialogContent, DialogTitle, Dialog, Tab, Tabs } from "@mui/material";

import AddStudentForm from "./AddStudentForm";
import ModalImportStudent from "./ModalImportStudent";

export default function ModalAddStudent({ open, onClose }) {
   const [value, setValue] = useState(1);

   const handleChange = (e, newValue) => {
      setValue(newValue);
   };
   return (
      <Dialog
         open={open}
         onClose={onClose}
         aria-labelledby="dialog-add-student-title"
         aria-describedby="dialog-add-student"
      >
         <DialogTitle id="dialog-add-student-title">
            <Tabs value={value} onChange={handleChange} centered>
               <Tab label="Thêm học sinh" value={1} />
               <Tab label="Thêm bằng Excel" value={2} />
            </Tabs>
         </DialogTitle>
         <DialogContent>
            {value == 1 && <AddStudentForm onClose={onClose} />}
            {value == 2 && <ModalImportStudent onClose={onClose} />}
         </DialogContent>
      </Dialog>
   );
}
