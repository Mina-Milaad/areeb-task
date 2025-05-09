# areeb-task
# Areeb Task – Event Booking App

This is a simple full-stack Node.js + React project for browsing and booking events.  
It includes user authentication, event listing, booking logic, and user-based event state display (e.g. "Book Now" / "Booked").

---

## 🚀 How to Run the Project

### 1. Clone the repository and unzip the project
```bash
git clone <your-repo-url>
cd areeb-task
2. Install backend dependencies
bash
Copy
Edit
cd server
npm install
3. Install frontend dependencies
bash
Copy
Edit
cd client
npm install
4. Run both frontend and backend
bash
Copy
Edit
# in /server
npm run dev

# in /client
npm run dev
🐛 Main Issue Faced
Problem:
When rendering events, we needed to check if the user had already booked each event.
However, accessing user data from localStorage inside EventCard was unreliable and insecure.

Root Cause:
The AuthContext was returning cached or partial user info.

Booked events info wasn't always available at component level.

We wanted fresh and secure fetch of the user from /auth/me.

✅ Solution:
Replaced useContext(AuthContext) with direct API fetching using React Query.

Ensured that events load only after the user is fetched.

Updated the logic in EventCard to check user.bookedEvents.includes(event._id).

React Query dependency control:
js
Copy
Edit
const { data: user, isLoading: userLoading } = useQuery(['user'], fetchUser);
const { data: events, isLoading: eventsLoading } = useQuery(['events'], fetchEvents, {
  enabled: !!user,
});
📦 Features
User registration & login

Event listing with images, details, prices

"Book Now" logic based on user data

Prevent duplicate bookings

Redirect to congratulations screen after booking

📂 Project Structure
bash
Copy
Edit
areeb-task/
├── client/         # React frontend
├── server/         # Express backend
└── README.md       # This file
🧠 Notes
MongoDB is required (you can use local Mongo or Mongo Atlas)

JWT token is used for authentication

Protected routes use a verifyToken middleware