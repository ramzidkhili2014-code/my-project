'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  TicketCheck, 
  Laptop, 
  KeyRound, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { PriorityBadge, StatusBadge, CategoryBadge } from '@/components/Badges';
import { ActiveTab } from './Sidebar';
import { Ticket } from '@/types';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectTicket: (ticket: Ticket) => void;
  openNewTicketModal: () => void;
}

export function DashboardView({ 
  setActiveTab, 
  onSelectTicket, 
  openNewTicketModal 
}: DashboardViewProps) {
  const { tickets, assets, licenses } = useApp();

  // Metrics
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress' || t.status === 'waiting');
  const criticalTickets = tickets.filter(t => t.priority === 'critical' && t.status !== 'closed' && t.status !== 'resolved');
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const resolutionRate = tickets.length > 0 ? Math.round((resolvedCount / tickets.length) * 100) : 100;

  const totalAssets = assets.length;
  const inUseAssets = assets.filter(a => a.status === 'in_use').length;
  const maintenanceAssets = assets.filter(a => a.status === 'maintenance').length;
  const inStockAssets = assets.filter(a => a.status === 'available').length;

  const totalLicenseBudget = licenses.reduce((acc, curr) => acc + curr.costPerYear, 0);
  const licensesNearLimit = licenses.filter(l => (l.usedSeats / l.totalSeats) >= 0.88);

  // Asset type counts
  const assetTypeMap: Record<string, number> = {};
  assets.forEach(a => {
    assetTypeMap[a.type] = (assetTypeMap[a.type] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if Critical Tickets exist */}
      {criticalTickets.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 text-white rounded-lg">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-semibold text-red-900 text-sm">
                {criticalTickets.length} incident(s) critique(s) en attente d&apos;intervention immédiate
              </h2>
              <p className="text-xs text-red-700">
                Priorité absolue pour l&apos;équipe support informatique.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('tickets')}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5"
          >
            Voir les tickets
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Tickets */}
        <div 
          onClick={() => setActiveTab('tickets')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tickets Actifs</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
              <TicketCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{openTickets.length}</span>
            <span className="text-xs text-slate-500">sur {tickets.length} au total</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            {criticalTickets.length > 0 ? (
              <span className="text-red-600 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {criticalTickets.length} critique(s)
              </span>
            ) : (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Aucun critique
              </span>
            )}
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">Taux: {resolutionRate}%</span>
          </div>
        </div>

        {/* KPI 2: Parc Matériel */}
        <div 
          onClick={() => setActiveTab('assets')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Parc Informatique</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
              <Laptop className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{inUseAssets}</span>
            <span className="text-xs text-slate-500">équipements en service</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <span className="text-blue-600 font-medium">{inStockAssets} en stock</span>
            <span className="text-slate-400">•</span>
            <span className={maintenanceAssets > 0 ? "text-amber-600 font-medium" : "text-slate-500"}>
              {maintenanceAssets} en réparation
            </span>
          </div>
        </div>

        {/* KPI 3: Licences & Logiciels */}
        <div 
          onClick={() => setActiveTab('licenses')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Licences Logicielles</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
              <KeyRound className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{licenses.length}</span>
            <span className="text-xs text-slate-500">abonnements gérés</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            {licensesNearLimit.length > 0 ? (
              <span className="text-amber-600 font-medium">
                {licensesNearLimit.length} seuil &gt; 90%
              </span>
            ) : (
              <span className="text-emerald-600 font-medium">Quotas optimaux</span>
            )}
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium">{totalLicenseBudget.toLocaleString('fr-FR')} €/an</span>
          </div>
        </div>

        {/* KPI 4: Efficacité */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Temps Moyen Résolution</span>
            <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">2.4 h</span>
            <span className="text-xs text-emerald-600 font-semibold">-18% ce mois</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>SLA 98.2% respecté</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Recent Tickets & Asset Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Tickets (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Tickets récents</h2>
              <p className="text-xs text-slate-500">Dernières demandes soumises par les collaborateurs</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openNewTicketModal}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100"
              >
                + Créer
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 transition"
              >
                Tout voir
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {tickets.slice(0, 5).map(ticket => (
              <div
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className="p-4 hover:bg-slate-50/80 transition cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-semibold text-slate-500">{ticket.id}</span>
                    <PriorityBadge priority={ticket.priority} />
                    <CategoryBadge category={ticket.category} />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 truncate">
                    {ticket.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>{ticket.requesterName} ({ticket.requesterDept})</span>
                    <span>•</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                    {ticket.assignedTo && (
                      <>
                        <span>•</span>
                        <span className="text-indigo-600 font-medium">Assigné: {ticket.assignedTo}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <StatusBadge status={ticket.status} />
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Fleet Distribution & Alerts */}
        <div className="space-y-6">
          {/* Asset Distribution */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 text-sm">Flotte Matériel</h2>
              <button
                onClick={() => setActiveTab('assets')}
                className="text-xs text-indigo-600 hover:underline"
              >
                Gérer ({totalAssets})
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: 'PC Portables', count: assetTypeMap['laptop'] || 0, color: 'bg-indigo-500' },
                { label: 'Postes Fixes', count: assetTypeMap['desktop'] || 0, color: 'bg-blue-500' },
                { label: 'Écrans 4K/QHD', count: assetTypeMap['screen'] || 0, color: 'bg-teal-500' },
                { label: 'Serveurs & Cloud', count: assetTypeMap['server'] || 0, color: 'bg-purple-500' },
                { label: 'Réseau (Switchs/Routeurs)', count: assetTypeMap['network'] || 0, color: 'bg-amber-500' },
                { label: 'Imprimantes', count: assetTypeMap['printer'] || 0, color: 'bg-rose-500' },
              ].map(item => {
                const pct = totalAssets > 0 ? Math.round((item.count / totalAssets) * 100) : 0;
                return (
                  <div key={item.label} className="text-xs">
                    <div className="flex justify-between mb-1 text-slate-600">
                      <span>{item.label}</span>
                      <span className="font-medium text-slate-900">{item.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${item.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Licenses Capacity Quick View */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900 text-sm">Quotas Licences</h2>
              <button
                onClick={() => setActiveTab('licenses')}
                className="text-xs text-indigo-600 hover:underline"
              >
                Détails
              </button>
            </div>

            <div className="space-y-3">
              {licenses.slice(0, 4).map(lic => {
                const ratio = lic.usedSeats / lic.totalSeats;
                const isWarning = ratio >= 0.9;
                return (
                  <div key={lic.id} className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-slate-700 truncate max-w-[140px]">{lic.name}</span>
                      <span className={`font-semibold ${isWarning ? 'text-amber-600' : 'text-slate-600'}`}>
                        {lic.usedSeats} / {lic.totalSeats}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.round(ratio * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
