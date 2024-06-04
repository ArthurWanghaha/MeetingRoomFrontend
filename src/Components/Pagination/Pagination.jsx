import React, { useEffect } from "react";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./Pagination.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  useEffect(() => {
    const setPage = (pageNumber) => {
      onPageChange(pageNumber);
    };

    const pageNo = document.getElementsByClassName("number");

    for (let i = 0; i < pageNo.length; i++) {
      pageNo[i].addEventListener("click", () => setPage(i + 1));
    }

    return () => {
      for (let i = 0; i < pageNo.length; i++) {
        pageNo[i].removeEventListener("click", () => setPage(i + 1));
      }
    };
  }, [currentPage, onPageChange]);

  return (
    <div className="pagination">
      <Button
        id="page-buttons-1"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="contained"
      >
        <ArrowBackIcon style={{ marginRight: "10px" }} /> Prev
      </Button>
      <div className="number-cont">
        {Array.from({ length: totalPages }, (_, i) => (
          <div
            key={i + 1}
            className={`number ${currentPage === i + 1 ? "selected" : ""}`}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <Button
        id="page-buttons-2"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="contained"
      >
        Next <ArrowForwardIcon style={{ marginLeft: "10px" }} />
      </Button>
    </div>
  );
}
