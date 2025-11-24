# 🚀 Space Selfies  
Create custom NASA-style space portraits using real APOD images + your own selfie.

Space Selfies is a full-stack React + Node project that uses NASA’s Astronomy Picture of the Day (APOD) API to generate cosmic portrait images.  
Users can pick a NASA image, upload a selfie, adjust zoom, preview the result, and download a fully rendered PNG.

Because NASA’s image servers do **not** include CORS headers, this project also includes a **Node/Express proxy server** to safely fetch APOD images so the final canvas can be exported.

This is both a fun portfolio project and a demonstration of handling **real-world API limitations**, **CORS issues**, and **full-stack troubleshooting**.

---

## 🌌 Features

### 🔭 NASA APOD Integration  
- Fetches a random set of image-only APOD entries  
- Displays thumbnails, titles, and dates  
- Live preview of selected APOD as background  

### 🤳 Selfie Upload  
- Accepts any image type (`image/*`)  
- Auto-previews uploaded image  
- Safe loading via FileReader  

### 🔍 Dynamic Preview (Canvas)  
- Draws APOD background  
- Clips the selfie into a perfect circle  
- Includes zoom control for precise positioning  
- Real-time updating on zoom or APOD change  

### 🖼️ Download Your Space Portrait  
- Exports as PNG  
- Works even when NASA images block CORS thanks to proxy server  
- Graceful fallback if the canvas becomes tainted  

### 📱 Mobile-First Responsive Design  
- Stacks preview → controls on smaller screens  
- Two-column layout on desktops  
- SCSS architecture with nesting, breakpoints, clean organization  

### 🛰️ Full CORS Proxy Server (Node + Express)  
- Fetches APOD images server-side  
- Adds `Access-Control-Allow-Origin: *`  
- Streams them safely back to client  
- Protects against open-proxy abuse  
- Demonstrates real-world API handling  

---

## 🖥️ Tech Stack

### Frontend
- React (Vite)
- React Hooks
- Canvas API
- SCSS (mobile-first architecture)
- Modern ES modules

### Backend
- Node.js  
- Express  
- CORS  
- node-fetch (v2 for buffer streaming)

### APIs
- NASA APOD API (`https://api.nasa.gov/planetary/apod`)

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/space-selfies.git
cd space-selfies
