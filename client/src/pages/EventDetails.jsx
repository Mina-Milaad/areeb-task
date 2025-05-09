import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/api';
import { FaArrowLeft } from 'react-icons/fa';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading } = useQuery(['event', id], () =>
    api.get(`/event/${id}`).then(res => res.data)
  );

  const handleBooking = async () => {
    try {
      await api.post(`/event/book/${id}`); // تأكد إن التوكن بيتبعت تلقائي من axios instance
      navigate('/congratulations');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (!event) return <p className="text-center">Event not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-blue-600 mb-4">
        <FaArrowLeft /> Back
      </Link>

      {/* Image */}
      {event.imageUrl && (
        <img src={event.imageUrl} alt={event.name} className="w-full rounded-xl mb-4" />
      )}

      {/* Event Info */}
      <h1 className="text-3xl font-bold">{event.name}</h1>
      <p className="mt-2 text-gray-700">{event.description}</p>

      <div className="mt-4 grid gap-2 text-sm text-gray-600">
        <p><strong>Category:</strong> {event.category}</p>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Venue:</strong> {event.venue}</p>
        <p><strong>Price:</strong> ${event.price}</p>
      </div>

      <button
        onClick={handleBooking}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Book Now
      </button>
    </div>
  );
}
