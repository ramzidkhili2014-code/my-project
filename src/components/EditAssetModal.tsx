'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Asset, AssetStatus } from '@/types';
import { X, Trash2 } from 'lucide-react';

interface EditAssetModalProps {
  asset: Asset | null;
  onClose: () => void;
}

export function EditAssetModal({ asset, onClose }: EditAssetModalProps) {
  const { updateAsset, deleteAsset, employees } = useApp();

  const [name, setName] = useState('');
  const [status, setStatus] = useState<AssetStatus>('in_use');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState('');
  const [location, setLocation] = useState('');
  const [warrantyEnd, setWarrantyEnd] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (asset) {
      setName(asset.name);
      setStatus(asset.status);
      const currentEmp = employees.find(e => e.name === asset.assignedUser);
      setAssignedEmployeeId(currentEmp ? currentEmp.id : '');
      setLocation(asset.location || '');
      setWarrantyEnd(asset.warrantyEnd || '');
      setIpAddress(asset.ipAddress || '');
      setNotes(asset.notes || '');
    }
  }, [asset, employees]);

  if (!asset) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === assignedEmployeeId);

    updateAsset(asset.id, {
      name: name.trim(),
      status: emp && status === 'available' ? 'in_use' : status,
      assignedUser: emp ? emp.name : undefined,
      assignedUserEmail: emp ? emp.email : undefined,
      department: emp ? emp.department : undefined,
      location: location.trim(),
      warrantyEnd,
      ipAddress: ipAddress.trim() || undefined,
      notes: notes.trim() || undefined
    });

    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Voulez-vous supprimer l'équipement ${asset.id} (${asset.name}) ?`)) {
      deleteAsset(asset.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
              {asset.id}
            </span>
            <h2 className="font-bold text-base truncate max-w-[320px]">
              Modifier : {asset.name}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nom / Désignation
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Statut de l&apos;équipement
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as AssetStatus)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="in_use">En service (Attribué)</option>
                <option value="available">En stock / Disponible</option>
                <option value="maintenance">En réparation / Maintenance</option>
                <option value="retired">Rebut / Retiré</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Collaborateur affecté
              </label>
              <select
                value={assignedEmployeeId}
                onChange={e => setAssignedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">-- Aucun (Non attribué) --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Emplacement</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse IP locale</label>
              <input
                type="text"
                value={ipAddress}
                onChange={e => setIpAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notes internes</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1.5 p-2 rounded hover:bg-red-50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Supprimer
            </button>

            <div className="flex items-center gap-2">
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
                Sauvegarder
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
