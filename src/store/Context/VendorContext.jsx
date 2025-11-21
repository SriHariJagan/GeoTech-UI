import { createContext, useState, useEffect } from "react";

export const VendorContext = createContext();

export const VendorProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy Data (Fallback)
  const dummyData = [
    {
      id: 1,
      name: "ABC Supplies",
      company: "ABC Ltd.",
      contactPerson: "John Doe",
      phone: "9876543210",
      email: "abc@example.com",
      address: "123 Main St",
      depthHardRock: 120,
      depthSoftRock: 80,
    },
    {
      id: 2,
      name: "XYZ Materials",
      company: "XYZ Pvt. Ltd.",
      contactPerson: "Jane Smith",
      phone: "9876543211",
      email: "xyz@example.com",
      address: "456 Second St",
      depthHardRock: 100,
      depthSoftRock: 70,
    },
  ];

  const API_URL = "https://api.example.com/vendors"; // Change to your API

  // -------------------------------------------------------------------
  // FETCH Vendors
  // -------------------------------------------------------------------
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();

      setVendors(data.length ? data : dummyData);
    } catch (err) {
      console.error("API fetch failed. Using dummy data.", err);
      setVendors(dummyData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // -------------------------------------------------------------------
  // ADD Vendor
  // -------------------------------------------------------------------
  const addVendor = async (vendor) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendor),
      });

      if (!res.ok) throw new Error("API Add Error");

      const newVendor = await res.json();
      setVendors((prev) => [...prev, newVendor]);
    } catch (err) {
      console.error("API Add failed. Adding locally.", err);
      setVendors((prev) => [...prev, { ...vendor, id: Date.now() }]);
    }
  };

  // -------------------------------------------------------------------
  // UPDATE Vendor
  // -------------------------------------------------------------------
  const updateVendor = async (id, vendor) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendor),
      });

      if (!res.ok) throw new Error("API Update Error");

      const updatedVendor = await res.json();

      setVendors((prev) =>
        prev.map((v) => (v.id === id ? updatedVendor : v))
      );
    } catch (err) {
      console.error("API Update failed. Updating locally.", err);
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...vendor } : v))
      );
    }
  };

  // -------------------------------------------------------------------
  // DELETE Vendor
  // -------------------------------------------------------------------
  const deleteVendor = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("API Delete Error");

      setVendors((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error("API Delete failed. Deleting locally.", err);
      setVendors((prev) => prev.filter((v) => v.id !== id));
    }
  };

  return (
    <VendorContext.Provider
      value={{
        vendors,
        loading,
        addVendor,
        updateVendor,
        deleteVendor,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};
