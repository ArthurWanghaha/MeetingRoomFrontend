import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DocumentIcon from '@mui/icons-material/Article';
import Folder from './Folder';
import './Files.css';
import api from '../../api/axiosConfig';

export default function Files() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                // Fetch documents for the selected folder from the backend
                const response = await api.get(`/documents/folder/${selectedFolder}`);
                setDocuments(response.data);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        if (selectedFolder) {
            fetchDocuments();
        }
    }, [selectedFolder]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFolderClick = (folderName) => {
        setSelectedFolder(folderName);
    };

    const handleUpload = () => {
    // Trigger the file input element
    document.getElementById('fileInput').click();
};

const handleFileChange = (event) => {
    // Update the selected files state
    setSelectedFiles(event.target.files);
    // Call handleFileUpload directly when files are selected
    handleFileUpload(event.target.files);
};

const handleFileUpload = async (files) => {
    try {
        const formData = new FormData();
        formData.append('folderName', selectedFolder);
        console.log(selectedFolder);
        Array.from(files).forEach((file) => {
            formData.append('document', file);
            console.log(file);
            formData.append('title', file.name);
            console.log(file.name);
        });

        console.log(formData);

        // Upload files to the backend
        await api.post('/documents/add', formData);

        // Refresh the document list
        setSelectedFiles(null);
        setSelectedFolder(null);
    } catch (error) {
        console.error('Error uploading files:', error);
        // Handle error (display error message, etc.)
    }
};

    return (
        <div className="files">
            <Paper elevation={3} style={{ paddingBottom: '10px' }}>
                <div className="header" style={{ borderBottom: '1px solid #a8a8a850' }}>
                    <div className="title">Forms & Files</div>
                    <div className="progress-right">
                        <div>
                            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                                Sort By <ExpandMoreIcon />
                            </Button>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>Date of Activity</MenuItem>
                                <MenuItem onClick={handleClose}>Name of Activity</MenuItem>
                                <MenuItem onClick={handleClose}>Place</MenuItem>
                            </Menu>
                        </div>
                    </div>
                </div>
                <div className="folder-cont">
                    <Folder meeting='Sales Week 22 Meeting' num='6' onClick={() => handleFolderClick('Sales Week 22 Meeting')} />
                    <Folder meeting='Client Meeting With Christian' num='2' onClick={() => handleFolderClick('Client Meeting With Christian')} />
                    <Folder meeting='Dunder Mifflin Infinity 2.0' num='6' onClick={() => handleFolderClick('Dunder Mifflin Infinity 2.0')} />
                    <Folder meeting='Diversity Day' num='3' onClick={() => handleFolderClick('Diversity Day')} />
                    <Folder meeting='CPR training' num='4' onClick={() => handleFolderClick('CPR training')} />
                    <Folder meeting='Public Display of Affection' num='5' onClick={() => handleFolderClick('Public Display of Affection')} />
                </div>
                {selectedFolder && (
                    <div className="overlay">
                        <div className="overlay-content">
                            <h2>{selectedFolder}</h2>
                            {documents.map(document => (
                                <div key={document.id}>
                                    <a href={`http://localhost:8080/documents/download/${document.id}`} download>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <DocumentIcon style={{ color: 'blue', marginRight: '8px' }} /> {/* Render document icon */}
                                            <span>{document.title}</span>
                                        </div>
                                    </a>
                                </div>
                            ))}
                            <input id="fileInput" type="file" multiple style={{ display: 'none' }} onChange={handleFileChange} />
                            <div>
                                <Button variant="contained" color="primary" onClick={handleUpload}>Upload</Button>
                                <Button variant="contained" color="secondary" onClick={() => setSelectedFolder(null)}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                )}
            </Paper>
        </div>
    )
}
