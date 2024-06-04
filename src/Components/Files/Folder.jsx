import React from "react";
import FolderIcon from "@mui/icons-material/Folder";

export default function Folder({ meeting, num, date, onClick }) {
  const handleClick = () => {
    onClick(); // Pass the folder name to the parent component
  };

  return (
    <div className="folder" onClick={handleClick}>
      <div className="folder-1">
        <FolderIcon
          fontSize="large"
          style={{ color: "#C5CEE0", padding: "0px" }}
        />
        <div className="folder-text">
          <div className="folder-head">{meeting}</div>
          <div className="folder-para">{num} files</div>
          <div className="folder-date">{date}</div>
        </div>
      </div>
    </div>
  );
}
