import "./style.scss"

import { useState, useEffect, useRef } from "react";
import { Box, Card, RadioGroup, FormControlLabel, Radio, Grid2, Button, Stack, Paper, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import studentAPI from "../../studentAPI";
import LoadingPage from "../../../components/LoadingPage";

const formatTime = (seconds) => {
    if (seconds <= 0) return "Hết giờ";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const ExamSubmission = ({ submission }) => {
    const navigate = useNavigate();
    const questionRefs = useRef({});
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeleft] = useState(0);
    const queryClient = useQueryClient();

    const [confirmSubmit, setConfirmSubmit] = useState(false);

    const exam = submission.exam;

    useEffect(() => {
        let timer;
        if (!submission.isExpired) {
            timer = setInterval(() => {
                const remainingTime = exam.duration * 60 + 1 - Math.floor((Date.now() - new Date(submission.createdAt).getTime()) / 1000);
                if (remainingTime < 0) {
                    clearInterval(timer);
                    submitExam();
                }
                else {
                    setTimeleft(remainingTime);
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [submission])

    const { mutate, isLoading: isSubmitting } = useMutation(async () => {
        try {
            const { data } = await studentAPI.submitExam(answers, submission._id);
            queryClient.invalidateQueries("submissionDetails")
        } catch (error) {
            console.log(error);
        }
    })

    const submitExam = async () => {
        mutate();
    }

    const handleAnswerChange = (questionId, answer) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const scrollToQuestion = (questionId) => {
        questionRefs.current[questionId]?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (isSubmitting) {
        return <div>Đang nộp bài ...</div>
    }

    return (
        <div className="SubmissionPage">
            <Dialog
                open={confirmSubmit}
                onClose={() => setConfirmSubmit(false)}
                aria-labelledby="dialog-submit-exam-title"
                aria-describedby="dialog-submit-exam-description"
            >
                <DialogTitle id="dialog-submit-exam-title">
                    {"Xác nhận nộp bài"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-submit-exam-description">
                        Bạn có chắc chắn muốn nộp bài thi? Sau khi nộp, bạn sẽ không thể sửa lại đáp án. Hãy nhớ rằng gian để trả lời câu hỏi là {formatTime(timeLeft)}.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmSubmit(false)} color="info">Quay lại</Button>
                    <Button onClick={submitExam} color="success">
                        NỘP BÀI
                    </Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ p: 2, height: "100%", overflow: "hidden" }} >
                <Grid2 container spacing={3} sx={{ height: "100%", }}>
                    <Grid2 container size={{ sm: 9 }} sx={{ height: "100%" }}>
                        <div className="questions-view">
                            <Grid2 container spacing={3}>
                                {exam?.questions.map((q, index) => (
                                    <Grid2 key={q._id} size={{ sm: 12 }} >
                                        <Card ref={(el) => (questionRefs.current[q._id] = el)} className="question-card">
                                            <span><strong>Câu {index + 1}:</strong> {q.content}</span>
                                            <RadioGroup
                                                value={answers[q._id] || ""}
                                                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                                sx={{ paddingX: 2, mt: 1 }}
                                            >
                                                {q.options.map((option, i) => (
                                                    <FormControlLabel key={i} value={i} control={<Radio />} label={option} />
                                                ))}
                                            </RadioGroup>
                                        </Card>
                                    </Grid2>

                                ))}
                            </Grid2>
                        </div>
                    </Grid2>
                    <Grid2 size={{ sm: 3 }}>
                        <Stack spacing={3}>
                            <Box className="exam-submit-container exam-title">
                                <div className="label">Đề:</div>
                                <div className="title">{exam?.title}</div>
                            </Box>

                            <Box className="exam-submit-container">
                                {/* <div className="exam-title">
                                        <div className="label">Học viên:</div>
                                        <div className="title" style={{ color: "#312fae" }}>{user.fullname}</div>
                                    </div> */}
                                <div className="exam-title" style={{ marginTop: 10 }}>
                                    <div className="label">Thời gian:</div>
                                    <div className="title" style={{ color: "#312fae" }}>{formatTime(timeLeft)}</div>
                                </div>
                            </Box>

                            <Box className="exam-submit-container">
                                <div style={{ marginBottom: 10 }}>Câu hỏi</div>
                                <Grid2 container spacing={1} columns={4}>
                                    {exam?.questions.map((q, index) => (
                                        <Grid2 xs={1} key={q._id}>
                                            <Button
                                                variant={answers[q._id] ? "contained" : "outlined"}
                                                color={answers[q._id] ? "primary" : "primary"}
                                                onClick={() => scrollToQuestion(q._id)}
                                                sx={{ minWidth: 40, minHeight: 40, }}
                                            >
                                                {index + 1}
                                            </Button>
                                        </Grid2>
                                    ))}
                                </Grid2>
                            </Box>

                            <Paper sx={{ p: 2 }} className="exam-title">
                                <Button variant="outlined" color="error" onClick={() => navigate(`/exam/${submission.exam._id}`)}>
                                    Thoát
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => setConfirmSubmit(true)}>
                                    Nộp bài
                                </Button>
                            </Paper>
                        </Stack>
                    </Grid2>
                </Grid2>
            </Box>
        </div>
    )
}

const SubmissionPage = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();

    const { data: submission, isLoading } = useQuery("submissionDetails", async () => {
        const { data } = await studentAPI.getExamForSubmission(submissionId);
        return data
    });

    if (isLoading) return <LoadingPage />
    else if (submission) {
        if (submission.isDone) {
            return <Stack sx={{ p: 2, m: 2 }} spacing={2}>
                <div>Bài thi đã kết thúc. {submission.score == null ? "Bạn chưa nộp bài" : `Bạn trả lời đúng ${submission.score}/${submission.exam.questions.length} câu`}</div>
                <div>
                    <Button onClick={() => { navigate(`/exam/${submission.exam._id}`) }}>Quay lại</Button>
                </div>
            </Stack>
        }
        return <ExamSubmission submission={submission} />
    }
    else {
        return <>Lỗi</>
    }
};

export default SubmissionPage;
