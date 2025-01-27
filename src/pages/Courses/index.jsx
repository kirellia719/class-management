import "./style.scss"

import { useQuery } from "react-query";
import { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { Divider, TextField } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import api from "api";
import ModalCreateCourse from "./ModalCreateCourse";
import useCourseStore from "../../store/courseStore";
import LoadingPage from "../../components/LoadingPage"
import { useNavigate } from "react-router-dom";


const CoursePage = () => {

    const [filter, setFilter] = useState("");

    const { courses, setCourses } = useCourseStore();

    const navigate = useNavigate();

    const { data, isLoading } = useQuery(
        "courses",
        async () => {
            const response = await api.get("/course/all");
            return response.data;
        }
    )

    useEffect(() => {
        if (data) {
            setCourses(data);
        }
    }, [data]);

    const filteredCourses = courses.filter(c => (!(filter.trim()) || c.name.includes(filter.trim())));


    return <>
        {
            isLoading
                ? <LoadingPage />
                : <div className="Courses">
                    <div className="course-header">
                        <div className="search-box">
                            <TextField label="Tìm kiếm" variant="outlined" size="small" value={filter} onChange={e => setFilter(e.target.value)} />
                        </div>
                        <ModalCreateCourse />
                    </div>
                    <Divider style={{ margin: '10px 0' }} />
                    <div className="course-body">
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid
                                container
                                spacing={{ xs: 2, md: 3 }}
                                columns={{ xs: 4, sm: 8, md: 12 }}
                            >
                                {filteredCourses.length == 0
                                    ? <div>Không có khoá học</div>
                                    : filteredCourses.map((c) => (
                                        <Grid
                                            key={c._id}
                                            size={{ xs: 10, sm: 8, md: 4, lg: 3, xl: 2 }}
                                            onClick={() => navigate(`/courses/${c._id}`)}
                                        >
                                            <div className="course-item">
                                                <div className="course-info">
                                                    <div className="course-name">
                                                        {c.name}
                                                    </div>
                                                    <div className="course-size">
                                                        Sĩ số: {c.students.length || 0}
                                                    </div>
                                                </div>
                                                <div className="course-menu">
                                                    <MoreVertIcon />
                                                </div>
                                            </div>
                                        </Grid>
                                    ))}
                            </Grid>
                        </Box>
                    </div>
                </div>
        }
    </>

}

export default CoursePage;