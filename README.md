# 🌐 DPI Dashboard

> A modern React dashboard for a **C++ Multi-Threaded Deep Packet Inspection (DPI) Engine** that analyzes network traffic, applies filtering rules, and visualizes results through an interactive web interface.

## 🚀 Live Demo

🔗 https://dpi-dashboard-ean4.onrender.com

---

# 📖 Overview

Imagine a **security checkpoint at an airport**.

Every passenger goes through security before boarding a flight.

Similarly, every **network packet** passes through the DPI Engine before reaching its destination.

The engine inspects each packet, identifies the application or website it belongs to, checks it against security rules, and decides whether to **allow** or **block** it.

The dashboard simply provides an easy and interactive way to control and visualize this entire process.

---

# ✨ Features

- 📂 Upload PCAP files
- 🔍 Deep Packet Inspection
- 🌐 Application Detection
- 🔒 TLS SNI Extraction
- 🛡️ Block by Application, Domain & IP
- 📊 Interactive Analytics Dashboard
- 📄 PDF Report Generation
- 🎬 Animated Packet Flow
- 📥 Download Filtered PCAP
- 🧵 Multi-threaded Processing
- 📦 Built-in Demo PCAP
- 🐳 Dockerized Deployment

---

# 🏗 System Architecture

```text
                User
                  │
                  ▼
        React Dashboard
                  │
          Upload PCAP
                  │
                  ▼
        Express Backend
                  │
      Launches C++ Engine
                  │
                  ▼
      Multi-threaded DPI Engine
                  │
       Packet Inspection
                  │
                  ▼
   Statistics + Filtered PCAP
                  │
                  ▼
      Interactive Dashboard
```

---

# ⚙️ How It Works

### 📂 1. Upload a PCAP

A **PCAP** is like a **CCTV recording of network activity**.

Instead of watching people move through a building, it records how packets move through a network.

---

### 🛡️ 2. Choose Blocking Rules

Select what should be blocked:

- Applications
- Domains
- IP Addresses

Just like configuring a firewall to decide which traffic is allowed.

---

### 🔍 3. Deep Packet Inspection

The C++ engine examines every packet by:

- Reading protocol headers
- Extracting TLS SNI
- Identifying applications
- Applying security rules
- Generating statistics
- Creating a filtered PCAP

Think of it as a security officer checking every passenger's identity before allowing entry.

---

### 📊 4. Dashboard Visualization

The processed data is displayed through:

- Packet statistics
- Traffic charts
- Application breakdown
- Thread utilization
- PDF reports
- Downloadable filtered PCAP

Instead of reading console logs, everything is presented visually.

---

# 📊 Packet Processing Flow

```text
PCAP File
    │
    ▼
Read Packets
    │
    ▼
Parse Ethernet/IP/TCP/UDP
    │
    ▼
Extract TLS SNI
    │
    ▼
Identify Application
    │
    ▼
Apply Blocking Rules
    │
 ┌──┴──────────┐
 │             │
 ▼             ▼
Allowed     Blocked
 │             │
 └──────┬──────┘
        ▼
Generate Statistics
        │
        ▼
Filtered PCAP + Dashboard
```

---

# 🛠 Tech Stack

| Layer | Technologies |
|--------|--------------|
| Frontend | React • TypeScript • Vite • Tailwind CSS • Recharts |
| Backend | Node.js • Express • Multer |
| DPI Engine | C++17 • Multi-threading • PCAP Parsing • TLS SNI |
| Deployment | Docker • Render |

---

# 📂 Project Structure

```text
dpi-dashboard
│
├── frontend/
├── backend/
│   ├── engine/
│   ├── controllers/
│   ├── routes/
│   └── utils/
├── Dockerfile
└── README.md
```

---

# ▶️ Run Locally

```bash
git clone https://github.com/aashi-singh-web/DPI-Dashboard.git
cd DPI-Dashboard

docker build -t dpi-dashboard .
docker run -p 5000:5000 dpi-dashboard
```

Open:

```
http://localhost:5000
```

---

# 🐳 Deployment

The project is fully containerized using **Docker** and deployed on **Render**.

Every push to the **main** branch automatically rebuilds the Docker image and updates the live application.

---

# 🌍 Real World Applications

- Enterprise Network Monitoring
- Security Operations Centers (SOC)
- Firewall Rule Testing
- Malware Traffic Analysis
- Digital Forensics
- Network Research & Education

