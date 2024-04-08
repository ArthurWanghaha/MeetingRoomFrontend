import React from 'react';
import FolderIcon from '@material-ui/icons/Folder';

export default function Folder({ meeting, num, onClick }) {
    const handleClick = () => {
        onClick(meeting); // Pass the folder name to the parent component
    };

    return (
        <div className='folder' onClick={handleClick}>
            <div className="folder-1">
                <FolderIcon fontSize="large" style={{ color: '#C5CEE0', padding: '0px' }} />
                <div className="folder-text">
                    <div className="folder-head">{meeting}</div>
                    <div className="folder-para">{num} files</div>
                </div>
            </div>
        </div>
    );
}
