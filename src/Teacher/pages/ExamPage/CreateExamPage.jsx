import "./style.scss"
import { useEffect, useState } from "react";
import { Button, Stack, Typography, TextField, Paper, IconButton, RadioGroup, FormControlLabel, Radio, Select, MenuItem, Grid2, Box, InputLabel, OutlinedInput, Chip, useTheme, FormControl, SpeedDial } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Add, Delete } from "@mui/icons-material";
import useTitleStore from "../../../store/titleStore";
import teacherAPI from "teacher-api";
import { useMutation, useQueryClient } from "react-query";
import LoadingPage from "~/components/LoadingPage";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
function getStyles(name, personName, theme) {
    return {
        fontWeight: personName.includes(name)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

const answerLabels = ["A", "B", "C", "D"];

const CreateExamPage = () => {
    const queryClient = useQueryClient();
    const theme = useTheme();
    const navigate = useNavigate();
    const { setTitle, setBackButton } = useTitleStore();

    const [exam, setExam] = useState({ title: "", duration: "", classes: [], questions: [] });
    const [availableClasses, setAvailableClasses] = useState([]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await teacherAPI.getAllCourses();

                setAvailableClasses(response.data);
            } catch (error) {
                console.log(error);

            }
        }
        fetchClasses();
    }, []);

    useEffect(() => {
        setTitle("Tạo bài thi");
        setBackButton("/exams");

        return () => {
            setTitle("");
            setBackButton("");
        }
    }, [setTitle, setBackButton])


    const { mutate, isLoading } = useMutation({
        mutationFn: async (examData) => {
            const response = await api.createExam(examData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["exams"]); // Làm mới danh sách đề thi nếu cần
        },
        onError: (error) => {
            console.error("Lỗi khi tạo đề thi:", error.response?.data || error.message);
        }
    });


    const handleChange = (e) => setExam({ ...exam, [e.target.name]: e.target.value });


    const handleClassChange = (event) => {
        const { target: { value } } = event;
        setExam({ ...exam, classes: typeof value === 'string' ? value.split(',') : value, });
    };

    const handleAddQuestion = () => setExam({ ...exam, questions: [...exam.questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }] });


    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...exam.questions];
        newQuestions[index][field] = value;
        setExam({ ...exam, questions: newQuestions });
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const newQuestions = [...exam.questions];
        newQuestions[qIndex].options[optIndex] = value;
        setExam({ ...exam, questions: newQuestions });
    };

    const handleCorrectAnswerChange = (qIndex, value) => {
        const newQuestions = [...exam.questions];
        newQuestions[qIndex].correctAnswer = parseInt(value);
        setExam({ ...exam, questions: newQuestions });
    };

    const handleDeleteQuestion = (index) => {
        const newQuestions = exam.questions.filter((_, i) => i !== index);
        setExam({ ...exam, questions: newQuestions });
    };

    const handleSave = () => {
        const pack = { title: exam.title, duration: exam.duration, courses: exam.classes.map(c => c._id), questions: exam.questions };
        mutate(pack, {
            onSuccess: (data) => {
                console.log("Đề thi được tạo thành công:", data);
                navigate("/exams")
            }
        });

    };

    const isFormValid = exam.title && exam.duration && exam.classes.length > 0 && exam.questions.length > 0;

    return (
        <>
            <Stack className="CreateExamPage" >
                <SpeedDial
                    title="Thêm câu hỏi"
                    ariaLabel="SpeedDial basic example"
                    onClick={handleAddQuestion} sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 9 }}
                    icon={<Add />}
                >
                </SpeedDial>
                {/* Phần thông tin bài thi */}
                <Box sx={{ padding: 2, m: 0 }}>
                    <Paper sx={{ padding: 2 }}>
                        <Stack spacing={2}>
                            <Grid2 container alignItems={"center"} justifyContent={"space-between"} spacing={2}>
                                <Grid2 size={{ xs: "auto", md: 2 }}>
                                    <Typography sx={{ fontWeight: 500 }}>Tên bài thi</Typography>
                                </Grid2>
                                <Grid2 size={{ xs: "auto", md: 10 }}>
                                    <TextField name="title" placeholder="Nhập tên đề thi ..." fullWidth value={exam.title} onChange={handleChange} />
                                </Grid2>
                            </Grid2>
                            <Grid2 container alignItems={"center"} justifyContent={"space-between"} spacing={2}>
                                <Grid2 container size={{ xs: 12, md: 4 }}>
                                    <Grid2 container size={{ xs: 6, md: 6 }} alignItems={"center"}>
                                        <Typography sx={{ fontWeight: 500 }}>Thời gian (phút)</Typography>
                                    </Grid2>
                                    <Grid2 size={{ xs: 6, md: 6 }}>
                                        <TextField type="number" placeholder="Nhập số phút ..." name="duration" fullWidth value={exam.duration} onChange={handleChange} />
                                    </Grid2>
                                </Grid2>
                                <Grid2 size={{ xs: 12, md: 6 }} container alignItems={"center"}>
                                    <Grid2 size={{ xs: 6, md: 4 }} >
                                        <Typography sx={{ fontWeight: 500 }}>Lớp tham gia</Typography>
                                    </Grid2>
                                    <Grid2 size={{ xs: 6, md: 8 }}>
                                        <FormControl sx={{ m: 1, width: "100%" }}>
                                            <InputLabel id="demo-multiple-chip-label">Chọn</InputLabel>
                                            <Select
                                                labelId="demo-multiple-chip-label"
                                                id="demo-multiple-chip"
                                                multiple
                                                value={exam.classes}
                                                onChange={handleClassChange}
                                                input={<OutlinedInput label="Chip" />}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selected.map((value) => (
                                                            <Chip key={`selected-${value._id}`} label={value.name} />
                                                        ))}
                                                    </Box>
                                                )}
                                                MenuProps={MenuProps}
                                            >
                                                {(availableClasses || []).map((c) => (
                                                    <MenuItem
                                                        key={`menu-${c._id}`}
                                                        value={c}
                                                        style={getStyles(c.name, exam.classes, theme)}
                                                    >
                                                        {c.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                    </Grid2>
                                </Grid2>
                            </Grid2>

                        </Stack>
                    </Paper>
                </Box>
                {/* Phần danh sách câu hỏi */}
                <Box className="quiz-header" sx={{ padding: 2 }}>
                    <Paper sx={{ padding: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Số lượng ({exam.questions.length})</Typography>
                            <Stack direction="row" spacing={2} justifyContent="flex-end" >
                                <Button variant="outlined" onClick={() => navigate("/exams")}>
                                    Hủy
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleSave} disabled={!isFormValid}>
                                    Lưu bài thi
                                </Button>

                            </Stack>
                        </Stack>
                    </Paper>
                </Box>
                <Box sx={{ p: 2 }}>
                    <Stack spacing={2} sx={{ p: 2 }}>
                        {exam.questions.map((q, index) => (
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
                                        value={q.question}
                                        placeholder="Nhập câu hỏi"
                                        onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
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
                                                    <FormControlLabel value={optIndex} control={<Radio />} label={`${answerLabels[optIndex]}`} />
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
};

export default CreateExamPage;
