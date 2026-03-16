import { useState, useEffect } from 'react'
import { Calendar, Bell, Trophy, User, Mail, Phone, GraduationCap, MapPin, CreditCard, BookOpen } from 'lucide-react'
import { supabase } from '../supabaseClient'

function StudentPortal() {
  const [studentInfo, setStudentInfo] = useState({
    name: 'Loading...',
    id: '',
    dob: '',
    grade: '',
    rollNo: '',
    parentContact: '',
    email: '',
    address: '',
    classTeacher: '',
    teacherContact: ''
  })

  // Live data will be fetched from Supabase
  const [upcomingEvents, setUpcomingEvents] = useState([])

  const [recentResults, setRecentResults] = useState([])
  const [term, setTerm] = useState('N/A')
  const [teacher, setTeacher] = useState(studentInfo.classTeacher)
  const [attendance, setAttendance] = useState('Not Marked')
  const [mustChange, setMustChange] = useState(localStorage.getItem('mustChangePassword') === 'true')
  const [newPass, setNewPass] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const sid = localStorage.getItem('studentId') || studentInfo.id
      const { data: sData } = await supabase.from('class_students').select('*').eq('id', sid).maybeSingle()
      if (sData) {
        setStudentInfo(prev => ({ 
           ...prev, id: sData.id, name: sData.name, rollNo: sData.roll_no, dob: sData.dob, address: sData.address, parentContact: sData.parent_contact
        }))
        if (!sData.password_changed) setMustChange(true)
      }
      const { data: gData } = await supabase.from('student_grades').select('*').eq('student_id', sid).maybeSingle()
      if (gData) {
        setRecentResults(gData.results || [])
        setTerm(gData.term || 'N/A')
        setAttendance(gData.attendance || 'Not Marked')
      }
      const { data: eData } = await supabase.from('school_events').select('*').gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true }).limit(5)
      if (eData) setUpcomingEvents(eData)
    }
    fetchData()
  }, [])

  const updatePassword = async () => {
    if (newPass.length < 4) return alert('Password too short (min 4 chars)')
    const { error } = await supabase.from('class_students').update({ password: newPass, password_changed: true }).eq('id', studentInfo.id)
    if (!error) {
      setMustChange(false)
      localStorage.setItem('mustChangePassword', 'false')
      alert('Password updated successfully!')
    }
  }

  const downloadGradesheet = () => {
    alert("Downloading Official NEB Gradesheet for Student: " + studentInfo.id)
  }

  return (
    <div className="min-h-screen bg-slate-50 border-t border-gray-200 animate-fade-in pb-12">
      {mustChange && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up">
              <h2 className="text-2xl font-bold text-navy mb-2">Change Password</h2>
              <p className="text-gray-500 mb-6 text-sm">Welcome! For security, please set a new password for your first login.</p>
              <input type="password" placeholder="New Password" value={newPass} onChange={e => setNewPass(e.target.value)} className="input-modern mb-4" />
              <button onClick={updatePassword} className="btn-gold w-full">Update & Continue</button>
           </div>
        </div>
      )}
      {/* Header Profile Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-7">
            <div className="relative">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-3xl md:rounded-full border-4 border-gold/20 bg-gray-50 flex items-center justify-center overflow-hidden shadow-xl group">
                <img src="/images/toppers/sachin-shrestha.png" alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }} />
                <User className="h-10 w-10 text-gray-300 hidden" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white shadow-sm"></div>
            </div>
            
            <div className="flex-1 text-center md:text-left min-w-0">
              <h1 className="text-xl md:text-3xl font-bold text-navy mb-1 truncate">{studentInfo.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-bold border border-blue-100 uppercase tracking-wide"><User className="w-3 h-3" /> ID: {studentInfo.id}</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gold/10 text-gold-dark text-[10px] sm:text-xs font-bold border border-gold/20 uppercase tracking-wide"><GraduationCap className="w-3 h-3" /> Grade: {studentInfo.grade}</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-[10px] sm:text-xs font-bold border border-gray-200 uppercase tracking-wide"><Calendar className="w-3 h-3" /> Roll: {studentInfo.rollNo}</span>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 mt-4 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gray-400" /> Class Teacher: <span className="text-navy">{studentInfo.classTeacher || 'N/A'}</span></div>
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> Help: {studentInfo.teacherContact || 'Contact Admin'}</div>                
                {/* Attendance Badge */}
                <div className="flex items-center gap-1.5 ml-0 md:ml-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Today's Attendance:</span>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                    attendance === 'Present' ? 'bg-green-100 text-green-700 border border-green-200' :
                    attendance === 'Absent' ? 'bg-red-100 text-red-700 border border-red-200' :
                    'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {attendance}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-gray-400">
                {studentInfo.email && (
                  <div className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-300" /> {studentInfo.email}</div>
                )}
                <div className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-300" /> Parent: {studentInfo.parentContact}</div>
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-300" /> {studentInfo.address}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Urgent Notices (Fees) */}
        <div className="mb-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-4 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-red-800">Fee Due Notice</h3>
              <p className="text-sm text-red-700 mt-1">Your term fee is due on or before 2081-09-10. Please complete the payment to avoid late fees.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cat-exam/10 rounded-lg">
                  <Trophy className="h-5 w-5 text-cat-exam" />
                </div>
                <h2 className="text-lg font-bold text-navy">Latest Results</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-md">{recentResults.length > 0 ? term : 'No Results'}</span>
              </div>
            </div>
            <div className="p-0">
              {recentResults.length > 0 ? (
                <>
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-5 py-3 font-semibold text-gray-700">Subject</th>
                        <th className="px-5 py-3 font-semibold text-gray-700">Marks</th>
                        <th className="px-5 py-3 font-semibold text-gray-700 text-right">Grade (NEB)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentResults.map((res, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3">{res.subject}</td>
                          <td className="px-5 py-3 font-medium text-navy">{res.marks}</td>
                          <td className="px-5 py-3 text-right">
                            <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">{res.grade}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <p className="text-xs text-gray-500">Published by: {teacher}</p>
                    <button onClick={downloadGradesheet} className="text-sm font-semibold text-white bg-gradient-to-r from-navy to-navy-dark px-4 py-2 rounded-lg hover:from-gold hover:to-gold-dark transition-all duration-300 shadow-md flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Download NEB Gradesheet
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-10 text-center">
                  <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-navy font-semibold">No Results Published</h3>
                  <p className="text-sm text-gray-500 mt-1">Your class teacher will publish your grades here soon.</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <div className="p-2 bg-cat-academic/10 rounded-lg">
                <Calendar className="h-5 w-5 text-cat-academic" />
              </div>
              <h2 className="text-lg font-bold text-navy">Upcoming Events</h2>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gold/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center shadow-sm">
                        <span className="text-xs font-bold text-red-500 uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-lg font-bold text-navy leading-none">{new Date(event.date).getDate()}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-navy">{event.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{event.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default StudentPortal
