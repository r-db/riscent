'use client';

/**
 * CMS - Edit Document
 */

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';
import { DocumentForm } from '@/components/cms/DocumentForm';

interface Document {
  document_id: string;
  topic_id: string | null;
  article_id: string | null;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_size: number;
  status: string;
}

export default function EditDocumentPage() {
  const params = useParams();
  const documentId = params.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocument() {
      try {
        const res = await fetch('/api/research/documents?status=all');
        if (!res.ok) throw new Error('Failed to fetch documents');
        const data = await res.json();
        const found = data.documents?.find((d: Document) => d.document_id === documentId);
        if (!found) {
          setError('Document not found');
          return;
        }
        setDocument(found);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        setLoading(false);
      }
    }

    if (documentId) {
      fetchDocument();
    }
  }, [documentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A7C59]" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#E07A5F] mb-4">{error || 'Document not found'}</p>
          <Link
            href="/cms/research/documents"
            className="px-4 py-2 bg-[#4A7C59] text-white rounded-lg text-sm"
          >
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#666] mb-2">
          <Link href="/cms/research" className="hover:text-[#888]">Research</Link>
          <ChevronRight size={14} />
          <Link href="/cms/research/documents" className="hover:text-[#888]">Documents</Link>
          <ChevronRight size={14} />
          <span className="text-[#e8e4df]">Edit</span>
        </div>
        <h1 className="text-2xl font-light text-[#e8e4df]">Edit Document</h1>
      </div>

      {/* Form */}
      <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a] p-6">
        <DocumentForm
          initialData={{
            topic_id: document.topic_id || '',
            article_id: document.article_id || '',
            title: document.title,
            description: document.description || '',
            file_url: document.file_url,
            file_type: document.file_type,
            file_size: document.file_size,
            status: document.status,
          }}
          documentId={document.document_id}
          isEdit
        />
      </div>
    </div>
  );
}
