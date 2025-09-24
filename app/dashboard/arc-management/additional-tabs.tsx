// Additional Tab Components for ARC Management Dashboard

import { Button } from '@/components/ui/Button';
import { 
  Search, 
  FileText, 
  Eye
} from 'lucide-react';
import Link from 'next/link';

// Archives Tab Component - Searchable archive of previous ARC requests
export function ArchivesTab({ requests, filteredRequests, searchTerm, setSearchTerm, statusFilter, setStatusFilter, updateRequestStatus, STATUS_COLORS, STATUS_ICONS, ARC_STATUS_LABELS }) {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-card border border-ink-900/8 p-6">
        <h2 className="text-2xl font-bold text-ink-900 mb-4">Search Archives</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-500" size={16} />
              <input
                type="text"
                placeholder="Search by request title, homeowner name, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-control text-body focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-control text-body focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Requests</option>
              <option value="completed">Completed</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
              <option value="in-progress">In Progress</option>
              <option value="board-voting">Board Review</option>
              <option value="under-review">Under Review</option>
              <option value="submitted">Submitted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Archive Results */}
      <div className="bg-white rounded-card border border-ink-900/8">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-ink-900 mb-2">
            {filteredRequests.length === 0 ? 'No Results Found' : `${filteredRequests.length} Request${filteredRequests.length !== 1 ? 's' : ''} Found`}
          </h2>
          {searchTerm && (
            <p className="text-body text-ink-600">
              Searching for "{searchTerm}"
            </p>
          )}
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto text-ink-400 mb-4" size={48} />
            <h4 className="text-h4 font-medium text-ink-900 mb-2">
              {requests.length === 0 ? 'No ARC Requests in Archive' : 'No Matching Requests'}
            </h4>
            <p className="text-body text-ink-600">
              {requests.length === 0 
                ? 'Completed and processed ARC requests will appear here for future reference.'
                : 'Try adjusting your search terms or filters to find what you\'re looking for.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-body font-semibold text-ink-900 truncate">
                        {request.title}
                      </h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[request.status]}`}>
                        {STATUS_ICONS[request.status]}
                        {ARC_STATUS_LABELS[request.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-caption text-ink-600">
                      <span>{request.submittedBy.name}</span>
                      <span>{request.submittedBy.address}</span>
                      <span>Submitted {request.submittedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/arc-management/${request.id}`}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1"
                      >
                        <Eye size={14} />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// Settings Tab Component
export function SettingsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-card border border-ink-900/8 p-6">
        <h3 className="text-h3 font-semibold text-ink-900 mb-4">ARC Workflow Settings</h3>
        <p className="text-body text-ink-600 mb-6">
          Configure how ARC requests are processed and managed in your community.
        </p>
        
        <div className="space-y-6">
          {/* Approval Workflow */}
          <div>
            <h4 className="text-body font-semibold text-ink-900 mb-3">Approval Workflow</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded border-neutral-300" />
                <span className="text-body text-ink-700">Require neighbor sign-offs for exterior modifications</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded border-neutral-300" />
                <span className="text-body text-ink-700">Send requests to board for final approval</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-neutral-300" />
                <span className="text-body text-ink-700">Require inspection before project completion</span>
              </label>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h4 className="text-body font-semibold text-ink-900 mb-3">Notifications</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded border-neutral-300" />
                <span className="text-body text-ink-700">Email notifications for new requests</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded border-neutral-300" />
                <span className="text-body text-ink-700">Daily digest of pending actions</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-neutral-300" />
                <span className="text-body text-ink-700">SMS alerts for urgent requests</span>
              </label>
            </div>
          </div>

          {/* Processing Times */}
          <div>
            <h4 className="text-body font-semibold text-ink-900 mb-3">Processing Times</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">
                  Initial Review Period
                </label>
                <select className="w-full px-3 py-2 border border-neutral-300 rounded-control text-body focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>5 business days</option>
                  <option>7 business days</option>
                  <option>10 business days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">
                  Board Review Period
                </label>
                <select className="w-full px-3 py-2 border border-neutral-300 rounded-control text-body focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>14 days</option>
                  <option>21 days</option>
                  <option>30 days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-neutral-200">
          <Button>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
