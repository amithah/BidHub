import axios from "axios";
import { useState } from "react";

export function AddItem() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleAddItem = async (e) => {
    e.preventDefault();
    const data = { name, description: desc };
    const headers = new Headers();
    await axios.post(`http://localhost:3000/item`, data, headers);
  };
  return (
    <>
      <form onSubmit={handleAddItem}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <label htmlFor="name">Name</label>
            <input
              onChange={(e) => setName(e.value)}
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
              onChange={(e) => setDesc(e.value)}
              name="desc"
              type="text"
              id="desc"
              placeholder="Description"
              className="border border-2 rounded-md"
            />
          </div>
        </div>
        <button type="submit" >Add Item</button>
      </form>
    </>
  );
}
