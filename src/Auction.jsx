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

  useEffect(() => {
    // Fetch auction details when component mounts
    dispatch(fetchAuction(id));

    // Initialize socket connection when component mounts
    const newSocket = io(import.meta.env.VITE_REACT_APP_URL, {
      query: { roomId: id },
    });
    setSocket(newSocket);

    // Event listeners for socket events
    newSocket.on("connect", () => {
      console.log("Socket.io connected");
    });

    newSocket.on("previousBids", (data) => {
      console.log("Received previous bids:", data);
      setBidList(data.map((bid) => bid)); // Update bid list with previous bids
    });

    newSocket.on("bid", (bid) => {
      console.log("Received new bid:", bid);
      setBidList((prevBidList) => [...prevBidList, bid]); // Add new bid to bid list
    });

    newSocket.on("disconnect", () => {
      console.log("Socket.io disconnected");
    });

    // Clean-up function to disconnect socket when component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
      dispatch(setAuction(null)); // Reset auction state
    };
  }, [id, dispatch]); // Dependency array ensures useEffect runs only when id or dispatch changes

  const submitBid = () => {
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
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
          <h2 className="text-3xl mb-4 font-bold tracking-tight text-gray-900">
            Auction Details
          </h2>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {auction?.status}
              {auction?.bids?.length > 0 ? (
                <p className="text-gray-500 mb-4">
                  Highest Bid: AED {auction?.bids[0]?.amount}
                </p>
              ) : (
                <p className="text-gray-500 mb-4">No bids yet</p>
              )}
              <p className="text-gray-500 mb-4">
                Created By: {auction?.createdBy?.name}
              </p>
              <p className="text-gray-500 mb-4">
                Created At: {new Date(auction?.createdAt).toLocaleString()}
              </p>
              {auction?.status !== "Finished" && <Timer auction={auction} />}
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div key={auction?._id} className="group relative w-1/2">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    {auction?.item?.images?.[0] && (
                      <img
                        src={`https://bidhub.s3.us-east-1.amazonaws.com/${auction?.item?.images?.[0]}`}
                        alt={auction?.item?.name}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                    )}
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
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                  {auction?.status !== "Finished" &&
                    auction?.createdBy?._id !== user?._id &&
                    auction?.status === "Ongoing" && (
                      <>
                        {/* Input field for bidding */}
                        <div className="col-span-full">
                          <h3 className="text-xl font-semibold mb-2">
                            Submit Bid
                          </h3>
                          <div className="flex gap-4">
                            <input
                              type="text"
                              value={currentBid}
                              onChange={(e) => setCurrentBid(e.target.value)}
                              placeholder="Enter your bid"
                              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                              disabled={!user}
                              onClick={submitBid}
                              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              Submit
                            </button>
                            {!user && (
                              <button
                                onClick={navigate("/")}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                Login
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  {/* Display bid list */}

                  <div className="col-span-full mb-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {bidList?.length === 0 ? "No bids" : "Bid List"}
                    </h3>
                    <ul className="divide-y divide-gray-200">
                      {bidList?.map((bid, index) => (
                        <li key={index} className="py-2">
                          Bid: AED {bid?.amount} -Bidder: {bid?.addedBy?.name}
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
    </>
  );
}
