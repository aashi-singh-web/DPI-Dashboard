# 🌐 DPI Dashboard

A modern web dashboard for a **C++ Multi-Threaded Deep Packet Inspection (DPI) Engine** that allows users to upload PCAP files, inspect network traffic, apply blocking rules, visualize analytics, and download the filtered PCAP.

---

## 🚀 Overview

Think of this project like an **airport security checkpoint**.

- Every packet entering the network is like a passenger entering the airport.
- The DPI Engine acts as the security officer inspecting each passenger.
- It identifies where packets are going, which application generated them, and whether they should be allowed or blocked.
- The dashboard simply provides an easy way to interact with the engine visually.

---

## ✨ Features

- 📂 Upload PCAP files
- 🔍 Deep Packet Inspection
- 🌐 Application Detection
- 🔒 TLS SNI Extraction
- 🛡️ Block by Application
- 🌍 Block by Domain
- 📍 Block by IP Address
- 📊 Interactive Charts
- 🧵 Multi-threaded Packet Processing
- 📥 Download Filtered PCAP
- 📄 Export PDF Report
- 🎬 Animated Packet Flow During Analysis
- 📦 Built-in Demo PCAP Download

---

# 🏗 Architecture

```text
                User
                  │
                  ▼
        React Dashboard (Frontend)
                  │
      Upload PCAP + Blocking Rules
                  │
                  ▼
          Express Backend (Node.js)
                  │
      Launches C++ DPI Engine (.exe)
                  │
                  ▼
       Multi-threaded DPI Engine
                  │
      Packet Inspection & Filtering
                  │
                  ▼
      Console Output + Output PCAP
                  │
                  ▼
        Backend parses results
                  │
                  ▼
      Dashboard Visualizations
```

---

# 📖 How It Works

## Step 1 — Upload a PCAP

The user uploads a network capture (`.pcap`) file.

Think of a PCAP as a CCTV recording of everything that happened on a network.

---

## Step 2 — Choose Rules

The user can decide to block:

- Applications
- Domains
- IP Addresses

Example

```
Block:
✓ YouTube
✓ TikTok
✓ facebook.com
✓ 192.168.1.20
```

---

## Step 3 — DPI Engine Starts

The backend launches the compiled C++ engine.

The engine then:

- Reads packets
- Parses protocols
- Detects applications
- Applies blocking rules
- Generates statistics
- Creates a new filtered PCAP

---

## Step 4 — Dashboard

The frontend displays

- Total packets
- TCP / UDP packets
- Forwarded packets
- Dropped packets
- Application distribution
- Thread utilization
- Packet charts
- PDF report

---

## 📊 Packet Processing Flow

```text
PCAP File
    │
    ▼
Read Packets
    │
    ▼
Ethernet
    │
    ▼
IP
    │
    ▼
TCP / UDP
    │
    ▼
TLS SNI Extraction
    │
    ▼
Application Detection
    │
    ▼
Apply Rules
    │
    ├────────► Allowed
    │
    └────────► Dropped
    │
    ▼
Generate Statistics
    │
    ▼
Output PCAP
```

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts

---

## Backend

- Node.js
- Express.js
- Multer
- Child Process API

---

## DPI Engine

- C++
- Multi-threading
- PCAP Parsing
- TCP/UDP Analysis
- TLS SNI Extraction
- Application Detection

---

# 📈 Dashboard Features

The dashboard provides:

- Packet statistics
- Traffic analytics
- Application breakdown
- Packet distribution charts
- Thread utilization
- Blocking summary
- Download filtered PCAP
- PDF report

---

# 🎯 Demo

A sample PCAP file is included.

If you don't have your own capture file, simply click

**Download Demo PCAP**

and upload it to explore the dashboard.

---

# 📂 Project Structure

```text
dpi-dashboard
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── utils
│   ├── cpp
│   │    └── dpi_engine.exe
│   └── server.js
│
└── README.md
```

---

# ▶ Running Locally

## Backend

```bash
cd backend
npm install
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

Open

```
http://localhost:5173
```

---

# 📦 Using the Dashboard

1. Download the demo PCAP (optional).
2. Upload a PCAP file.
3. Choose blocking rules.
4. Click **Analyze**.
5. Watch the live analysis animation.
6. Explore charts and statistics.
7. Download the filtered PCAP.
8. Export the PDF report.

---

# 💡 Real World Applications

- Enterprise Network Monitoring
- Security Operations Centers (SOC)
- Malware Traffic Analysis
- Traffic Classification
- Firewall Testing
- Network Research
- Educational Demonstrations
- Digital Forensics
