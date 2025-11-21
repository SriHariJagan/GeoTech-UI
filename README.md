# 🌍 GeoTech-UI  
A modern and responsive frontend application for managing geotechnical project operations, including Daily Execution Reports, Vendors, Machinery, Supervisors, and Projects.  
Built using **React**, **Context API**, and **CSS Modules** for clean, maintainable, and scalable UI architecture.

---

## 🚀 Features

### ✔ **Projects Module**
- Add, edit, delete, and manage geotechnical project details  
- Responsive and clean data table UI  

### ✔ **Daily Execution Reports (DER)**
- Fetch reports from API (fallback → dummy data)  
- Add, update, delete operations  
- Drill depth, rig details, chainage, engineer, client & more  
- Professional responsive table with smooth scroll  

### ✔ **Vendors**
- Vendor company information  
- Contact person, email, phone, address  
- Machinery depth capabilities  
- API-first loading → falls back to dummy data  

### ✔ **Machinery Details**
- Handles machine specifications  
- Depth soft rock / hard rock  
- Vendor-linked machines  

### ✔ **Supervisors**
- Supervisor list with contact details  
- API fetch → dummy fallback  
- Update & delete options  

### ✔ **Authentication UI**
- Login  
- Signup  
- Navbar updates after login (Bitly-style UI)  

### ✔ **UI/UX**
- Fully responsive  
- Professional tables  
- Smooth scrollbars  
- Clean layout and spacing  
- Mobile-friendly  
- CSS modules for isolation  
- Icons via `react-icons`  

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React |
| State Management | React Context API |
| Styling | CSS Modules |
| Icons | react-icons |
| Data Layer | REST APIs + Dummy Fallback |

---

## 🔌 API Integration

All modules follow this pattern:

### ✔ Try fetching from API  
### ✔ If API fails → load dummy data  
### ✔ Still allow add/update/delete locally  

Example:

```js
try {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error();
  const data = await res.json();
  setState(data.length > 0 ? data : dummyData);
} catch {
  console.log("API unreachable → using dummy data");
  setState(dummyData);
}


```



