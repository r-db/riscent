'use client';

/**
 * DocumentForm - Reusable form for creating/editing research documents
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Upload, X, FileText, File } from 'lucide-react';
import Link from 'next/link';

interface Topic {
  topic_id: string;
  slug: string;
  title: string;
}

interface DocumentFormData {
  topic_id: string;
  article_id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  file_size: number;
  status: string;
}

interface DocumentFormProps {
  initialData?: Partial<DocumentFormData>;
  documentId?: string;
  isEdit?: boolean;
}

const FILE_TYPES = [
  { value: 'pdf', label: 'PDF Document', accept: '.pdf', icon: FileText },
  { value: 'doc', label: 'Word Document', accept: '.doc,.docx', icon: File },
  { value: 'txt', label: 'Text File', accept: '.txt', icon: File },
  { value: 'other', label: 'Other', accept: '*', icon: File },
];

export function DocumentForm({ initialData, documentId, isEdit = false }: DocumentFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<DocumentFormData>({
    topic_id: initialData?.topic_id || '',
    article_id: initialData?.article_id || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    file_url: initialData?.file_url || '',
    file_type: initialData?.file_type || 'pdf',
    file_size: initialData?.file_size || 0,
    status: initialData?.status || 'draft',
  });

  // Fetch topics for dropdown
  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch('/api/research/topics?status=all');
        if (res.ok) {
          const data = await res.json();
          setTopics(data.topics || []);
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
      }
    }
    fetchTopics();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Auto-populate title if empty
    if (!formData.title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setFormData((prev) => ({
        ...prev,
        title: nameWithoutExt,
        file_size: file.size,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        file_size: file.size,
      }));
    }

    // Detect file type
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      setFormData((prev) => ({ ...prev, file_type: 'pdf' }));
    } else if (ext === 'doc' || ext === 'docx') {
      setFormData((prev) => ({ ...prev, file_type: 'doc' }));
    } else if (ext === 'txt') {
      setFormData((prev) => ({ ...prev, file_type: 'txt' }));
    } else {
      setFormData((prev) => ({ ...prev, file_type: 'other' }));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFormData((prev) => ({
      ...prev,
      file_url: '',
      file_size: 0,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let fileUrl = formData.file_url;

      // Upload file if selected
      if (selectedFile) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload file');
        }

        const uploadData = await uploadRes.json();
        fileUrl = uploadData.url;
        setUploading(false);
      }

      const url = isEdit
        ? `/api/research/documents/${documentId}`
        : '/api/research/documents';

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          file_url: fileUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save document');
      }

      router.push('/cms/research/documents');
      router.refresh();
    } catch (err) {
      console.error('Error saving document:', err);
      setError(err instanceof Error ? err.message : 'Failed to save document');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {error && (
        <div className="mb-6 p-4 bg-[#E07A5F]/10 border border-[#E07A5F]/20 rounded-lg text-[#E07A5F] text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-[#e8e4df] mb-2">
            Document File <span className="text-[#E07A5F]">*</span>
          </label>

          {selectedFile || formData.file_url ? (
            <div className="flex items-center gap-4 p-4 bg-[#0f0f14] border border-[#2a2a3a] rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-[#4A7C59]/10 flex items-center justify-center">
                <FileText size={24} className="text-[#4A7C59]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#e8e4df] truncate">
                  {selectedFile?.name || formData.file_url.split('/').pop()}
                </p>
                <p className="text-xs text-[#666]">
                  {formatFileSize(formData.file_size)} • {formData.file_type.toUpperCase()}
                </p>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-2 rounded-lg hover:bg-[#2a2a3a] text-[#666] hover:text-[#E07A5F] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#2a2a3a] rounded-lg p-8 text-center cursor-pointer hover:border-[#4A7C59] transition-colors"
            >
              <Upload size={32} className="mx-auto mb-3 text-[#666]" />
              <p className="text-sm text-[#888] mb-1">Click to upload a document</p>
              <p className="text-xs text-[#555]">PDF, DOC, DOCX, TXT up to 10MB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-[#e8e4df] mb-2">
            Title <span className="text-[#E07A5F]">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-[#e8e4df] placeholder:text-[#555] focus:outline-none focus:border-[#4A7C59]"
            placeholder="Document title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#e8e4df] mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-[#e8e4df] placeholder:text-[#555] focus:outline-none focus:border-[#4A7C59] resize-none"
            placeholder="Brief description of the document..."
          />
        </div>

        {/* Topic & Status Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-[#e8e4df] mb-2">
              Topic
            </label>
            <select
              name="topic_id"
              value={formData.topic_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
            >
              <option value="">No topic (standalone)</option>
              {topics.map((topic) => (
                <option key={topic.topic_id} value={topic.topic_id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-[#e8e4df] mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* File Type */}
        <div>
          <label className="block text-sm font-medium text-[#e8e4df] mb-2">
            File Type
          </label>
          <select
            name="file_type"
            value={formData.file_type}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
          >
            {FILE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#2a2a3a]">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex items-center gap-2 px-6 py-3 bg-[#4A7C59] text-white rounded-lg text-sm font-medium hover:bg-[#3d6a4a] transition-colors disabled:opacity-50"
        >
          {loading || uploading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {uploading ? 'Uploading...' : isEdit ? 'Save Changes' : 'Upload Document'}
        </button>
        <Link
          href="/cms/research/documents"
          className="flex items-center gap-2 px-6 py-3 bg-[#2a2a3a] text-[#888] rounded-lg text-sm font-medium hover:bg-[#3a3a4a] transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
