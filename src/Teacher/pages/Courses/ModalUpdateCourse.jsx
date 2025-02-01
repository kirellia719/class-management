import { Box, Button, Dialog, DialogActions, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import teacherAPI from "teacher-api";
import { useQueryClient } from "react-query";

const ModalUpdateCourse = ({ item, open, onClose }) => {
   const queryClient = useQueryClient();
   const [name, setName] = useState(item.name);

   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const handleNameChange = (e) => {
      setError("");
      setName(e.target.value);
   };

   const confirmUpdate = async (e) => {
      // Call API update course
      e.preventDefault();
      setLoading(true);
      try {
         await teacherAPI.updateCourse(item._id, { name });
         queryClient.invalidateQueries("courses");
         onClose && onClose();
      } catch (error) {
         console.error("Lỗi update khóa học:", error);
         setError(error.response?.data?.message || "Cập nhật khóa học thất bại");
      }

      setLoading(false);
   };
   return (
      <Dialog
         open={open}
         onClose={onClose}
         aria-labelledby="dialog-update-course-title"
         aria-describedby="dialog-update-course-description"
         PaperProps={{
            component: "form",
            onSubmit: confirmUpdate,
         }}
      >
         <DialogTitle id="dialog-update-course-title">Cập nhật</DialogTitle>

         <Box sx={{ padding: 2, minWidth: 250 }}>
            <TextField
               fullWidth
               label={"Tên khóa học"}
               value={name}
               onChange={handleNameChange}
               error={!!error}
               helperText={error ? error : ""}
            />
         </Box>

         <DialogActions>
            <Button onClick={onClose}>Hủy</Button>
            <Button
               onClick={confirmUpdate}
               type="submit"
               variant="contained"
               disabled={item.name == name || !name}
               loading={loading}
            >
               Đồng ý
            </Button>
         </DialogActions>
      </Dialog>
   );
};

export default ModalUpdateCourse;
