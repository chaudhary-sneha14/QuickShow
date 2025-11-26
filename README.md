🎬 QuickShow – MERN Movie Ticket Booking App

A full-stack movie ticket booking platform built using the MERN Stack.
Users can browse movies, view details, select seats, and book tickets.
Admins can manage movies and bookings through a dedicated dashboard.

QuickShow provides a smooth, modern, and responsive UI inspired by real movie-booking platforms like BookMyShow.

📸 Screenshots
🏠 Home Page
<img src="https://github.com/user-attachments/assets/64345100-590e-451f-af0c-e07f107c12d5" width="800"/>
🎥 Movie Details Page
<img src="https://github.com/user-attachments/assets/bbb337f0-59f8-40ac-8ba3-0b01ee9bd104" width="800"/>
🎟 Seat Selection Page
<img src="https://github.com/user-attachments/assets/569ecda1-edc8-4944-8740-609122918eef" width="800"/>
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
