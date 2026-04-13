'use client';

/**
 * CMS - Upload New Document
 */

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { DocumentForm } from '@/components/cms/DocumentForm';

export default function NewDocumentPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#666] mb-2">
          <Link href="/cms/research" className="hover:text-[#888]">Research</Link>
          <ChevronRight size={14} />
          <Link href="/cms/research/documents" className="hover:text-[#888]">Documents</Link>
          <ChevronRight size={14} />
          <span className="text-[#e8e4df]">New</span>
        </div>
        <h1 className="text-2xl font-light text-[#e8e4df]">Upload Document</h1>
      </div>

      {/* Form */}
      <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a] p-6">
        <DocumentForm />
      </div>
    </div>
  );
}
