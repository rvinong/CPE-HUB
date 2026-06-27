import React, { useEffect, useState } from 'react';
import apiClient, { setAuthToken } from '../api/apiClient';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('token');
        setAuthToken(token);
        const response = await apiClient.get('/addresses');
        setAddresses(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load addresses.');
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleChangeNew = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      setAuthToken(token);
      const response = await apiClient.post('/addresses', newAddress);
      setAddresses(response.data);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
      });
      setError(null);
    } catch (err) {
      setError('Failed to add address.');
    }
  };

  const handleEdit = (address) => {
    setEditingId(address.id || address._id);
    setEditingAddress(address);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingAddress(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      setAuthToken(token);
      await apiClient.put(`/addresses/${editingId}`, editingAddress);
      const updatedAddresses = addresses.map((addr) =>
        (addr.id || addr._id) === editingId ? editingAddress : addr
      );
      setAddresses(updatedAddresses);
      setEditingId(null);
      setEditingAddress(null);
      setError(null);
    } catch (err) {
      setError('Failed to update address.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      setAuthToken(token);
      await apiClient.delete(`/addresses/${id}`);
      setAddresses(addresses.filter((addr) => (addr.id || addr._id) !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete address.');
    }
  };

  if (loading) return <div>Loading addresses...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Your Addresses</h3>
      {addresses.length === 0 && <div>No addresses found.</div>}
      {addresses.map((address) =>
        editingId === (address.id || address._id) ? (
          <form key={address.id || address._id} onSubmit={handleSaveEdit} className="mb-4 border p-4 rounded">
            <input
              name="street"
              value={editingAddress.street}
              onChange={handleChangeEdit}
              placeholder="Street"
              className="w-full mb-2 border border-gray-300 rounded px-2 py-1"
              required
            />
            <input
              name="city"
              value={editingAddress.city}
              onChange={handleChangeEdit}
              placeholder="City"
              className="w-full mb-2 border border-gray-300 rounded px-2 py-1"
              required
            />
            <input
              name="state"
              value={editingAddress.state}
              onChange={handleChangeEdit}
              placeholder="State"
              className="w-full mb-2 border border-gray-300 rounded px-2 py-1"
              required
            />
            <input
              name="zip"
              value={editingAddress.zip}
              onChange={handleChangeEdit}
              placeholder="Zip"
              className="w-full mb-2 border border-gray-300 rounded px-2 py-1"
              required
            />
            <input
              name="country"
              value={editingAddress.country}
              onChange={handleChangeEdit}
              placeholder="Country"
              className="w-full mb-2 border border-gray-300 rounded px-2 py-1"
              required
            />
            <input
              name="phone"
              value={editingAddress.phone}
              onChange={handleChangeEdit}
              placeholder="Phone"
              className="w-full mb-2 border border-gray-300 rounded px-2 py-1"
              required
            />
            <div className="flex space-x-2">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
                Save
              </button>
              <button type="button" onClick={handleCancelEdit} className="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div key={address.id || address._id} className="border p-4 mb-4 rounded shadow">
            <p>{address.street}, {address.city}, {address.state}, {address.zip}</p>
            <p>{address.country}</p>
            <p>Phone: {address.phone}</p>
            <div className="mt-2 space-x-2">
              <button onClick={() => handleEdit(address)} className="bg-indigo-600 text-white px-3 py-1 rounded">
                Edit
              </button>
              <button onClick={() => handleDelete(address.id || address._id)} className="bg-red-600 text-white px-3 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        )
      )}
      <h3 className="text-xl font-semibold mt-6 mb-4">Add New Address</h3>
      <form onSubmit={handleAdd} className="mb-4 border p-4 rounded">
        <input
          name="street"
          value={newAddress.street}
          onChange={handleChangeNew}
          placeholder="Street"
          className="w-full mb-2 border border-gray-300 rounded px-2 py-1"
          required
        />
        <input
          name="city"
          value={newAddress.city}
          onChange={handleChangeNew}
          placeholder="City"
          className="w-full mb-2 border border-gray-300 rounded px-2 py-1"
          required
        />
        <input
          name="state"
          value={newAddress.state}
          onChange={handleChangeNew}
          placeholder="State"
          className="w-full mb-2 border border-gray-300 rounded px-2 py-1"
          required
        />
        <input
          name="zip"
          value={newAddress.zip}
          onChange={handleChangeNew}
          placeholder="Zip"
          className="w-full mb-2 border border-gray-300 rounded px-2 py-1"
          required
        />
        <input
          name="country"
          value={newAddress.country}
          onChange={handleChangeNew}
          placeholder="Country"
          className="w-full mb-2 border border-gray-300 rounded px-2 py-1"
          required
        />
        <input
          name="phone"
          value={newAddress.phone}
          onChange={handleChangeNew}
          placeholder="Phone"
          className="w-full border border-gray-300 rounded px-2 py-1"
          required
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900">
          Add Address
        </button>
      </form>
    </div>
  );
};

export default Addresses;
