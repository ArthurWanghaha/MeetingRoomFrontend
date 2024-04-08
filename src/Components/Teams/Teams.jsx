import React from 'react';
import Paper from '@material-ui/core/Paper';
import TeamBox from './TeamBox';
import Pagination from '../Pagination/Pagination';
import './Teams.css';


import Michael from '../../Images/Michael.jpg';
import Angela from '../../Images/Angela.jpg';
import Dwight from '../../Images/Dwight.jpg';
import Kelly from '../../Images/Kelly.jpg';
import Pam from '../../Images/Pam.jpg';

export default function Teams() {
    return (
        <div className="teams">
            <Paper elevation={3}>
                <div className="header" style={{paddingTop:'16px'}} >
                    <div className="title" >Teams</div>                    
                </div>
                <div className="teams-cont">
                    <TeamBox title="Regional Manager" image={Michael} name='Michael Scott' /> 
                    <TeamBox title="Assistant Regional Manager" image={Dwight} name = 'Dwight Schrute'/> 
                    <TeamBox title="Accountant" image={Angela} name='Angela Martin' /> 
                    <TeamBox title="Customer Service" image={Kelly} name='Kelly Kapoor' /> 
                    <TeamBox title="Sales" image={Pam} name='Pam Beesly' /> 
                 
                    {/* Add more TeamBox components with different images */}
                </div>
                <Pagination/>
            </Paper>
        </div>
    )
}