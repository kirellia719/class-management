import "./style.scss";

import {
   Button,
   Stack,
   Typography,
   IconButton,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogContentText,
   DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import teacherAPI from "../../teacherAPI";
import LoadingPage from "~/components/LoadingPage";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";

const ExamPage = () => {
   const navigate = useNavigate();
   const {
      data: exams,
      isLoading,
      isError,
   } = useQuery("all-exams", async () => {
      const { data } = await teacherAPI.getAllExams();
      return data;
   });

   const [deleteExam, setDeleteExam] = useState(null);

   const handleDeleteExam = async () => {
      mutate(deleteExam._id);
      setDeleteExam(null);
   };

   const { mutate } = useMutation(async (examId) => {
      const response = await teacherAPI.deleteExam(examId);
      console.log(response);
   }, {});

   if (isLoading) return <LoadingPage />;
   if (isError) return <p>Lỗi khi tải dữ liệu</p>;

   const columns = [
      {
         field: "stt",
         headerName: "STT",
         resizable: false,
      },
      { field: "title", headerName: "Tên bài thi", flex: 1, resizable: false },
      {
         field: "numquestions",
         headerName: "Số câu hỏi",
         width: 150,
         resizable: false,
         renderCell: (params) => <div style={{}}>{params.row.questions.length}</div>,
      },
      { field: "duration", headerName: "Thời gian (phút)", width: 150, resizable: false },
      {
         field: "actions",
         headerName: "Hành động",
         resizable: false,
         width: 150,
         renderCell: (params) => (
            <Stack direction="row" spacing={1}>
               <IconButton color="primary">
                  <Visibility />
               </IconButton>
               <IconButton color="warning" onClick={() => navigate(`/exams/${params.row._id}/edit`)}>
                  <Edit />
               </IconButton>
               <IconButton color="error" onClick={() => setDeleteExam(params.row)}>
                  <Delete />
               </IconButton>
            </Stack>
         ),
      },
   ];

   const rows = exams.map((exam, index) => ({ ...exam, id: exam._id, stt: index + 1 })); // Add actions column to rows

   return (
      <div className="ExamPage">
         {deleteExam && (
            <Dialog open={!!deleteExam} onClose={() => setDeleteExam(null)}>
               <DialogTitle>{"Thông báo xác nhận"}</DialogTitle>
               <DialogContent>
                  <DialogContentText>
                     Bạn chắc chắn xóa <b>{deleteExam.title}</b> chứ?
                  </DialogContentText>
               </DialogContent>
               <DialogActions>
                  <Button onClick={() => setDeleteExam(null)}>Hủy</Button>
                  <Button onClick={() => handleDeleteExam(deleteExam._id)} color="error" variant="contained" autoFocus>
                     Xóa
                  </Button>
               </DialogActions>
            </Dialog>
         )}
         <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
               <Typography variant="h5">Danh sách bài thi</Typography>
               <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="primary" onClick={() => navigate("/exams/create")}>
                     Thêm bài thi
                  </Button>
                  {/* <Button variant="outlined">Xuất file</Button>
                    <Button variant="outlined">Lọc dữ liệu</Button> */}
               </Stack>
            </Stack>

            {/* Table */}
            <div style={{ width: "100%" }}>
               <DataGrid
                  rows={rows}
                  columns={columns}
                  res
                  sx={{
                     height: "100%",
                     // "& .MuiDataGrid-columnSeparator": {
                     //    borderRight: "1px solid #ccc", // Định dạng border
                     // },
                     // "& .MuiDataGrid-cell": {
                     //    borderRight: "1px solid #ccc" /* Border phải giữa các cột */,
                     // },
                  }}
               />
            </div>
         </Stack>
      </div>
   );
};

export default ExamPage;
