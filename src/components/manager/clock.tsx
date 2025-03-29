'use client';

import { useState, useEffect } from "react";

function DateTimeDisplay() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(timer); // Clean up the interval on component unmount
    }, []);

    return (
        <div>
            {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
        </div>
    );
}

export default DateTimeDisplay;
