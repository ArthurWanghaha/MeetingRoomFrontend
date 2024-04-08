import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import './Calendar.css';
import 'react-calendar/dist/Calendar.css';

export default function MyCalendar() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className="calendar-containers">
            <Paper elevation={3} className="calendar-paper">
              
                <Calendar
                    onClickDay={handleDateClick}
                    value={selectedDate}
                    className="calendar"
                />
            </Paper>
            
        </div>
    );
}
