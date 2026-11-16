import React from 'react';
import { TicketPriority, TicketStatus, AssetStatus, TicketCategory } from '@/types';

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const configs = {
    low: { label: 'Basse', bg: 'bg-slate-100 text-slate-700 border-slate-200' },
    medium: { label: 'Moyenne', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    high: { label: 'Haute', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    critical: { label: 'Critique', bg: 'bg-red-50 text-red-700 border-red-200 font-semibold animate-pulse' },
  };

  const c = configs[priority] || configs.medium;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${c.bg}`}>
      {c.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  const configs = {
    open: { label: 'Nouveau', bg: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
    in_progress: { label: 'En cours', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
    waiting: { label: 'En attente', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    resolved: { label: 'Résolu', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    closed: { label: 'Clôturé', bg: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  };

  const c = configs[status] || configs.open;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${c.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export function AssetStatusBadge({ status }: { status: AssetStatus }) {
  const configs = {
    in_use: { label: 'En service', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    available: { label: 'En stock', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    maintenance: { label: 'En réparation', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    retired: { label: 'Rebut / Retiré', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  };

  const c = configs[status] || configs.available;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${c.bg}`}>
      {c.label}
    </span>
  );
}

export function CategoryBadge({ category }: { category: TicketCategory }) {
  const configs = {
    hardware: { label: 'Matériel', color: 'text-violet-700 bg-violet-50 border-violet-200' },
    software: { label: 'Logiciel', color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
    network: { label: 'Réseau', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    access: { label: 'Accès & Droits', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    security: { label: 'Sécurité', color: 'text-red-700 bg-red-50 border-red-200' },
    other: { label: 'Autre', color: 'text-slate-700 bg-slate-100 border-slate-200' },
  };

  const c = configs[category] || configs.other;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${c.color}`}>
      {c.label}
    </span>
  );
}
