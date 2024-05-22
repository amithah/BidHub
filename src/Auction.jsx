import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listAuctions } from "./feature/auction/auctionSlice";
import Modal from "./ui/Modal";
import AuctionCard from "./ui/AuctionCard";
import { useParams } from "react-router-dom";
import Timer from "./ui/Timer";
import { addBid } from "./feature/bid/bidSlice";

export function Auction() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { auction } = useSelector((state) => state?.auctions);
  const [ws, setWs] = useState(null);
  const [currentBid, setCurrentBid] = useState(""); // State to track the current bid value
  const [bidList, setBidList] = useState([]); // State to store the list of bids

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:3000/${id}`);
    setWs(socket);

    socket.onopen = function () {
      console.log("WebSocket connected");
    };

    socket.onmessage = function (event) {
      let data = event.data;

      if (data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function () {
          const convertedData = reader.result;
          try {
            // Parse the converted data into a JSON object
            const jsonData = JSON.parse(convertedData);
            if (jsonData.type === "bid") {
              setBidList((prevBidList) => [...prevBidList, jsonData.value]);
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
            // Handle the error here
          }
          console.log("received (converted from Blob): ", convertedData);
          // Handle the converted data here
        };
        reader.readAsText(data);
      } else {
        console.log("received: ", data);
        // Handle the data here
      }
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [id]);

  useEffect(() => {
    setBidList(auction.bids?.map((x) => x.amount));
  }, [auction]);

  // Function to handle bid submission
  const submitBid = () => {
    if (ws && currentBid !== "") {
      const bidData = { type: "bid", value: currentBid };
      ws.send(JSON.stringify(bidData));
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
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-3xl mb-4font-bold tracking-tight text-gray-900">
            Auction Details
          </h2>
          {auction && auction?.status !== "Finished" && (
            <Timer auction={auction} />
          )}
          <div className="flex flex-row gap-4 mt-2">
            <div key={auction._id} className="group relative w-1/2">
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
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {/* Display bid list */}

              <div className="col-span-full mb-6">
                <h3 className="text-xl font-semibold mb-2">Bid List</h3>
                <ul className="divide-y divide-gray-200">
                  {bidList?.map((bid, index) => (
                    <li key={index} className="py-2">
                      Bid: {bid}
                    </li>
                  ))}
                </ul>
              </div>
              {auction?.status !== "Finished" &&
                auction?.status === "Ongoing" && (
                  <>
                    {/* Input field for bidding */}
                    <div className="col-span-full">
                      <h3 className="text-xl font-semibold mb-2">Submit Bid</h3>
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={currentBid}
                          onChange={(e) => setCurrentBid(e.target.value)}
                          placeholder="Enter your bid"
                          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          onClick={submitBid}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
