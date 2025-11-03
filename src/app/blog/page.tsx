import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface BlogPost {
  id: number;
  title_hindi: string;
  title_english: string;
  slug: string;
  excerpt_hindi: string;
  excerpt_english: string;
  featured_image_url: string;
  category: string;
  tags: string;
  views: number;
  published_at: string;
  author_name: string;
}

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

async function getBlogPosts(page: number = 1, category?: string) {
  try {
    const params = new URLSearchParams({ page: page.toString(), limit: '12' });
    if (category) params.append('category', category);
    
    const res = await fetch(`${API_URL}/api/blog?${params}`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { posts: [], pagination: { total: 0, totalPages: 0 } };
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/api/blog/categories/all`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category;
  const page = parseInt(params.page || '1');
  
  const title = category 
    ? `${category} - ब्लॉग | Opinion Pole Bihar`
    : 'ब्लॉग | Opinion Pole Bihar - बिहार विधानसभा चुनाव समाचार और विश्लेषण';
  
  const description = 'बिहार विधानसभा चुनाव से संबंधित ताजा समाचार, राजनीतिक विश्लेषण, उम्मीदवार प्रोफाइल और मतदाता जागरूकता लेख पढ़ें।';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://opinionpoll.co.in/blog${category ? `?category=${category}` : ''}${page > 1 ? `?page=${page}` : ''}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://opinionpoll.co.in/blog${category ? `?category=${category}` : ''}${page > 1 ? `?page=${page}` : ''}`
    }
  };
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const category = params.category;
  
  const [blogData, categories] = await Promise.all([
    getBlogPosts(page, category),
    getCategories()
  ]);

  const { posts, pagination } = blogData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            बिहार चुनाव ब्लॉग
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            विधानसभा चुनाव से संबंधित ताजा समाचार, विश्लेषण और जानकारी
          </p>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/blog"
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                !category
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              सभी लेख
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  category === cat.slug
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {cat.name_hindi} ({cat.post_count})
              </Link>
            ))}
          </div>
        )}

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">कोई ब्लॉग पोस्ट उपलब्ध नहीं है।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post: BlogPost) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
              >
                {/* Featured Image */}
                {post.featured_image_url ? (
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <Image
                      src={post.featured_image_url}
                      alt={post.title_hindi}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <span className="text-white text-5xl">📰</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  {post.category && (
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full mb-3">
                      {post.category}
                    </span>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {post.title_hindi}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt_hindi && (
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {post.excerpt_hindi}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>👁️ {post.views} views</span>
                      <span>
                        {new Date(post.published_at).toLocaleDateString('hi-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}${category ? `&category=${category}` : ''}`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ← पिछला
              </Link>
            )}
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Link
                  key={pageNum}
                  href={`/blog?page=${pageNum}${category ? `&category=${category}` : ''}`}
                  className={`px-4 py-2 rounded-lg ${
                    page === pageNum
                      ? 'bg-orange-600 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
            
            {page < pagination.totalPages && (
              <Link
                href={`/blog?page=${page + 1}${category ? `&category=${category}` : ''}`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                अगला →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
