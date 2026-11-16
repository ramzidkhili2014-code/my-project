'use client';

import React, { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import { Sidebar, ActiveTab } from '@/components/Sidebar';
import { DashboardView } from '@/components/DashboardView';
import { TicketsView } from '@/components/TicketsView';
import { AssetsView } from '@/components/AssetsView';
import { LicensesView } from '@/components/LicensesView';
import { EmployeesView } from '@/components/EmployeesView';
import { NewTicketModal } from '@/components/NewTicketModal';
import { NewAssetModal } from '@/components/NewAssetModal';
import { TicketDetailModal } from '@/components/TicketDetailModal';
import { Ticket } from '@/types';
import { ShieldCheck } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isNewAssetModalOpen, setIsNewAssetModalOpen] = useState(false);

  const handleOpenTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleOpenNewTicketForUser = () => {
    setIsNewTicketModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openNewTicketModal={() => setIsNewTicketModalOpen(true)}
        openNewAssetModal={() => setIsNewAssetModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Système Opérationnel (100% Uptime)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewTicketModalOpen(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition shadow-sm"
            >
              + Nouveau Ticket
            </button>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>DSI Entreprise • v2.4</span>
            </div>
          </div>
        </header>

        {/* View Container */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              setActiveTab={setActiveTab}
              onSelectTicket={handleOpenTicket}
              openNewTicketModal={() => setIsNewTicketModalOpen(true)}
            />
          )}

          {activeTab === 'tickets' && (
            <TicketsView
              onSelectTicket={handleOpenTicket}
              openNewTicketModal={() => setIsNewTicketModalOpen(true)}
            />
          )}

          {activeTab === 'assets' && (
            <AssetsView
              openNewAssetModal={() => setIsNewAssetModalOpen(true)}
            />
          )}

          {activeTab === 'licenses' && (
            <LicensesView />
          )}

          {activeTab === 'employees' && (
            <EmployeesView
              onOpenNewTicketForUser={handleOpenNewTicketForUser}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
      />

      <NewAssetModal
        isOpen={isNewAssetModalOpen}
        onClose={() => setIsNewAssetModalOpen(false)}
      />

      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
