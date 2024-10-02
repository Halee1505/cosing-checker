import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import callApi from "../api";
interface Ingredient {
  name: string;
  percentage: number;
  casNo: string;
  reference: string;
  function: string;
  loading: boolean;
  results?: Result[];
}
interface Result {
  name: string;
  casNumber: string;
  ECNumber: string;
  AnnexRef: string;
}

const ExcelReader: React.FC = () => {
  const [rawData, setRawData] = useState<Ingredient[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchBy, setSearchBy] = useState<"name" | "cas" | "all">("all");
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const headerIndex = jsonData.findIndex(
        (row) =>
          row[0]?.trim().toLowerCase() === "INGREDIENT  NAME".toLowerCase()
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
        loading: true,
      }));
      setRawData(formattedData);
    };
    reader.readAsBinaryString(file);
  };
  const [refetch, setRefetch] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleFileUpload(acceptedFiles[0]),
    multiple: false,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });
  useEffect(() => {
    setIngredients(rawData);
    setRefetch(!refetch);
  }, [rawData, searchBy]);
  useEffect(() => {
    const updateIngredients = async () => {
      const promises = ingredients.map(async (ingredient, index) => {
        try {
          const response = await callApi(
            searchBy,
            ingredient.name,
            ingredient.casNo
          );
          const result = response.results.map((item: any) => ({
            name: item.metadata.nameOfCommonIngredientsGlossary?.join(", "),
            casNumber: item.metadata.casNo.join(", "),
            ECNumber: item.metadata.ecNo.join(", "),
            AnnexRef: [
              ...item.metadata.cosmeticRestriction,
              ...item.metadata.annexNo,
              ...item.metadata.refNo,
            ].join(", "),
          }));

          setIngredients((prevIngredients) =>
            prevIngredients.map((ing, idx) =>
              idx === index ? { ...ing, loading: false, results: result } : ing
            )
          );
        } catch (error) {
          setIngredients((prevIngredients) =>
            prevIngredients.map((ing, idx) =>
              idx === index ? { ...ing, loading: false } : ing
            )
          );
          console.error(`Error updating ingredient: ${ingredient.name}`, error);
        }
      });

      await Promise.allSettled(promises);
    };
    updateIngredients();
  }, [refetch]);

  return (
    <div>
      <div
        style={{ padding: "20px", border: "1px dashed #cccccc" }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <p>Kéo thả file .xlsx vào đây hoặc nhấp để chọn file</p>
      </div>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        Search by
        <label>
          <input
            type="radio"
            name="searchBy"
            className="hidden"
            checked={searchBy === "all"}
            onChange={() => setSearchBy("all")}
          />
          All
        </label>
        <label>
          <input
            type="radio"
            name="searchBy"
            className="hidden"
            checked={searchBy === "name"}
            onChange={() => setSearchBy("name")}
          />
          name
        </label>
        <label>
          <input
            type="radio"
            name="searchBy"
            className="hidden"
            checked={searchBy === "cas"}
            onChange={() => setSearchBy("cas")}
          />
          CAS
        </label>
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
                  CAS No.
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Results
                </th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      width: "50px",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      width: "300px",
                    }}
                  >
                    {ingredient.name}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      width: "150px",
                    }}
                  >
                    {ingredient.casNo}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    <div
                      style={{
                        maxHeight: "300px",
                        overflow: "auto",
                      }}
                    >
                      {ingredient.loading ? (
                        <div>Loading...</div>
                      ) : ingredient.results?.length &&
                        ingredient.results?.length > 0 ? (
                        <table>
                          <thead>
                            <tr>
                              <th
                                style={{
                                  border: "1px solid black",
                                  padding: "8px",
                                }}
                              >
                                Name
                              </th>
                              <th
                                style={{
                                  border: "1px solid black",
                                  padding: "8px",
                                }}
                              >
                                CAS
                              </th>
                              <th
                                style={{
                                  border: "1px solid black",
                                  padding: "8px",
                                }}
                              >
                                EC
                              </th>
                              <th
                                style={{
                                  border: "1px solid black",
                                  padding: "8px",
                                }}
                              >
                                Annex Ref
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {ingredient.results?.map(
                              (result: Result, index: number) => (
                                <tr key={index}>
                                  <td
                                    style={{
                                      border: "1px solid black",
                                      padding: "8px",
                                    }}
                                  >
                                    {result.name}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid black",
                                      padding: "8px",
                                    }}
                                  >
                                    {result.casNumber}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid black",
                                      padding: "8px",
                                    }}
                                  >
                                    {result.ECNumber}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid black",
                                      padding: "8px",
                                    }}
                                  >
                                    {result.AnnexRef}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      ) : (
                        <div>No Results</div>
                      )}
                    </div>
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
