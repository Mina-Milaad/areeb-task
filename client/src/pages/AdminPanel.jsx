// src/pages/AdminPanel.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/api';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminPanel() {
  const queryClient = useQueryClient();
  const { data: resp = {}, isLoading } = useQuery(
    ['events'],
    () => api.get('/event').then(res => res.data),
  );
  const events = resp.events || [];
  console.log(events);
  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const addMutation = useMutation(
    formData =>
      api.post('/event', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['events']);
        toast.success('Event added successfully!');
        // clear form
        setEventName('');
        setCategory('');
        setVenue('');
        setDate('');
        setPrice('');
        setDescription('');
        setImageFile(null);
      },
      onError: err => {
        const msg = err.response?.data?.message || err.message;
        toast.error(`Add failed: ${msg}`);
      },
    }
  );

  const deleteEvent = async id => {
    try {
      await api.delete(`/event/${id}`);
      queryClient.invalidateQueries(['events']);
      toast.success('Event deleted');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(`Delete failed: ${msg}`);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  const handleSubmit = e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('eventName', eventName);
    fd.append('category', category);
    fd.append('venue', venue);
    fd.append('date', date);
    fd.append('price', price);
    fd.append('description', description);
    if (imageFile) fd.append('image', imageFile);

    addMutation.mutate(fd);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow"
      >
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={e => setEventName(e.target.value)}
          className="border p-2 rounded w-full focus:outline-green-600 text-white"
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border p-2 rounded w-full focus:outline-green-600 text-white"
          required
        />

        <input
          type="text"
          placeholder="Venue"
          value={venue}
          onChange={e => setVenue(e.target.value)}
          className="border p-2 rounded w-full focus:outline-green-600 text-white"
          required
        />

        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border p-2 rounded w-full focus:outline-green-600 text-white"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="border p-2 rounded w-full focus:outline-green-600 text-white"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border p-2 rounded w-full focus:outline-green-600 text-white"
          required
        />

        <input
          type="file"
          onChange={e => setImageFile(e.target.files[0])}
          className="col-span-1 md:col-span-2"
          required
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Add Event
        </button>
      </form>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(ev => (
          <div
            key={ev._id}
            className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
          >
            <div className='flex gap-3 justify-between' >


              <div>
                <h2 className="text-xl font-semibold mb-2">{ev.eventName}</h2>
                <p className="text-sm text-gray-500 mb-1">
                  {new Date(ev.createdAt).toLocaleDateString()}
                </p>
                <p className="mb-2">${ev.price}</p>
              </div>
              <div className='h-20 w-20'>
                <img className='w-full h-full' src={ev.image} alt="event image" />
              </div>
            </div>
            <button
              onClick={() => deleteEvent(ev._id)}
              className="mt-4 bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
