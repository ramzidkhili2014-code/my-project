'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AssetType, AssetStatus } from '@/types';
import { X, Laptop } from 'lucide-react';

interface NewAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewAssetModal({ isOpen, onClose }: NewAssetModalProps) {
  const { addAsset, employees } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<AssetType>('laptop');
  const [brand, setBrand] = useState('Dell');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [status, setStatus] = useState<AssetStatus>('available');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState('');
  const [location, setLocation] = useState('Bâtiment Principal');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [warrantyEnd, setWarrantyEnd] = useState(
    new Date(Date.now() + 3 * 365 * 24 * 3600 * 1000).toISOString().slice(0, 10)
  );
  const [ipAddress, setIpAddress] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !serialNumber.trim()) return;

    const emp = employees.find(e => e.id === assignedEmployeeId);

    addAsset({
      name: name.trim(),
      type,
      brand: brand.trim(),
      model: model.trim() || name.trim(),
      serialNumber: serialNumber.trim().toUpperCase(),
      status: emp ? 'in_use' : status,
      assignedUser: emp ? emp.name : undefined,
      assignedUserEmail: emp ? emp.email : undefined,
      department: emp ? emp.department : undefined,
      location: location.trim(),
      purchaseDate,
      warrantyEnd,
      ipAddress: ipAddress.trim() || undefined,
      notes: notes.trim() || undefined
    });

    // Reset
    setName('');
    setModel('');
    setSerialNumber('');
    setAssignedEmployeeId('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base">Ajouter un Équipement au Parc</h2>
              <p className="text-xs text-slate-400">Inventaire matériel et traçabilité</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Désignation du matériel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: ThinkPad T14s, MacBook Pro..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type d&apos;équipement
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as AssetType)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="laptop">Ordinateur Portable (Laptop)</option>
                <option value="desktop">Ordinateur Fixe (Desktop)</option>
                <option value="screen">Écran / Moniteur</option>
                <option value="server">Serveur physique / Baie</option>
                <option value="network">Réseau (Switch, Routeur, Borne Wi-Fi)</option>
                <option value="printer">Imprimante / Scanner</option>
                <option value="mobile">Smartphone / Tablette</option>
                <option value="other">Autre périphérique</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Marque</label>
              <input
                type="text"
                required
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="Dell, Apple, Lenovo, HP..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Modèle précis</label>
              <input
                type="text"
                value={model}
                onChange={e => setModel(e.target.value)}
                placeholder="Ex: Latitude 5540 i7 16GB"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Numéro de Série (S/N) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={serialNumber}
                onChange={e => setSerialNumber(e.target.value)}
                placeholder="Ex: 8FK90M3, C02G99..."
                className="w-full px-3 py-2 text-xs font-mono uppercase border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Affecter à un collaborateur
              </label>
              <select
                value={assignedEmployeeId}
                onChange={e => setAssignedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">-- Aucun (Garder en stock) --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.department} - {emp.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Statut initial
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as AssetStatus)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="available">En stock / Disponible</option>
                <option value="in_use">En service</option>
                <option value="maintenance">En réparation / Maintenance</option>
                <option value="retired">Rebut / Retiré</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Emplacement / Bureau</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Paris Étage 2, Télétravail..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date d&apos;achat</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={e => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fin de garantie</label>
              <input
                type="date"
                value={warrantyEnd}
                onChange={e => setWarrantyEnd(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse IP locale (Optionnel)</label>
              <input
                type="text"
                value={ipAddress}
                onChange={e => setIpAddress(e.target.value)}
                placeholder="192.168.10.x"
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notes & Configuration</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Logiciels préinstallés, BitLocker, etc."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
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
              Enregistrer l&apos;équipement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
