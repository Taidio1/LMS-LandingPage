import { useRole } from '../../context/RoleContext';
import { useNavigation, ActiveTab } from '../../context/NavigationContext';

export const TabBar = () => {
  const { role } = useRole();
  const { activeTab, setActiveTab, tabs } = useNavigation();

  return (
    <div className="border-b border-slate-200 bg-white sticky top-16 z-40">
      <div className="container mx-auto px-4 flex items-center">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as ActiveTab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#4F46E5] text-[#4F46E5]'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-slate-400 italic pr-2">
          {role === 'LEARNER' ? 'Learner view' : 'Admin view'}
        </span>
      </div>
    </div>
  );
};
