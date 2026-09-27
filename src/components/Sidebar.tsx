import React from 'react';
import type { PageKey } from '../types';

interface NavItem {
  key: PageKey;
  label: string;
  icon: string;
  group: string;
  badge?: number;
}

interface SidebarProps {
  active: PageKey;
  onNavigate: (key: PageKey) => void;
  pendingApprovals: number;
  pendingAssign: number;
  isCollapsed: boolean;
  onToggle: () => void;
  onLogout?: () => void;
  userName?: string;
  userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  active,
  onNavigate,
  pendingApprovals,
  pendingAssign,
  isCollapsed,
  onToggle,
  onLogout,
  userName = 'Admin User',
  userRole = 'Super Admin',
}) => {
  const items: NavItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: '◧', group: 'Overview' },
    { key: 'categories', label: 'Categories', icon: '▤', group: 'Catalog' },
    { key: 'subCategories', label: 'Sub-categories', icon: '▥', group: 'Catalog' },
    { key: 'services', label: 'Services', icon: '✦', group: 'Catalog' },
    { key: 'banners', label: 'Banners', icon: '▭', group: 'Catalog' },
    { key: 'bookings', label: 'Bookings', icon: '▦', group: 'Operations' },
    { key: 'assignService', label: 'Assign provider', icon: '↦', group: 'Operations', badge: pendingAssign },
    { key: 'providerApproval', label: 'Provider approval', icon: '✓', group: 'People', badge: pendingApprovals },
    { key: 'providers', label: 'Providers', icon: '☺', group: 'People' },
    { key: 'customers', label: 'Customers', icon: '☻', group: 'People' },
  ];

  const groups = Array.from(new Set(items.map((i) => i.group)));

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-top">
        <div className="brand">
          <div className="brand-mark">SH</div>
          {!isCollapsed && (
            <div>
              <div className="brand-name">ServiceHub</div>
              <div className="brand-sub">Admin Console</div>
            </div>
          )}
        </div>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '›' : '‹'}
        </button>
      </div>
      <nav className="nav">
        {groups.map((group) => (
          <div className="nav-group" key={group}>
            {!isCollapsed && <div className="nav-group-label">{group}</div>}
            {items
              .filter((i) => i.group === group)
              .map((item) => (
                <button
                  key={item.key}
                  className={`nav-item ${active === item.key ? 'nav-item-active' : ''}`}
                  onClick={() => onNavigate(item.key)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                  {!!item.badge && <span className="nav-badge">{item.badge}</span>}
                </button>
              ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <img src="https://picsum.photos/seed/admin/64/64" alt="" className="footer-avatar" />
        {!isCollapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="footer-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName}
            </div>
            <div className="footer-role" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userRole}
            </div>
          </div>
        )}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title="Sign out"
            aria-label="Sign out"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f87171',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '4px 6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
            }}
          >
            ↪
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
