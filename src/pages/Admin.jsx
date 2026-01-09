import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, CheckCircle, AlertCircle, Calendar, LogOut, Edit, Trash2, Bell, X } from 'lucide-react'

function Admin() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Calendar event states
  const [eventTitle, setEventTitle] = useState('')
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0])
  const [eventType, setEventType] = useState('academic')
  const [eventMessage, setEventMessage] = useState({ type: '', text: '' })
  
  // Lists for management
  const [notices, setNotices] = useState([])
  const [events, setEvents] = useState([])
  const [editingNotice, setEditingNotice] = useState(null)
  const [editingEvent, setEditingEvent] = useState(null)

  useEffect(() => {
    loadNotices()
    loadEvents()
  }, [])

  useEffect(() => {
    // Clear message after 3 seconds
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  useEffect(() => {
    // Clear event message after 3 seconds
    if (eventMessage.text) {
      const timer = setTimeout(() => setEventMessage({ type: '', text: '' }), 3000)
      return () => clearTimeout(timer)
    }
  }, [eventMessage])

  const loadNotices = () => {
    const storedNotices = localStorage.getItem('schoolNotices')
    if (storedNotices) {
      const parsedNotices = JSON.parse(storedNotices)
      setNotices(parsedNotices.sort((a, b) => new Date(b.date) - new Date(a.date)))
    }
  }

  const loadEvents = () => {
    const storedEvents = localStorage.getItem('schoolCalendarEvents')
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents)
      setEvents(parsedEvents.sort((a, b) => new Date(a.date) - new Date(b.date)))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    localStorage.removeItem('adminUsername')
    navigate('/login')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Please enter a notice title.' })
      return
    }

    // Get existing notices
    const storedNotices = localStorage.getItem('schoolNotices')
    const noticesList = storedNotices ? JSON.parse(storedNotices) : []

    if (editingNotice) {
      // Update existing notice
      const index = noticesList.findIndex(n => n.id === editingNotice.id)
      if (index !== -1) {
        noticesList[index] = { ...editingNotice, title: title.trim(), date: date }
        localStorage.setItem('schoolNotices', JSON.stringify(noticesList))
        window.dispatchEvent(new Event('noticeUpdated'))
        setMessage({ type: 'success', text: 'Notice updated successfully!' })
        setEditingNotice(null)
      }
    } else {
      // Create new notice
      const newNotice = {
        id: Date.now(),
        title: title.trim(),
        date: date,
      }
      noticesList.push(newNotice)
      localStorage.setItem('schoolNotices', JSON.stringify(noticesList))
      window.dispatchEvent(new Event('noticeUpdated'))
      setMessage({ type: 'success', text: 'Notice added successfully!' })
    }

    // Reset form
    setTitle('')
    setDate(new Date().toISOString().split('T')[0])
    loadNotices()
  }

  const handleEventSubmit = (e) => {
    e.preventDefault()

    if (!eventTitle.trim()) {
      setEventMessage({ type: 'error', text: 'Please enter an event title.' })
      return
    }

    // Get existing calendar events
    const storedEvents = localStorage.getItem('schoolCalendarEvents')
    const eventsList = storedEvents ? JSON.parse(storedEvents) : []

    if (editingEvent) {
      // Update existing event
      const index = eventsList.findIndex(e => e.id === editingEvent.id)
      if (index !== -1) {
        eventsList[index] = { ...editingEvent, title: eventTitle.trim(), date: eventDate, type: eventType }
        localStorage.setItem('schoolCalendarEvents', JSON.stringify(eventsList))
        window.dispatchEvent(new Event('calendarUpdated'))
        setEventMessage({ type: 'success', text: 'Calendar event updated successfully!' })
        setEditingEvent(null)
      }
    } else {
      // Create new event
      const newEvent = {
        id: Date.now(),
        title: eventTitle.trim(),
        date: eventDate,
        type: eventType,
      }
      eventsList.push(newEvent)
      localStorage.setItem('schoolCalendarEvents', JSON.stringify(eventsList))
      window.dispatchEvent(new Event('calendarUpdated'))
      setEventMessage({ type: 'success', text: 'Calendar event added successfully!' })
    }

    // Reset form
    setEventTitle('')
    setEventDate(new Date().toISOString().split('T')[0])
    setEventType('academic')
    loadEvents()
  }

  const handleEditNotice = (notice) => {
    setEditingNotice(notice)
    setTitle(notice.title)
    setDate(notice.date)
  }

  const handleDeleteNotice = (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      const storedNotices = localStorage.getItem('schoolNotices')
      const noticesList = storedNotices ? JSON.parse(storedNotices) : []
      const filtered = noticesList.filter(n => n.id !== id)
      localStorage.setItem('schoolNotices', JSON.stringify(filtered))
      window.dispatchEvent(new Event('noticeUpdated'))
      setMessage({ type: 'success', text: 'Notice deleted successfully!' })
      loadNotices()
    }
  }

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    setEventTitle(event.title)
    setEventDate(event.date)
    setEventType(event.type)
  }

  const handleDeleteEvent = (id) => {
    if (window.confirm('Are you sure you want to delete this calendar event?')) {
      const storedEvents = localStorage.getItem('schoolCalendarEvents')
      const eventsList = storedEvents ? JSON.parse(storedEvents) : []
      const filtered = eventsList.filter(e => e.id !== id)
      localStorage.setItem('schoolCalendarEvents', JSON.stringify(filtered))
      window.dispatchEvent(new Event('calendarUpdated'))
      setEventMessage({ type: 'success', text: 'Calendar event deleted successfully!' })
      loadEvents()
    }
  }

  const cancelEdit = () => {
    setEditingNotice(null)
    setEditingEvent(null)
    setTitle('')
    setDate(new Date().toISOString().split('T')[0])
    setEventTitle('')
    setEventDate(new Date().toISOString().split('T')[0])
    setEventType('academic')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold text-navy">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Notices Management */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <Bell className="h-6 w-6 text-gold" />
          <h2 className="text-2xl font-bold text-navy">
            {editingNotice ? 'Edit Notice' : 'Add New Notice'}
          </h2>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="notice-title" className="block text-sm font-medium text-gray-700 mb-2">
              Notice Title
            </label>
            <input
              type="text"
              id="notice-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="e.g., Exam Schedule Released"
              required
            />
          </div>

          <div>
            <label htmlFor="notice-date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="notice-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-navy text-white py-3 rounded-lg font-semibold hover:bg-navy-dark transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>{editingNotice ? 'Update Notice' : 'Add Notice'}</span>
            </button>
            {editingNotice && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <X className="h-5 w-5" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing Notices List */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-navy mb-6">Manage Notices</h2>
        {notices.length === 0 ? (
          <p className="text-gray-500">No notices available.</p>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-navy">{notice.title}</h3>
                  <p className="text-sm text-gray-600">{formatDate(notice.date)}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditNotice(notice)}
                    className="p-2 text-navy hover:bg-gold/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteNotice(notice.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Calendar Events Management */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="h-6 w-6 text-gold" />
          <h2 className="text-2xl font-bold text-navy">
            {editingEvent ? 'Edit Calendar Event' : 'Add Calendar Event'}
          </h2>
        </div>

        {eventMessage.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              eventMessage.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {eventMessage.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{eventMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleEventSubmit} className="space-y-6">
          <div>
            <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title
            </label>
            <input
              type="text"
              id="event-title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="e.g., Annual Sports Day"
              required
            />
          </div>

          <div>
            <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-2">
              Event Date
            </label>
            <input
              type="date"
              id="event-date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="event-type" className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <select
              id="event-type"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              <option value="academic">Academic</option>
              <option value="exam">Examination</option>
              <option value="event">Event</option>
              <option value="meeting">Meeting</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-navy text-white py-3 rounded-lg font-semibold hover:bg-navy-dark transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>{editingEvent ? 'Update Event' : 'Add Calendar Event'}</span>
            </button>
            {editingEvent && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <X className="h-5 w-5" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing Calendar Events List */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-navy mb-6">Manage Calendar Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No calendar events available.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-navy">{event.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      event.type === 'exam' ? 'bg-red-100 text-red-800' :
                      event.type === 'event' ? 'bg-green-100 text-green-800' :
                      event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                      'bg-gold/20 text-navy'
                    }`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="p-2 text-navy hover:bg-gold/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
