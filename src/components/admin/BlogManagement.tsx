'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/config/api';

interface BlogPost {
  id: number;
  title_hindi: string;
  title_english: string;
  slug: string;
  category: string;
  status: string;
  views: number;
  published_at: string;
  created_at: string;
}

interface Category {
  id: number;
  name_hindi: string;
  name_english: string;
  slug: string;
  post_count: number;
}

export default function BlogManagement({ token }: { token: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    title_hindi: '',
    title_english: '',
    slug: '',
    content_hindi: '',
    content_english: '',
    excerpt_hindi: '',
    excerpt_english: '',
    featured_image_url: '',
    category: '',
    tags: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  });

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [statusFilter]);

  const fetchPosts = async () => {
    try {
      const url = statusFilter === 'all' 
        ? `${API_URL}/api/blog/admin/all`
        : `${API_URL}/api/blog/admin/all?status=${statusFilter}`;
        
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blog/categories/all`);
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingPost
        ? `${API_URL}/api/blog/admin/${editingPost}`
        : `${API_URL}/api/blog/admin/create`;
      
      const method = editingPost ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(editingPost ? 'ब्लॉग अपडेट हो गया!' : 'ब्लॉग बन गया!');
        setShowForm(false);
        setEditingPost(null);
        resetForm();
        fetchPosts();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title_hindi: post.title_hindi,
      title_english: post.title_english || '',
      slug: post.slug,
      content_hindi: '', // Will need to fetch full post
      content_english: '',
      excerpt_hindi: '',
      excerpt_english: '',
      featured_image_url: '',
      category: post.category,
      tags: '',
      status: post.status,
      meta_title: '',
      meta_description: '',
      meta_keywords: ''
    });
    setEditingPost(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('क्या आप इस ब्लॉग पोस्ट को डिलीट करना चाहते हैं?')) return;

    try {
      const response = await fetch(`${API_URL}/api/blog/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('ब्लॉग डिलीट हो गया!');
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const resetForm = () => {
    setFormData({
      title_hindi: '',
      title_english: '',
      slug: '',
      content_hindi: '',
      content_english: '',
      excerpt_hindi: '',
      excerpt_english: '',
      featured_image_url: '',
      category: '',
      tags: '',
      status: 'draft',
      meta_title: '',
      meta_description: '',
      meta_keywords: ''
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">ब्लॉग प्रबंधन</h2>
          <p className="text-gray-600">Manage blog posts and categories</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingPost(null);
            resetForm();
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ नया ब्लॉग'}
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        {['all', 'published', 'draft', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Blog Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            {editingPost ? 'ब्लॉग एडिट करें' : 'नया ब्लॉग बनाएं'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">शीर्षक (Hindi) *</label>
                <input
                  type="text"
                  value={formData.title_hindi}
                  onChange={(e) => {
                    setFormData({ ...formData, title_hindi: e.target.value });
                    if (!editingPost) {
                      setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                    }
                  }}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title (English)</label>
                <input
                  type="text"
                  value={formData.title_english}
                  onChange={(e) => setFormData({ ...formData, title_english: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Slug (URL) *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full p-2 border rounded font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                URL will be: /blog/{formData.slug}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">सामग्री (Hindi) *</label>
              <textarea
                value={formData.content_hindi}
                onChange={(e) => setFormData({ ...formData, content_hindi: e.target.value })}
                className="w-full p-2 border rounded h-64"
                placeholder="HTML content supported..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">अंश (Excerpt Hindi)</label>
              <textarea
                value={formData.excerpt_hindi}
                onChange={(e) => setFormData({ ...formData, excerpt_hindi: e.target.value })}
                className="w-full p-2 border rounded h-20"
                maxLength={500}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name_hindi}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Featured Image URL</label>
              <input
                type="text"
                value={formData.featured_image_url}
                onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="politics, election, bihar"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingPost ? 'Update Post' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingPost(null);
                  resetForm();
                }}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No blog posts found
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{post.title_hindi}</div>
                    <div className="text-xs text-gray-500">/blog/{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{post.category || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : post.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{post.views}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(post.published_at || post.created_at).toLocaleDateString('hi-IN')}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
