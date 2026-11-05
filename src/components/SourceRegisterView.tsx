import React, { useState } from 'react';
import { 
  Globe2, 
  Plus, 
  ExternalLink, 
  Rss, 
  Sparkles, 
  CheckCircle2, 
  Search,
  Filter,
  Check,
  Building,
  Edit2,
  Trash2
} from 'lucide-react';
import { SourceRegisterItem } from '../types';

interface SourceRegisterViewProps {
  sources: SourceRegisterItem[];
  onAddSource: (source: Partial<SourceRegisterItem>) => void;
  onUpdateSource: (source: SourceRegisterItem) => void;
  onDeleteSource: (id: string) => void;
  onTriggerFromSource: (source: SourceRegisterItem) => void;
}

export const SourceRegisterView: React.FC<SourceRegisterViewProps> = ({
  sources,
  onAddSource,
  onUpdateSource,
  onDeleteSource,
  onTriggerFromSource,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOrg, setNewOrg] = useState({
    organization: '',
    country: '',
    type: 'Authority' as const,
    website: '',
    news_url: '',
    rss_url: '',
    topics: '',
  });

  const filteredSources = sources.filter((s) => {
    const matchesSearch = 
      s.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.topics.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || s.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrg.organization || !newOrg.website) return;
    onAddSource(newOrg);
    setNewOrg({
      organization: '',
      country: '',
      type: 'Authority',
      website: '',
      news_url: '',
      rss_url: '',
      topics: '',
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            HTA & Payer Source Register
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified monitoring registry covering UK, European, North American, and APAC reimbursement authorities
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Source</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search authority, country, or methods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden"
          >
            <option value="all">All Organization Types ({sources.length})</option>
            <option value="Authority">Authorities</option>
            <option value="Payer Body">Payer Bodies</option>
            <option value="Joint Assessment">Joint Assessment Bodies</option>
            <option value="Consultancy">Consultancies & Institutes</option>
          </select>
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Organization & Country</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Official Links</th>
                <th className="py-3 px-4">Topics Covered</th>
                <th className="py-3 px-4">Verified</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredSources.map((source) => (
                <tr
                  key={source.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {source.organization}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {source.country}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {source.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 space-y-1">
                    <a
                      href={source.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline block"
                    >
                      <Globe2 className="w-3 h-3" />
                      <span>Official Portal</span>
                    </a>
                    {source.news_url && (
                      <a
                        href={source.news_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 block text-[11px]"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>News & Publications</span>
                      </a>
                    )}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {source.topics}
                    </p>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {source.date_verified}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onTriggerFromSource(source)}
                        title="Draft LinkedIn post from this source"
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-md transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Draft Post</span>
                      </button>

                      <button
                        onClick={() => onDeleteSource(source.id)}
                        title="Remove source"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Add Verified HTA / Payer Source
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ZIN (Zorginstituut Nederland)"
                  value={newOrg.organization}
                  onChange={(e) => setNewOrg({ ...newOrg, organization: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Country / Region
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Netherlands"
                    value={newOrg.country}
                    onChange={(e) => setNewOrg({ ...newOrg, country: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Organization Type
                  </label>
                  <select
                    value={newOrg.type}
                    onChange={(e) => setNewOrg({ ...newOrg, type: e.target.value as any })}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                  >
                    <option value="Authority">Authority</option>
                    <option value="Payer Body">Payer Body</option>
                    <option value="Joint Assessment">Joint Assessment</option>
                    <option value="Consultancy">Consultancy</option>
                    <option value="Professional Org">Professional Org</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Official Website URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.zorginstituutnederland.nl"
                  value={newOrg.website}
                  onChange={(e) => setNewOrg({ ...newOrg, website: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Topics Covered
                </label>
                <input
                  type="text"
                  placeholder="Basic benefit package, therapeutic value, farmaco-economisch dossier"
                  value={newOrg.topics}
                  onChange={(e) => setNewOrg({ ...newOrg, topics: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Save Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
