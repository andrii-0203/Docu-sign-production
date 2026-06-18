import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { Plus, FileText, Search, Clock, CheckCircle, LayoutGrid, List as ListIcon, File, AlertCircle, Trash2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import UploadModal from '../components/UploadModal';
import AppLayout from '../components/layout/AppLayout';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const DocumentSkeleton = () => (
    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex justify-between items-start mb-4">
            <div className="skeleton w-12 h-12 rounded-xl" />
            <div className="skeleton w-20 h-6 rounded-full" />
        </div>
        <div className="skeleton w-3/4 h-5 rounded-lg mb-2" />
        <div className="skeleton w-1/2 h-4 rounded-lg mb-4" />
        <div className="skeleton w-full h-px rounded mt-auto" />
    </div>
);

const Dashboard = () => {
    const socket = useSocket();

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [filterStatus, setFilterStatus] = useState('All');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchDocuments = useCallback(async () => {
        setError(null);
        try {
            const res = await api.get('/docs');
            setDocuments(res.data);
        } catch (err) {
            setError('Unable to load documents. Please check your connection and try again.');
            console.error('Error fetching documents:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    useEffect(() => {
        if (!socket) return;

        socket.on('document-updated', () => {
            fetchDocuments();
        });

        return () => {
            socket.off('document-updated');
        };
    }, [socket, fetchDocuments]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await api.delete(`/docs/${deleteTarget._id}`);
            toast.success('Document deleted');
            setDeleteTarget(null);
            fetchDocuments();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete document');
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredDocs = documents.filter((doc) => {
        const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || doc.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

  return (
        <AppLayout>
            <ConfirmDialog
                isOpen={!!deleteTarget}
                title="Delete document"
                message={`Are you sure you want to permanently delete "${deleteTarget?.filename}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={fetchDocuments}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Documents</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Upload, sign, and track your agreements
                        </p>
                    </div>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2 active:scale-[0.98]"
                    >
                        <Plus size={20} />
                        <span>New Document</span>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0 overflow-x-auto">
                            {['All', 'Pending', 'Signed', 'Rejected'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                                        filterStatus === status
                                            ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0 self-end md:self-center">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                            title="Grid view"
                            aria-label="Grid view"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                            title="List view"
                            aria-label="List view"
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <DocumentSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-red-100 dark:border-red-900/30">
                        <AlertCircle className="mx-auto text-red-400 mb-4" size={40} />
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Something went wrong</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-6 max-w-sm mx-auto">{error}</p>
                        <button
                            onClick={() => { setLoading(true); fetchDocuments(); }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            <RefreshCw size={16} /> Try again
                        </button>
                    </div>
                ) : filteredDocs.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <File className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                            {documents.length === 0 ? 'No documents yet' : 'No matching documents'}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-6">
                            {documents.length === 0
                                ? 'Upload your first PDF to start signing'
                                : 'Try adjusting your search or filters'}
                        </p>
                        {documents.length === 0 && (
                            <button
                                onClick={() => setIsUploadModalOpen(true)}
                                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 text-sm"
                            >
                                Upload a document
                            </button>
                        )}
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDocs.map((doc) => (
                            <div
                                key={doc._id}
                                className="group bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                        <FileText className="text-indigo-600 dark:text-indigo-400" size={24} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={doc.status} />
                                        <button
                                            onClick={(e) => { e.preventDefault(); setDeleteTarget(doc); }}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            title="Delete document"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <Link to={`/documents/${doc._id}`} className="flex-1 flex flex-col">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1 truncate" title={doc.filename}>
                                        {doc.filename}
                                    </h3>
                                    {doc.invitations?.length > 0 ? (
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {doc.invitations.map((inv, idx) => {
                                                const isSigned = doc.signatures?.some((s) => s.signerEmail === inv.email && s.hasSignature) || inv.status === 'Completed';
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 ${
                                                            isSigned
                                                                ? 'bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/20 dark:text-green-400'
                                                                : 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400'
                                                        }`}
                                                    >
                                                        {isSigned ? <CheckCircle size={8} /> : <Clock size={8} />}
                                                        <span className="font-semibold uppercase">{inv.role}:</span>
                                                        <span className="truncate max-w-[60px]">{inv.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-[10px] text-slate-400 mb-4">No signers invited</p>
                                    )}
                                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline">
                                            Open document
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Document</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredDocs.map((doc) => (
                                        <tr key={doc._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
                                                        <FileText size={16} />
                                                    </div>
                                                    <Link to={`/documents/${doc._id}`} className="font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors">
                                                        {doc.filename}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={doc.status} />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link to={`/documents/${doc._id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                                                        Open
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteTarget(doc)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default Dashboard;
