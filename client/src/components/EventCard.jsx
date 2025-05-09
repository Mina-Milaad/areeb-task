import { FaTicketAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function EventCard({ event, user }) {
  console.log(user);
  const isBooked = user.bookedEvents?.includes(event._id);

  return (
    <div className="border rounded-xl overflow-hidden shadow-md">
      <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="font-bold text-xl">{event.name}</h2>
        <p className="mt-2 text-gray-600">{event.date}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="font-semibold">${event.price}</span>
          {isBooked ? (
            <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full">Booked</span>
          ) : (
            <Link
              to={`/events/${event._id}`}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              <FaTicketAlt /> Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
