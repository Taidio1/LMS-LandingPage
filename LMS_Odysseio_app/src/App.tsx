import { useState } from "react"
import { useRole } from "./context/RoleContext"
import { Header } from "./components/shared/Header"
import { MOCK_COURSE, Lesson, fetchUserActivity } from "./services/mockData"
import { useProgress } from "./hooks/useProgress"
import { Button } from "./components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle2, PlayCircle, FileText, ChevronRight, BarChart3, Users as UsersIcon, Settings as SettingsIcon } from "lucide-react"

const LearnerView = () => {
  const [activeLesson, setActiveLesson] = useState<Lesson>(MOCK_COURSE.lessons[0])
  const { toggleLesson, isCompleted, completedLessons } = useProgress()
  
  const progressPercent = Math.round((completedLessons.length / MOCK_COURSE.lessons.length) * 100)

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 md:p-8">
      {/* Sidebar */}
      <div className="w-full md:w-80 space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4">{MOCK_COURSE.title}</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">Your Progress</span>
              <span className="font-semibold text-brand-accent">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-gradient transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-sm">Course Content</div>
          <div className="divide-y divide-slate-100">
            {MOCK_COURSE.lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 ${activeLesson.id === lesson.id ? 'bg-brand-accent-light' : ''}`}
              >
                {isCompleted(lesson.id) ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                ) : (
                  <PlayCircle className={`w-5 h-5 shrink-0 ${activeLesson.id === lesson.id ? 'text-brand-accent' : 'text-slate-400'}`} />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${activeLesson.id === lesson.id ? 'text-brand-accent' : 'text-slate-700'}`}>
                    {lesson.title}
                  </p>
                  <p className="text-xs text-slate-500">{lesson.duration}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
            {activeLesson.type === 'video' ? (
              <iframe 
                src={activeLesson.content} 
                className="w-full h-full"
                allowFullScreen
              />
            ) : (
              <div className="text-center p-12">
                <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h4 className="text-white text-xl font-bold">{activeLesson.title}</h4>
                <p className="text-slate-400 mt-2">Document Preview Mode</p>
              </div>
            )}
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{activeLesson.title}</h2>
                <p className="text-slate-500 mt-1">Module: {MOCK_COURSE.title}</p>
              </div>
              <Button 
                onClick={() => toggleLesson(activeLesson.id)}
                className={`${isCompleted(activeLesson.id) ? 'bg-green-500 hover:bg-green-600' : 'bg-brand-gradient'} rounded-xl px-8 h-12 shadow-lg shadow-brand-mid/20 text-white`}
              >
                {isCompleted(activeLesson.id) ? 'Completed' : 'Mark as Complete'}
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AdminView = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUserActivity
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Admin Dashboard</h2>
          <p className="text-slate-500 mt-1">Real-time engagement metrics for your custom platform.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Learners', value: '1,284', icon: UsersIcon, color: 'text-blue-600' },
          { label: 'Avg. Completion', value: '74%', icon: BarChart3, color: 'text-brand-accent' },
          { label: 'Active Sessions', value: '42', icon: PlayCircle, color: 'text-green-600' },
          { label: 'Engagement Rate', value: '+12%', icon: CheckCircle2, color: 'text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+4.5%</span>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Learner Activity</h3>
            {isLoading && <div className="text-xs text-slate-400 animate-pulse">Syncing data...</div>}
          </div>
          
          <div className="space-y-6">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-1/4" />
                    <div className="h-1.5 bg-slate-50 rounded w-full" />
                  </div>
                </div>
              ))
            ) : (
              users?.map(user => (
                <div key={user.id} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                    {user.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                      <span className="text-xs text-slate-400">{user.lastActive}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-gradient rounded-full transition-all duration-1000" 
                        style={{ width: `${user.progress}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-brand-gradient rounded-2xl p-8 text-white shadow-xl shadow-brand-mid/20">
          <SettingsIcon className="w-8 h-8 mb-4 opacity-80" />
          <h3 className="text-xl font-bold mb-2">Bespoke Customization</h3>
          <p className="text-white/80 text-sm leading-relaxed mb-6">
            Every element in this dashboard can be tailored to your specific business KPIs. From data visualization to automated reporting workflows.
          </p>
          <Button variant="secondary" className="w-full bg-white text-brand-accent hover:bg-slate-100 border-none rounded-xl">
            View Design Patterns
          </Button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { role } = useRole();

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <Header />
      <main className="container mx-auto">
        {role === 'LEARNER' ? <LearnerView /> : <AdminView />}
      </main>
    </div>
  )
}

export default App
