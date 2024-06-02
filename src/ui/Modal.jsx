import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { addAuction } from "../feature/auction/auctionSlice";
import { listItems } from "../feature/item/itemSlice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useNavigate } from "react-router-dom";

export default function Modal({ open, setOpen }) {
  const { user } = useSelector((state) => state.auth);
  const { loading, item } = useSelector((state) => state.items);
  const [price, setPrice] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [startTime, setStartTime] = useState(new Date().getTime()+ 10 * 60 * 1000);
  const [error, setError] = useState("");
  const [duration, setDuration] = useState("600000");

  const handleDateChange = (newValue) => {
    const now = new Date().getTime();
    const tenMinutesFromNow = now + 10 * 60 * 1000;

    if (newValue.getTime() >= tenMinutesFromNow) {
      setStartTime(newValue.getTime());
      setError("");
    } else {
      setError("The start time must be at least 10 minutes in the future.");
    }
  };

  const dispatch = useDispatch();
  const navigate =useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
        // Validate fields
        if (!price || !reservePrice || !duration || !startTime) {
          setError("All fields are mandatory.");
          return;
        }
    const data = {
      item: item._id,
      price: Number(price),
      reservePrice: Number(reservePrice),
      duration: Number(duration),
      startTime: startTime,
      createdBy: user?._id,
    };

    dispatch(addAuction(data));
    dispatch(listItems());
    setOpen(false);
    navigate('/auctions')
    resetForm();
  };

  const resetForm = () => {
    setPrice("");
    setReservePrice("");
    setDuration("");
    setStartTime(new Date().getTime()+ 10 * 60 * 1000);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create Auction for - {item?.name}
                  </Dialog.Title>
                  <div className="mt-4">
                    <form onSubmit={handleAdd} className="space-y-4">
                      <div className="flex flex-col gap-2 justify-start items-start">
                        <label
                          htmlFor="duration"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Duration
                        </label>
                        <select
                        required
                          onChange={(e) => setDuration(e.target.value)}
                          id="duration"
                          name="duration"
                          className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="600000">10 Minutes</option>
                          <option value="1200000">20 Minutes</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2 justify-start items-start">
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Initial Price (AED)
                        </label>
                        <input
                        required
                          onChange={(e) => setPrice(e.target.value)}
                          value={price}
                          name="price"
                          type="text"
                          id="price"
                          placeholder="Initial Price"
                          className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="flex flex-col gap-2 justify-start items-start">
                        <label
                          htmlFor="reservePrice"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Reserve Price (AED)<span className="text-sm" >{`( Minimium amount that a seller will accept as the winning bid)`}</span>
                        </label>
                        <input
                        required
                          onChange={(e) => setReservePrice(e.target.value)}
                          value={reservePrice}
                          name="reservePrice"
                          type="number"
                          id="reservePrice"
                          placeholder="Reserve Price"
                          className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="flex flex-col gap-2 justify-start items-start">
                        <label
                          htmlFor="startTime"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Start Time
                        </label>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DateTimePicker
                            disablePast
                            value={new Date(startTime)}
                            onChange={handleDateChange}
                            renderInput={(params) => (
                              <input
                                {...params.inputProps}
                                className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            )}
                          />
                        </LocalizationProvider>
                        {error && (
                          <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="mt-4 inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        {loading ? "Loading" : "Add Auction"}
                      </button>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
