import { TextField, Box, Button, Dialog, DialogActions, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMutation } from "react-query";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import teacherAPI from "teacher-api";

const ModalPassword = ({ open, onClose, student }) => {
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState("");

   const mutation = useMutation((newData) => teacherAPI.changePasswordStudent(student.id, newData), {
      onSuccess: () => {
         // Refetch data after a successful create
         toast.success("Đã đổi mật khẩu", { autoClose: 2000 });
         onClose && onClose();
      },
   });

   const [formData, setFormData] = useState({
      password: "",
      confirmPassword: "",
   });

   const handleChange = (field, value) => {
      setError("");
      setFormData((prev) => ({
         ...prev,
         [field]: value,
      }));
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.password != formData.confirmPassword) {
         setError("Mật khẩu không khớp");
         return;
      } else {
         setError("");
         mutation.mutate({ password: formData.password });
         onClose && onClose();
      }
   };

   return (
      <Dialog open={!!open} onClose={onClose}>
         <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 600 }}>Đổi mật khẩu</div>
            <div
               onClick={() => setShowPassword(!showPassword)}
               style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
               {showPassword ? <VisibilityOff /> : <Visibility />}
            </div>
         </DialogTitle>
         <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
               component="form"
               onSubmit={handleSubmit}
               sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minWidth: 300,
                  margin: "auto",
                  paddingX: 2,
               }}
            >
               <TextField
                  label="Tên đăng nhập"
                  variant="filled"
                  value={student?.username}
                  readOnly
               // sx={{ paddingX: 1 }}
               />
               <TextField
                  label="Mật khẩu mới"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
               />
               <TextField
                  label="Nhập lại mật khẩu"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
               />

               {error && (
                  <Typography color="error" variant="body2">
                     {error}
                  </Typography>
               )}

               <DialogActions>
                  <Button onClick={onClose}>Hủy</Button>
                  <Button variant="contained" type="submit">
                     Đổi
                  </Button>
               </DialogActions>
            </Box>
         </LocalizationProvider>
      </Dialog>
   );
};

export default ModalPassword;
