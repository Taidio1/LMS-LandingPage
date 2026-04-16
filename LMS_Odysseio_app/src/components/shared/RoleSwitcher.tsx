import { Button } from "@/components/ui/button"
import { useRole } from "@/context/RoleContext"
import { Users, ShieldCheck } from "lucide-react"

export const RoleSwitcher = () => {
  const { role, setRole } = useRole();

  return (
    <div className="flex items-center gap-2 p-1 bg-bg-accent-light rounded-lg border border-border-brand">
      <Button
        variant={role === 'LEARNER' ? "default" : "ghost"}
        size="sm"
        onClick={() => setRole('LEARNER')}
        className="gap-2"
      >
        <Users className="w-4 h-4" />
        Learner
      </Button>
      <Button
        variant={role === 'ADMIN' ? "default" : "ghost"}
        size="sm"
        onClick={() => setRole('ADMIN')}
        className="gap-2"
      >
        <ShieldCheck className="w-4 h-4" />
        Admin
      </Button>
    </div>
  );
};
