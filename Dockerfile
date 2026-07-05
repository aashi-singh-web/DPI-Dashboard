# ---------- FRONTEND BUILD ----------
FROM node:20 AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build


# ---------- BACKEND BUILD ----------
FROM node:20

RUN apt-get update && \
    apt-get install -y g++ make && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY backend ./backend

RUN mkdir -p /app/backend/uploads \
    && mkdir -p /app/backend/outputs

# Frontend build
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Compile DPI Engine
WORKDIR /app/backend/engine

RUN mkdir -p ../cpp

RUN g++ -std=c++17 -pthread -O2 -I include \
    -o ../cpp/dpi_engine \
    src/dpi_mt.cpp \
    src/pcap_reader.cpp \
    src/packet_parser.cpp \
    src/sni_extractor.cpp \
    src/types.cpp

WORKDIR /app/backend

ENV DPI_ENGINE_PATH=./cpp/dpi_engine
ENV PORT=5000

EXPOSE 5000

CMD ["npm","start"]