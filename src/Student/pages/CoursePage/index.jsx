import {
   Box,
   Typography,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   Button,
} from "@mui/material";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import studentAPI from "../../studentAPI";
import useTitleStore from "../../../store/titleStore";
import { useEffect } from "react";
import LoadingPage from "../../../components/LoadingPage";

const AssignmentsPage = () => {
   const { courseId } = useParams();

   const {
      data: exams,
      error,
      isLoading,
   } = useQuery("exams-in-course", async () => {
      const response = await studentAPI.getAllExamsInCourse(courseId);
      return response.data;
   });

   const { setTitle, setBackButton } = useTitleStore();

   useEffect(() => {
      setTitle("Danh sách đề");
      setBackButton("/");

      return () => {
         setTitle("");
         setBackButton("");
      };
   }, []);

   if (isLoading) {
      return <LoadingPage />;
   } else
      return (
         <Box sx={{ width: "100%", p: 3 }}>
            {error && <Typography color="error">{error.message}</Typography>}

            {exams && (
               <TableContainer component={Paper}>
                  <Table>
                     <TableHead>
                        <TableRow>
                           <TableCell>STT</TableCell>
                           <TableCell>Tên bài tập</TableCell>
                           <TableCell align="center">Thời gian</TableCell>
                           <TableCell align="center">Số lần làm</TableCell>
                           <TableCell align="center">Điểm cao nhất</TableCell>
                           <TableCell align="center">Trạng thái</TableCell>
                           <TableCell align="center"></TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {exams.map((exam, index) => (
                           <TableRow key={exam._id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{exam.title}</TableCell>
                              <TableCell align="center">{exam.duration}</TableCell>
                              <TableCell align="center">{`${exam.attempts}/${exam.attemptsAllowed}`}</TableCell>
                              <TableCell align="center">
                                 {exam.maxScoreSubmission ? exam.maxScoreSubmission : !exam.attempts ? "Chưa có" : 0}
                              </TableCell>
                              <TableCell align="center">{exam.isOpen ? "Đang mở" : "Đã khoá"}</TableCell>
                              <TableCell align="center">
                                 {
                                    <Link to={`/exam/${exam._id}`}>
                                       <Button>Xem</Button>
                                    </Link>
                                 }
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>
            )}
         </Box>
      );
};

export default AssignmentsPage;
