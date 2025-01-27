import "./style.scss"

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import { useMutation } from "react-query";

import api from "api";
import useCourseStore from "../../store/courseStore";
import { toast } from "react-toastify";

const ModalCreateCourse = () => {
    const [open, setOpen] = useState(false);

    const [courseName, setCourseName] = useState("");

    const handleChange = (e) => setCourseName(e.target.value);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { addCourse } = useCourseStore();

    const mutation = useMutation(
        async () => {
            const response = await api.post("/course", { name: courseName });
            return response;
        },
        {
            onSuccess: (response) => {
                const { message, data } = response;
                setCourseName("");
                handleClose();
                addCourse(data);
                toast.success(message, { autoClose: 3000 });
            },
        }
    );


    const handleCreateCourse = (e) => {
        e.preventDefault();
        mutation.mutate(courseName);
    };
    return <div>
        <button className="add-btn" onClick={handleOpen}>
            <AddIcon />
            <span>Tạo khoá học</span>
        </button>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle>
                Khoá học mới
            </DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{ '& > :not(style)': { m: 1 } }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleCreateCourse}
                >
                    <TextField
                        id="outlined-basic"
                        label="Nhập tên"
                        value={courseName}
                        onChange={handleChange}
                        helperText={mutation.error ? mutation.error.response.data.message : ""}
                        autoFocus
                        error={mutation.error ? true : false}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Huỷ</Button>
                <Button onClick={handleCreateCourse}>
                    Tạo
                </Button>
            </DialogActions>
        </Dialog>
    </div>

}

export default ModalCreateCourse;