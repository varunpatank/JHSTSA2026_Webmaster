'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { calendarEvents } from '@/lib/hubData';

const eventTypeColors = {
  'Meeting': 'bg-blue-100 text-blue-700 border-blue-300',
  'Competition': 'bg-red-100 text-red-700 border-red-300',
  'Deadline': 'bg-amber-100 text-amber-700 border-amber-300',
  'Workshop': 'bg-purple-100 text-purple-700 border-purple-300',
  'Event': 'bg-green-100 text-green-700 border-green-300'
};

type EventType = keyof typeof eventTypeColors;

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<typeof calendarEvents[0] | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showExportModal, setShowExportModal] = useState(false);
  const [subscribedClubs, setSubscribedClubs] = useState<string[]>(['TSA', 'DECA']);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Filter events for current month
  const monthEvents = calendarEvents.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  });

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    return monthEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === day;
    });
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentYear, currentMonth + direction, 1));
  };

  const upcomingEvents = calendarEvents
    .filter(event => new Date(event.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 10);

  const allClubs = [...new Set(calendarEvents.map(e => e.chapterName || 'Unknown'))];

  const handleSubscribe = (club: string) => {
    if (subscribedClubs.includes(club)) {
      setSubscribedClubs(subscribedClubs.filter(c => c !== club));
    } else {
      setSubscribedClubs([...subscribedClubs, club]);
    }
  };

  const generateICS = () => {
    // In production, this would generate an actual .ics file
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ClubConnect//Events//EN
${calendarEvents.map(event => `BEGIN:VEVENT
DTSTART:${new Date(event.startDate).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${new Date(event.endDate).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT`).join('\n')}
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clubconnect-events.ics';
    a.click();
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1920&q=80"
            alt="Calendar"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/95 to-blue-600/80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <Link href="/hub" className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
            ← Back to Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
            📅 Events Calendar
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Stay on top of club meetings, competitions, deadlines, and special events. 
            Subscribe to calendars and sync with your favorite apps.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#calendar" className="btn-secondary">
              View Calendar
            </a>
            <button 
              onClick={() => setShowExportModal(true)}
              className="bg-white/20 backdrop-blur text-white px-6 py-2.5 font-semibold border-2 border-white/50 hover:bg-white hover:text-cyan-600 transition-all rounded-lg"
            >
              Export / Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-6 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-500 font-heading">{calendarEvents.length}</div>
              <div className="text-sm text-neutral-600">Total Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 font-heading">{monthEvents.length}</div>
              <div className="text-sm text-neutral-600">This Month</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-500 font-heading">{allClubs.length}</div>
              <div className="text-sm text-neutral-600">Active Clubs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-500 font-heading">{subscribedClubs.length}</div>
              <div className="text-sm text-neutral-600">Subscribed</div>
            </div>
          </div>
        </div>
      </section>

      {/* View Toggle & Navigation */}
      <section id="calendar" className="py-6 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Month Navigation */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-neutral-100 transition-colors"
              >
                ◀
              </button>
              <h2 className="text-xl font-bold text-primary-500 font-heading min-w-[180px] text-center">
                {months[currentMonth]} {currentYear}
              </h2>
              <button 
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-neutral-100 transition-colors"
              >
                ▶
              </button>
              <button 
                onClick={() => setCurrentDate(new Date())}
                className="text-sm text-primary-500 hover:underline"
              >
                Today
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 font-semibold transition-all
                  ${viewMode === 'calendar' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
              >
                📅 Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 font-semibold transition-all
                  ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
              >
                📋 List
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="card overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-primary-500 text-white">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center font-semibold text-sm">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="min-h-[100px] p-2 bg-neutral-50 border border-neutral-100"></div>
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1;
                  const dayEvents = getEventsForDay(day);
                  const isToday = new Date().getDate() === day && 
                                  new Date().getMonth() === currentMonth && 
                                  new Date().getFullYear() === currentYear;

                  return (
                    <div 
                      key={day} 
                      className={`min-h-[100px] p-2 border border-neutral-100 ${isToday ? 'bg-blue-50' : 'bg-white'}`}
                    >
                      <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-neutral-700'}`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`text-xs p-1 truncate cursor-pointer hover:opacity-80 border ${eventTypeColors[event.eventType as EventType] || 'bg-neutral-100 text-neutral-700 border-neutral-300'}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-neutral-500 cursor-pointer hover:text-primary-500">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="space-y-4">
              {monthEvents.length === 0 ? (
                <div className="card p-12 text-center">
                  <p className="text-neutral-500">No events scheduled for {months[currentMonth]} {currentYear}</p>
                </div>
              ) : (
                monthEvents
                  .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                  .map((event) => (
                    <div 
                      key={event.id} 
                      className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Date */}
                        <div className="flex-shrink-0 w-16 text-center">
                          <div className="text-2xl font-bold text-primary-500 font-heading">
                            {new Date(event.startDate).getDate()}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {months[new Date(event.startDate).getMonth()].slice(0, 3)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-xs font-semibold border ${eventTypeColors[event.eventType as EventType] || 'bg-neutral-100 text-neutral-700 border-neutral-300'}`}>
                              {event.eventType}
                            </span>
                            <span className="text-xs text-neutral-500">{event.chapterName || 'General'}</span>
                          </div>
                          <h3 className="font-bold text-neutral-700">{event.title}</h3>
                          <p className="text-sm text-neutral-600 line-clamp-1">{event.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                            <span>🕐 {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>📍 {event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Sidebar */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Upcoming Events */}
            <div className="md:col-span-2">
              <h2 className="section-title mb-6">📆 Upcoming Events</h2>
              <div className="space-y-3">
                {upcomingEvents.map((event) => {
                  const eventDate = new Date(event.startDate);
                  const daysAway = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <div 
                      key={event.id} 
                      className="card p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex-shrink-0 w-14 h-14 bg-primary-100 flex flex-col items-center justify-center">
                        <div className="text-lg font-bold text-primary-600">{eventDate.getDate()}</div>
                        <div className="text-xs text-primary-500">{months[eventDate.getMonth()].slice(0, 3)}</div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs font-semibold border ${eventTypeColors[event.eventType as EventType] || 'bg-neutral-100'}`}>
                            {event.eventType}
                          </span>
                          {daysAway <= 3 && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold">
                              {daysAway === 0 ? 'Today!' : daysAway === 1 ? 'Tomorrow' : `${daysAway} days`}
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-neutral-700">{event.title}</h4>
                        <div className="text-xs text-neutral-500">{event.chapterName || 'General'} • {event.location}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Club Subscriptions */}
            <div>
              <h2 className="section-title mb-6">🔔 Subscriptions</h2>
              <div className="card p-4">
                <p className="text-sm text-neutral-600 mb-4">
                  Subscribe to clubs to see their events and get notifications.
                </p>
                <div className="space-y-2">
                  {allClubs.map((club) => (
                    <label key={club} className="flex items-center gap-3 p-2 hover:bg-neutral-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subscribedClubs.includes(club)}
                        onChange={() => handleSubscribe(club)}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-medium text-neutral-700">{club}</span>
                    </label>
                  ))}
                </div>
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="btn-outline w-full mt-4"
                >
                  Export Subscribed Events
                </button>
              </div>

              {/* Event Type Legend */}
              <div className="card p-4 mt-6">
                <h3 className="font-semibold text-neutral-700 mb-3">Event Types</h3>
                <div className="space-y-2">
                  {Object.entries(eventTypeColors).map(([type, colors]) => (
                    <div key={type} className="flex items-center gap-2">
                      <div className={`w-4 h-4 border ${colors}`}></div>
                      <span className="text-sm text-neutral-600">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-lg w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <span className={`px-3 py-1 text-sm font-semibold border ${eventTypeColors[selectedEvent.eventType as EventType] || 'bg-neutral-100'}`}>
                {selectedEvent.eventType}
              </span>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-neutral-500 hover:text-neutral-700 text-2xl"
              >
                ×
              </button>
            </div>

            <h2 className="text-2xl font-bold text-primary-500 font-heading mb-2">{selectedEvent.title}</h2>
            <p className="text-neutral-500 mb-4">{selectedEvent.chapterName || 'General'}</p>

            <p className="text-neutral-600 mb-6">{selectedEvent.description}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xl">📅</span>
                <div>
                  <div className="font-semibold text-neutral-700">
                    {new Date(selectedEvent.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {new Date(selectedEvent.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(selectedEvent.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xl">📍</span>
                <div className="font-semibold text-neutral-700">{selectedEvent.location}</div>
              </div>

              {selectedEvent.isRecurring && (
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔄</span>
                  <div className="text-neutral-600">Recurring: {selectedEvent.recurrencePattern}</div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button className="btn-primary flex-1">
                Add to My Calendar
              </button>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-500 font-heading">Export Calendar</h2>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-neutral-500 hover:text-neutral-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <button 
                onClick={generateICS}
                className="w-full p-4 border-2 border-neutral-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
              >
                <div className="font-bold text-neutral-700">📥 Download .ICS File</div>
                <div className="text-sm text-neutral-500">Import into any calendar app</div>
              </button>

              <button className="w-full p-4 border-2 border-neutral-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-left">
                <div className="font-bold text-neutral-700">🔗 Subscribe via URL</div>
                <div className="text-sm text-neutral-500">Auto-sync with Google Calendar, Apple Calendar, etc.</div>
              </button>

              <button className="w-full p-4 border-2 border-neutral-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-left">
                <div className="font-bold text-neutral-700">📧 Email Reminders</div>
                <div className="text-sm text-neutral-500">Get email notifications for upcoming events</div>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-200">
              <p className="text-xs text-neutral-500 mb-4">
                Subscribed clubs: {subscribedClubs.join(', ') || 'None selected'}
              </p>
              <button 
                onClick={() => setShowExportModal(false)}
                className="btn-outline w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
