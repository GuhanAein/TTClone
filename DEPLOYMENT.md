# 🚀 Deployment Guide

This guide explains how to host the TickTick Clone application using Docker and Docker Compose. This is the recommended way to deploy as it bundles the Backend, Frontend, Database, and Cache into a single manageable unit.

## 📋 Prerequisites

1.  **Server/VPS**: A cloud server (e.g., DigitalOcean Droplet, AWS EC2, Linode) with at least **2GB RAM** (4GB recommended).
2.  **Docker & Docker Compose**: Installed on the server.
3.  **Domain Name** (Optional): If you want to access the app via a domain (e.g., `myapp.com`) instead of an IP address.

## 🛠️ Step 1: Prepare the Server

1.  **SSH into your server**:
    ```bash
    ssh user@your-server-ip
    ```

2.  **Install Docker & Docker Compose** (if not already installed):
    ```bash
    # Update packages
    sudo apt update
    
    # Install Docker
    sudo apt install -y docker.io
    
    # Install Docker Compose
    sudo apt install -y docker-compose
    
    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    ```

## 🚀 Step 2: Deploy the Application

1.  **Clone the Repository** (or copy your project files):
    ```bash
    git clone <your-repo-url>
    cd <repo-folder>
    ```
    *If you don't have a git repo, you can use `scp` or `rsync` to upload your project folder to the server.*

2.  **Configuration**:
    *   Check `docker-compose.yml` to ensure environment variables (like DB passwords) are secure. **Do not use default passwords in production!**
    *   Update `frontend/src/services/api.ts` or your environment configuration to point to the correct backend URL if not using the Nginx proxy setup (the provided setup handles this automatically via Nginx).

3.  **Build and Run**:
    ```bash
    sudo docker-compose up -d --build
    ```
    *   `-d`: Runs containers in detached mode (background).
    *   `--build`: Forces a rebuild of the images.

4.  **Verify Deployment**:
    *   Check status: `sudo docker-compose ps`
    *   View logs: `sudo docker-compose logs -f`

## 🌐 Step 3: Access the Application

*   Open your browser and navigate to `http://<your-server-ip>`.
*   The Frontend is served on port `80`.
*   The Backend is accessible internally by the Frontend via the Nginx proxy at `/api`.

## 🔒 Step 4: (Optional) SSL/HTTPS with Certbot

To secure your application with HTTPS:

1.  **Update `docker-compose.yml`** to include an Nginx container that handles SSL (or use a tool like `Nginx Proxy Manager`).
2.  **Simplest Method**: Install Nginx on the host machine as a reverse proxy.
    *   Install Nginx: `sudo apt install nginx`
    *   Configure Nginx to proxy traffic to `localhost:80`.
    *   Use Certbot: `sudo apt install certbot python3-certbot-nginx`
    *   Run: `sudo certbot --nginx -d yourdomain.com`

## 📦 Troubleshooting

*   **Database Connection Failed**: Ensure the `db` container is healthy. Check logs with `docker-compose logs db`.
*   **Frontend can't reach Backend**: The Nginx config in `frontend/nginx.conf` proxies `/api` requests to `http://backend:8080`. Ensure the backend service name in `docker-compose.yml` matches.

## 🔄 Step 5: Updating the Application

Yes, you can frequently change your code! Here is the workflow to deploy updates:

1.  **Make Changes Locally**: Edit your code on your local machine and test it.
2.  **Push Changes**: Push your changes to your Git repository (or upload the modified files to your server).
3.  **Pull on Server**:
    ```bash
    # On your server
    cd <repo-folder>
    git pull
    ```
4.  **Rebuild & Restart**:
    Run the following command to rebuild the Docker images with your new code and restart the containers. Docker is smart enough to only restart what changed.
    ```bash
    sudo docker-compose up -d --build
    ```
5.  **Cleanup** (Optional):
    Remove old, unused images to save disk space:
    ```bash
    sudo docker image prune -f
    ```

### ⚡ Pro Tip: Zero-Downtime Updates
For critical applications, you might want to look into **CI/CD pipelines** (like GitHub Actions) or container orchestration tools (like **Kubernetes** or **Docker Swarm**) which can handle rolling updates without any downtime. For this simple Docker Compose setup, there will be a few seconds of downtime while the containers restart.

---

## ⚡ Option 2: Temporary Quick Share (Ngrok)

If you just want to **temporarily show your running app** to someone else without setting up a server, you can use **Ngrok**. This exposes your *local* computer to the internet.

1.  **Start the App Locally**: Ensure your app is running (`npm run dev` and Spring Boot backend).
2.  **Install Ngrok**: [Download and install Ngrok](https://ngrok.com/download).
3.  **Expose Frontend**:
    ```bash
    ngrok http 3000
    ```
    *   Copy the `https://...ngrok-free.app` URL provided.
    *   **Note**: Since your frontend tries to talk to `localhost:8080` for the backend, this might fail for the remote user unless you also expose the backend or configure the frontend to point to a public backend URL.
    
    *A better approach for full-stack apps with Ngrok is to use Docker Compose locally and expose the Nginx port (80).*

## ☁️ Option 3: Easy Cloud Hosting (Railway / Render)

If you want the app to stay online **without your computer being on**, but don't want to manage a server, use a Platform as a Service (PaaS).

### **Railway (Recommended for Docker)**
Railway is excellent because it supports Dockerfiles and Docker Compose natively.

1.  Create a [Railway](https://railway.app/) account.
2.  Install the Railway CLI or connect your GitHub repository.
3.  Railway will detect the `Dockerfile` in `backend/` and `frontend/`.
4.  You can add a PostgreSQL and Redis plugin directly in their dashboard.
5.  Set the environment variables (`SPRING_DATASOURCE_URL`, etc.) in the Railway dashboard to connect the services.

### **Render**
1.  Create a [Render](https://render.com/) account.
2.  **Database**: Create a new PostgreSQL database (Free tier available).
3.  **Backend**: Create a "Web Service", connect your repo, and point it to the `backend` directory. Choose "Docker" as the environment.
4.  **Frontend**: Create a "Static Site", connect your repo.
    *   Build Command: `npm run build`
    *   Publish Directory: `dist`
    *   **Important**: You must update the frontend's API URL to point to your Render Backend URL instead of `localhost`.


