import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "./feature/item/itemSlice";

export function AddItem() {
  const { item, loading } = useSelector((state) => state?.items);
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const dispatch = useDispatch();

  const handleAddItem = async (e) => {
    e.preventDefault();
    const data = { name, description: desc, addedBy: user?._id };
    dispatch(addItem(data));
    resetForm();
  };
  const resetForm = () => {
    setName("");
    setDesc("");
  };
  return (
    <>
      <form onSubmit={handleAddItem}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <label htmlFor="name">Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              name="name"
              type="text"
              id="name"
              placeholder="Name"
              className="border border-2 rounded-md"
            />
          </div>

          <div className="flex flex-row gap-2">
            <label htmlFor="desc">Description</label>
            <textarea
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
              name="desc"
              type="text"
              id="desc"
              placeholder="Description"
              className="border border-2 rounded-md"
            />
          </div>
        </div>
        <button className="bg-indigo-600 text-white" type="submit">
          Add Item{loading ? "Loading" : ""}
        </button>
      </form>
      {item && <p>{item?.name}</p>}
    </>
  );
}
