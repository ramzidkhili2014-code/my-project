'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { LicenseCategory } from '@/types';
import { X, KeyRound } from 'lucide-react';

interface NewLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewLicenseModal({ isOpen, onClose }: NewLicenseModalProps) {
  const { addLicense } = useApp();

  const [name, setName] = useState('');
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState<LicenseCategory>('productivity');
  const [totalSeats, setTotalSeats] = useState(25);
  const [usedSeats, setUsedSeats] = useState(20);
  const [costPerYear, setCostPerYear] = useState(3000);
  const [renewalDate, setRenewalDate] = useState(
    new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10)
  );
  const [keyOrContractRef, setKeyOrContractRef] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !vendor.trim()) return;

    addLicense({
      name: name.trim(),
      vendor: vendor.trim(),
      category,
      totalSeats: Number(totalSeats) || 1,
      usedSeats: Number(usedSeats) || 0,
      costPerYear: Number(costPerYear) || 0,
      renewalDate,
      keyOrContractRef: keyOrContractRef.trim() || 'REF-CONTRAT-IT'
    });

    setName('');
    setVendor('');
    setKeyOrContractRef('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base">Ajouter une Licence Logicielle</h2>
              <p className="text-xs text-slate-400">Suivi des abonnements SaaS et logiciels</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nom du logiciel / Service SaaS <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Microsoft 365, Slack Enterprise, GitHub..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Éditeur / Fournisseur <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={vendor}
                onChange={e => setVendor(e.target.value)}
                placeholder="Microsoft, Adobe, Atlassian..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as LicenseCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="productivity">Bureautique & Productivité</option>
                <option value="security">Sécurité & Antivirus</option>
                <option value="communication">Communication & Visio</option>
                <option value="dev">Développement & DevOps</option>
                <option value="design">Design & Multimédia</option>
                <option value="infrastructure">Infrastructure & Cloud</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sièges / Licences Totales</label>
              <input
                type="number"
                min={1}
                required
                value={totalSeats}
                onChange={e => setTotalSeats(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sièges actuellement attribués</label>
              <input
                type="number"
                min={0}
                required
                value={usedSeats}
                onChange={e => setUsedSeats(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Coût Annuel (€)</label>
              <input
                type="number"
                min={0}
                value={costPerYear}
                onChange={e => setCostPerYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date de renouvellement</label>
              <input
                type="date"
                required
                value={renewalDate}
                onChange={e => setRenewalDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Référence contrat / Clé de licence
            </label>
            <input
              type="text"
              value={keyOrContractRef}
              onChange={e => setKeyOrContractRef(e.target.value)}
              placeholder="Ex: SUB-98412-ENT"
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition shadow-sm"
            >
              Enregistrer la licence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
