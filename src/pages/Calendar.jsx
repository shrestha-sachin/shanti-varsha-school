import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, BookOpen, GraduationCap, Trophy, Users } from 'lucide-react'
import { supabase } from '../supabaseClient'

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase.from('school_events').select('*')
      if (data) setEvents(data)
    }
    fetchEvents()
  }, [])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const getEventsForDate = (day) => {
    if (!day) return []
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split('T')[0]
    return events.filter(event => event.date === dateStr)
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'exam':
        return <BookOpen className="h-3 w-3" />
      case 'event':
        return <Trophy className="h-3 w-3" />
      case 'meeting':
        return <Users className="h-3 w-3" />
      default:
        return <GraduationCap className="h-3 w-3" />
    }
  }

  const getEventColor = (type) => {
    switch (type) {
      case 'exam':
        return 'bg-cat-exam/10 text-cat-exam border-cat-exam/30'
      case 'event':
        return 'bg-cat-event/10 text-cat-event border-cat-event/30'
      case 'meeting':
        return 'bg-cat-academic/10 text-cat-academic border-cat-academic/30'
      default:
        return 'bg-gold/20 text-navy border-gold/40'
    }
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date()
  const isToday = (day) => {
    if (!day) return false
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      {/* Hero */}
      <section className="page-hero py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 animate-fade-in-up">
            <div className="bg-white/15 p-3 rounded-2xl backdrop-blur-sm">
              <CalendarIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl md:text-5xl">Academic Calendar</h1>
              <p className="text-gold-light text-sm mt-1">View important dates, events, and academic schedules for the school year.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gold/10 rounded-xl transition-all duration-300 hover:scale-110 group"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-6 w-6 text-navy group-hover:text-gold transition-colors" />
            </button>

            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-navy">{getMonthName(currentDate)}</h2>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-gradient-to-r from-gold to-gold-light text-white rounded-xl hover:from-gold-light hover:to-gold transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Today
              </button>
            </div>

            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gold/10 rounded-xl transition-all duration-300 hover:scale-110 group"
              aria-label="Next month"
            >
              <ChevronRight className="h-6 w-6 text-navy group-hover:text-gold transition-colors" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Week day headers */}
            {weekDays.map((day) => (
              <div key={day} className="text-center font-semibold text-navy py-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day)
              const todayClass = isToday(day) ? 'ring-2 ring-gold bg-gold/10 shadow-lg' : ''

              return (
                <div
                  key={index}
                  className={`min-h-[80px] border-2 rounded-xl p-2 ${day ? 'bg-white hover:bg-gold/5 cursor-pointer hover:border-gold/40 hover:shadow-md' : 'bg-gray-50'
                    } ${todayClass} transition-all duration-300 transform hover:scale-[1.02]`}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-semibold mb-1 ${isToday(day) ? 'text-gold' : 'text-gray-700'}`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded border ${getEventColor(event.type)} flex items-center space-x-1`}
                          >
                            {getEventIcon(event.type)}
                            <span className="truncate">{event.title}</span>
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-gray-100 animate-fade-in-up mb-8">
            <h3 className="text-xl font-bold text-navy mb-4 flex items-center space-x-2">
              <div className="w-1 h-6 bg-gradient-to-b from-gold to-gold-dark rounded-full"></div>
              <span>Events on {selectedDate} {getMonthName(currentDate)}</span>
            </h3>
            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {getEventsForDate(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border-l-4 ${getEventColor(event.type)}`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {getEventIcon(event.type)}
                      <h4 className="font-semibold">{event.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No events scheduled for this date.</p>
            )}
            <button
              onClick={() => setSelectedDate(null)}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-gold to-gold-light text-white rounded-xl hover:from-gold-light hover:to-gold transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Close
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <h3 className="text-lg font-semibold text-navy mb-4">Event Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gold/20 border border-gold/40 rounded"></div>
              <span className="text-sm text-gray-700">Academic</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-cat-exam/10 border border-cat-exam/30 rounded"></div>
              <span className="text-sm text-gray-700">Examinations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-cat-event/10 border border-cat-event/30 rounded"></div>
              <span className="text-sm text-gray-700">Events</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-cat-academic/10 border border-cat-academic/30 rounded"></div>
              <span className="text-sm text-gray-700">Meetings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
