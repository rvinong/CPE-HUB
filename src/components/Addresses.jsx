import React, { useEffect, useState } from "react";
import { createAddress, deleteAddress, getAddresses, updateAddress } from "../api/apiClient";

const emptyAddress = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "Philippines",
  phone: "",
};

const inputClass = "w-full border border-neutral-950/20 bg-[#f7f4ef] px-3 py-2 outline-none focus:border-neutral-950";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [editingId, setEditingId] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchAddresses = async () => {
    try {
      const response = await getAddresses();
      setAddresses(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChangeNew = (event) => {
    const { name, value } = event.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeEdit = (event) => {
    const { name, value } = event.target;
    setEditingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    try {
      const response = await createAddress(newAddress);
      setAddresses((prev) => [...response.data, ...prev]);
      setNewAddress(emptyAddress);
      setError(null);
    } catch (err) {
      setError("Failed to add address.");
    }
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    try {
      const response = await updateAddress(editingId, editingAddress);
      setAddresses((prev) => prev.map((address) => (address.id === editingId ? response.data : address)));
      setEditingId(null);
      setEditingAddress(null);
      setError(null);
    } catch (err) {
      setError("Failed to update address.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((address) => address.id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete address.");
    }
  };

  if (loading) return <div>Loading addresses...</div>;

  return (
    <div>
      <h3 className="text-xl font-semibold">Your Addresses</h3>
      {error && <div className="mt-3 text-sm font-semibold text-red-600">{error}</div>}
      {addresses.length === 0 && <div className="mt-4 text-neutral-600">No addresses found.</div>}

      <div className="mt-4 grid gap-4">
        {addresses.map((address) =>
          editingId === address.id ? (
            <form key={address.id} onSubmit={handleSaveEdit} className="grid gap-3 border border-neutral-950/10 bg-white p-4">
              {["street", "city", "state", "zip", "country", "phone"].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={editingAddress[field] || ""}
                  onChange={handleChangeEdit}
                  placeholder={field}
                  className={inputClass}
                  required
                />
              ))}
              <div className="flex gap-2">
                <button type="submit" className="bg-neutral-950 px-4 py-2 text-white">
                  Save
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="border border-neutral-950 px-4 py-2">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div key={address.id} className="border border-neutral-950/10 bg-white p-4">
              <p>{address.street}, {address.city}, {address.state}, {address.zip}</p>
              <p>{address.country}</p>
              <p>Phone: {address.phone}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(address.id);
                    setEditingAddress(address);
                  }}
                  className="border border-neutral-950 px-3 py-1"
                >
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(address.id)} className="bg-red-600 px-3 py-1 text-white">
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>

      <h3 className="mt-8 text-xl font-semibold">Add New Address</h3>
      <form onSubmit={handleAdd} className="mt-4 grid gap-3 border border-neutral-950/10 bg-white p-4">
        {["street", "city", "state", "zip", "country", "phone"].map((field) => (
          <input
            key={field}
            name={field}
            value={newAddress[field]}
            onChange={handleChangeNew}
            placeholder={field}
            className={inputClass}
            required
          />
        ))}
        <button type="submit" className="bg-neutral-950 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
          Add Address
        </button>
      </form>
    </div>
  );
};

export default Addresses;
