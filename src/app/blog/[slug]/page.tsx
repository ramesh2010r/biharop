import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface BlogPost {
  id: number;
  title_hindi: string;
  title_english: string;
  slug: string;
  content_hindi: string;
  content_english: string;
  excerpt_hindi: string;
  excerpt_english: string;
  featured_image_url: string;
  category: string;
  tags: string;
  views: number;
  published_at: string;
  author_name: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/api/blog/${slug}`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

async function getRelatedPosts(category: string, currentSlug: string) {
  try {
    const res = await fetch(`${API_URL}/api/blog?category=${category}&limit=3`, {
      next: { revalidate: 600 }
    });
    
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts.filter((post: BlogPost) => post.slug !== currentSlug);
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  
  if (!post) {
    return {
      title: 'ब्लॉग पोस्ट नहीं मिला',
    };
  }

  const title = post.meta_title || post.title_hindi;
  const description = post.meta_description || post.excerpt_hindi || post.content_hindi.substring(0, 160);

  return {
    title: `${title} | Opinion Pole Bihar`,
    description,
    keywords: post.meta_keywords || post.tags,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://opinionpoll.co.in/blog/${post.slug}`,
      images: post.featured_image_url ? [post.featured_image_url] : [],
      publishedTime: post.published_at,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
    alternates: {
      canonical: `https://opinionpoll.co.in/blog/${post.slug}`
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = post.category ? await getRelatedPosts(post.category, post.slug) : [];

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title_hindi,
            image: post.featured_image_url || 'https://opinionpoll.co.in/og-share-image.jpg',
            datePublished: post.published_at,
            author: {
              '@type': 'Person',
              name: post.author_name || 'Opinion Pole Team'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Opinion Pole Bihar',
              logo: {
                '@type': 'ImageObject',
                url: 'https://opinionpoll.co.in/images/Logo_OP.webp'
              }
            },
            description: post.meta_description || post.excerpt_hindi
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Header with breadcrumb */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-2 text-sm text-orange-100">
              <Link href="/" className="hover:text-white">होम</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white">ब्लॉग</Link>
              {post.category && (
                <>
                  <span>/</span>
                  <Link href={`/blog?category=${post.category}`} className="hover:text-white">
                    {post.category}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Article */}
          <article className="bg-white">
            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="relative h-96 bg-gray-200 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.featured_image_url}
                  alt={post.title_hindi}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Header */}
            <header className="mb-8">
              {/* Category Badge */}
              {post.category && (
                <Link
                  href={`/blog?category=${post.category}`}
                  className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full mb-4 hover:bg-orange-200 transition-colors"
                >
                  {post.category}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title_hindi}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{post.author_name || 'Opinion Pole Team'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <time>
                    {new Date(post.published_at).toLocaleDateString('hi-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span>{post.views} बार पढ़ा गया</span>
                </div>
              </div>
            </header>

            {/* Article Content - Optimized for Reading */}
            <div 
              className="blog-article-content text-gray-800 text-lg leading-relaxed"
              style={{
                fontFamily: "'Noto Sans Devanagari', sans-serif",
                fontSize: '1.125rem',
                lineHeight: '1.9',
                letterSpacing: '0.01em'
              }}
              dangerouslySetInnerHTML={{ __html: post.content_hindi }}
            />

            {/* Tags */}
            {post.tags && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">टैग्स</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.split(',').map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Share Buttons */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">इस लेख को शेयर करें</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title_hindi)}&url=${encodeURIComponent(`https://opinionpoll.co.in/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://opinionpoll.co.in/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title_hindi + ' - ' + `https://opinionpoll.co.in/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">संबंधित लेख</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost: BlogPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block border-b border-gray-200 pb-6 hover:border-orange-500 transition-colors"
                  >
                    {relatedPost.featured_image_url ? (
                      <div className="relative h-48 bg-gray-200 mb-4 overflow-hidden">
                        <Image
                          src={relatedPost.featured_image_url}
                          alt={relatedPost.title_hindi}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 mb-4 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {relatedPost.title_hindi}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedPost.excerpt_hindi}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(relatedPost.published_at).toLocaleDateString('hi-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog Link */}
          <div className="mt-16 pt-8 border-t border-gray-200 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              सभी ब्लॉग पोस्ट देखें
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
