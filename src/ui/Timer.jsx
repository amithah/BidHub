import React, { useEffect, useState } from "react";

function Timer({ auction }) {
    const [timeUntilStart, setTimeUntilStart] = useState(null);
    const [countdown, setCountdown] = useState(null);
  
    useEffect(() => {
      const calculateTimeLeft = () => {
        const currentTime = new Date().getTime();
        const startTime = new Date(auction.startTime).getTime();
  
        if (startTime > currentTime) {
          const difference = startTime - currentTime;
          setTimeUntilStart(difference);
          setCountdown(null);
        } else {
          const endTime = startTime + auction.duration;
          const remainingTime = endTime - currentTime;
          setCountdown(remainingTime);
          setTimeUntilStart(null);
        }
      };
  
      calculateTimeLeft();
  
      const timer = setInterval(() => {
        calculateTimeLeft();
      }, 1000);
  
      return () => clearInterval(timer);
    }, [auction]);
  // Format elapsed time as HH:MM:SS
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${hours > 0 ? hours + "h " : ""}${minutes > 0 ? minutes + "m " : ""}${seconds}s`;
  };

  return (
    <>
          {timeUntilStart !== null && <div>Auction will start in {formatTime(timeUntilStart / 1000)}</div>}
      {countdown !== null && <div>Time left: {formatTime(countdown / 1000)}</div>}
</>
  );
}

export default Timer;
