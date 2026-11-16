'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, Mail, Phone, Laptop, TicketCheck, Briefcase } from 'lucide-react';

interface EmployeesViewProps {
  onOpenNewTicketForUser: (userName: string, userDept: string, userEmail: string) => void;
}

export function EmployeesView({ onOpenNewTicketForUser }: EmployeesViewProps) {
  const { employees, assets, tickets } = useApp();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const departments = Array.from(new Set(employees.map(e => e.department)));

  const filteredEmployees = employees.filter(emp => {
    const q = search.toLowerCase();
    const matchesSearch =
      emp.name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (deptFilter !== 'all' && emp.department !== deptFilter) return false;

    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Annuaire des Collaborateurs & Équipements
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold">
              {employees.length} utilisateurs
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Vue d&apos;ensemble des collaborateurs, matériel rattaché et historique de support.
          </p>
        </div>
      </div>

      {/* Search and Dept Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un collaborateur par nom, poste, email..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
        >
          <option value="all">Tous les départements</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map(emp => {
          const userAssets = assets.filter(a => a.assignedUser === emp.name || a.assignedUserEmail === emp.email);
          const userTickets = tickets.filter(t => t.requesterEmail === emp.email || t.requesterName === emp.name);
          const activeTickets = userTickets.filter(t => t.status !== 'closed' && t.status !== 'resolved');

          return (
            <div
              key={emp.id}
              className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{emp.name}</h3>
                    <p className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-indigo-400" />
                      {emp.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  {emp.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                  )}
                  <div className="text-[11px] text-slate-500 pt-0.5">
                    Département : <span className="font-semibold text-slate-700">{emp.department}</span>
                  </div>
                </div>

                {/* Assigned Assets */}
                <div className="mt-3 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Matériel affecté ({userAssets.length})
                  </span>
                  {userAssets.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Aucun équipement assigné</p>
                  ) : (
                    <div className="space-y-1">
                      {userAssets.map(a => (
                        <div key={a.id} className="text-xs flex items-center gap-2 p-1.5 rounded bg-slate-100/70 text-slate-800">
                          <Laptop className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="font-medium truncate">{a.name}</span>
                          <span className="font-mono text-[10px] text-slate-400 ml-auto">{a.id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action: Create ticket for user */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {activeTickets.length > 0 ? (
                    <span className="text-amber-600 font-semibold">{activeTickets.length} ticket(s) en cours</span>
                  ) : (
                    <span className="text-emerald-600 font-medium">Aucun ticket actif</span>
                  )}
                </span>

                <button
                  onClick={() => onOpenNewTicketForUser(emp.name, emp.department, emp.email)}
                  className="px-2.5 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium transition flex items-center gap-1"
                >
                  <TicketCheck className="w-3.5 h-3.5" />
                  Nouveau Ticket
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
