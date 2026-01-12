# Live File Upload System

A full-stack real-time file upload system with live progress, processing status, and admin history. Users can upload files, track their upload and processing status in real time, and admins can view detailed upload history.

## Tech Stack

**Backend:** Node.js, Express, Multer  
**Frontend:** React  
**Real-time:** Socket.IO  
**Messaging/Queue:** Kafka  
**Temporary Storage:** Redis  
**Search/History:** Elasticsearch

## Features

- Upload files with live progress updates
- Processing status tracking (UPLOADING → PROCESSING → DONE)
- Admin dashboard with upload history
- View uploaded files directly from browser
- Kafka + Redis integration for asynchronous updates
- Elasticsearch indexing for analytics and audit logs

## Project Structure

```
live-upload-system/
├── backend/
│   ├── uploads/        # Uploaded files
│   ├── upload.js       # Upload route
│   ├── admin.js        # Admin route
│   ├── consumer.js     # Kafka consumer
│   ├── elastic.js      # Elasticsearch client
│   └── server.js       # Express server
├── frontend/
│   ├── src/
│   │   ├── Upload.jsx  # Upload component
│   │   └── Admin.jsx   # Admin dashboard
│   └── package.json
└── docker-compose.yml  # Kafka/Redis/Elasticsearch
```

## Setup

### Backend

```bash
cd backend
npm install
node server.js
```

Optional: Use Docker Compose to run Kafka, Redis, and Elasticsearch:

```bash
docker-compose up -d
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. Navigate to the Upload page
2. Select a file and upload
3. Observe live status updates: UPLOADING → PROCESSING → DONE
4. Go to Admin page to view upload history
5. Click View to open or download uploaded files

## Notes

- Files are stored with unique filenames to avoid overwrites (timestamp-originalName.ext)
- Admin dashboard displays original file name, status, timestamp, and View link
- Clear old uploads by deleting the uploads directory and clearing the Elasticsearch index

## Author

**Naina Kothari** – [GitHub](https://github.com/NainaKothari-14)

---

If you find this project helpful, please star the repository!
