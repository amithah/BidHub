import { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setAuction } from "../feature/auction/auctionSlice";
import { useNavigate } from "react-router-dom";

const AuctionCard = ({ auction }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        let remainingTime = endTime - currentTime;
        if (remainingTime <= 0) {
          remainingTime = 0; // Ensure we do not display negative time
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

    return `${hours > 0 ? hours + "h " : ""}${
      minutes > 0 ? minutes + "m " : ""
    }${seconds}s`;
  };

  return (
    <>
      <div
        key={auction._id}
        className="group relative"
        onClick={() => {
          navigate(`/auction/${auction?._id}`);
        }}
      >
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
          <img
            src={`https://bidhub.s3.us-east-1.amazonaws.com/${auction?.item?.images[0]}`}
            alt={auction?.item?.name}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">
              <span aria-hidden="true" className="absolute inset-0" />
              {auction?.item?.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {auction?.duration / 60000} Minutes
            </p>
          </div>
          <p className="text-sm font-medium text-gray-900">
            AED {auction?.price}
          </p>
        </div>
        <div className="mt-4 flex justify-between">
          {auction.status !== "Finished" && (
            <>
              {timeUntilStart !== null && (
                <div>Starts in {formatTime(timeUntilStart / 1000)}</div>
              )}
              {countdown !== null && (
                <div>Time left: {formatTime(countdown / 1000)}</div>
              )}
            </>
          )}
          {auction.status}-{auction?.bids?.length} bids
        </div>
      </div>
    </>
  );
};
export default AuctionCard;
