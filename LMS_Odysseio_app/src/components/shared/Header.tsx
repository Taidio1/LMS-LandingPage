import { RoleSwitcher } from "./RoleSwitcher"

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-bg-surface/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <span className="font-bold text-xl tracking-tight bg-brand-gradient bg-clip-text text-transparent">
            Odysseio
          </span>
          <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-brand-accent-light text-brand-accent rounded-full border border-border-brand">
            DEMO
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <RoleSwitcher />
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300" />
        </div>
      </div>
    </header>
  );
};
