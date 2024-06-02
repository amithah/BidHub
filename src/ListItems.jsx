import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listItems, setItem } from "./feature/item/itemSlice";
import Modal from "./ui/Modal";

export function ListItems() {
  const { loading, items } = useSelector((state) => state?.items);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(listItems());
  }, []);

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Items
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {!loading &&
            items?.length > 0 &&
            items?.map((item) => (
              <div key={item._id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src={`https://bidhub.s3.us-east-1.amazonaws.com/${item?.images?.[0]}`}
                    alt={item.name}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                    
                        <span aria-hidden="true" className="absolute inset-0" />
                        {item?.name}
                     
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{item?.desc}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {item?.price}
                  </p>
                </div>
                {!item?.status && user&& item?.addedBy ===user?._id? (
                  <div
                    className="absolute top-0 right-0 cursor-pointer p-2 bg-indigo-600 text-white rounded-md"
                    onClick={() => {
                      dispatch(setItem(item));
                      setOpen(true);
                    }}
                  >
                    Add to Auction
                  </div>
                ) : ''}
              </div>
            ))}
        </div>
      </div>
      <Modal open={open} setOpen={setOpen} />
    </>
  );
}
