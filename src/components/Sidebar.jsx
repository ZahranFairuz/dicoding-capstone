import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Heart, 
  Repeat, 
  BarChart2, 
  Blocks, 
  ChevronDown,
  ChevronUp,
  History,
  User
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, active = false, hasDropdown = false, isOpen = false, onClick, children }) => (
  <div className="flex flex-col">
    <div 
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-[#dbeafe] text-[#2563eb]' : 'text-[#64748b] hover:bg-slate-50'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={active ? 'text-[#2563eb]' : 'text-[#94a3b8]'} />
        <span className="font-semibold text-sm">{label}</span>
      </div>
      {hasDropdown && (isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
    </div>
    {isOpen && <div className="ml-6 mt-1 flex flex-col gap-1">{children}</div>}
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFinanceOpen, setIsFinanceOpen] = React.useState(location.pathname.includes('/finance'));

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 sticky top-0 h-screen">
      <div className="mb-10 flex items-center gap-2 px-2">
        <span className="text-2xl font-black text-slate-800">Logo</span>
      </div>

      <nav className="flex-1 space-y-2">
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          active={isActive('/dashboard')} 
          onClick={() => navigate('/dashboard')}
        />
        
        <SidebarItem 
          icon={Wallet} 
          label="Finance" 
          hasDropdown 
          isOpen={isFinanceOpen}
          onClick={() => setIsFinanceOpen(!isFinanceOpen)}
          active={location.pathname.includes('/finance')}
        >
          <div 
            onClick={() => navigate('/finance/savings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${isActive('/finance/savings') ? 'bg-[#dbeafe] text-[#2563eb]' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Savings
          </div>
          <div 
            onClick={() => navigate('/finance/history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${isActive('/finance/history') ? 'bg-[#dbeafe] text-[#2563eb]' : 'text-slate-500 hover:text-slate-800'}`}
          >
            History
          </div>
        </SidebarItem>

        <SidebarItem 
          icon={Heart} 
          label="Wishlist" 
          active={isActive('/wishlist')}
          onClick={() => navigate('/wishlist')}
        />
        
        <SidebarItem 
          icon={Repeat} 
          label="Transaction" 
          active={isActive('/transaction')}
          onClick={() => navigate('/transaction')}
        />
        
        <SidebarItem 
          icon={BarChart2} 
          label="Analysis" 
          active={isActive('/analysis')}
          onClick={() => navigate('/analysis')}
        />
        
        <SidebarItem 
          icon={Blocks} 
          label="Category" 
          active={isActive('/category')}
          onClick={() => navigate('/category')}
        />

        <SidebarItem 
          icon={History} 
          label="History" 
          active={isActive('/history')}
          onClick={() => navigate('/history')}
        />

        <SidebarItem 
          icon={User} 
          label="Profile" 
          active={isActive('/profile')}
          onClick={() => navigate('/profile')}
        />
      </nav>

      <div className="mt-auto border-t border-slate-100 pt-6 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200" />
          <div>
            <p className="text-sm font-bold text-slate-800">User</p>
            <p className="text-xs text-slate-500">Saver</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
