import { createContext, useContext, useState, useCallback } from "react";
import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../../api/vendors.api";

const VendorContext = createContext();

export const VendorProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadVendors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getVendors();
      setVendors(res.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const addVendor = async (data) => {
    await createVendor(data);
    await loadVendors();
  };

  const editVendor = async (id, data) => {
    await updateVendor(id, data);
    await loadVendors();
  };

  const removeVendor = async (id) => {
    await deleteVendor(id);
    await loadVendors();
  };

  return (
    <VendorContext.Provider
      value={{
        vendors,
        loading,
        loadVendors,
        addVendor,
        editVendor,
        removeVendor,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};

export const useVendors = () => useContext(VendorContext);
