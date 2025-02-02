import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { TextField, Box, RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "react-query";

import teacherAPI from "../../teacherAPI";

const ModalUpdateStudent = ({ open, onClose, student }) => {
   const queryClient = useQueryClient();

   const mutation = useMutation((newData) => teacherAPI.updateStudent(student.id, newData), {
      onSuccess: () => {
         // Refetch data after a successful create
         queryClient.invalidateQueries("list-student");
         toast.success("Đã cập nhật", { autoClose: 2000 });
         onClose && onClose();
      },
   });

   const [formData, setFormData] = useState({
      fullname: student.fullname,
      male: student.male,
      birthday: dayjs(student.birthday),
      phone: student.phone || "",
   });

   const [errors, setErrors] = useState({
      fullname: "",
      birthday: "",
   });

   const handleChange = (field, value) => {
      setFormData((prev) => ({
         ...prev,
         [field]: value,
      }));

      // Xóa lỗi khi người dùng chỉnh sửa
      if (errors[field]) {
         setErrors((prev) => ({ ...prev, [field]: "" }));
      }
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      // Kiểm tra lỗi
      let isValid = true;
      const newErrors = {
         fullname: "",
         male: "",
         birthday: "",
      };

      if (!formData.fullname.trim()) {
         newErrors.fullname = "Họ và tên là bắt buộc.";
         isValid = false;
      }

      if (!formData.birthday) {
         newErrors.birthday = "Ngày sinh là bắt buộc.";
         isValid = false;
      } else {
         const date = new Date(formData.birthday);
         if (date == "Invalid Date") {
            newErrors.birthday = "Ngày sinh chưa đúng.";
            isValid = false;
         }
      }

      setErrors(newErrors);

      if (isValid) {
         const pack = {
            fullname: formData.fullname,
            male: formData.male,
            birthday: formData.birthday,
            phone: formData.phone,
         };

         mutation.mutate(pack);
      }
   };

   return (
      <Dialog open={!!open} onClose={onClose}>
         <DialogTitle>Cập nhật thông tin học viên</DialogTitle>
         <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
               component="form"
               onSubmit={handleSubmit}
               sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  maxWidth: 400,
                  margin: "auto",
                  p: 1,
               }}
            >
               <TextField
                  label="Họ và tên"
                  value={formData.fullname}
                  onChange={(e) => handleChange("fullname", e.target.value)}
                  error={!!errors.fullname}
                  helperText={errors.fullname}
                  fullWidth
                  autoComplete={"false"}
               />

               {/* DatePicker với validation */}
               <DatePicker
                  label="Ngày sinh"
                  value={formData.birthday}
                  onChange={(newValue) => handleChange("birthday", newValue)}
                  format="DD/MM/YYYY"
                  minDate={dayjs("2000-01-01")}
               />
               {errors.birthday && (
                  <Typography color="error" variant="body2">
                     {errors.birthday}
                  </Typography>
               )}
               <TextField
                  type="tel"
                  label="Số điện thoại"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  slotProps={{
                     pattern: "^[0-9]{10}$", // Pattern kiểm tra 10 chữ số
                     title: "Số điện thoại phải bao gồm 10 chữ số",
                  }}
                  fullWidth
                  autoComplete={"false"}
               />

               <Box
                  sx={{
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "space-between",
                     gap: 2,
                     paddingLeft: 2,
                     paddingRight: 2,
                  }}
               >
                  <Typography
                     sx={{
                        whiteSpace: "nowrap",
                        fontSize: "1rem",
                        color: "#555",
                     }}
                  >
                     Giới tính
                  </Typography>
                  <RadioGroup
                     row
                     value={formData.male}
                     onChange={(e) => handleChange("male", e.target.value)}
                     sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        gap: 2,
                     }}
                  >
                     <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label="Nam"
                        sx={{
                           margin: 0,
                        }}
                     />
                     <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label="Nữ"
                        sx={{
                           margin: 0,
                        }}
                     />
                  </RadioGroup>
               </Box>

               <DialogActions>
                  <Button onClick={onClose} color="secondary">
                     Hủy
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                     Cập nhật
                  </Button>
               </DialogActions>
            </Box>
         </LocalizationProvider>
      </Dialog>
   );
};

export default ModalUpdateStudent;
