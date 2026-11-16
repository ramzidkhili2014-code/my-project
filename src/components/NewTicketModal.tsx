'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TicketPriority, TicketCategory } from '@/types';
import { X, PlusCircle } from 'lucide-react';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTicketModal({ isOpen, onClose }: NewTicketModalProps) {
  const { addTicket, employees, assets } = useApp();

  const [title, setTitle] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [requesterDept, setRequesterDept] = useState('Général');
  const [category, setCategory] = useState<TicketCategory>('hardware');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [assetId, setAssetId] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleEmployeeSelect = (empId: string) => {
    setSelectedEmployeeId(empId);
    if (!empId) {
      setRequesterName('');
      setRequesterEmail('');
      setRequesterDept('Général');
      return;
    }
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      setRequesterName(emp.name);
      setRequesterEmail(emp.email);
      setRequesterDept(emp.department);
      
      // Auto-suggest asset assigned to employee if any
      const userAsset = assets.find(a => a.assignedUser === emp.name || a.assignedUserEmail === emp.email);
      if (userAsset && !assetId) {
        setAssetId(userAsset.id);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addTicket({
      title: title.trim(),
      description: description.trim(),
      requesterName: requesterName.trim() || 'Collaborateur',
      requesterEmail: requesterEmail.trim() || 'contact@entreprise.com',
      requesterDept: requesterDept.trim() || 'Général',
      assignedTo: null,
      category,
      priority,
      status: 'open',
      assetId: assetId || undefined
    });

    // Reset form
    setTitle('');
    setDescription('');
    setSelectedEmployeeId('');
    setRequesterName('');
    setRequesterEmail('');
    setAssetId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base">Nouveau Ticket d&apos;Assistance</h2>
              <p className="text-xs text-slate-400">Enregistrer un incident ou une demande IT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Titre de l&apos;incident / de la demande <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Écran bleu au démarrage, demande d'accès VPN..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Quick select employee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Collaborateur concerné
              </label>
              <select
                value={selectedEmployeeId}
                onChange={e => handleEmployeeSelect(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Sélectionner dans l&apos;annuaire...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nom du demandeur
              </label>
              <input
                type="text"
                required
                value={requesterName}
                onChange={e => setRequesterName(e.target.value)}
                placeholder="Prénom Nom"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email professionnel
              </label>
              <input
                type="email"
                required
                value={requesterEmail}
                onChange={e => setRequesterEmail(e.target.value)}
                placeholder="collaborateur@entreprise.com"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Département / Service
              </label>
              <input
                type="text"
                value={requesterDept}
                onChange={e => setRequesterDept(e.target.value)}
                placeholder="Finance, Marketing, RH..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catégorie
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TicketCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="hardware">Matériel (PC, Écran...)</option>
                <option value="software">Logiciel / OS</option>
                <option value="network">Réseau & VPN</option>
                <option value="access">Accès & Droits</option>
                <option value="security">Sécurité / Antivirus</option>
                <option value="other">Autre demande</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priorité
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TicketPriority)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="low">Basse (Non urgent)</option>
                <option value="medium">Moyenne (Standard)</option>
                <option value="high">Haute (Impact important)</option>
                <option value="critical">Critique (Bloquant entreprise)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Équipement concerné
              </label>
              <select
                value={assetId}
                onChange={e => setAssetId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">-- Aucun équipement spécifique --</option>
                {assets.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.id} - {a.name} ({a.brand})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description détaillée <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Expliquez en détail le problème rencontré, les messages d'erreur affichés et les étapes pour reproduire..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
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
              Créer le ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
