Tech Stack

Frontend: React (Vite) + Tailwind CSS

Backend: Node.js + Express

Database: MongoDB

File Storage: Cloudinary (images, videos, voice notes)

Notifications: Email & in-app notifications

Other Features: Google Maps API for live location, Voice-to-Text translation

Installation

Clone the repository

git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>


Install dependencies for frontend

cd client
npm install


Install dependencies for backend

cd server
npm install


Setup environment variables

Create a .env file in the server folder:

PORT=8080
MONGO_URI=<your-mongodb-connection-string>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-email-password>

Running the Application
Start backend server:
cd server
npm run dev

Start frontend (React Vite) server:
cd client
npm run dev


Open your browser at http://localhost:5173 (or the port shown in terminal) to access the app.

Usage

Salesperson: Upload images, videos, voice notes, view tasks, and generate invoices.

Manager/Admin: Assign tasks, manage products & categories, view dashboards, and track team activities.

Screenshots

(Include relevant screenshots for Dashboard, Media Uploads, Billing, etc.)

Future Enhancements

Integrate real-time chat using WebSockets.

Add analytics charts for sales performance trends.

Enable mobile-friendly layout and offline support.

License

This project is licensed under the MIT License.
