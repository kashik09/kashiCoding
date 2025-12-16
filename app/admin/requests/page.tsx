'use client'

import { useState, useEffect } from 'react'
import { Search, Eye, Trash2, Mail, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

type RequestStatus = 'pending' | 'contacted' | 'completed' | 'rejected'

interface Request {
  id: number
  name: string
  email: string
  serviceType: string
  budget: string
  timeline: string
  status: RequestStatus
  createdAt: string
  description?: string
}

export default function AdminRequestsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | RequestStatus>('all')
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState<Request | null>(null)
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  })

  // TODO: Fetch from database
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      serviceType: 'Web Development',
      budget: '$1,000 - $2,500',
      timeline: 'Normal (2-4 weeks)',
      status: 'pending',
      createdAt: '2024-01-20',
      description: 'Need a portfolio website with modern design'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      serviceType: 'Mobile Development',
      budget: '$2,500+',
      timeline: 'ASAP (1-2 weeks)',
      status: 'contacted',
      createdAt: '2024-01-19',
      description: 'iOS app for e-commerce business'
    }
  ])

  // Filter and search logic
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filter === 'all' || request.status === filter
    
    return matchesSearch && matchesFilter
  })

  // Calculate real stats from actual data
  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    contacted: requests.filter(r => r.status === 'contacted').length,
    completed: requests.filter(r => r.status === 'completed').length,
    total: requests.length
  }

  const handleDelete = (id: number) => {
    setRequests(requests.filter(r => r.id !== id))
    setShowDeleteModal(false)
    setRequestToDelete(null)
    showToast('Request deleted successfully', 'success')
  }

  const confirmDelete = (request: Request) => {
    setRequestToDelete(request)
    setShowDeleteModal(true)
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' })
    }, 3000)
  }

  const handleView = (request: Request) => {
    setSelectedRequest(request)
    setShowModal(true)
  }

  const getStatusBadge = (status: RequestStatus) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
      contacted: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
      completed: 'bg-green-500/20 text-green-600 dark:text-green-400',
      rejected: 'bg-red-500/20 text-red-600 dark:text-red-400'
    }
    return styles[status]
  }

  const getStatusIcon = (status: RequestStatus) => {
    switch(status) {
      case 'pending': return <Clock size={16} />
      case 'contacted': return <Mail size={16} />
      case 'completed': return <CheckCircle size={16} />
      case 'rejected': return <XCircle size={16} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Service Requests</h1>
        <p className="text-foreground-muted">Manage incoming project requests</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" size={20} />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card text-foreground border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | RequestStatus)}
          className="min-w-[180px] pl-4 pr-10 py-3 bg-card text-foreground border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M10.293%203.293L6%207.586%201.707%203.293A1%201%200%2000.293%204.707l5%205a1%201%200%20001.414%200l5-5a1%201%200%2010-1.414-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[center_right_1rem] bg-no-repeat"
        >
          <option value="all" className="bg-card text-foreground">All Requests</option>
          <option value="pending" className="bg-card text-foreground">Pending</option>
          <option value="contacted" className="bg-card text-foreground">Contacted</option>
          <option value="completed" className="bg-card text-foreground">Completed</option>
          <option value="rejected" className="bg-card text-foreground">Rejected</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-foreground-muted text-sm">Pending</p>
            <Clock className="text-yellow-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-foreground-muted text-sm">Contacted</p>
            <Mail className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.contacted}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-foreground-muted text-sm">Completed</p>
            <CheckCircle className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-foreground-muted text-sm">Total</p>
            <Eye className="text-primary" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-card-hover border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Service</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Budget</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Timeline</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-foreground-muted">
                    No requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-card-hover transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{request.name}</p>
                        <p className="text-sm text-foreground-muted">{request.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">{request.serviceType}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full font-medium">
                        {request.budget}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground-muted">{request.timeline}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 w-fit font-medium ${getStatusBadge(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground-muted">{request.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleView(request)}
                          className="p-2 hover:bg-primary/10 text-primary rounded-lg transition"
                          title="View details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => confirmDelete(request)}
                          className="p-2 hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg transition"
                          title="Delete request"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">{selectedRequest.name}</h2>
                  <p className="text-foreground-muted">{selectedRequest.email}</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-card-hover rounded-lg transition text-foreground-muted hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-semibold text-foreground-muted uppercase tracking-wide">Service Type</label>
                <p className="text-lg text-foreground mt-1">{selectedRequest.serviceType}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-foreground-muted uppercase tracking-wide">Budget</label>
                  <p className="text-lg text-foreground mt-1">{selectedRequest.budget}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground-muted uppercase tracking-wide">Timeline</label>
                  <p className="text-lg text-foreground mt-1">{selectedRequest.timeline}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground-muted uppercase tracking-wide">Status</label>
                <div className="mt-2">
                  <span className={`px-4 py-2 text-sm rounded-full inline-flex items-center gap-2 font-medium ${getStatusBadge(selectedRequest.status)}`}>
                    {getStatusIcon(selectedRequest.status)}
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </span>
                </div>
              </div>

              {selectedRequest.description && (
                <div>
                  <label className="text-sm font-semibold text-foreground-muted uppercase tracking-wide">Description</label>
                  <p className="text-foreground mt-2 leading-relaxed">{selectedRequest.description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-foreground-muted uppercase tracking-wide">Submitted</label>
                <p className="text-foreground mt-1">{selectedRequest.createdAt}</p>
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-card-hover border border-border text-foreground rounded-lg hover:bg-card transition font-medium"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  handleDelete(selectedRequest.id)
                  setShowModal(false)
                }}
                className="px-6 py-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-500/20 transition font-medium"
              >
                Delete Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && requestToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Delete Request</h2>
                  <p className="text-sm text-foreground-muted">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-foreground mb-6">
                Are you sure you want to delete the request from <span className="font-semibold">{requestToDelete.name}</span>?
              </p>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowDeleteModal(false)
                    setRequestToDelete(null)
                  }}
                  className="flex-1 px-6 py-3 bg-card-hover border border-border text-foreground rounded-lg hover:bg-card transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(requestToDelete.id)}
                  className="flex-1 px-6 py-3 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
          <div className={`px-6 py-4 rounded-lg shadow-lg border ${
            toast.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
          }`}>
            <div className="flex items-center gap-3">
              {toast.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <XCircle size={20} />
              )}
              <p className="font-medium">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}