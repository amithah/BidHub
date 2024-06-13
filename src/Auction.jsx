import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuction, setAuction } from "./feature/auction/auctionSlice";
import { useNavigate, useParams } from "react-router-dom";
import Timer from "./ui/Timer";
import { addBid } from "./feature/bid/bidSlice";
import Loader from "./ui/Loader";
import { io } from "socket.io-client";

export function Auction() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isLoading, auction } = useSelector((state) => state?.auctions);
  const [socket, setSocket] = useState(null);
  const [currentBid, setCurrentBid] = useState("");
  const [bidList, setBidList] = useState([]);
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
          remainingTime = null; // Ensure we do not display negative time
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
  useEffect(() => {
    // Fetch auction details when component mounts
    dispatch(fetchAuction(id));

    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_REACT_APP_URL, {
      query: { roomId: id },
    });
    setSocket(newSocket);

    // Event listeners for socket events
    newSocket.on("connect", () => {
      // console.log("Socket.io connected");
    });

    newSocket.on("previousBids", (data) => {
      // console.log("Received previous bids:", data);
      setBidList(data);
    });

    const updateBidList = (bid) => {
      // console.log(bid?.value);
      setBidList((prevBidList) => [bid?.value, ...prevBidList]);
    };
    newSocket.on("message", updateBidList);

    newSocket.on("disconnect", () => {
      // console.log("Socket.io disconnected");
    });

    // Clean-up function
    return () => {
      newSocket.disconnect();
      dispatch(setAuction(null));
    };
  }, [id, dispatch]);

  const submitBid = (e) => {
    e.preventDefault();
    if (socket && currentBid !== "") {
      const bidData = {
        type: "bid",
        value: {
          amount: currentBid,
          auction: auction?._id,
          addedBy: user,
        },
      };

      // Emit the bidData using socket.io
      socket.emit("message", bidData);

      const data = {
        amount: currentBid,
        auction: auction?._id,
        addedBy: user?._id,
      };

      dispatch(addBid(data));
      setCurrentBid(""); // Clear the input field after submitting the bid
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Auction Details
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {auction?.item?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Duration: {auction?.duration / 60000} Minutes
                  </p>
                </div>
                <p className="text-lg font-medium text-gray-900">
                  Starting Price: AED {auction?.price}
                </p>
              </div>

              {auction?.status !== "Finished" && <Timer auction={auction} />}
              {/* <p className="text-sm text-gray-700 mb-2">
                Status: {auction?.status}
              </p> */}
              {auction?.bids?.length > 0 ? (
                <p className="text-gray-700 mb-4">
                  Highest Bid: AED {auction?.bids[0]?.amount}
                </p>
              ) : (
                <p className="text-gray-700 mb-4">No bids yet</p>
              )}
              <p className="text-gray-700 mb-4">
                Created By: {auction?.createdBy?.name}
              </p>
              <p className="text-gray-700 mb-4">
                Created At: {new Date(auction?.createdAt).toLocaleString()}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
    
                <div className="group relative">
                  <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-md bg-gray-200">
                    {auction?.item?.images?.[0] && (
                      <img
                        src={`https://bidhub.s3.us-east-1.amazonaws.com/${auction?.item?.images?.[0]}`}
                        alt={auction?.item?.name}
                        className="h-full w-full object-cover object-center"
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                {auction?.status !== "Finished" &&
                  auction?.createdBy?._id !== user?._id &&
                  !timeUntilStart && countdown !==null &&(
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Submit Bid</h3>
                      <form onSubmit={submitBid} className="flex gap-4">
                        <input
                          type="number"
                          value={currentBid}
                          onChange={(e) => setCurrentBid(e.target.value)}
                          placeholder="Enter your bid"
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                          max={ auction?.price + 1000}
                          min={auction?.bids?.[0]?.amount + 1 || auction?.price + 1}
                  
                        />
                        <button
                          type="submit"
                          disabled={!user}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          Submit
                        </button>
                      </form>
                      {!user && (
                        <div className="mt-4">
                          <button
                            onClick={() => navigate("/")}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            Login
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                <div className="p-8 bg-gray-100 rounded-md">
                <h3 className="text-xl font-semibold mb-4">
                  {bidList?.length === 0 ? "No bids" : "Bid List"}
                </h3>
                <ul className="divide-y divide-gray-200">
                  {bidList?.map((bid, index) => (
                    <li key={index} className="py-4">
                      <div className="flex flex-row gap-2">
                      <div className="bg-indigo-600 text-white px-4 py-2 rounded-md">
                      <p className="text-white">
                         AED {bid?.amount}
                      </p>                    
                      </div>
                      <div className="bg-gray-300 text-black px-4 py-2 rounded-md">
                     {bid?.addedBy?.name}
                      </div>
                      </div>
                    </li>
                  ))}
                </ul>
                </div>
              </div>
             
              </div>


            </>
          )}
        </div>
      </div>
    </div>
  );
}
