import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listAuctions } from "./feature/auction/auctionSlice";
import Modal from "./ui/Modal";
import AuctionCard from "./ui/AuctionCard";
import Loader from "./ui/Loader";

export function ListAuctions() {
  const { isLoading, auctions } = useSelector((state) => state?.auctions);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(listAuctions());
  }, []);

  return (
    <>
      <div className="bg-white ">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Auctions
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {isLoading ? (
              <Loader/>
            ) :
              auctions?.length > 0 &&
              auctions?.map((auction) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))}
          </div>
        </div>
      </div>
      <Modal open={open} setOpen={setOpen} />
    </>
  );
}
