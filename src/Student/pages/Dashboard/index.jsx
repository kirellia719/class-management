import { Badge, Box, Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import "./style.scss"

import MailIcon from '@mui/icons-material/Mail';
import { useQuery } from "react-query";

import studentAPI from "../../studentAPI"
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useQuery('courses', async () => {
        const res = await studentAPI.getAllCourses();
        return res.data;
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (data)
        return (
            <div className="Dashboard">
                {data.map(c => (
                    <Card key={c._id} sx={{ maxWidth: 300 }} onClick={() => navigate(`/${c._id}`)}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="170"
                                image={`${Math.floor(Math.random() * 6)}.jpg`}
                                alt="green iguana"
                            />
                            <CardContent>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <b>
                                        Toán học 3
                                    </b>
                                    <Badge badgeContent={c.openExamsNotAttempted} color="error">
                                        <MailIcon color="action" />
                                    </Badge>
                                </Box>

                                {/* <Typography variant="body2">
                            <CampaignOutlinedIcon fontSize="small" />
                            {" "}
                            Bài kiểm tra mới
                        </Typography> */}

                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}

            </div>
        );
};

export default Dashboard;