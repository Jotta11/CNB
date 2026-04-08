// src/components/admin/AdminSidebar.tsx
import {
  Users, UserCheck, Package, Building2, Newspaper,
  CalendarDays, Settings, LayoutDashboard, Handshake,
  Target, BarChart3, FileText,
} from 'lucide-react';

export type SectionKey =
  | 'leads' | 'usuarios' | 'lotes' | 'parceiros' | 'noticias' | 'calendario' | 'settings'
  | 'parceiro-dashboard' | 'parceiro-crm' | 'parceiro-indicacoes' | 'parceiro-metricas' | 'parceiro-contratos';

interface SectionDef {
  key: SectionKey;
  label: string;
  icon: React.ElementType;
  group: 'site' | 'parceiros';
}

export const ALL_SECTIONS: SectionDef[] = [
  { key: 'leads',                label: 'Leads',       icon: Users,          group: 'site' },
  { key: 'usuarios',             label: 'Usuários',    icon: UserCheck,      group: 'site' },
  { key: 'lotes',                label: 'Lotes',       icon: Package,        group: 'site' },
  { key: 'parceiros',            label: 'Empresas',    icon: Building2,      group: 'site' },
  { key: 'noticias',             label: 'Notícias',    icon: Newspaper,      group: 'site' },
  { key: 'calendario',           label: 'Calendário',  icon: CalendarDays,   group: 'site' },
  { key: 'settings',             label: 'Configurações', icon: Settings,     group: 'site' },
  { key: 'parceiro-dashboard',   label: 'Dashboard',   icon: LayoutDashboard, group: 'parceiros' },
  { key: 'parceiro-crm',         label: 'CRM Parceiros', icon: Handshake,   group: 'parceiros' },
  { key: 'parceiro-indicacoes',  label: 'Indicações',  icon: Target,         group: 'parceiros' },
  { key: 'parceiro-metricas',    label: 'Métricas',    icon: BarChart3,      group: 'parceiros' },
  { key: 'parceiro-contratos',   label: 'Contratos',   icon: FileText,       group: 'parceiros' },
];

interface AdminSidebarProps {
  allowedKeys: string[] | null; // null = acesso total
  activeSection: SectionKey;
  onSelect: (key: SectionKey) => void;
}

const AdminSidebar = ({ allowedKeys, activeSection, onSelect }: AdminSidebarProps) => {
  const visible = allowedKeys
    ? ALL_SECTIONS.filter((s) => allowedKeys.includes(s.key))
    : ALL_SECTIONS;

  const siteItems = visible.filter((s) => s.group === 'site');
  const parceirosItems = visible.filter((s) => s.group === 'parceiros');

  const NavItem = ({ section }: { section: SectionDef }) => {
    const isActive = activeSection === section.key;
    const Icon = section.icon;
    return (
      <button
        onClick={() => onSelect(section.key)}
        className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors text-left rounded-none border-l-2 ${
          isActive
            ? 'bg-white/10 border-accent text-white'
            : 'border-transparent text-white/65 hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        {section.label}
      </button>
    );
  };

  return (
    <aside className="w-52 bg-primary flex-shrink-0 flex flex-col py-4 overflow-y-auto">
      {siteItems.length > 0 && (
        <div className="mb-2">
          <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/35">
            🌐 Site
          </p>
          {siteItems.map((s) => <NavItem key={s.key} section={s} />)}
        </div>
      )}

      {parceirosItems.length > 0 && (
        <div className="mt-2">
          <div className="mx-4 mb-2 border-t border-white/10" />
          <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/35">
            🤝 Parceiros
          </p>
          {parceirosItems.map((s) => <NavItem key={s.key} section={s} />)}
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
