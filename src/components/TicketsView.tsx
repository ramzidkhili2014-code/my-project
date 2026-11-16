'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Ticket, TicketPriority } from '@/types';
import { PriorityBadge, StatusBadge, CategoryBadge } from './Badges';
import { 
  Search, 
  Filter, 
  Plus, 
  MessageSquare, 
  User, 
  Calendar, 
  Laptop, 
  ArrowUpDown
} from 'lucide-react';

interface TicketsViewProps {
  onSelectTicket: (ticket: Ticket) => void;
  openNewTicketModal: () => void;
}

export function TicketsView({ onSelectTicket, openNewTicketModal }: TicketsViewProps) {
  const { tickets, assets } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all_active');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'priority'>('date_desc');

  // Priority ranking for sorting
  const priorityRank: Record<TicketPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    // Search filter
    const q = search.toLowerCase();
    const matchesSearch = 
      ticket.id.toLowerCase().includes(q) ||
      ticket.title.toLowerCase().includes(q) ||
      ticket.requesterName.toLowerCase().includes(q) ||
      ticket.requesterDept.toLowerCase().includes(q) ||
      (ticket.assignedTo && ticket.assignedTo.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    // Status filter
    if (statusFilter === 'all_active') {
      if (ticket.status === 'closed' || ticket.status === 'resolved') return false;
    } else if (statusFilter !== 'all') {
      if (ticket.status !== statusFilter) return false;
    }

    // Priority filter
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;

    // Category filter
    if (categoryFilter !== 'all' && ticket.category !== categoryFilter) return false;

    return true;
  });

  // Sort tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortBy === 'priority') {
      return priorityRank[b.priority] - priorityRank[a.priority];
    }
    if (sortBy === 'date_asc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const activeCount = tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length;

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Gestion des Tickets & Helpdesk
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
              {activeCount} actif(s)
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des incidents, pannes matérielles, demandes logicielles et requêtes d&apos;accès.
          </p>
        </div>

        <button
          onClick={openNewTicketModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Nouveau Ticket
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par ID (TCK-...), titre, collaborateur, service..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Quick Selectors */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Priorité :</span>
            </div>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Toutes</option>
              <option value="critical">Critique</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="hardware">Matériel</option>
              <option value="software">Logiciel</option>
              <option value="network">Réseau & VPN</option>
              <option value="access">Accès & Droits</option>
              <option value="security">Sécurité</option>
              <option value="other">Autre</option>
            </select>

            <div className="flex items-center gap-1 text-xs text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'date_desc' | 'date_asc' | 'priority')}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date_desc">Plus récents</option>
              <option value="priority">Priorité d&apos;urgence</option>
              <option value="date_asc">Plus anciens</option>
            </select>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          {[
            { id: 'all_active', label: 'Tickets en cours' },
            { id: 'all', label: 'Tous les tickets' },
            { id: 'open', label: 'Nouveaux' },
            { id: 'in_progress', label: 'Pris en charge' },
            { id: 'waiting', label: 'En attente' },
            { id: 'resolved', label: 'Résolus' },
            { id: 'closed', label: 'Clôturés' },
          ].map(tab => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {sortedTickets.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 space-y-2">
            <p className="font-semibold text-sm text-slate-700">Aucun ticket ne correspond aux filtres.</p>
            <p className="text-xs">Modifiez vos critères de recherche ou créez un nouveau ticket.</p>
          </div>
        ) : (
          sortedTickets.map(ticket => {
            const linkedAsset = ticket.assetId ? assets.find(a => a.id === ticket.assetId) : null;
            return (
              <div
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {ticket.id}
                      </span>
                      <PriorityBadge priority={ticket.priority} />
                      <CategoryBadge category={ticket.category} />
                      <StatusBadge status={ticket.status} />
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                      {ticket.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-1">
                      {ticket.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <User className="w-3.5 h-3.5 text-indigo-500" />
                        {ticket.requesterName} ({ticket.requesterDept})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(ticket.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                      {linkedAsset && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            <Laptop className="w-3.5 h-3.5" />
                            {linkedAsset.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    <div className="text-xs">
                      {ticket.assignedTo ? (
                        <span className="text-indigo-700 font-medium bg-indigo-50 px-2 py-1 rounded">
                          Assigné : {ticket.assignedTo}
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium bg-amber-50 px-2 py-1 rounded">
                          Non assigné
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ticket.comments.length} message(s)</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
