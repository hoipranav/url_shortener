# URL Shortener

This project is a simple URL shortener service built with FastAPI (Python) for the backend, React for the frontend, and Redis as a database to store the URL mappings. The application is containerized using Docker.

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone https://github.com/aditya-borse/url_shortener.git
    cd url_shortener
    ```

2. **Build and run the application using Docker Compose:**

    ```bash
    docker compose up -d
    ```

    This will:
    *   Build the Docker images for the backend and frontend.
    *   Start three containers:
        *   `backend`: Runs the FastAPI application on port 8000.
        *   `frontend`: Runs the React application on port 5173.
        *   `redis`: Runs the Redis database on port 6379.

3. **Access the application:**

    *   **Frontend:** Open your web browser and go to `http://localhost:5173`.
    *   **Backend:** The FastAPI backend will be accessible at `http://localhost:8000`.

4. **Stop Docker Containers**

    ```
    docker compose down --volumes
    ```

## Usage

1. Enter a long URL in the input field on the frontend.
2. Click the "Shorten" button.
3. The shortened URL will be displayed below the form, along with a "Copy" button to copy the URL to your clipboard.
4. You can then use the shortened URL to access the original long URL.