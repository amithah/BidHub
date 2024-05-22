import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, uploadToS3 } from "./feature/item/itemSlice";

export function AddItem() {
  const { item, loading } = useSelector((state) => state?.items);
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState();
  const [desc, setDesc] = useState("");
  const dispatch = useDispatch();

  const handleAddItem = async (e) => {
    e.preventDefault();
    const data = {
      name,
      description: desc,
      addedBy: user?._id,
      images: [image],
    };

    await uploadToS3(file, file.name);
    dispatch(addItem(data));
    resetForm();
  };
  const resetForm = () => {
    setName("");
    setDesc("");
  };
  const handleChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(file.name);
      setFile(file);
    } else {
      setImage(null);
      setFile(null);
    }
  };

  return (
    <>
    
 <div className="flex justify-center mt-12 flex-col items-center">
 {item && (
        <div className="mt-2 p-2 bg-green-100 text-green-700 border border-green-300 rounded">
          <p>Item added: {item.name}</p>
        </div>
      )}
      <form onSubmit={handleAddItem} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Item</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            name="name"
            type="text"
            id="name"
            placeholder="Name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="desc" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            name="desc"
            id="desc"
            placeholder="Description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Image</label>
          <input
            onChange={handleChange}
            name="image"
            type="file"
            id="image"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {file && <img src={URL.createObjectURL(file)} alt="Preview" className="mt-4 h-28 w-full object-cover" />}
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {loading ? "Loading..." : "Add Item"}
          </button>
        </div>
      </form>

    </div>

    </>
  );
}
