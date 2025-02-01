import "./style.scss"

import { Button, Stack, Typography, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import teacherAPI from "../../teacherAPI"
import LoadingPage from "~/components/LoadingPage";
import { useQuery } from "react-query";

const columns = [
    // { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Tên bài thi", flex: 1 },
    // { field: "date", headerName: "Ngày thi", width: 150 },
    { field: "duration", headerName: "Thời gian (phút)", width: 150 },
    {
        field: "actions",
        headerName: "Hành động",
        width: 150,
        renderCell: () => (
            <Stack direction="row" spacing={1}>
                <IconButton color="primary"><Visibility /></IconButton>
                <IconButton color="warning"><Edit /></IconButton>
                <IconButton color="error"><Delete /></IconButton>
            </Stack>
        ),
    },
];

const ExamPage = () => {
    const navigate = useNavigate();
    const { data: exams, isLoading, isError } = useQuery("exams", async () => {
        const { data } = await teacherAPI.getAllExams();
        return data;
    });

    if (isLoading) return <LoadingPage />
    if (isError) return <p>Lỗi khi tải dữ liệu</p>;

    const rows = exams.map(exam => ({ ...exam, id: exam._id })); // Add actions column to rows

    return (
        <div className="ExamPage">
            <Stack spacing={3}>
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">Danh sách bài thi</Typography>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="primary" onClick={() => navigate("/exams/create")}>Thêm bài thi</Button>
                        {/* <Button variant="outlined">Xuất file</Button>
                    <Button variant="outlined">Lọc dữ liệu</Button> */}
                    </Stack>
                </Stack>

                {/* Table */}
                <div style={{ height: 400, width: "100%" }}>
                    <DataGrid rows={rows} columns={columns} pageSize={5} />
                </div>
            </Stack>
        </div>
    );
};

export default ExamPage;
