import "./style.scss";

import { useQuery, useQueryClient } from "react-query";
import { useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import {
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   Divider,
   Menu,
   MenuItem,
   TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import api from "api";
import ModalCreateCourse from "./ModalCreateCourse";

import LoadingPage from "../../components/LoadingPage";
import { useNavigate } from "react-router-dom";
import ModalUpdateCourse from "./ModalUpdateCourse";

function BasicMenu({ item, onDeleteClick, onUpdateClick }) {
   const [anchorEl, setAnchorEl] = useState(null);
   const open = Boolean(anchorEl);
   const handleClick = (event) => setAnchorEl(event.currentTarget);
   const handleClose = () => setAnchorEl(null);

   return (
      <div>
         <MoreVertIcon
            aria-controls={open ? `basic-menu-${item.id}` : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
         />

         <Menu
            id={`basic-menu-${item._id}`}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
               "aria-labelledby": "basic-button",
            }}
         >
            <MenuItem
               onClick={() => {
                  handleClose();
                  onUpdateClick();
               }}
            >
               Sửa
            </MenuItem>
            <MenuItem
               onClick={() => {
                  handleClose();
                  onDeleteClick();
               }}
            >
               Xóa
            </MenuItem>
         </Menu>
      </div>
   );
}

const CoursePage = () => {
   const queryClient = useQueryClient();
   const [filter, setFilter] = useState("");
   const navigate = useNavigate();

   const { data, isLoading } = useQuery("courses", async () => {
      const response = await api.get("/course/all");
      return response.data;
   });

   const filteredCourses = (data || []).filter((c) => !filter.trim() || c.name.includes(filter.trim()));

   const [deleteCourse, setDeleteCourse] = useState(null);
   const [updateCourse, setUpdateCourse] = useState(null);

   const confirmDelete = async () => {
      try {
         await api.delete(`/course/${deleteCourse._id}`);
         setDeleteCourse(null);
         queryClient.invalidateQueries("courses");
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <>
         {isLoading ? (
            <LoadingPage />
         ) : (
            <div className="Courses">
               <div className="course-header">
                  <div className="search-box">
                     <TextField
                        label="Tìm kiếm"
                        variant="outlined"
                        size="small"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                     />
                  </div>
                  <ModalCreateCourse />
               </div>
               <Divider style={{ margin: "10px 0" }} />
               <div className="course-body">
                  <Box sx={{ flexGrow: 1 }}>
                     <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {filteredCourses.length == 0 ? (
                           <div>Không có khoá học</div>
                        ) : (
                           filteredCourses.map((c) => (
                              <Grid key={c._id} size={{ xs: 10, sm: 8, md: 4, lg: 3, xl: 2 }}>
                                 <div className="course-item">
                                    <div className="course-info" onClick={() => navigate(`/courses/${c._id}`)}>
                                       <div className="course-name">{c.name}</div>
                                       <div className="course-size">Sĩ số: {c.students.length || 0}</div>
                                    </div>
                                    <div className="course-menu">
                                       <BasicMenu
                                          item={c}
                                          onDeleteClick={() => setDeleteCourse(c)}
                                          onUpdateClick={() => setUpdateCourse(c)}
                                       />
                                    </div>
                                 </div>
                              </Grid>
                           ))
                        )}
                     </Grid>
                  </Box>
               </div>

               {deleteCourse && (
                  <Dialog
                     open={!!deleteCourse}
                     onClose={() => setDeleteCourse(null)}
                     aria-labelledby="dialog-delete-course-title"
                     aria-describedby="dialog-delete-course-description"
                  >
                     <DialogTitle id="dialog-delete-course-title">Xác nhận</DialogTitle>
                     <DialogContent>
                        Bạn chắc chắn xóa khóa học <b>{deleteCourse.name}</b>
                     </DialogContent>
                     <DialogActions>
                        <Button onClick={() => setDeleteCourse(null)}>Hủy</Button>
                        <Button onClick={confirmDelete} autoFocus variant="contained">
                           Đồng ý
                        </Button>
                     </DialogActions>
                  </Dialog>
               )}
               {updateCourse && (
                  <ModalUpdateCourse open={!!updateCourse} onClose={() => setUpdateCourse(null)} item={updateCourse} />
               )}
            </div>
         )}
      </>
   );
};

export default CoursePage;
