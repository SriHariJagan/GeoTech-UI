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

<img width="1915" height="973" alt="image" src="https://github.com/user-attachments/assets/905e7ffa-d84a-4fa5-8f13-b4ab7e739c57" />



<img width="1916" height="968" alt="image" src="https://github.com/user-attachments/assets/2d4a1e2c-5c0b-4aaf-be55-d0d28d27eba5" />


<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/b7108928-d51b-4af6-9caf-f88cc503a41f" />


<img width="1919" height="968" alt="image" src="https://github.com/user-attachments/assets/c98e76fd-6c3d-4258-bd61-b25222a44ede" />

<img width="1919" height="973" alt="image" src="https://github.com/user-attachments/assets/81a5d851-2520-4380-9d89-ee42ac757376" />



