# Full-Stack Stock Management Application

A full-stack web application built with **Django** for the backend and **React.js** for the frontend. The app allows users to view, add, update, and delete stock data. It uses **SQLite** for data storage and is hosted with **Docker** for easy deployment.

## Live Demo

Check out the live frontend here: [Live Demo](https://silver-naiad-1baf3d.netlify.app/)

## Features
- **View Data**: Select a trade code to see relevant stock data.  
- **Add New Data**: Create a new stock entry or update an existing one.  
- **Update/Delete Data**: Modify or remove stock entries as needed.  
- **Charts**: Visualize trends with charts for stock volume and closing values.  
- **Date Filter**: Search stock data within a specific date range.

## Technologies
- **Backend**: Django, Django REST Framework, SQLite  
- **Frontend**: React.js, Chart.js (or any chart library used)  
- **Deployment**: Docker  

## Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Node.js and npm installed (for frontend development if needed)

### Clone the Repository
```bash
git clone https://github.com/md-asik-reza-tasin/stock-market-task-Django.git

# Build and run the app with Docker
docker-compose up --build
