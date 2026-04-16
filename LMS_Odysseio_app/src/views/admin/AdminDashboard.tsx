import { Users, BarChart3, PlayCircle, CheckCircle2 } from 'lucide-react';
import { MOCK_COURSES, MOCK_LEARNERS, WEEKLY_ACTIVITY } from '../../services/mockData';

const maxActivity = Math.max(...WEEKLY_ACTIVITY.map(d => d.count));

export const AdminDashboard = () => {
  const avgCompletion = Math.round(MOCK_LEARNERS.reduce((s, l) => s + l.progress, 0) / MOCK_LEARNERS.length);
  const activeSessions = MOCK_LEARNERS.filter(l => l.status === 'Active').length;

  const stats = [
    { label: 'Total Learners', value: MOCK_LEARNERS.length, icon: Users, color: 'text-blue-600' },
    { label: 'Avg. Completion', value: `${avgCompletion}%`, icon: BarChart3, color: 'text-[#4F46E5]' },
    { label: 'Active Sessions', value: activeSessions, icon: PlayCircle, color: 'text-green-600' },
    { label: 'Engagement Rate', value: '+12%', icon: CheckCircle2, color: 'text-purple-600' },
  ];

  const topCourses = MOCK_COURSES.map(course => {
    const enrollees = MOCK_LEARNERS.filter(l => l.enrolledCourse === course.title);
    const avg = enrollees.length > 0 ? Math.round(enrollees.reduce((s, l) => s + l.progress, 0) / enrollees.length) : 0;
    return { ...course, avgCompletion: avg, learnerCount: enrollees.length };
  }).sort((a, b) => b.avgCompletion - a.avgCompletion);

  const topLearners = [...MOCK_LEARNERS].sort((a, b) => b.progress - a.progress).slice(0, 3);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Admin Dashboard</h2>
        <p className="text-slate-500 mt-1">Real-time engagement metrics for your platform.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
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
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-lg mb-6">Completion Trend</h3>
          <div className="flex items-end gap-3 h-32">
            {WEEKLY_ACTIVITY.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-brand-gradient rounded-t-md" style={{ height: `${(day.count / maxActivity) * 100}%` }} />
                <span className="text-xs text-slate-500">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-lg mb-4">Top Courses</h3>
          <div className="space-y-4">
            {topCourses.map((course) => (
              <div key={course.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700 truncate mr-2">{course.title}</span>
                  <span className="shrink-0 text-[#4F46E5] font-semibold">{course.avgCompletion}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gradient" style={{ width: `${course.avgCompletion}%` }} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{course.learnerCount} learners</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-lg mb-6">Most Active Learners</h3>
        <div className="space-y-4">
          {topLearners.map((learner) => (
            <div key={learner.id} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-[#4F46E5] shrink-0">
                {learner.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-700">{learner.name}</span>
                  <span className="text-xs text-slate-400">{learner.lastActive}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gradient" style={{ width: `${learner.progress}%` }} />
                </div>
              </div>
              <span className="text-sm font-bold text-slate-700 w-10 text-right">{learner.progress}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
