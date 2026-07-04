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

const inputClass = "ui-input w-full px-3 py-2";

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
      {error && <div className="error-text mt-3 text-sm font-semibold">{error}</div>}
      {addresses.length === 0 && <div className="mt-4 text-neutral-600">No addresses found.</div>}

      <div className="mt-4 grid gap-4">
        {addresses.map((address) =>
          editingId === address.id ? (
            <form key={address.id} onSubmit={handleSaveEdit} className="surface-panel grid gap-3 p-4">
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
                <button type="submit" className="ui-button-primary px-4 py-2">
                  Save
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="ui-button-secondary px-4 py-2">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div key={address.id} className="surface-panel p-4">
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
                  className="ui-button-secondary px-3 py-2"
                >
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(address.id)} className="ui-button-danger px-3 py-2">
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>

      <h3 className="mt-8 text-xl font-semibold">Add New Address</h3>
      <form onSubmit={handleAdd} className="surface-panel mt-4 grid gap-3 p-4">
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
        <button type="submit" className="ui-button-primary px-4 py-3">
          Add Address
        </button>
      </form>
    </div>
  );
};

export default Addresses;
