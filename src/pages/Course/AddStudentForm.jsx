import { useState } from "react";
import { TextField, Button, Box, RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "react-query";

import api from "api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AddStudentForm = ({ onClose }) => {
   const { courseId } = useParams();
   const queryClient = useQueryClient();

   const mutation = useMutation((newData) => api.post(`/student/${courseId}`, newData), {
      onSuccess: () => {
         // Refetch data after a successful create
         queryClient.invalidateQueries("list-student");
         toast.success("Thêm học viên thành công", { autoClose: 2000 });
         onClose && onClose();
      },
   });

   const [formData, setFormData] = useState({
      name: "",
      gender: "male",
      dateOfBirth: null,
      phone: "",
   });

   const [errors, setErrors] = useState({
      name: "",
      gender: "",
      dateOfBirth: "",
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
         name: "",
         gender: "",
         dateOfBirth: "",
      };

      if (!formData.name.trim()) {
         newErrors.name = "Họ và tên là bắt buộc.";
         isValid = false;
      }

      if (!formData.gender) {
         newErrors.gender = "Giới tính là bắt buộc.";
         isValid = false;
      }

      if (!formData.dateOfBirth) {
         newErrors.dateOfBirth = "Ngày sinh là bắt buộc.";
         isValid = false;
      } else {
         const date = new Date(formData.dateOfBirth);
         if (date == "Invalid Date") {
            newErrors.dateOfBirth = "Ngày sinh chưa đúng.";
            isValid = false;
         }
      }

      setErrors(newErrors);

      if (isValid) {
         const pack = {
            fullname: formData.name,
            male: formData.gender === "male" ? true : false,
            birthday: formData.dateOfBirth,
         };
         mutation.mutate(pack);
      }
   };

   return (
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
               value={formData.name}
               onChange={(e) => handleChange("name", e.target.value)}
               error={!!errors.name}
               helperText={errors.name}
               fullWidth
               autoComplete={"false"}
            />

            {/* DatePicker với validation */}
            <DatePicker
               label="Ngày sinh"
               value={formData.dateOfBirth}
               onChange={(newValue) => handleChange("dateOfBirth", newValue)}
               format="DD/MM/YYYY"
               minDate={dayjs("2000-01-01")}
            />
            {errors.dateOfBirth && (
               <Typography color="error" variant="body2">
                  {errors.dateOfBirth}
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
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  sx={{
                     display: "flex",
                     alignItems: "center",
                     height: "100%",
                     gap: 2,
                  }}
               >
                  <FormControlLabel
                     value="male"
                     control={<Radio />}
                     label="Nam"
                     sx={{
                        margin: 0,
                     }}
                  />
                  <FormControlLabel
                     value="female"
                     control={<Radio />}
                     label="Nữ"
                     sx={{
                        margin: 0,
                     }}
                  />
               </RadioGroup>
            </Box>
            {errors.gender && (
               <Typography color="error" variant="body2">
                  {errors.gender}
               </Typography>
            )}

            <Button variant="contained" color="primary" type="submit">
               Gửi thông tin
            </Button>
         </Box>
      </LocalizationProvider>
   );
};

export default AddStudentForm;
