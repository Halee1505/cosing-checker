import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import callApi from "../api";
import {
  Modal,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Button,
  LinearProgress,
  TableContainer,
} from "@mui/material";
import ExcelUploadComponent from "./InputData";
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
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchBy, setSearchBy] = useState<"name" | "cas" | "all">("name");
  const [rawData, setRawData] = useState<Ingredient[]>([]);
  const [refetch, setRefetch] = useState(false);

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
      {/* Modal for displaying data rows */}
      <ExcelUploadComponent
        selectedData={rawData}
        setSelectedData={setRawData}
      />

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
        Tìm kiếm theo
        <label>
          <input
            type="radio"
            name="searchBy"
            className="hidden"
            checked={searchBy === "name"}
            onChange={() => setSearchBy("name")}
          />
          Tên
        </label>
        <label>
          <input
            type="radio"
            name="searchBy"
            className="hidden"
            checked={searchBy === "cas"}
            onChange={() => setSearchBy("cas")}
          />
          Mã CAS
        </label>
        <label>
          <input
            type="radio"
            name="searchBy"
            className="hidden"
            checked={searchBy === "all"}
            onChange={() => setSearchBy("all")}
          />
          Cả hai
        </label>
      </div>
      <div>
        {ingredients.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Mã CAS</TableCell>
                <TableCell>Kết quả</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ingredients.map((ingredient, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={1} sx={{ verticalAlign: "top" }}>
                      {ingredient.name}
                  </TableCell>
                  <TableCell colSpan={1} sx={{ width: "100px", verticalAlign: "top" }}>
                    {ingredient.casNo}
                  </TableCell>
                  <TableCell colSpan={2}>
                    {ingredient.loading ? (
                      <LinearProgress />
                    ) : ingredient.results?.length &&
                      ingredient.results?.length > 0 ? (
                      <TableContainer sx={{ maxHeight: 440 }}>
                        <Table sx={{ backgroundColor: "#f0f0f0" }} stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell>Tên</TableCell>
                              <TableCell>Mã CAS</TableCell>
                              <TableCell>Mã EC</TableCell>
                              <TableCell>Annex Ref</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {ingredient.results?.map(
                              (result: Result, index: number) => (
                                <TableRow key={index}>
                                  <TableCell sx={{ border: "1px solid #fff" }}>
                                    {result.name}
                                  </TableCell>
                                  <TableCell sx={{ border: "1px solid #fff", width: "100px"}}>
                                    {result.casNumber}
                                  </TableCell>
                                  <TableCell sx={{ border: "1px solid #fff", width: "100px" }}>
                                    {result.ECNumber}
                                  </TableCell>
                                  <TableCell sx={{ border: "1px solid #fff" }}>
                                    {result.AnnexRef}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <div>Không có kết quả</div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ExcelReader;
