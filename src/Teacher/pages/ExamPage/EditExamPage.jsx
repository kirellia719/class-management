import "./style.scss";
import { useEffect, useState } from "react";
import {
   Button,
   Stack,
   Typography,
   TextField,
   Paper,
   IconButton,
   RadioGroup,
   FormControlLabel,
   Radio,
   Select,
   MenuItem,
   Grid2,
   Box,
   InputLabel,
   FormControl,
   SpeedDial,
   Switch,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { Add, Delete } from "@mui/icons-material";
import useTitleStore from "../../../store/titleStore";
import teacherAPI from "../../teacherAPI";
import { useMutation, useQueryClient } from "react-query";
import LoadingPage from "~/components/LoadingPage";

const answerLabels = ["A", "B", "C", "D"];

const CreateExamPage = () => {
   const { examId } = useParams();
   const queryClient = useQueryClient();
   const navigate = useNavigate();
   const { setTitle, setBackButton } = useTitleStore();

   const [exam, setExam] = useState(null);

   const [questions, setQuestions] = useState([]);
   const [availableCourses, setAvailableCourses] = useState(null);

   useEffect(() => {
      const fetchClasses = async () => {
         try {
            const response = await teacherAPI.getAllCourses();
            setAvailableCourses(response.data);
         } catch (error) {
            console.log(error);
         }
      };

      const fetchExam = async () => {
         try {
            const { data } = await teacherAPI.getExam(examId);
            console.log(data);

            setExam({
               title: "",
               description: "",
               attemptsAllowed: 1,
               shuffleQuestions: false,
               isOpen: false,
               dateClose: null,
               duration: 0,
               course: "",
               ...data,
            });

            setQuestions(data.questions);
         } catch (error) {
            console.log(error);
         }
      };
      fetchExam();
      fetchClasses();
   }, [examId]);

   useEffect(() => {
      setTitle("Sửa bài thi");
      setBackButton("/exams");

      return () => {
         setTitle("");
         setBackButton("");
      };
   }, [setTitle, setBackButton]);

   const { mutate, isLoading } = useMutation({
      mutationFn: async (examData) => {
         const response = await teacherAPI.updateExam(examId, examData);
         return response.data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries("all-exams"); // Làm mới danh sách đề thi nếu cần
      },
      onError: (error) => {
         console.error("Lỗi khi tạo đề thi:", error.response?.data || error.message);
      },
   });

   const handleChange = (e) => {
      setExam({ ...exam, [e.target.name]: e.target.value });
   };

   const handleClassChange = (event) => {
      const {
         target: { value },
      } = event;
      setExam({ ...exam, course: value });
   };

   const handleAddQuestion = () =>
      setQuestions([...questions, { content: "", options: ["", "", "", ""], correctAnswer: 0 }]);

   const handleQuestionChange = (index, field, value) => {
      const newQuestions = [...questions];
      newQuestions[index][field] = value;
      setQuestions(newQuestions);
   };

   const handleOptionChange = (qIndex, optIndex, value) => {
      const newQuestions = [...questions];
      newQuestions[qIndex].options[optIndex] = value;
      setQuestions(newQuestions);
   };

   const handleCorrectAnswerChange = (qIndex, value) => {
      const newQuestions = [...questions];
      newQuestions[qIndex].correctAnswer = parseInt(value);
      setQuestions(newQuestions);
   };

   const handleDeleteQuestion = (index) => {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
   };

   const handleSave = () => {
      const pack = {
         ...exam,
         questions: questions,
      };
      mutate(pack, {
         onSuccess: () => {
            navigate("/exams");
         },
      });
   };

   if (!exam || !availableCourses) {
      return <>Vui lòng chờ</>;
   } else {
      console.log(exam.course, availableCourses);

      const isFormValid = exam.title && exam.duration && questions.length > 0;
      return (
         <>
            <Stack className="CreateExamPage">
               <SpeedDial
                  title="Thêm câu hỏi"
                  ariaLabel="SpeedDial basic example"
                  onClick={handleAddQuestion}
                  sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 9 }}
                  icon={<Add />}
               ></SpeedDial>
               {/* Phần thông tin bài thi */}
               <Box sx={{ padding: 2, m: 0 }}>
                  <Paper sx={{ padding: 2 }}>
                     <Stack spacing={3}>
                        {/* DÒNG 1 */}
                        <Grid2 container alignItems={"center"} justifyContent={"space-between"} spacing={5}>
                           <Grid2 size={{ sm: 2 }}>
                              <Typography sx={{ fontWeight: 500 }}>Tên bài thi</Typography>
                           </Grid2>
                           <Grid2 size={{ sm: 10 }}>
                              <TextField
                                 name="title"
                                 placeholder="Nhập tên đề thi ..."
                                 fullWidth
                                 value={exam.title}
                                 onChange={handleChange}
                              />
                           </Grid2>
                        </Grid2>

                        {/* Dòng 2 */}
                        <Grid2 container justifyContent={"space-between"} alignItems={"center"} spacing={2}>
                           <Grid2 container spacing={2} alignItems={"center"} size={{ sm: 6 }}>
                              <Grid2 size={{ sm: 4 }}>
                                 <Typography sx={{ fontWeight: 500 }}>Thời gian </Typography>
                              </Grid2>
                              <Grid2 size={{ sm: 6 }}>
                                 <TextField
                                    type="number"
                                    placeholder="Nhập số phút ..."
                                    name="duration"
                                    fullWidth
                                    value={exam.duration}
                                    onChange={handleChange}
                                 />
                              </Grid2>
                           </Grid2>
                           <Grid2 container spacing={2} alignItems={"center"} size={{ sm: 6 }}>
                              <Grid2 size={{ sm: 4 }}>
                                 <Typography sx={{ fontWeight: 500 }}>Số lần làm bài</Typography>
                              </Grid2>
                              <Grid2 size={{ sm: 6 }}>
                                 <TextField
                                    type="number"
                                    placeholder="Số lần"
                                    name="attemptsAllowed"
                                    fullWidth
                                    value={exam.attemptsAllowed}
                                    onChange={handleChange}
                                 />
                              </Grid2>
                           </Grid2>
                        </Grid2>

                        {/* Dòng 3 */}
                        <Grid2 container spacing={2}>
                           <Grid2 container size={{ sm: 3 }} spacing={2} alignItems={"center"}>
                              <Grid2>
                                 <Switch
                                    name="isOpen"
                                    checked={exam.isOpen}
                                    onChange={(e) => setExam({ ...exam, isOpen: e.target.checked })}
                                 />
                              </Grid2>
                              <Grid2>
                                 <Typography sx={{ fontWeight: 500 }}>Mở</Typography>
                              </Grid2>
                           </Grid2>
                           <Grid2 container size={{ sm: 3 }} spacing={2} alignItems={"center"}>
                              <Grid2>
                                 <Switch
                                    name="shuffleQuestions"
                                    checked={exam.shuffleQuestions}
                                    onChange={(e) => setExam({ ...exam, shuffleQuestions: e.target.checked })}
                                 />
                              </Grid2>
                              <Grid2>
                                 <Typography sx={{ fontWeight: 500 }}>Đảo câu hỏi</Typography>
                              </Grid2>
                           </Grid2>
                           <Grid2 container size={{ sm: 6 }} spacing={2} alignItems={"center"}>
                              <Grid2 size={{ sm: 4 }}>
                                 <Typography sx={{ fontWeight: 500 }}>Lớp tham gia</Typography>
                              </Grid2>
                              <Grid2 size={{ sm: 8 }}>
                                 {availableCourses && (
                                    <FormControl sx={{ m: 1, width: "100%" }}>
                                       <InputLabel id="demo-simple-select-label">Chọn</InputLabel>
                                       <Select
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          value={exam.course}
                                          label="Khoá học"
                                          onChange={handleClassChange}
                                       >
                                          {availableCourses.map((c) => (
                                             <MenuItem key={`menu-${c._id}`} value={c._id}>
                                                {c.name}
                                             </MenuItem>
                                          ))}
                                       </Select>
                                    </FormControl>
                                 )}
                              </Grid2>
                           </Grid2>
                        </Grid2>

                        {/* Dòng 4 */}
                        <Grid2 container alignItems={"center"} justifyContent={"space-between"} spacing={5}>
                           <Grid2>
                              <Typography sx={{ fontWeight: 500 }}>Mô tả</Typography>
                           </Grid2>
                           <Grid2 sx={{ flex: 1 }}>
                              <TextField
                                 name="description"
                                 placeholder="Thông báo"
                                 fullWidth
                                 value={exam.description}
                                 onChange={handleChange}
                              />
                           </Grid2>
                        </Grid2>
                     </Stack>
                  </Paper>
               </Box>
               {/* Phần danh sách câu hỏi */}
               <Box className="quiz-header" sx={{ padding: 2 }}>
                  <Paper sx={{ padding: 2 }}>
                     <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Số lượng ({questions.length})</Typography>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                           <Button variant="outlined" onClick={() => navigate("/exams")}>
                              Hủy
                           </Button>
                           <Button variant="contained" color="primary" onClick={handleSave} disabled={!isFormValid}>
                              Cập nhật
                           </Button>
                        </Stack>
                     </Stack>
                  </Paper>
               </Box>
               <Box sx={{ p: 2 }}>
                  <Stack spacing={2} sx={{ p: 2 }}>
                     {questions.map((q, index) => (
                        <Paper key={index} sx={{ p: 2 }}>
                           <Stack spacing={2}>
                              <Grid2 container justifyContent={"space-between"} alignItems={"center"}>
                                 <h1>Câu hỏi {index + 1}:</h1>
                                 <IconButton color="error" onClick={() => handleDeleteQuestion(index)}>
                                    <Delete />
                                 </IconButton>
                              </Grid2>
                              <TextField
                                 multiline
                                 fullWidth
                                 value={q.content}
                                 placeholder="Nhập câu hỏi"
                                 onChange={(e) => handleQuestionChange(index, "content", e.target.value)}
                              />
                              <Stack spacing={2}>
                                 <h1>Lựa chọn:</h1>
                                 <RadioGroup
                                    value={q.correctAnswer}
                                    onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                                    sx={{ paddingLeft: 3, display: "flex", gap: 2 }}
                                 >
                                    {q.options.map((option, optIndex) => (
                                       <Stack direction="row" alignItems="center" key={optIndex}>
                                          <FormControlLabel
                                             value={optIndex}
                                             control={<Radio />}
                                             label={`${answerLabels[optIndex]}`}
                                          />
                                          <TextField
                                             placeholder={`...`}
                                             fullWidth
                                             value={option}
                                             onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                          />
                                       </Stack>
                                    ))}
                                 </RadioGroup>
                              </Stack>
                           </Stack>
                        </Paper>
                     ))}
                  </Stack>
               </Box>
               {/* Nút lưu bài thi */}
            </Stack>
            {isLoading ? <LoadingPage /> : null}
         </>
      );
   }
};

export default CreateExamPage;
