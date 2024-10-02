import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Button,
  Modal,
  Box,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Input,
  Checkbox,
} from "@mui/material";
import { useDropzone } from "react-dropzone";

interface Ingredient {
  name: string;
  percentage: number;
  casNo: string;
  reference: string;
  function: string;
  loading: boolean;
}

const ExcelUploadComponent = ({
    selectedData,
    setSelectedData,
}:{
    selectedData: Ingredient[],
    setSelectedData: (data: Ingredient[]) => void
}) => {
  const [dataRows, setDataRows] = useState<any[][]>([]); // Store the sheet data
  const [open, setOpen] = useState(false); // Modal state

  // State to hold user selections
  const [startRow, setStartRow] = useState<number>(0);
  const [endRow, setEndRow] = useState<number>(0);
  const [nameColumn, setNameColumn] = useState<number>(0);
  const [casColumn, setCasColumn] = useState<number>(0);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      setDataRows(jsonData); // Store all rows and columns for display
      setStartRow(-1);
      setEndRow(-1); // Default end row to the last row
      setNameColumn(-1); // Default name column to the first column
      setCasColumn(-1); // Default CAS column to the second column
      setOpen(true); // Open the modal to display data
    };
    reader.readAsBinaryString(file);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleFileUpload(acceptedFiles[0]),
    multiple: false,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });
  // Confirm selection and extract the formatted data
  const handleConfirmSelection = () => {
    const selectedRows = dataRows.slice(startRow, endRow + 1);

    // Map the selected rows into Ingredient format
    const formattedData: Ingredient[] = selectedRows.map((row) => ({
      name: row[nameColumn],
      percentage: parseFloat(row[nameColumn + 1] || 0),
      casNo: row[casColumn],
      reference: row[casColumn + 1] || "",
      function: row[casColumn + 2] || "",
      loading: true,
    }));
    setSelectedData(formattedData);
    setOpen(false); // Close the modal
  };
  const getLengthTableHeader = () => {
    let maxRow = dataRows[0] ?? [];
    for (let i = 0; i < dataRows.length; i++) {
      if (dataRows[i].length > maxRow.length) {
        maxRow = dataRows[i];
      }
    }
    return maxRow;
  };

  return (
    <div>
     <div
        style={{ padding: "20px", border: "1px dashed #cccccc" }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <p>Kéo thả file .xlsx vào đây hoặc nhấp để chọn file</p>
      </div>
      {/* Modal for displaying and selecting data */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            height: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            overflow: "auto",
            p: 4,
          }}
        >
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>

          <h2>Chọn vùng dữ liệu</h2>
          <FormControl sx={{ ml: 2 ,width: 200}}>
            <InputLabel id="name-col-label" sx={{fontSize: 20, display: "flex", justifyContent: "center", alignItems: "center", width: "max-content", padding: "10px", marginTop: "-20px"}} >Tên thành phần</InputLabel>
            <Select
              labelId="name-col-label"
              id="name-col-select"
              value={nameColumn}
              label="Start Row"
              onChange={(e) => setNameColumn(e.target.value as number)}
            >
              {getLengthTableHeader().map((_, index) => (
                <MenuItem key={index} value={index}>
                  Cột {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ ml: 2 ,width: 200}}>
            <InputLabel id="cas-col-label" sx={{fontSize: 20, display: "flex", justifyContent: "center", alignItems: "center", width: "max-content", padding: "10px", marginTop: "-20px"}}  >Mã CAS</InputLabel>
            <Select
              labelId="cas-col-label"
              id="cas-col-select"
              value={casColumn}
              label="End Row"
              onChange={(e) => setCasColumn(e.target.value as number)}
            >
              {getLengthTableHeader().map((_, index) => (
                <MenuItem key={index} value={index}>
                  Cột {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
            </div>
          <Table sx={{ maxHeight: 300, overflowY: "auto", height: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Hàng</TableCell>
                {getLengthTableHeader().map((_, index) => (
                  <TableCell key={index}>Cột {index + 1}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataRows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor:
                      index >= startRow && index <= endRow ? "#f0f0f0" : "",
                  }}
                >
                  <TableCell>
                    <Checkbox
                      checked={
                        startRow === -1 || endRow === -1
                          ? index === startRow
                          : index >= startRow && index <= endRow
                      }
                      onChange={(e) => {
                        if (!e.target.checked) {
                          if (index === startRow) {
                            setStartRow(-1);
                          }
                          if (index === endRow) {
                            setEndRow(-1);
                          }
                        } else {
                          if (
                            startRow === -1 ||
                            (startRow >= 0 && endRow >= 0)
                          ) {
                            setStartRow(index);
                            setEndRow(-1);
                          } else if (endRow === -1) {
                            setEndRow(index);
                          }
                        }
                      }}
                      sx={{ width: "20px", height: "20px" }}
                    ></Checkbox>
                  </TableCell>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      sx={{ border: "1px solid black" }}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Confirm button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmSelection}
            sx={{ mt: 2 }}
          >
            Confirm Selection
          </Button>
        </Box>
      </Modal>

      {/* Display the selected data */}
      {/* <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>CAS No</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rawData.map((ingredient, index) => (
            <TableRow key={index}>
              <TableCell>{ingredient.name}</TableCell>
              <TableCell>{ingredient.casNo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </div>
  );
};

export default ExcelUploadComponent;
