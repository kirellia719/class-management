import "./style.scss"

import { useQuery } from "react-query";
import studentAPI from "../../studentAPI";
import { useNavigate, useParams } from "react-router-dom"; // Nếu sử dụng react-router-dom v6
import LoadingPage from "../../../components/LoadingPage";
import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import useTitleStore from "../../../store/titleStore";
import { useEffect } from "react";

const formatAttemptDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');  // Tháng (1-12)
    const day = String(d.getDate()).padStart(2, '0');  // Ngày (1-31)
    const hours = String(d.getHours()).padStart(2, '0');  // Giờ (00-23)
    const minutes = String(d.getMinutes()).padStart(2, '0');  // Phút (00-59)

    return `${year}/${month}/${day}, ${hours}:${minutes}`;
};

const ExamPreparation = () => {
    const navigate = useNavigate(); // Dùng để điều hướng trang nếu sử dụng React Router
    const { examId } = useParams();
    const { data, isLoading, } = useQuery(
        "examSubmissionDetails",
        async () => {
            const { data } = await studentAPI.checkExam(examId);
            return data;
        },
        {
            retry: false, // Nếu muốn không tự động retry khi lỗi
        }
    );

    const joinExam = async () => {
        try {
            const { data } = await studentAPI.joinExam(examId);
            navigate(`/submit/${data._id}`);
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
        }
    }


    const { setTitle, setBackButton } = useTitleStore();

    useEffect(() => {
        if (data) {
            setTitle("Các lần làm bài");
            setBackButton(data.exam.course);
        }
        return () => {
            setTitle("");
            setBackButton("");
        }
    }, [data]);

    if (isLoading || !data) {
        return <LoadingPage />
    }
    else {
        const { exam, submissions } = data;
        const isDoing = submissions.find(submission => !submission.isDone);

        const maxScoreSubmissions = submissions.reduce((maxScore, submission) => (submission.score && maxScore < submission.score) ? submission.score : maxScore, 0)

        return (
            <Stack className="ExamPreparation" spacing={2}>
                <Paper sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Đề: <b>{exam.title}</b></div>
                    <div>{
                        isDoing
                            ? <Button variant="contained" onClick={() => navigate(`/submit/${isDoing._id}`)}>Tiếp tục</Button>
                            : (exam.attemptsAllowed > submissions.length && exam.isOpen ? <Button variant="contained" onClick={joinExam}>{submissions.length == 0 ? "Vào làm" : "Làm lại"}</Button> : " ")
                    }
                    </div>
                </Paper>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Lần</TableCell>
                                <TableCell align='center'>Ngày làm</TableCell>
                                <TableCell align='center'>Số câu đúng</TableCell>
                                <TableCell align='center'>Trạng thái</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {submissions.map((submission, index) => (
                                <TableRow key={submission._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell align='center'>{formatAttemptDate(submission.createdAt)}</TableCell>
                                    <TableCell align='center'>{submission.score == null ? "Không có điểm" : `${submission.score}/${exam.numberQuestions}`}</TableCell>
                                    <TableCell align='center'>
                                        {submission.score == null ? "Đang làm" : submission.isDone ? "Đã nộp" : "Chưa nộp"}
                                    </TableCell>
                                </TableRow>
                            ))}

                            {
                                Array.from({ length: exam.attemptsAllowed - submissions.length }).map((_, index) => <TableRow key={index}>
                                    <TableCell>{index + 1 + submissions.length}</TableCell>
                                    <TableCell align='center'></TableCell>
                                    <TableCell align='center'></TableCell>
                                    <TableCell align='center'></TableCell>
                                </TableRow>
                                )
                            }
                            <TableRow sx={{ borderTop: "2px solid black" }}>
                                <TableCell><b>Cao nhất</b></TableCell>
                                <TableCell align='center'></TableCell>
                                <TableCell align='center'>{`${maxScoreSubmissions}/${exam.numberQuestions}`}</TableCell>
                                <TableCell align='center'></TableCell>
                            </TableRow>

                        </TableBody>

                    </Table>
                </TableContainer>
            </Stack>
        );
    }


};

export default ExamPreparation;
