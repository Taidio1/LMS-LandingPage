import { useState } from 'react';
import { PlayCircle, FileText, AlignJustify, Plus } from 'lucide-react';
import { MOCK_COURSES, Course, Lesson } from '../../services/mockData';

const lessonIcon = (type: Lesson['type']) => {
  if (type === 'video') return <PlayCircle className="w-4 h-4 text-[#4F46E5]" />;
  if (type === 'pdf') return <FileText className="w-4 h-4 text-orange-500" />;
  return <FileText className="w-4 h-4 text-slate-400" />;
};

const completionMap: Record<string, number> = {
  'The Odysseio Advantage': 74,
  'Security & Compliance': 58,
  'Branding Your Platform': 41,
};

export const CoursesManager = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course>(MOCK_COURSES[0]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Courses</h2>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex" style={{ minHeight: '600px' }}>
        {/* Left panel */}
        <div className="w-72 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Courses</p>
          </div>
          <div className="flex-1 divide-y divide-slate-100">
            {MOCK_COURSES.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`w-full text-left p-4 transition-colors hover:bg-slate-50 ${selectedCourse.id === course.id ? 'bg-indigo-50 border-r-2 border-[#4F46E5]' : ''}`}
              >
                <p className={`text-sm font-semibold ${selectedCourse.id === course.id ? 'text-[#4F46E5]' : 'text-slate-700'}`}>{course.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{course.lessons.length} lessons · {completionMap[course.title] ?? 0}% avg</p>
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-slate-100">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-sm text-slate-400 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors">
              <Plus className="w-4 h-4" /> New Course
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 p-8 space-y-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Edit Course</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                key={selectedCourse.id + '-title'}
                type="text"
                defaultValue={selectedCourse.title}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                key={selectedCourse.id + '-desc'}
                defaultValue={selectedCourse.description}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] resize-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-700">Lessons</p>
              <span className="text-xs text-slate-400">Drag to reorder</span>
            </div>
            <div className="space-y-2">
              {selectedCourse.lessons.map((lesson, i) => (
                <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 group cursor-grab">
                  <AlignJustify className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-400 w-5 shrink-0">{i + 1}.</span>
                  {lessonIcon(lesson.type)}
                  <span className="flex-1 text-sm font-medium text-slate-700">{lesson.title}</span>
                  <span className="text-xs text-slate-400 shrink-0">{lesson.duration}</span>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-300 text-sm text-slate-400 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors">
              <Plus className="w-4 h-4" /> Add Lesson
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button className="bg-brand-gradient text-white px-8 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
