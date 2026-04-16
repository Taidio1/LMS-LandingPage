import { useState } from 'react';
import { CheckCircle2, PlayCircle, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_COURSES, Course, Lesson } from '../../services/mockData';
import { useProgress } from '../../hooks/useProgress';

const CoursePlayer = ({ course, onBack }: { course: Course; onBack: () => void }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson>(course.lessons[0]);
  const { toggleLesson, isCompleted, completedLessons } = useProgress();

  const done = completedLessons.filter(id => course.lessons.some(l => l.id === id)).length;
  const progressPercent = Math.round((done / course.lessons.length) * 100);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 md:p-8">
      <div className="w-full md:w-80 space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to My Courses
        </button>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4">{course.title}</h3>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-500">Your Progress</span>
            <span className="font-semibold text-[#4F46E5]">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-gradient transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-sm">Course Content</div>
          <div className="divide-y divide-slate-100">
            {course.lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 ${activeLesson.id === lesson.id ? 'bg-indigo-50' : ''}`}
              >
                {isCompleted(lesson.id) ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                ) : (
                  <PlayCircle className={`w-5 h-5 shrink-0 ${activeLesson.id === lesson.id ? 'text-[#4F46E5]' : 'text-slate-400'}`} />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${activeLesson.id === lesson.id ? 'text-[#4F46E5]' : 'text-slate-700'}`}>{lesson.title}</p>
                  <p className="text-xs text-slate-500">{lesson.duration}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="aspect-video bg-slate-900 flex items-center justify-center">
            {activeLesson.type === 'video' ? (
              <iframe src={activeLesson.content} className="w-full h-full" allowFullScreen />
            ) : (
              <div className="text-center p-12">
                <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h4 className="text-white text-xl font-bold">{activeLesson.title}</h4>
                <p className="text-slate-400 mt-2">Document Preview Mode</p>
              </div>
            )}
          </div>
          <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{activeLesson.title}</h2>
              <p className="text-slate-500 mt-1">Module: {course.title}</p>
            </div>
            <button
              onClick={() => toggleLesson(activeLesson.id)}
              className={`flex items-center gap-2 px-8 h-12 rounded-xl font-semibold text-white shadow-lg transition-colors ${isCompleted(activeLesson.id) ? 'bg-green-500 hover:bg-green-600' : 'bg-brand-gradient hover:opacity-90'}`}
            >
              {isCompleted(activeLesson.id) ? 'Completed' : 'Mark as Complete'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MyCourses = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { completedLessons } = useProgress();

  if (selectedCourse) return <CoursePlayer course={selectedCourse} onBack={() => setSelectedCourse(null)} />;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COURSES.map((course) => {
          const done = completedLessons.filter(id => course.lessons.some(l => l.id === id)).length;
          const progress = Math.round((done / course.lessons.length) * 100);
          return (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="aspect-video bg-slate-900 flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-slate-600" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 mb-1">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-4 flex-1">{course.description}</p>
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{done} / {course.lessons.length} lessons</span>
                    <span className="font-semibold text-[#4F46E5]">{progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-gradient transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="w-full bg-brand-gradient text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm"
                >
                  {progress === 0 ? 'Start Course' : progress === 100 ? 'Review Course' : 'Continue'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
