import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRole } from './RoleContext';

export const LEARNER_TABS = ['Dashboard', 'My Courses', 'Progress'] as const;
export const ADMIN_TABS = ['Dashboard', 'Courses', 'Learners'] as const;

export type LearnerTab = typeof LEARNER_TABS[number];
export type AdminTab = typeof ADMIN_TABS[number];
export type ActiveTab = LearnerTab | AdminTab;

interface NavigationContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  tabs: readonly string[];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState<ActiveTab>('Dashboard');

  useEffect(() => {
    setActiveTab('Dashboard');
  }, [role]);

  const tabs = role === 'LEARNER' ? LEARNER_TABS : ADMIN_TABS;

  return (
    <NavigationContext.Provider value={{ activeTab, setActiveTab, tabs }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
};
