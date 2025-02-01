import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import * as XLSX from "xlsx";
import { Button, Box } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import teacherAPI from "teacher-api";
import dayjs from "dayjs";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

const formattedColumns = [
   { field: "fullname", headerName: "Họ và tên" },
   {
      field: "male",
      headerName: "Giới tính",
      renderCell: (params) => <div className="center-cell">{params.row.male}</div>,
   },
   {
      field: "birthday",
      headerName: "Ngày sinh",
      renderCell: (params) => <div className="center-cell">{dayjs(params.row.birthday).format("DD/MM/YYYY")}</div>,
   },
   { field: "phone", headerName: "Số điện thoại" },
];

const ImportExcelComponent = ({ onClose }) => {
   const { courseId } = useParams();
   const queryClient = useQueryClient();

   const [loading, setLoading] = useState(false);

   const [rows, setRows] = useState([]);
   const [columns, setColumns] = useState([]);
   const [fileUploaded, setFileUploaded] = useState(false);

   // Xử lý khi chọn file Excel
   const handleFileUpload = (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setFileUploaded(true);

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = (e) => {
         const bufferArray = e.target.result;
         const wb = XLSX.read(bufferArray, { type: "array" });
         const wsname = wb.SheetNames[0];
         const ws = wb.Sheets[wsname];

         const excel = XLSX.utils.sheet_to_json(ws, { header: 1 });
         const headers = excel[0];
         const data = excel.filter((row) => {
            return Object.values(row).some((value) => value != null && value !== "");
         });

         if (data.length > 0) {
            const formattedRows = data.slice(1).map((row, rowIndex) => {
               let rowData = {};

               // Lặp qua các cột và gán giá trị vào object mới với key là fullname, male, birthday, phone
               rowData["fullname"] = row[headers.indexOf("Họ và tên")];
               rowData["phone"] = row[headers.indexOf("Số điện thoại")];

               // Xử lý giới tính (Nam -> true, Nữ -> false)
               const gender = row[headers.indexOf("Giới tính")];
               rowData["male"] = !gender ? null : gender == "Nam" ? true : false; // Chuyển "Nam" thành true, "Nữ" thành false

               // Xử lý ngày sinh, nếu là số thì chuyển thành định dạng ngày tháng
               const birthDateIndex = headers.indexOf("Ngày sinh");
               if (birthDateIndex !== -1 && row[birthDateIndex]) {
                  let birthValue = row[birthDateIndex];

                  if (typeof birthValue === "number") {
                     const date = XLSX.SSF.parse_date_code(birthValue); // Chuyển số thành đối tượng ngày tháng
                     const day = String(date.d).padStart(2, "0"); // Lấy ngày và đảm bảo là 2 chữ số
                     const month = String(date.m).padStart(2, "0"); // Tháng, cộng 1 vì tháng bắt đầu từ 0
                     const year = date.y; // Lấy năm
                     birthValue = dayjs(`${year}/${month}/${day}`).format("YYYY-MM-DD");
                  }
                  rowData["birthday"] = birthValue;
                  // console.log(birthValue);
               }

               return { id: rowIndex, ...rowData };
            });

            setColumns(formattedColumns);
            setRows(formattedRows);
         } else {
            setColumns([]);
            setRows([]);
         }
      };
   };

   // Xác nhận gửi dữ liệu lên API
   const handleConfirmUpload = async () => {
      setLoading(true);
      try {
         const resArr = await Promise.all(rows.map((row) => teacherAPI.addStudent(courseId, row)));
         console.log(resArr);
         queryClient.invalidateQueries("list-student");
         onClose();
      } catch (error) {
         console.error("Lỗi khi gửi dữ liệu:", error);
      }
      setLoading(false);
   };

   // Tải file mẫu Excel
   const handleDownloadTemplate = () => {
      const ws_data = [
         ["Họ và tên", "Giới tính", "Ngày sinh", "Số điện thoại"], // Chỉ có tiêu đề cột
      ];

      const ws = XLSX.utils.aoa_to_sheet(ws_data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Mẫu import");

      // Tải file mẫu Excel xuống
      XLSX.writeFile(wb, "file_mau_import.xlsx");
   };

   return (
      <Box sx={{ width: "100%", textAlign: "center" }}>
         {/* Upload Button */}
         <input
            type="file"
            accept=".xlsx, .xls"
            id="upload-excel"
            style={{ display: "none" }}
            onChange={handleFileUpload}
         />
         <label htmlFor="upload-excel">
            <Button variant="contained" component="span" startIcon={<UploadFileIcon />}>
               Upload Excel
            </Button>
         </label>

         {/* Download Template Button */}
         <Button
            variant="contained"
            component="span"
            startIcon={<CloudDownloadIcon />}
            onClick={handleDownloadTemplate}
            sx={{ marginLeft: 2 }}
            color="secondary"
         >
            Tải file mẫu
         </Button>

         {/* Data Grid */}
         {fileUploaded && (
            <>
               <div style={{ marginTop: 20 }}>
                  <DataGrid
                     sx={{ height: 400 }}
                     rows={rows}
                     columns={columns}
                     hideFooter // Ẩn footer, bỏ phân trang
                  />
               </div>

               {/* Confirm Button */}
               <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirmUpload}
                  sx={{ marginTop: 2 }}
                  disabled={rows.length == 0}
                  loading={loading}
               >
                  Xác nhận gửi dữ liệu
               </Button>
            </>
         )}
      </Box>
   );
};

export default ImportExcelComponent;
