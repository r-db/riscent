'use client';

/**
 * TopicForm - Reusable form for creating/editing research topics
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface TopicFormData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon_name: string;
  color_hex: string;
  display_order: number;
  status: string;
}

interface TopicFormProps {
  initialData?: Partial<TopicFormData>;
  topicId?: string;
  isEdit?: boolean;
}

const ICON_OPTIONS = [
  { value: 'Brain', label: 'Brain' },
  { value: 'Target', label: 'Target' },
  { value: 'Sparkles', label: 'Sparkles' },
  { value: 'FileText', label: 'FileText' },
  { value: 'Lightbulb', label: 'Lightbulb' },
  { value: 'Zap', label: 'Zap' },
];

const COLOR_OPTIONS = [
  { value: '#4A7C59', label: 'Sage Green' },
  { value: '#2C5282', label: 'Trust Blue' },
  { value: '#E07A5F', label: 'Warm Coral' },
  { value: '#D4A84B', label: 'Warm Gold' },
  { value: '#6B5B95', label: 'Purple' },
  { value: '#88B04B', label: 'Greenery' },
];

export function TopicForm({ initialData, topicId, isEdit = false }: TopicFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TopicFormData>({
    slug: initialData?.slug || '',
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    description: initialData?.description || '',
    icon_name: initialData?.icon_name || 'Brain',
    color_hex: initialData?.color_hex || '#4A7C59',
    display_order: initialData?.display_order || 0,
    status: initialData?.status || 'draft',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'display_order' ? parseInt(value, 10) || 0 : value,
    }));
  };

  // Auto-generate slug from title
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isEdit
        ? `/api/research/topics/${topicId}`
        : '/api/research/topics';

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save topic');
      }

      router.push('/cms/research/topics');
      router.refresh();
    } catch (err) {
      console.error('Error saving topic:', err);
      setError(err instanceof Error ? err.message : 'Failed to save topic');
    } finally {
      setLoading(false);
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
            onBlur={() => !isEdit && !formData.slug && generateSlug()}
            required
            className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-[#e8e4df] placeholder:text-[#555] focus:outline-none focus:border-[#4A7C59]"
            placeholder="e.g., Mechanistic Interpretability"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-[#e8e4df] mb-2">
            URL Slug <span className="text-[#E07A5F]">*</span>
          </label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center">
              <span className="px-3 py-3 bg-[#0f0f14] border border-r-0 border-[#2a2a3a] rounded-l-lg text-[#666] text-sm">
                /research/
              </span>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3 bg-[#1a1a24] border border-[#2a2a3a] rounded-r-lg text-[#e8e4df] placeholder:text-[#555] focus:outline-none focus:border-[#4A7C59]"
                placeholder="mechanistic-interpretability"
              />
            </div>
            <button
              type="button"
              onClick={generateSlug}
              className="px-3 py-3 bg-[#2a2a3a] text-[#888] rounded-lg text-sm hover:bg-[#3a3a4a] transition-colors"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-[#e8e4df] mb-2">
            Subtitle
          </label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-[#e8e4df] placeholder:text-[#555] focus:outline-none focus:border-[#4A7C59]"
            placeholder="A brief tagline for the topic"
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
            rows={4}
            className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-[#e8e4df] placeholder:text-[#555] focus:outline-none focus:border-[#4A7C59] resize-none"
            placeholder="Detailed description of this research topic..."
          />
        </div>

        {/* Icon & Color Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-[#e8e4df] mb-2">
              Icon
            </label>
            <select
              name="icon_name"
              value={formData.icon_name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
            >
              {ICON_OPTIONS.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-[#e8e4df] mb-2">
              Color
            </label>
            <div className="flex gap-2">
              <select
                name="color_hex"
                value={formData.color_hex}
                onChange={handleChange}
                className="flex-1 px-4 py-3 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
              >
                {COLOR_OPTIONS.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.label}
                  </option>
                ))}
              </select>
              <div
                className="w-12 h-12 rounded-lg border border-[#2a2a3a]"
                style={{ backgroundColor: formData.color_hex }}
              />
            </div>
          </div>
        </div>

        {/* Display Order & Status Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-[#e8e4df] mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              min={0}
              className="w-full px-4 py-3 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
            />
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
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#2a2a3a]">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-[#4A7C59] text-white rounded-lg text-sm font-medium hover:bg-[#3d6a4a] transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {isEdit ? 'Save Changes' : 'Create Topic'}
        </button>
        <Link
          href="/cms/research/topics"
          className="flex items-center gap-2 px-6 py-3 bg-[#2a2a3a] text-[#888] rounded-lg text-sm font-medium hover:bg-[#3a3a4a] transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
