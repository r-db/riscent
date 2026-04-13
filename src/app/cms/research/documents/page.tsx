'use client';

/**
 * CMS Documents List
 * Manage research documents
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Loader2,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  ChevronRight,
  Download,
  File,
} from 'lucide-react';

interface Document {
  document_id: string;
  topic_id: string | null;
  topic_title: string | null;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_size: number;
  status: string;
  created_at: string;
}

export default function CMSDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const res = await fetch('/api/research/documents?status=all');
      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteDocument(documentId: string) {
    if (!confirm('Are you sure you want to archive this document?')) return;

    try {
      const res = await fetch(`/api/research/documents/${documentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete document');
      fetchDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Failed to delete document');
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-[#4A7C59] bg-[#4A7C59]/10';
      case 'draft':
        return 'text-[#D4A84B] bg-[#D4A84B]/10';
      case 'archived':
        return 'text-[#666] bg-[#666]/10';
      default:
        return 'text-[#666] bg-[#666]/10';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText size={18} className="text-[#E07A5F]" />;
      default:
        return <File size={18} className="text-[#888]" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A7C59]" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#666] mb-2">
            <Link href="/cms/research" className="hover:text-[#888]">Research</Link>
            <ChevronRight size={14} />
            <span className="text-[#e8e4df]">Documents</span>
          </div>
          <h1 className="text-2xl font-light text-[#e8e4df]">Research Documents</h1>
        </div>
        <Link
          href="/cms/research/documents/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4A7C59] text-white rounded-lg text-sm font-medium hover:bg-[#3d6a4a] transition-colors"
        >
          <Plus size={18} />
          Upload Document
        </Link>
      </div>

      {/* Documents List */}
      <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a] overflow-hidden">
        {documents.length === 0 ? (
          <div className="p-12 text-center text-[#666]">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="mb-4">No documents yet</p>
            <Link
              href="/cms/research/documents/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white rounded-lg text-sm"
            >
              <Plus size={16} />
              Upload your first document
            </Link>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#2a2a3a] text-xs text-[#666] uppercase tracking-wide">
              <div className="col-span-5">Document</div>
              <div className="col-span-2">Topic</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1"></div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#2a2a3a]">
              {documents.map((doc) => (
                <div
                  key={doc.document_id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-[#2a2a3a]/30 transition-colors"
                >
                  {/* Document Info */}
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#2a2a3a] flex items-center justify-center">
                      {getFileIcon(doc.file_type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#e8e4df] truncate">{doc.title}</p>
                      <p className="text-xs text-[#666] truncate">{doc.file_type.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Topic */}
                  <div className="col-span-2 flex items-center">
                    {doc.topic_title ? (
                      <span className="text-sm text-[#888] truncate">{doc.topic_title}</span>
                    ) : (
                      <span className="text-sm text-[#555] italic">Standalone</span>
                    )}
                  </div>

                  {/* Size */}
                  <div className="col-span-2 flex items-center text-sm text-[#888]">
                    {formatFileSize(doc.file_size)}
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === doc.document_id ? null : doc.document_id)}
                      className="p-2 rounded-lg hover:bg-[#2a2a3a] text-[#666] hover:text-[#e8e4df] transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenu === doc.document_id && (
                      <div className="absolute right-0 top-10 z-10 w-40 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg shadow-xl overflow-hidden">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#888] hover:text-[#e8e4df] hover:bg-[#2a2a3a] transition-colors"
                        >
                          <Eye size={14} />
                          View
                        </a>
                        <a
                          href={doc.file_url}
                          download
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#888] hover:text-[#e8e4df] hover:bg-[#2a2a3a] transition-colors"
                        >
                          <Download size={14} />
                          Download
                        </a>
                        <Link
                          href={`/cms/research/documents/${doc.document_id}`}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#888] hover:text-[#e8e4df] hover:bg-[#2a2a3a] transition-colors"
                        >
                          <Edit size={14} />
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            setActiveMenu(null);
                            deleteDocument(doc.document_id);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#E07A5F] hover:bg-[#E07A5F]/10 transition-colors w-full"
                        >
                          <Trash2 size={14} />
                          Archive
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
