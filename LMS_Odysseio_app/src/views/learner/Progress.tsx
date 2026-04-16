import { Award, Star, Zap } from 'lucide-react';
import { MOCK_COURSES, WEEKLY_ACTIVITY } from '../../services/mockData';
import { useProgress } from '../../hooks/useProgress';

const BADGES = [
  { icon: Zap,   label: 'First Lesson',    desc: 'Complete your first lesson',  unlocked: (done: number) => done >= 1 },
  { icon: Star,  label: 'Halfway There',   desc: 'Reach 50% overall progress',  unlocked: (done: number, total: number) => total > 0 && done / total >= 0.5 },
  { icon: Award, label: 'Course Complete', desc: 'Finish an entire course',      unlocked: (_d: number, _t: number, hasFull: boolean) => hasFull },
];

export const Progress = () => {
  const { completedLessons } = useProgress();
  const totalLessons = MOCK_COURSES.reduce((sum, c) => sum + c.lessons.length, 0);
  const overallPercent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
  const hasFullCourse = MOCK_COURSES.some(c => c.lessons.every(l => completedLessons.includes(l.id)));
  const maxActivity = Math.max(...WEEKLY_ACTIVITY.map(d => d.count));

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Progress</h2>
        <p className="text-slate-500 mt-1">Track your learning journey</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="text-center shrink-0">
          <p className="text-6xl font-bold text-[#4F46E5]">{overallPercent}%</p>
          <p className="text-sm text-slate-500 mt-2">Overall Completion</p>
        </div>
        <div className="flex-1 w-full space-y-2">
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-gradient transition-all duration-700" style={{ width: `${overallPercent}%` }} />
          </div>
          <p className="text-sm text-slate-500">{completedLessons.length} of {totalLessons} lessons completed</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-lg mb-6">Course Breakdown</h3>
        <div className="space-y-6">
          {MOCK_COURSES.map((course) => {
            const done = completedLessons.filter(id => course.lessons.some(l => l.id === id)).length;
            const pct = Math.round((done / course.lessons.length) * 100);
            return (
              <div key={course.id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">{course.title}</span>
                  <span className="text-slate-500">{done} / {course.lessons.length} lessons · <span className="font-semibold text-[#4F46E5]">{pct}%</span></span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gradient transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-lg mb-6">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const unlocked = badge.unlocked(completedLessons.length, totalLessons, hasFullCourse);
            return (
              <div key={badge.label} className={`rounded-xl p-4 flex items-center gap-4 border transition-opacity ${unlocked ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200 opacity-40'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${unlocked ? 'bg-brand-gradient' : 'bg-slate-200'}`}>
                  <badge.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{badge.label}</p>
                  <p className="text-xs text-slate-500">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-lg mb-6">Weekly Activity</h3>
        <div className="flex items-end gap-3 h-32">
          {WEEKLY_ACTIVITY.map((day) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-brand-gradient rounded-t-md" style={{ height: `${(day.count / maxActivity) * 100}%` }} />
              <span className="text-xs text-slate-500">{day.day}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center">Lessons completed per day (mock data)</p>
      </div>
    </div>
  );
};
