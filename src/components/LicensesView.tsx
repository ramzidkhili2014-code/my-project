'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { LicenseCategory } from '@/types';
import { 
  KeyRound, 
  Search, 
  Plus, 
  Euro, 
  Calendar, 
  ShieldAlert, 
  Trash2,
  Tag
} from 'lucide-react';
import { NewLicenseModal } from './NewLicenseModal';

export function LicensesView() {
  const { licenses, deleteLicense } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isNewLicenseOpen, setIsNewLicenseOpen] = useState(false);

  const totalCost = licenses.reduce((sum, l) => sum + l.costPerYear, 0);
  const totalSeats = licenses.reduce((sum, l) => sum + l.totalSeats, 0);
  const totalUsedSeats = licenses.reduce((sum, l) => sum + l.usedSeats, 0);
  const globalUtilization = totalSeats > 0 ? Math.round((totalUsedSeats / totalSeats) * 100) : 0;

  const filteredLicenses = licenses.filter(lic => {
    const q = search.toLowerCase();
    const matchesSearch = 
      lic.name.toLowerCase().includes(q) ||
      lic.vendor.toLowerCase().includes(q) ||
      lic.keyOrContractRef.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (categoryFilter !== 'all' && lic.category !== categoryFilter) return false;

    return true;
  });

  const getCategoryLabel = (cat: LicenseCategory) => {
    const labels: Record<LicenseCategory, string> = {
      productivity: 'Bureautique & Productivité',
      security: 'Sécurité & Antivirus',
      communication: 'Communication',
      dev: 'Développement',
      design: 'Design & Médias',
      infrastructure: 'Infrastructure & Cloud'
    };
    return labels[cat] || cat;
  };

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Gestion des Licences & Abonnements SaaS
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              {licenses.length} contrats
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des coûts informatiques, quotas d&apos;utilisateurs et renouvellements.
          </p>
        </div>

        <button
          onClick={() => setIsNewLicenseOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Ajouter une Licence
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Budget Annuel SaaS / IT</span>
            <Euro className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {totalCost.toLocaleString('fr-FR')} € / an
          </div>
          <p className="text-xs text-slate-500 mt-1">Soit environ {Math.round(totalCost / 12).toLocaleString('fr-FR')} € / mois</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Taux d&apos;attribution</span>
            <span className="font-bold text-indigo-600">{globalUtilization}%</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {totalUsedSeats} / {totalSeats} sièges
          </div>
          <p className="text-xs text-slate-500 mt-1">{totalSeats - totalUsedSeats} licences actuellement disponibles</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Alertes Quotas &gt; 90%</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {licenses.filter(l => (l.usedSeats / l.totalSeats) >= 0.9).length} licence(s)
          </div>
          <p className="text-xs text-slate-500 mt-1">Nécessite une extension de contrat prochainement</p>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par logiciel, éditeur ou référence de contrat..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
        >
          <option value="all">Toutes les catégories</option>
          <option value="productivity">Bureautique & Productivité</option>
          <option value="security">Sécurité & Antivirus</option>
          <option value="communication">Communication</option>
          <option value="dev">Développement</option>
          <option value="design">Design & Médias</option>
        </select>
      </div>

      {/* Licenses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLicenses.map(lic => {
          const ratio = lic.totalSeats > 0 ? (lic.usedSeats / lic.totalSeats) : 0;
          const pct = Math.round(ratio * 100);
          const isWarning = ratio >= 0.9;
          const isFull = lic.usedSeats >= lic.totalSeats;

          return (
            <div
              key={lic.id}
              className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{lic.name}</h3>
                    <p className="text-xs text-slate-500">
                      Éditeur : <span className="font-medium text-slate-700">{lic.vendor}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Supprimer la licence ${lic.name} ?`)) {
                      deleteLicense(lic.id);
                    }
                  }}
                  className="text-slate-400 hover:text-red-500 p-1 rounded transition"
                  title="Supprimer la licence"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar of seats */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-600">Sièges attribués</span>
                  <span className={`font-semibold ${isFull ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-slate-800'}`}>
                    {lic.usedSeats} / {lic.totalSeats} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      isFull ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>

              {/* Details strip */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Coût annuel</span>
                  <span className="font-semibold text-slate-800">
                    {lic.costPerYear.toLocaleString('fr-FR')} €/an
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Renouvellement</span>
                  <div className="flex items-center gap-1 font-medium text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lic.renewalDate}</span>
                  </div>
                </div>

                <div className="col-span-2 flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {getCategoryLabel(lic.category)}
                  </span>
                  <span className="font-mono text-slate-400">Réf: {lic.keyOrContractRef}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <NewLicenseModal
        isOpen={isNewLicenseOpen}
        onClose={() => setIsNewLicenseOpen(false)}
      />
    </div>
  );
}
