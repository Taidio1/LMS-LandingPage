import { BookOpen, CheckCircle2, TrendingUp } from 'lucide-react';
import { MOCK_COURSES } from '../../services/mockData';
import { useProgress } from '../../hooks/useProgress';
import { useNavigation, ActiveTab } from '../../context/NavigationContext';

export const LearnerDashboard = () => {
  const { completedLessons } = useProgress();
  const { setActiveTab } = useNavigation();

  const totalLessons = MOCK_COURSES.reduce((sum, c) => sum + c.lessons.length, 0);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  const lastCourse = MOCK_COURSES[0];
  const lastCourseDone = completedLessons.filter(id => lastCourse.lessons.some(l => l.id === id)).length;
  const lastCourseProgress = Math.round((lastCourseDone / lastCourse.lessons.length) * 100);

  const stats = [
    { label: 'Courses Enrolled', value: MOCK_COURSES.length, icon: BookOpen, color: 'text-blue-600' },
    { label: 'Lessons Completed', value: completedLessons.length, icon: CheckCircle2, color: 'text-green-600' },
    { label: 'Overall Progress', value: `${overallProgress}%`, icon: TrendingUp, color: 'text-[#4F46E5]' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="bg-brand-gradient rounded-3xl p-8 text-white">
        <p className="text-white/70 text-sm font-medium mb-1">Welcome back,</p>
        <h1 className="text-3xl font-bold mb-2">Alex Johnson</h1>
        <p className="text-white/80">You're making great progress. Keep it up!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4">Continue Learning</h3>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900">{lastCourse.title}</h4>
            <p className="text-sm text-slate-500 mt-1">{lastCourse.description}</p>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Progress</span>
                <span>{lastCourseProgress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-gradient transition-all duration-500" style={{ width: `${lastCourseProgress}%` }} />
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('My Courses' as ActiveTab)}
            className="shrink-0 bg-brand-gradient text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Resume →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
        {completedLessons.length === 0 ? (
          <p className="text-sm text-slate-500">No activity yet — start a lesson in My Courses!</p>
        ) : (
          <div className="space-y-3">
            {[...completedLessons].reverse().slice(0, 5).map((lessonId, i) => {
              const course = MOCK_COURSES.find(c => c.lessons.some(l => l.id === lessonId));
              const lesson = course?.lessons.find(l => l.id === lessonId);
              return (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-slate-700 font-medium">{lesson?.title}</span>
                  <span className="text-slate-400 text-xs ml-auto">{course?.title}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
