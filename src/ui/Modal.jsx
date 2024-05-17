import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";

export default function Modal({ open, setOpen }) {
  const { user } = useSelector((state) => state.auth);
  const { item } = useSelector((state) => state.items);
  const [price, setPrice] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [duration, setDuration] = useState("");

  const dispatch = useDispatch();

  const handleAdd = async (e) => {
    e.preventDefault();
    const data = {
      item: item._id,
      price,
      reservePrice,
      duration,
      createdBy: user?._id,
    };
    //   dispatch(addItem(data));
    resetForm();
  };
  const resetForm = () => {
    setPrice("");
    setReservePrice("");
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

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div> */}
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Add to Auction -{item?.name}
                    </Dialog.Title>
                    <div className="mt-2">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2">
                          <label
                            htmlFor="duration"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Duration
                          </label>
                          <div className="mt-2">
                            <select
                              id="duration"
                              name="duration"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                              <option>10 Minute</option>
                              <option>20 Minute</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex flex-row gap-2">
                          <label htmlFor="price">Price</label>
                          <input
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                            name="price"
                            type="text"
                            id="price"
                            placeholder="price"
                            className="border border-2 rounded-md"
                          />
                        </div>

                        <div className="flex flex-row gap-2">
                          <label htmlFor="reservePrice">Reserve Price</label>
                          <input
                            onChange={(e) => setReservePrice(e.target.value)}
                            value={reservePrice}
                            name="reservePrice"
                            type="number"
                            id="reservePrice"
                            placeholder="Reserve Price"
                            className="border border-2 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={(e) => handleAdd(e)}
                  >
                    Add
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
