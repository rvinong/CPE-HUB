import React, { useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getOrders,
  getProducts,
  getUsers,
  updateProductStock,
  uploadMerchImage,
} from "../api/apiClient";
import { MERCH_STATUS, formatPrice, normalizeMerchList } from "../data/merch";

const emptyProduct = {
  productId: "",
  name: "",
  category: "tshirt",
  status: MERCH_STATUS.AVAILABLE,
  year: new Date().getFullYear(),
  price: "",
  sizes: "",
  image: "",
  quantity: "",
  description: "",
};

const inputClass = "h-11 border border-neutral-950/20 bg-white px-3 text-sm outline-none focus:border-neutral-950";

function ProductForm({ data, setData, mode, onImageUpload, uploading }) {
  const isArchive = data.status === MERCH_STATUS.ARCHIVED;
  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid gap-3 lg:grid-cols-4">
      {mode === "add" && (
        <input
          type="number"
          name="productId"
          placeholder="Product ID"
          value={data.productId}
          onChange={handleChange}
          className={inputClass}
        />
      )}
      <input name="name" placeholder="Name" value={data.name} onChange={handleChange} className={inputClass} />
      <input type="number" name="year" placeholder="Year" value={data.year} onChange={handleChange} className={inputClass} />
      <select name="status" value={data.status} onChange={handleChange} className={inputClass}>
        <option value={MERCH_STATUS.AVAILABLE}>Available</option>
        <option value={MERCH_STATUS.ARCHIVED}>Archive</option>
      </select>
      <select name="category" value={data.category} onChange={handleChange} className={inputClass}>
        <option value="tshirt">Shirt</option>
        <option value="lace">Lace</option>
        <option value="essential">Essential</option>
      </select>
      <input name="image" placeholder="Image URL" value={data.image} onChange={handleChange} className={`${inputClass} lg:col-span-2`} />
      <label className={`${inputClass} flex cursor-pointer items-center gap-3 lg:col-span-2`}>
        <span className="text-sm font-semibold">{uploading ? "Uploading image..." : "Upload image"}</span>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => onImageUpload(event.target.files?.[0], setData)}
          className="hidden"
          disabled={uploading}
        />
      </label>
      {!isArchive && (
        <>
          <input type="number" name="price" placeholder="Price" value={data.price} onChange={handleChange} className={inputClass} />
          <input name="sizes" placeholder="Sizes, comma separated" value={data.sizes} onChange={handleChange} className={inputClass} />
          <input type="number" name="quantity" placeholder="Stock" value={data.quantity} onChange={handleChange} className={inputClass} />
          <input name="description" placeholder="Description" value={data.description} onChange={handleChange} className={`${inputClass} lg:col-span-2`} />
        </>
      )}
    </div>
  );
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProductData, setEditingProductData] = useState(emptyProduct);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [addProductError, setAddProductError] = useState("");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const normalizedProducts = useMemo(
    () => normalizeMerchList(products).sort((a, b) => b.year - a.year || b.productId - a.productId),
    [products]
  );

  useEffect(() => {
    let intervalId;
    if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "orders") {
      fetchUsersAndOrders();
      intervalId = setInterval(fetchUsersAndOrders, 10000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setAddProductError("Could not load products. Check your Supabase configuration.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(Array.isArray(response.data) ? response.data : response.data?.users || []);
    } catch (error) {
      setUsers([]);
    }
  };

  const fetchUsersAndOrders = async () => {
    try {
      const [usersResponse, ordersResponse] = await Promise.all([getUsers(), getOrders()]);
      setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : usersResponse.data?.users || []);
      setOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : []);
    } catch (error) {
      setUsers([]);
      setOrders([]);
    }
  };

  const buildPayload = (data) => {
    const isArchive = data.status === MERCH_STATUS.ARCHIVED;
    return {
      productId: Number(data.productId),
      name: data.name.trim(),
      category: data.category,
      status: data.status,
      year: Number(data.year),
      image: data.image.trim(),
      description: data.description || "",
      price: isArchive ? 0 : Number(data.price || 0),
      sizes: isArchive
        ? []
        : data.sizes
            .split(",")
            .map((size) => size.trim())
            .filter(Boolean),
      quantity: isArchive ? 0 : Number(data.quantity || 0),
    };
  };

  const handleAddProduct = async () => {
    try {
      const productData = buildPayload(newProduct);
      if (!productData.productId || !productData.name || !productData.image || !productData.year) {
        setAddProductError("Product ID, name, image, and year are required.");
        return;
      }
      if (normalizedProducts.some((product) => product.productId === productData.productId)) {
        setAddProductError("Product ID already exists. Use a unique ID.");
        return;
      }
      await createProduct(productData);
      setNewProduct(emptyProduct);
      setAddProductError("");
      fetchProducts();
    } catch (error) {
      setAddProductError("Failed to add product. Please try again.");
    }
  };

  const startEditing = (product) => {
    setEditingProductId(product.productId);
    setEditingProductData({
      productId: product.productId,
      name: product.name,
      category: product.category,
      status: product.status,
      year: product.year,
      price: product.price,
      sizes: product.sizes.join(", "),
      image: product.image,
      quantity: product.quantity,
      description: product.description || "",
    });
  };

  const saveEdit = async () => {
    try {
      await updateProductStock(editingProductId, buildPayload(editingProductData));
      setEditingProductId(null);
      fetchProducts();
    } catch (error) {
      setAddProductError("Failed to update product.");
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      fetchProducts();
    } catch (error) {
      setAddProductError("Failed to delete product.");
    }
  };

  const handleImageUpload = async (file, setData) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const result = await uploadMerchImage(file);
      setData((prev) => ({ ...prev, image: result.data.publicUrl }));
      setAddProductError("");
    } catch (error) {
      setAddProductError("Image upload failed. Check Supabase Storage setup.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="bg-[#f7f4ef] py-10">
      <div className="page-shell">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-500">Admin</p>
        <h1 className="mt-2 text-4xl font-black uppercase">Dashboard</h1>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-neutral-950">
          {[
            ["products", "Products"],
            ["users", "Users"],
            ["orders", "Orders"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] ${
                activeTab === key ? "bg-neutral-950 text-white" : "bg-white text-neutral-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "products" && (
          <section className="mt-8 grid gap-8">
            <div className="bg-white p-5">
              <h2 className="text-lg font-black uppercase">Add Merch</h2>
              <p className="mt-2 text-sm text-neutral-500">
                Available merch can be ordered. Archive merch only needs photo, name, and year.
              </p>
              <div className="mt-5">
                <ProductForm
                  data={newProduct}
                  setData={setNewProduct}
                  mode="add"
                  onImageUpload={handleImageUpload}
                  uploading={uploadingImage}
                />
              </div>
              {addProductError && <p className="mt-4 text-sm font-semibold text-red-600">{addProductError}</p>}
              <button
                type="button"
                onClick={handleAddProduct}
                className="mt-5 bg-neutral-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
              >
                Add Merch
              </button>
            </div>

            <div className="overflow-auto bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-neutral-950 bg-neutral-950 text-white">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {normalizedProducts.map((product) =>
                    editingProductId === product.productId ? (
                      <tr key={product.productId} className="border-b border-neutral-950/10 align-top">
                        <td className="px-4 py-4 font-semibold">{product.productId}</td>
                        <td colSpan={7} className="px-4 py-4">
                          <ProductForm
                            data={editingProductData}
                            setData={setEditingProductData}
                            mode="edit"
                            onImageUpload={handleImageUpload}
                            uploading={uploadingImage}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button type="button" onClick={saveEdit} className="bg-neutral-950 px-3 py-2 text-xs font-bold uppercase text-white">
                              Save
                            </button>
                            <button type="button" onClick={() => setEditingProductId(null)} className="border border-neutral-950 px-3 py-2 text-xs font-bold uppercase">
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={product.productId} className="border-b border-neutral-950/10">
                        <td className="px-4 py-4 font-semibold">{product.productId}</td>
                        <td className="px-4 py-4">
                          <img src={product.image} alt={product.name} className="h-14 w-14 bg-[#f7f4ef] object-contain p-1" />
                        </td>
                        <td className="px-4 py-4 font-semibold">{product.name}</td>
                        <td className="px-4 py-4">{product.year}</td>
                        <td className="px-4 py-4 capitalize">{product.status}</td>
                        <td className="px-4 py-4 capitalize">{product.category}</td>
                        <td className="px-4 py-4">
                          {product.status === MERCH_STATUS.ARCHIVED ? "-" : formatPrice(product.price)}
                        </td>
                        <td className="px-4 py-4">{product.status === MERCH_STATUS.ARCHIVED ? "-" : product.quantity}</td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button type="button" onClick={() => startEditing(product)} className="border border-neutral-950 px-3 py-2 text-xs font-bold uppercase">
                              Edit
                            </button>
                            <button type="button" onClick={() => handleDelete(product.productId)} className="bg-red-600 px-3 py-2 text-xs font-bold uppercase text-white">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "users" && (
          <section className="mt-8 overflow-auto bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-neutral-950 text-white">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Birthday</th>
                  <th className="px-4 py-3">Mobile</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-neutral-950/10">
                    <td className="px-4 py-4">{user.name}</td>
                    <td className="px-4 py-4">{user.birthday ? new Date(user.birthday).toLocaleDateString() : ""}</td>
                    <td className="px-4 py-4">{user.mobile || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === "orders" && (
          <section className="mt-8 overflow-auto bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-neutral-950 text-white">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-neutral-950/10 align-top">
                    <td className="px-4 py-4">{order._id}</td>
                    <td className="px-4 py-4">{order.userId?.name || order.userId?.email || "Unknown"}</td>
                    <td className="px-4 py-4">
                      {order.items.map((item) => (
                        <div key={`${order._id}-${item.productId}-${item.size || ""}`}>
                          {item.name} x {item.qty}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-4">{formatPrice(order.total)}</td>
                    <td className="px-4 py-4">{order.status}</td>
                    <td className="px-4 py-4">{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
