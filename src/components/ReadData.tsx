import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import callApi from "../api";
interface Ingredient {
  name: string;
  percentage: number;
  casNo: string;
  reference: string;
  function: string;
}

const ExcelReader: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const headerIndex = jsonData.findIndex(
        (row) => row[0]?.trim() === "INGREDIENT  NAME"
      );
      if (headerIndex === -1) return;

      const endIndex = jsonData.findIndex((row) => row[0]?.trim() === "TOTAL");

      const dataRows = jsonData.slice(headerIndex + 1, endIndex);

      const formattedData: Ingredient[] = dataRows.map((row) => ({
        name: row[0],
        percentage: parseFloat(row[1]),
        casNo: row[2],
        reference: row[3],
        function: row[4],
      }));

      setIngredients(formattedData);
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

  return (
    <div>
      <div
        style={{ padding: "20px", border: "1px dashed #cccccc" }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <p>Kéo thả file .xlsx vào đây hoặc nhấp để chọn file</p>
      </div>
      <div>
        {ingredients.length > 0 && (
          <table
            style={{
              border: "1px solid black",
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Number
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Ingredient Name
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  % (w/w)
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  CAS No.
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Reference
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Function
                </th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient, index) => (
                <tr key={index}
                  onClick={() => callApi(ingredient.name, ingredient.casNo)}
                >
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {index + 1}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {ingredient.name}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {ingredient.percentage}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {ingredient.casNo}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {ingredient.reference}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {ingredient.function}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExcelReader;
