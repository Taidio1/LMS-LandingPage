import { useRole } from './context/RoleContext';
import { useNavigation } from './context/NavigationContext';
import { Header } from './components/shared/Header';
import { TabBar } from './components/shared/TabBar';
import { LearnerDashboard } from './views/learner/LearnerDashboard';
import { MyCourses } from './views/learner/MyCourses';

const Placeholder = ({ name }: { name: string }) => (
  <div className="p-12 text-center text-slate-400 text-lg">{name} — coming soon</div>
);

function App() {
  const { role } = useRole();
  const { activeTab } = useNavigation();

  const renderView = () => {
    if (role === 'LEARNER') {
      if (activeTab === 'My Courses') return <MyCourses />;
      if (activeTab === 'Progress') return <Placeholder name="Progress" />;
      return <LearnerDashboard />;
    }
    if (activeTab === 'Courses') return <Placeholder name="Courses" />;
    if (activeTab === 'Learners') return <Placeholder name="Learners" />;
    return <Placeholder name="Admin Dashboard" />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <Header />
      <TabBar />
      <main className="container mx-auto">{renderView()}</main>
    </div>
  );
}

export default App;
