'use client';

import React, { useState } from 'react';
import { Ticket, TicketStatus, TicketPriority } from '@/types';
import { useApp } from '@/context/AppContext';
import { PriorityBadge, StatusBadge, CategoryBadge } from './Badges';
import { 
  X, 
  Send, 
  User, 
  Clock, 
  Laptop, 
  Lock, 
  Trash2, 
  CheckCircle,
  PlayCircle,
  HelpCircle,
  Archive
} from 'lucide-react';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export function TicketDetailModal({ ticket, onClose }: TicketDetailModalProps) {
  const { 
    updateTicketStatus, 
    updateTicketPriority, 
    assignTicket, 
    addTicketComment, 
    deleteTicket,
    employees, 
    assets 
  } = useApp();

  const [commentContent, setCommentContent] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('Alexandre Martin');
  const [isInternal, setIsInternal] = useState(false);

  if (!ticket) return null;

  const linkedAsset = ticket.assetId ? assets.find(a => a.id === ticket.assetId) : null;
  const itStaff = employees.filter(e => e.department === 'IT');

  const handleStatusChange = (status: TicketStatus) => {
    updateTicketStatus(ticket.id, status);
  };

  const handlePriorityChange = (priority: TicketPriority) => {
    updateTicketPriority(ticket.id, priority);
  };

  const handleAssignChange = (techName: string) => {
    assignTicket(ticket.id, techName === '' ? null : techName);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    addTicketComment(
      ticket.id,
      commentContent.trim(),
      commentAuthor,
      commentAuthor === ticket.requesterName ? 'user' : 'tech',
      isInternal
    );

    setCommentContent('');
    setIsInternal(false);
  };

  const handleDelete = () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le ticket ${ticket.id} ?`)) {
      deleteTicket(ticket.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
              {ticket.id}
            </span>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
              <CategoryBadge category={ticket.category} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action quick bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Changer état :</span>
            {ticket.status !== 'in_progress' && (
              <button
                onClick={() => handleStatusChange('in_progress')}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium flex items-center gap-1 transition"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                Prendre en charge
              </button>
            )}
            {ticket.status !== 'waiting' && (
              <button
                onClick={() => handleStatusChange('waiting')}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded font-medium flex items-center gap-1 transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Mettre en attente
              </button>
            )}
            {ticket.status !== 'resolved' && (
              <button
                onClick={() => handleStatusChange('resolved')}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium flex items-center gap-1 transition"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Résoudre
              </button>
            )}
            {ticket.status !== 'closed' && (
              <button
                onClick={() => handleStatusChange('closed')}
                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-medium flex items-center gap-1 transition"
              >
                <Archive className="w-3.5 h-3.5" />
                Clôturer
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Priorité :</span>
              <select
                value={ticket.priority}
                onChange={e => handlePriorityChange(e.target.value as TicketPriority)}
                className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="critical">Critique</option>
              </select>
            </div>

            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition"
              title="Supprimer ce ticket"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">{ticket.title}</h2>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Requester info */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-slate-400 font-medium block mb-1">Demandeur</span>
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                {ticket.requesterName}
              </div>
              <p className="text-slate-500 mt-0.5">{ticket.requesterDept}</p>
              <p className="text-slate-400 text-[11px]">{ticket.requesterEmail}</p>
            </div>

            {/* Assigned tech */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-slate-400 font-medium block mb-1">Technicien Assigné</span>
              <select
                value={ticket.assignedTo || ''}
                onChange={e => handleAssignChange(e.target.value)}
                className="w-full mt-1 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">-- Non assigné --</option>
                {itStaff.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1.5">Modifiable à tout moment</p>
            </div>

            {/* Timing info */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-slate-400 font-medium block mb-1">Chronologie</span>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Créé le : {new Date(ticket.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-[11px]">
                <span>Mis à jour : {new Date(ticket.updatedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</span>
              </div>
            </div>
          </div>

          {/* Linked Asset */}
          {linkedAsset && (
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white rounded-lg">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700">
                    Matériel concerné ({linkedAsset.id})
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{linkedAsset.name}</p>
                  <p className="text-xs text-slate-500">
                    N° Série : {linkedAsset.serialNumber} • Localisation : {linkedAsset.location}
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-white text-indigo-700 border border-indigo-200 font-medium">
                {linkedAsset.brand} {linkedAsset.model}
              </span>
            </div>
          )}

          {/* Comments and Activity Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <span>Échanges & Notes ({ticket.comments.length})</span>
            </h3>

            {/* List of comments */}
            <div className="space-y-3">
              {ticket.comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-3 text-center bg-slate-50 rounded-lg">
                  Aucun message pour le moment.
                </p>
              ) : (
                ticket.comments.map(c => (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-xl border text-xs ${
                      c.isInternal
                        ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                        : c.role === 'tech' || c.role === 'admin'
                        ? 'bg-indigo-50/60 border-indigo-100 text-slate-800'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{c.author}</span>
                        {c.isInternal && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-200 text-amber-800 font-medium">
                            <Lock className="w-2.5 h-2.5" />
                            Note Interne IT
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          ({c.role === 'tech' ? 'Support IT' : c.role === 'admin' ? 'Admin IT' : 'Demandeur'})
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(c.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="pt-2 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Publier en tant que :</span>
                  <select
                    value={commentAuthor}
                    onChange={e => setCommentAuthor(e.target.value)}
                    className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 font-medium"
                  >
                    <option value="Alexandre Martin">Alexandre Martin (Admin IT)</option>
                    <option value="Sarah Benali">Sarah Benali (Support IT)</option>
                    <option value={ticket.requesterName}>{ticket.requesterName} (Demandeur)</option>
                  </select>
                </div>

                <label className="flex items-center gap-1.5 text-amber-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={e => setIsInternal(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-medium text-xs">Note interne privée</span>
                </label>
              </div>

              <div className="flex gap-2">
                <textarea
                  value={commentContent}
                  onChange={e => setCommentContent(e.target.value)}
                  placeholder="Écrire une réponse ou consigner une intervention..."
                  rows={2}
                  className="flex-1 p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  disabled={!commentContent.trim()}
                  className="px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition self-end py-2.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
