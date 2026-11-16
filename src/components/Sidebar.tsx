'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  TicketCheck, 
  Laptop, 
  KeyRound, 
  Users, 
  PlusCircle, 
  RotateCcw, 
  Download,
  ShieldCheck,
  Server
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export type ActiveTab = 'dashboard' | 'tickets' | 'assets' | 'licenses' | 'employees';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openNewTicketModal: () => void;
  openNewAssetModal: () => void;
}

export function Sidebar({ 
  activeTab, 
  setActiveTab, 
  openNewTicketModal, 
  openNewAssetModal 
}: SidebarProps) {
  const { tickets, assets, licenses, resetData, exportToCsv } = useApp();

  const openTicketsCount = tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length;
  const criticalTicketsCount = tickets.filter(t => t.priority === 'critical' && t.status !== 'closed').length;
  const inUseAssetsCount = assets.filter(a => a.status === 'in_use').length;

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'tickets' as ActiveTab,
      label: 'Tickets & Helpdesk',
      icon: TicketCheck,
      badge: openTicketsCount > 0 ? (
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
          criticalTicketsCount > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-100 text-indigo-700'
        }`}>
          {openTicketsCount}
        </span>
      ) : null,
    },
    {
      id: 'assets' as ActiveTab,
      label: 'Parc Matériel',
      icon: Laptop,
      badge: (
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
          {inUseAssetsCount}/{assets.length}
        </span>
      ),
    },
    {
      id: 'licenses' as ActiveTab,
      label: 'Licences & Logiciels',
      icon: KeyRound,
      badge: (
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
          {licenses.length}
        </span>
      ),
    },
    {
      id: 'employees' as ActiveTab,
      label: 'Collaborateurs',
      icon: Users,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
              ITDesk Pro
            </h1>
            <p className="text-xs text-slate-400">Gestion Service Informatique</p>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="px-4 py-4 space-y-2">
        <button
          onClick={openNewTicketModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition shadow-sm hover:shadow"
        >
          <PlusCircle className="w-4 h-4" />
          Nouveau Ticket
        </button>
        <button
          onClick={openNewAssetModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
        >
          <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
          Ajouter Équipement
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Navigation
        </p>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge}
            </button>
          );
        })}
      </nav>

      {/* Data Export & Reset */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1 mb-1">
          Outils & Données
        </div>
        
        <div className="flex gap-1.5">
          <button
            onClick={() => exportToCsv('tickets')}
            title="Exporter les tickets en CSV"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
          >
            <Download className="w-3 h-3 text-emerald-400" />
            CSV Tickets
          </button>
          <button
            onClick={() => exportToCsv('assets')}
            title="Exporter le parc matériel en CSV"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
          >
            <Download className="w-3 h-3 text-blue-400" />
            CSV Parc
          </button>
        </div>

        <button
          onClick={() => {
            if (confirm('Voulez-vous réinitialiser toutes les données aux valeurs de démonstration ?')) {
              resetData();
            }
          }}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded transition"
        >
          <RotateCcw className="w-3 h-3" />
          Réinitialiser démo
        </button>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-800 flex items-center gap-3 bg-slate-950/40">
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-xs font-semibold">
          AM
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-200 truncate">Alexandre Martin</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            <span>SuperAdmin IT</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
