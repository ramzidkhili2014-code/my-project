'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Asset, AssetType } from '@/types';
import { AssetStatusBadge } from './Badges';
import { 
  Laptop, 
  Search, 
  Plus, 
  User, 
  MapPin, 
  HardDrive, 
  Monitor, 
  Server, 
  Printer, 
  Network, 
  Smartphone,
  Pencil,
  Hash
} from 'lucide-react';
import { EditAssetModal } from './EditAssetModal';

interface AssetsViewProps {
  openNewAssetModal: () => void;
}

export function AssetsView({ openNewAssetModal }: AssetsViewProps) {
  const { assets } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // Stats
  const inUseCount = assets.filter(a => a.status === 'in_use').length;
  const availableCount = assets.filter(a => a.status === 'available').length;
  const maintenanceCount = assets.filter(a => a.status === 'maintenance').length;
  const retiredCount = assets.filter(a => a.status === 'retired').length;

  const filteredAssets = assets.filter(asset => {
    const q = search.toLowerCase();
    const matchesSearch =
      asset.id.toLowerCase().includes(q) ||
      asset.name.toLowerCase().includes(q) ||
      asset.brand.toLowerCase().includes(q) ||
      asset.model.toLowerCase().includes(q) ||
      asset.serialNumber.toLowerCase().includes(q) ||
      asset.location.toLowerCase().includes(q) ||
      (asset.assignedUser && asset.assignedUser.toLowerCase().includes(q)) ||
      (asset.ipAddress && asset.ipAddress.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (typeFilter !== 'all' && asset.type !== typeFilter) return false;
    if (statusFilter !== 'all' && asset.status !== statusFilter) return false;

    return true;
  });

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'laptop': return Laptop;
      case 'desktop': return HardDrive;
      case 'screen': return Monitor;
      case 'server': return Server;
      case 'network': return Network;
      case 'printer': return Printer;
      case 'mobile': return Smartphone;
      default: return Laptop;
    }
  };

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Gestion du Parc Informatique & Équipements
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
              {assets.length} machines
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inventaire matériel, affectation aux collaborateurs, numéro de série et garanties.
          </p>
        </div>

        <button
          onClick={openNewAssetModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Ajouter Équipement
        </button>
      </div>

      {/* KPI mini-bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">En service</span>
            <p className="text-xl font-bold text-emerald-600">{inUseCount}</p>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">En stock (Dispo)</span>
            <p className="text-xl font-bold text-blue-600">{availableCount}</p>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">En réparation</span>
            <p className="text-xl font-bold text-amber-600">{maintenanceCount}</p>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Retiré / Rebut</span>
            <p className="text-xl font-bold text-slate-500">{retiredCount}</p>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, S/N, collaborateur, marque, adresse IP..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tous types</option>
            <option value="laptop">PC Portables</option>
            <option value="desktop">PC Fixes</option>
            <option value="screen">Écrans</option>
            <option value="server">Serveurs</option>
            <option value="network">Réseau</option>
            <option value="printer">Imprimantes</option>
            <option value="mobile">Mobiles</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tous statuts</option>
            <option value="in_use">En service</option>
            <option value="available">En stock</option>
            <option value="maintenance">En réparation</option>
            <option value="retired">Rebut</option>
          </select>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Équipement</th>
                <th className="px-4 py-3">Marque / Modèle</th>
                <th className="px-4 py-3">N° Série & Réseau</th>
                <th className="px-4 py-3">Affectation</th>
                <th className="px-4 py-3">Emplacement</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Aucun matériel trouvé selon ces filtres.
                  </td>
                </tr>
              ) : (
                filteredAssets.map(asset => {
                  const Icon = getAssetIcon(asset.type);
                  return (
                    <tr key={asset.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-mono text-[11px] font-bold text-slate-500 block">
                              {asset.id}
                            </span>
                            <span className="font-semibold text-slate-900 block truncate max-w-[180px]">
                              {asset.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800 block">{asset.brand}</span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                          {asset.model}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-mono font-medium text-slate-700 flex items-center gap-1">
                          <Hash className="w-3 h-3 text-slate-400" />
                          <span>{asset.serialNumber}</span>
                        </div>
                        {asset.ipAddress && (
                          <span className="text-[11px] font-mono text-indigo-600 block">
                            IP: {asset.ipAddress}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {asset.assignedUser ? (
                          <div>
                            <span className="font-medium text-slate-900 flex items-center gap-1">
                              <User className="w-3 h-3 text-indigo-500" />
                              {asset.assignedUser}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {asset.department || 'Non précisé'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">En stock / Non affecté</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[140px]">{asset.location}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Gar: {asset.warrantyEnd}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <AssetStatusBadge status={asset.status} />
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setEditingAsset(asset)}
                          className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded font-medium transition inline-flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" />
                          Modifier
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      {editingAsset && (
        <EditAssetModal
          asset={editingAsset}
          onClose={() => setEditingAsset(null)}
        />
      )}
    </div>
  );
}
