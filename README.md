🎬 QuickShow – MERN Movie Ticket Booking App

A full-stack movie ticket booking platform built using the MERN Stack.
Users can browse movies, view details, select seats, and book tickets.
Admins can manage movies and bookings through a dedicated dashboard.

QuickShow provides a smooth, modern, and responsive UI inspired by real movie-booking platforms like BookMyShow.

📸 Screenshots
🏠 Home Page
<img width="1888" height="888" alt="Screenshot 2025-11-26 155620" src="https://github.com/user-attachments/assets/d88d98c2-0087-4ceb-9259-93f30e17390e" />
🎥 Movie Details Page
<img width="1866" height="882" alt="Screenshot 2025-11-26 155932" src="https://github.com/user-attachments/assets/b3d22f51-efe4-4206-a3e0-1dbf74e4df46" />
🎟 Seat Selection Page
<img width="1900" height="892" alt="Screenshot 2025-11-26 160000" src="https://github.com/user-attachments/assets/fc60a279-2dd5-460a-a84c-685f122cc8b6" />
Login page
<img width="1031" height="836" alt="image" src="https://github.com/user-attachments/assets/96f1c54d-737a-4af4-8263-065e3e6f4576" />

🚀 Features
👤 User Features

User signup & login

Browse all movies

View detailed movie information (rating, runtime, genre, description)

Select theater, timing & seats

Book tickets securely

Automatic seat reservation for 10 minutes during payment

Email notifications (confirmation, reminders, new movies)

🛠 Admin Features

Add new movies

Manage bookings

Manage theaters

Receive automatic emails using background jobs

🧩 Tech Stack
Frontend

React JS

Tailwind CSS / Custom CSS

React Router

Axios

Backend

Node.js

Express.js

MongoDB + Mongoose

Authentication & Jobs

Clerk – Authentication (Email, Phone, Social Login, Multi-session)

Inngest – Background jobs (email scheduling, seat release jobs)

📂 Folder Structure
QuickShow/
│── client/        # Frontend (React)
│── server/        # Backend (Node + Express)
│── README.md
│── package.json
│── .env

🔧 Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/chaudhary-sneha14/QuickShow.git
cd QuickShow

2️⃣ Setup Backend
cd server
npm install


Create a .env file:

MONGODB_URI=your_mongo_url
CLERK_SECRET_KEY=your_clerk_key
INNGEST_API_KEY=your_inngest_key
JWT_SECRET=your_jwt_secret


Run backend:

npm start

3️⃣ Setup Frontend
cd client
npm install
npm start

📧 Email & Background Jobs

Using Inngest, the backend automatically:

Sends an email when a new movie is added

Sends booking confirmation email

Sends reminder email before showtime

Frees reserved seats after 10 minutes if payment fails

🛡 Authentication (Clerk)

QuickShow uses Clerk for:

Email login

Phone login

Google login

Multi-session profile switching

📌 Future Improvements

Online payment integration

Admin analytics dashboard

QR-based ticket scanning

Mobile PWA implementation

⭐ Show Your Support

If you like this project, don’t forget to ⭐ star the repository!

👩‍💻 Author

Sneha Chaudhary
GitHub: https://github.com/chaudhary-sneha14
