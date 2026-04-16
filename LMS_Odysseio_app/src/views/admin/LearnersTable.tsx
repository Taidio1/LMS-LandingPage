import { useState } from 'react';
import { Search } from 'lucide-react';
import { MOCK_LEARNERS } from '../../services/mockData';

export const LearnersTable = () => {
  const [search, setSearch] = useState('');
  const filtered = MOCK_LEARNERS.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Learners</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search learners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['Learner', 'Enrolled Course', 'Progress', 'Last Active', 'Status'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((learner) => (
              <tr key={learner.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-[#4F46E5] text-sm shrink-0">
                      {learner.name[0]}
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{learner.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{learner.enrolledCourse}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-gradient" style={{ width: `${learner.progress}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 w-10 text-right">{learner.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{learner.lastActive}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${learner.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {learner.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">No learners match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
