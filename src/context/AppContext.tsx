'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket, Asset, License, Employee, Comment, TicketStatus, TicketPriority } from '@/types';
import { initialTickets, initialAssets, initialLicenses, initialEmployees } from '@/lib/initialData';

interface AppContextType {
  tickets: Ticket[];
  assets: Asset[];
  licenses: License[];
  employees: Employee[];
  
  // Ticket actions
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  updateTicketPriority: (id: string, priority: TicketPriority) => void;
  assignTicket: (id: string, technician: string | null) => void;
  addTicketComment: (ticketId: string, content: string, author: string, role: 'tech' | 'user' | 'admin', isInternal?: boolean) => void;
  deleteTicket: (id: string) => void;
  
  // Asset actions
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  
  // License actions
  addLicense: (license: Omit<License, 'id'>) => void;
  updateLicense: (id: string, license: Partial<License>) => void;
  deleteLicense: (id: string) => void;
  
  // System actions
  resetData: () => void;
  exportToCsv: (type: 'tickets' | 'assets' | 'licenses') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TICKETS: 'itdesk_tickets_v1',
  ASSETS: 'itdesk_assets_v1',
  LICENSES: 'itdesk_licenses_v1',
  EMPLOYEES: 'itdesk_employees_v1',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from LocalStorage or Defaults
  useEffect(() => {
    try {
      const savedTickets = localStorage.getItem(STORAGE_KEYS.TICKETS);
      const savedAssets = localStorage.getItem(STORAGE_KEYS.ASSETS);
      const savedLicenses = localStorage.getItem(STORAGE_KEYS.LICENSES);
      const savedEmployees = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);

      setTickets(savedTickets ? JSON.parse(savedTickets) : initialTickets);
      setAssets(savedAssets ? JSON.parse(savedAssets) : initialAssets);
      setLicenses(savedLicenses ? JSON.parse(savedLicenses) : initialLicenses);
      setEmployees(savedEmployees ? JSON.parse(savedEmployees) : initialEmployees);
    } catch {
      setTickets(initialTickets);
      setAssets(initialAssets);
      setLicenses(initialLicenses);
      setEmployees(initialEmployees);
    }
    setIsInitialized(true);
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
      localStorage.setItem(STORAGE_KEYS.LICENSES, JSON.stringify(licenses));
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }, [tickets, assets, licenses, employees, isInitialized]);

  // Ticket Handlers
  const addTicket = (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const nextNum = tickets.length > 0
      ? Math.max(...tickets.map(t => parseInt(t.id.replace('TCK-', '')) || 1000)) + 1
      : 1001;
    const newId = `TCK-${nextNum}`;
    const now = new Date().toISOString();

    const newTicket: Ticket = {
      ...data,
      id: newId,
      createdAt: now,
      updatedAt: now,
      comments: []
    };

    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicketStatus = (id: string, status: TicketStatus) => {
    setTickets(prev =>
      prev.map(t =>
        t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
      )
    );
  };

  const updateTicketPriority = (id: string, priority: TicketPriority) => {
    setTickets(prev =>
      prev.map(t =>
        t.id === id ? { ...t, priority, updatedAt: new Date().toISOString() } : t
      )
    );
  };

  const assignTicket = (id: string, technician: string | null) => {
    setTickets(prev =>
      prev.map(t =>
        t.id === id ? { ...t, assignedTo: technician, updatedAt: new Date().toISOString() } : t
      )
    );
  };

  const addTicketComment = (
    ticketId: string,
    content: string,
    author: string,
    role: 'tech' | 'user' | 'admin',
    isInternal = false
  ) => {
    const newComment: Comment = {
      id: `COM-${Date.now()}`,
      author,
      role,
      content,
      createdAt: new Date().toISOString(),
      isInternal
    };

    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            updatedAt: new Date().toISOString(),
            comments: [...t.comments, newComment]
          };
        }
        return t;
      })
    );
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  // Asset Handlers
  const addAsset = (data: Omit<Asset, 'id'>) => {
    const nextNum = assets.length > 0
      ? Math.max(...assets.map(a => parseInt(a.id.replace('AST-', '')) || 100)) + 1
      : 101;
    const newAsset: Asset = {
      ...data,
      id: `AST-${nextNum}`
    };
    setAssets(prev => [newAsset, ...prev]);
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  // License Handlers
  const addLicense = (data: Omit<License, 'id'>) => {
    const nextNum = licenses.length > 0
      ? Math.max(...licenses.map(l => parseInt(l.id.replace('LIC-', '')) || 1)) + 1
      : 1;
    const newLicense: License = {
      ...data,
      id: `LIC-${String(nextNum).padStart(3, '0')}`
    };
    setLicenses(prev => [...prev, newLicense]);
  };

  const updateLicense = (id: string, updates: Partial<License>) => {
    setLicenses(prev =>
      prev.map(l => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const deleteLicense = (id: string) => {
    setLicenses(prev => prev.filter(l => l.id !== id));
  };

  // Reset to initial demo data
  const resetData = () => {
    setTickets(initialTickets);
    setAssets(initialAssets);
    setLicenses(initialLicenses);
    setEmployees(initialEmployees);
  };

  // Export CSV
  const exportToCsv = (type: 'tickets' | 'assets' | 'licenses') => {
    let csvContent = '';
    let filename = '';

    if (type === 'tickets') {
      filename = `tickets_export_${new Date().toISOString().slice(0, 10)}.csv`;
      const headers = ['ID', 'Titre', 'Demandeur', 'Departement', 'Priorite', 'Statut', 'Technicien', 'Date_Creation'];
      const rows = tickets.map(t => [
        t.id,
        `"${t.title.replace(/"/g, '""')}"`,
        `"${t.requesterName}"`,
        `"${t.requesterDept}"`,
        t.priority,
        t.status,
        `"${t.assignedTo || 'Non assigné'}"`,
        t.createdAt
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else if (type === 'assets') {
      filename = `inventaire_parc_${new Date().toISOString().slice(0, 10)}.csv`;
      const headers = ['ID', 'Nom', 'Type', 'Marque', 'Modele', 'Numero_Serie', 'Statut', 'Utilisateur', 'Emplacement'];
      const rows = assets.map(a => [
        a.id,
        `"${a.name.replace(/"/g, '""')}"`,
        a.type,
        `"${a.brand}"`,
        `"${a.model}"`,
        `"${a.serialNumber}"`,
        a.status,
        `"${a.assignedUser || 'Non assigné'}"`,
        `"${a.location}"`
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else if (type === 'licenses') {
      filename = `licences_${new Date().toISOString().slice(0, 10)}.csv`;
      const headers = ['ID', 'Logiciel', 'Fournisseur', 'Attribuees', 'Total', 'Renouvellement', 'Cout_Annuel'];
      const rows = licenses.map(l => [
        l.id,
        `"${l.name.replace(/"/g, '""')}"`,
        `"${l.vendor}"`,
        l.usedSeats,
        l.totalSeats,
        l.renewalDate,
        l.costPerYear
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppContext.Provider
      value={{
        tickets,
        assets,
        licenses,
        employees,
        addTicket,
        updateTicketStatus,
        updateTicketPriority,
        assignTicket,
        addTicketComment,
        deleteTicket,
        addAsset,
        updateAsset,
        deleteAsset,
        addLicense,
        updateLicense,
        deleteLicense,
        resetData,
        exportToCsv
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
