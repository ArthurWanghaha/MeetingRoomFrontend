import React from 'react';
import Avatar from '@material-ui/core/Avatar';

export default function TeamBox({title, image, name}) {
    return (
        <div className="team-box">
            <Avatar style={{height:'50px',width:'50px'}} src={image}/> {/* Use passed image source */}
            <div className="team-box-text">
                <div className="team-box-title">{title}</div>
                <div className="team-box-para">{name}</div>
            </div>
        </div>
    )
}
