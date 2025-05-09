import { useQuery } from '@tanstack/react-query';
import api from '../api/api';
import EventCard from '../components/EventCard';

export default function HomePage() {
  // 🟢 أولاً: نجيب بيانات اليوزر
  const {
    data: user,
    isLoading: userLoading,
    isSuccess: userLoaded
  } = useQuery(['user'], () => api.get('/auth/me').then(res => res.data));

  // 🟡 ثانياً: نجيب الأحداث "فقط" بعد ما يخلص تحميل اليوزر
  const {
    data: events,
    isLoading: eventsLoading
  } = useQuery(['events'], () => api.get('/event').then(res => res.data), {
    enabled: userLoaded // ✅ مش هيشتغل غير بعد ما user يتحمّل
  });

  if (userLoading || eventsLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.events.map((event, index) => (
        <EventCard key={index} event={event} user={user} />
      ))}
    </div>
  );
}
