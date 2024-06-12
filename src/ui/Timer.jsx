import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateAuction } from "../feature/auction/auctionSlice";

function Timer({ auction }) {
  const dispatch = useDispatch();
  const [timeUntilStart, setTimeUntilStart] = useState(null);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const currentTime = new Date().getTime();
      const startTime = new Date(auction?.startTime).getTime();

      if (startTime > currentTime) {
        const difference = startTime - currentTime;
        setTimeUntilStart(difference);
        setCountdown(null);
      }  else {
        const endTime = startTime + auction?.duration;
        let remainingTime = endTime - currentTime;
        if (remainingTime <= 0) {
          remainingTime = 0; // Ensure we do not display negative time
          // dispatch(updateAuction(auction?.id, { status: "Finished" }));

          // Optionally, you can add any additional logic here, like stopping the auction
        }
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

    return (
      <>
        <div className="flex items-start justify-center w-full gap-4 count-down-main">
          <div className="timer w-16">
            <div className=" bg-indigo-600 py-4 px-2 rounded-lg overflow-hidden">
              <h3 className="countdown-element minutes font-Cormorant font-semibold text-2xl text-white text-center">
                {minutes > 0 ? minutes : "0"}
              </h3>
            </div>
            <p className="text-lg font-Cormorant font-normal text-gray-900 mt-1 text-center w-full">
              {" "}
              minutes
            </p>
          </div>
          <h3 className="font-manrope font-semibold text-2xl text-gray-900">
            :
          </h3>
          <div className="timer w-16">
            <div className=" bg-indigo-600 py-4 px-2 rounded-lg overflow-hidden ">
              <h3 className="countdown-element seconds font-Cormorant font-semibold text-2xl text-white text-center animate-countinsecond">
                {seconds > 0 ? seconds : "0"}
              </h3>
            </div>
            <p className="text-lg font-Cormorant font-normal text-gray-900 mt-1 text-center w-full">
              seconds
            </p>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {timeUntilStart !== null && (
        <div>Auction will start in {formatTime(timeUntilStart / 1000)}</div>
      )}
      {countdown !== null && (
        <div>Time left: {formatTime(countdown / 1000)}</div>
      )}
    </>
  );
}

export default Timer;
