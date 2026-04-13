'use client';

/**
 * ArticleForm - Form for creating/editing research articles
 * Includes markdown editor with preview
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Eye, Edit, Plus, Trash2, GripVertical } from 'lucide-react';
import Link from 'next/link';

interface ContentSection {
  heading: string;
  content: string;
}

interface ArticleFormData {
  topic_id: string;
  slug: string;
  title: string;
  subtitle: string;
  introduction: string;
  conclusion: string;
  key_takeaways: string[];
  content_sections: ContentSection[];
  author_name: string;
  published_date: string;
  read_time: string;
  category: string;
  color_hex: string;
  status: string;
  featured: boolean;
  is_interesting_find: boolean;
  meta_title: string;
  meta_description: string;
}

interface Topic {
  topic_id: string;
  slug: string;
  title: string;
}

interface ArticleFormProps {
  initialData?: Partial<ArticleFormData>;
  articleSlug?: string;
  isEdit?: boolean;
}

const COLOR_OPTIONS = [
  { value: '#4A7C59', label: 'Sage Green' },
  { value: '#2C5282', label: 'Trust Blue' },
  { value: '#E07A5F', label: 'Warm Coral' },
  { value: '#D4A84B', label: 'Warm Gold' },
  { value: '#6B5B95', label: 'Purple' },
];

export function ArticleForm({ initialData, articleSlug, isEdit = false }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const [formData, setFormData] = useState<ArticleFormData>({
    topic_id: initialData?.topic_id || '',
    slug: initialData?.slug || '',
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    introduction: initialData?.introduction || '',
    conclusion: initialData?.conclusion || '',
    key_takeaways: initialData?.key_takeaways || [''],
    content_sections: initialData?.content_sections || [{ heading: '', content: '' }],
    author_name: initialData?.author_name || 'Riscent Research Team',
    published_date: initialData?.published_date || '',
    read_time: initialData?.read_time || '',
    category: initialData?.category || '',
    color_hex: initialData?.color_hex || '#4A7C59',
    status: initialData?.status || 'draft',
    featured: initialData?.featured || false,
    is_interesting_find: initialData?.is_interesting_find || false,
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
  });

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch('/api/research/topics');
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
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData((prev) => ({ ...prev, slug }));
  };

  // Content sections management
  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      content_sections: [...prev.content_sections, { heading: '', content: '' }],
    }));
    setActiveSection(formData.content_sections.length);
  };

  const updateSection = (index: number, field: 'heading' | 'content', value: string) => {
    setFormData((prev) => ({
      ...prev,
      content_sections: prev.content_sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  const removeSection = (index: number) => {
    if (formData.content_sections.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      content_sections: prev.content_sections.filter((_, i) => i !== index),
    }));
    setActiveSection(null);
  };

  // Key takeaways management
  const addTakeaway = () => {
    setFormData((prev) => ({
      ...prev,
      key_takeaways: [...prev.key_takeaways, ''],
    }));
  };

  const updateTakeaway = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      key_takeaways: prev.key_takeaways.map((t, i) => (i === index ? value : t)),
    }));
  };

  const removeTakeaway = (index: number) => {
    if (formData.key_takeaways.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      key_takeaways: prev.key_takeaways.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Clean up empty values
    const cleanedData = {
      ...formData,
      topic_id: formData.topic_id || null,
      key_takeaways: formData.key_takeaways.filter((t) => t.trim()),
      content_sections: formData.content_sections.filter((s) => s.heading.trim() || s.content.trim()),
    };

    try {
      const url = isEdit
        ? `/api/research/articles/${articleSlug}`
        : '/api/research/articles';

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save article');
      }

      router.push('/cms/research/articles');
      router.refresh();
    } catch (err) {
      console.error('Error saving article:', err);
      setError(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-6 p-4 bg-[#E07A5F]/10 border border-[#E07A5F]/20 rounded-lg text-[#E07A5F] text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="col-span-2 space-y-6">
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
              className="w-full px-4 py-3 bg-[#0f0f14] border border-[#2a2a3a] rounded-lg text-[#e8e4df] text-lg placeholder:text-[#555] focus:outline-none focus:border-[#4A7C59]"
              placeholder="Article title"
            />
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
              className="w-full px-4 py-3 bg-[#0f0f14] border border-[#2a2a3a] rounded-lg text-[#e8e4df] placeholder:text-[#555] focus:outline-none focus:border-[#4A7C59]"
              placeholder="A compelling subtitle"
            />
          </div>

          {/* Introduction */}
          <div>
            <label className="block text-sm font-medium text-[#e8e4df] mb-2">
              Introduction
            </label>
            <textarea
              name="introduction"
              value={formData.introduction}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-[#0f0f14] border border-[#2a2a3a] rounded-lg text-[#e8e4df] placeholder:text-[#555] focus:outline-none focus:border-[#4A7C59] resize-none"
              placeholder="Opening paragraph that hooks the reader..."
            />
          </div>

          {/* Content Sections */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-[#e8e4df]">Content Sections</label>
              <button
                type="button"
                onClick={addSection}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-[#4A7C59] bg-[#4A7C59]/10 rounded-lg hover:bg-[#4A7C59]/20 transition-colors"
              >
                <Plus size={14} />
                Add Section
              </button>
            </div>

            <div className="space-y-4">
              {formData.content_sections.map((section, index) => (
                <div
                  key={index}
                  className={`border rounded-lg overflow-hidden transition-colors ${
                    activeSection === index ? 'border-[#4A7C59]' : 'border-[#2a2a3a]'
                  }`}
                >
                  <div
                    className="flex items-center gap-3 px-4 py-3 bg-[#0f0f14] cursor-pointer"
                    onClick={() => setActiveSection(activeSection === index ? null : index)}
                  >
                    <GripVertical size={16} className="text-[#555]" />
                    <input
                      type="text"
                      value={section.heading}
                      onChange={(e) => updateSection(index, 'heading', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder={`Section ${index + 1} heading`}
                      className="flex-1 bg-transparent text-[#e8e4df] placeholder:text-[#555] focus:outline-none"
                    />
                    {formData.content_sections.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSection(index);
                        }}
                        className="p-1 text-[#666] hover:text-[#E07A5F] transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {activeSection === index && (
                    <div className="p-4 bg-[#1a1a24]">
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(index, 'content', e.target.value)}
                        rows={8}
                        placeholder="Section content... Use **bold** for emphasis"
                        className="w-full px-3 py-2 bg-[#0f0f14] border border-[#2a2a3a] rounded-lg text-[#e8e4df] text-sm placeholder:text-[#555] focus:outline-none focus:border-[#4A7C59] resize-none font-mono"
                      />
                      <p className="mt-2 text-xs text-[#555]">
                        Supports **bold** and basic markdown formatting
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Conclusion */}
          <div>
            <label className="block text-sm font-medium text-[#e8e4df] mb-2">
              Conclusion
            </label>
            <textarea
              name="conclusion"
              value={formData.conclusion}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-[#0f0f14] border border-[#2a2a3a] rounded-lg text-[#e8e4df] placeholder:text-[#555] focus:outline-none focus:border-[#4A7C59] resize-none"
              placeholder="Summarize key points and call to action..."
            />
          </div>

          {/* Key Takeaways */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-[#e8e4df]">Key Takeaways</label>
              <button
                type="button"
                onClick={addTakeaway}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-[#4A7C59] bg-[#4A7C59]/10 rounded-lg hover:bg-[#4A7C59]/20 transition-colors"
              >
                <Plus size={14} />
                Add
              </button>
            </div>

            <div className="space-y-2">
              {formData.key_takeaways.map((takeaway, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-[#4A7C59]">•</span>
                  <input
                    type="text"
                    value={takeaway}
                    onChange={(e) => updateTakeaway(index, e.target.value)}
                    placeholder="Key takeaway point"
                    className="flex-1 px-3 py-2 bg-[#0f0f14] border border-[#2a2a3a] rounded-lg text-[#e8e4df] text-sm placeholder:text-[#555] focus:outline-none focus:border-[#4A7C59]"
                  />
                  {formData.key_takeaways.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTakeaway(index)}
                      className="p-1 text-[#666] hover:text-[#E07A5F] transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Publish Box */}
          <div className="bg-[#0f0f14] rounded-lg border border-[#2a2a3a] p-4">
            <h3 className="text-sm font-medium text-[#e8e4df] mb-4">Publish</h3>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-xs text-[#666] mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-sm text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Slug */}
            <div className="mb-4">
              <label className="block text-xs text-[#666] mb-1">URL Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-sm text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-[#2a2a3a]">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4A7C59] text-white rounded-lg text-sm font-medium hover:bg-[#3d6a4a] transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isEdit ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>

          {/* Topic */}
          <div className="bg-[#0f0f14] rounded-lg border border-[#2a2a3a] p-4">
            <h3 className="text-sm font-medium text-[#e8e4df] mb-4">Topic</h3>
            <select
              name="topic_id"
              value={formData.topic_id}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-sm text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
            >
              <option value="">No topic (Interesting Find)</option>
              {topics.map((topic) => (
                <option key={topic.topic_id} value={topic.topic_id}>
                  {topic.title}
                </option>
              ))}
            </select>

            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#2a2a3a] bg-[#1a1a24] text-[#4A7C59] focus:ring-[#4A7C59]"
                />
                <span className="text-sm text-[#888]">Featured article</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_interesting_find"
                  checked={formData.is_interesting_find}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#2a2a3a] bg-[#1a1a24] text-[#4A7C59] focus:ring-[#4A7C59]"
                />
                <span className="text-sm text-[#888]">Interesting Find</span>
              </label>
            </div>
          </div>

          {/* Meta */}
          <div className="bg-[#0f0f14] rounded-lg border border-[#2a2a3a] p-4">
            <h3 className="text-sm font-medium text-[#e8e4df] mb-4">Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#666] mb-1">Author</label>
                <input
                  type="text"
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-sm text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#666] mb-1">Published Date</label>
                <input
                  type="text"
                  name="published_date"
                  value={formData.published_date}
                  onChange={handleChange}
                  placeholder="January 2026"
                  className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-sm text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#666] mb-1">Read Time</label>
                <input
                  type="text"
                  name="read_time"
                  value={formData.read_time}
                  onChange={handleChange}
                  placeholder="12 min read"
                  className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-sm text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#666] mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="AI & Design"
                  className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-sm text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#666] mb-1">Color</label>
                <div className="flex gap-2">
                  <select
                    name="color_hex"
                    value={formData.color_hex}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-sm text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <div
                    className="w-10 h-10 rounded-lg border border-[#2a2a3a]"
                    style={{ backgroundColor: formData.color_hex }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-[#0f0f14] rounded-lg border border-[#2a2a3a] p-4">
            <h3 className="text-sm font-medium text-[#e8e4df] mb-4">SEO</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#666] mb-1">Meta Title</label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  placeholder="Custom page title"
                  className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-sm text-[#e8e4df] focus:outline-none focus:border-[#4A7C59]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#666] mb-1">Meta Description</label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="SEO description"
                  className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg text-sm text-[#e8e4df] focus:outline-none focus:border-[#4A7C59] resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#2a2a3a]">
        <Link
          href="/cms/research/articles"
          className="px-6 py-3 bg-[#2a2a3a] text-[#888] rounded-lg text-sm font-medium hover:bg-[#3a3a4a] transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
