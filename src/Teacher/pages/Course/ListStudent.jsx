import "./style.scss";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "react-query";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import teacherAPI from "../../teacherAPI";

import {
   Box,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   Typography,
} from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import DrawRoundedIcon from "@mui/icons-material/DrawRounded";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PhonelinkLockRoundedIcon from "@mui/icons-material/PhonelinkLockRounded";

import ModalAddStudent from "./ModalAddStudent";
import ModalUpdateStudent from "./ModalUpdateStudent";
import ModalPassword from "./ModalPassword";
import useTitleStore from "../../../store/titleStore";

const ListStudent = () => {
   const queryClient = useQueryClient();
   const { courseId } = useParams();

   const { setTitle, setBackButton } = useTitleStore();

   const { data, isLoading } = useQuery("list-student", async () => {
      const req = await teacherAPI.getStudentsInCourse(courseId);
      return req.data;
   });

   const [deleteRow, setDeleteRow] = useState(null);
   const [updateRow, setUpdateRow] = useState(null);
   const [changePasswords, setChangePasswords] = useState(null);

   const [selectedRows, setSelectedRows] = useState([]);
   const [importModal, setImportModal] = useState(false);
   const [loading, setLoading] = useState(false);

   // Lưu các hàng được chọn
   const handleRowSelection = (selection) => setSelectedRows(selection);

   // Hàm xóa hàng đã chọn
   const handleDeleteRows = async () => {
      const arr = await handleDelete(selectedRows);
      if (arr && arr.length > 0) {
         toast.success(`Đã xóa ${arr.length} học sinh`, { autoClose: 2000 });
         setSelectedRows([]); // Xóa selection sau khi xóa dữ liệu
      }
      queryClient.invalidateQueries("list-student");
   };

   const handleDelete = async (listStudent) => {
      setLoading(true);
      try {
         const resArr = await Promise.all(listStudent.map((id) => teacherAPI.deleteStudent(id)));
         if (resArr.length > 0) {
            return resArr;
         }
      } catch (error) {
         console.error(error);
      }
      setDeleteRow(null);
      setLoading(false);
   };

   const cols = [
      { field: "stt", headerName: "STT" },
      {
         field: "username",
         flex: 1,
         headerName: "Tài khoản",
         sortable: false,
         renderCell: (params) => <div style={{ fontSize: 14 }}>{params.row.username}</div>,
      },
      {
         field: "fullname",
         flex: 1,
         headerName: "Họ và tên",
         sortable: false,
      },
      {
         field: "male",
         headerName: "Giới tính",
         headerAlign: "center",
         sortable: false,
         renderCell: (params) => (
            <div className="center-cell">
               {params.row.male != null ? (
                  params.row.male ? (
                     <MaleIcon color="primary" />
                  ) : (
                     <FemaleIcon color="error" />
                  )
               ) : (
                  ""
               )}
            </div>
         ),
      },
      {
         field: "action",
         headerName: "Thao tác",
         headerAlign: "center",
         sortable: false,
         renderCell: (params) => (
            <>
               <div className="center-cell">
                  <div
                     style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                     onClick={() => setUpdateRow(params.row)}
                  >
                     <DrawRoundedIcon color="success" />
                  </div>
                  <div
                     style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                     onClick={() => setChangePasswords(params.row)}
                  >
                     <PhonelinkLockRoundedIcon color="primary" />
                  </div>
                  <div
                     style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                     onClick={() => setDeleteRow(params.row)}
                  >
                     <HighlightOffIcon color="error" />
                  </div>
               </div>
            </>
         ),
      },
   ];

   const listStudent = (data?.students || []).map((s, index) => ({ id: s._id, stt: index + 1, ...s }));

   useEffect(() => {
      if (data) {
         setTitle(data.name);
         setBackButton("/courses");
      }

      return () => {
         setTitle("");
         setBackButton("");
      };
   }, [data, setBackButton, setTitle]);

   return (
      <div style={{ height: "100%", width: "100%" }}>
         {deleteRow && (
            <Dialog open={!!deleteRow} onClose={() => setDeleteRow(false)}>
               <DialogTitle>{"Thông báo xác nhận"}</DialogTitle>
               <DialogContent>
                  <DialogContentText>
                     Bạn chắc chắn xóa <b>{deleteRow.fullname}</b> chứ?
                  </DialogContentText>
               </DialogContent>
               <DialogActions>
                  <Button onClick={() => setDeleteRow(false)}>Hủy</Button>
                  <Button onClick={() => handleDelete([deleteRow.id])} color="error" variant="contained" autoFocus>
                     Đồng ý
                  </Button>
               </DialogActions>
            </Dialog>
         )}
         {updateRow && <ModalUpdateStudent open={!!updateRow} onClose={() => setUpdateRow(null)} student={updateRow} />}
         {changePasswords && (
            <ModalPassword
               open={!!changePasswords}
               onClose={() => setChangePasswords(null)}
               student={changePasswords}
            />
         )}
         <DataGrid
            loading={isLoading || loading}
            rows={listStudent || []}
            columns={cols}
            pageSize={listStudent.length}
            disableRowSelectionOnClick
            checkboxSelection
            disableColumnMenu
            onRowSelectionModelChange={handleRowSelection}
            selectionModel={selectedRows}
            slots={{
               footer: () => (
                  <Box
                     sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "2px solid #ccc",
                        padding: 1,
                        paddingLeft: 2,
                        paddingRight: 2,
                     }}
                  >
                     <>
                        <Typography variant="h7">
                           {selectedRows.length > 0 ? `${selectedRows.length} hàng được chọn` : ""}{" "}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                           {selectedRows.length > 0 ? (
                              <Button
                                 variant="contained"
                                 color="error"
                                 onDoubleClick={handleDeleteRows}
                                 loading={loading}
                              >
                                 Xóa nhiều
                              </Button>
                           ) : (
                              <Button variant="contained" onClick={() => setImportModal(true)}>
                                 Thêm học sinh
                              </Button>
                           )}
                        </Box>
                     </>
                  </Box>
               ),
            }}
         />
         <ModalAddStudent open={importModal} onClose={() => setImportModal(false)} />
      </div>
   );
};

export default ListStudent;
