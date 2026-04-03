export const FILTERS = [
  { key: 'all',       label: 'All'      },
  { key: 'pending',   label: 'Pending'  },
  { key: 'accepted',  label: 'Accepted' },
  { key: 'completed', label: 'Done'     },
  { key: 'rejected',  label: 'Rejected' },
];

export const STATUS_CONFIG = {
  pending:   { accent: '#F59E0B', badgeBg: 'bg-amber-100',  badgeText: 'text-amber-800',  label: 'Pending'   },
  accepted:  { accent: '#3B82F6', badgeBg: 'bg-blue-100',   badgeText: 'text-blue-800',   label: 'Accepted'  },
  completed: { accent: '#10B981', badgeBg: 'bg-emerald-100',badgeText: 'text-emerald-800',label: 'Completed' },
  rejected:  { accent: '#EF4444', badgeBg: 'bg-red-100',    badgeText: 'text-red-800',    label: 'Rejected'  },
};