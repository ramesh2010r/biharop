# Blog Feature Documentation

## Overview
A complete blog/news section has been added to the Opinion Poll Bihar website for publishing election news, political analysis, candidate profiles, and voter awareness content.

## Features

### Public Features
- **Blog Listing Page** (`/blog`)
  - Grid layout with featured images
  - Category filtering
  - Pagination support
  - View count display
  - Responsive design

- **Individual Blog Posts** (`/blog/[slug]`)
  - Full article content with HTML support
  - Featured image display
  - Category tags
  - View counter
  - Social sharing (Twitter, Facebook, WhatsApp)
  - Related posts section
  - SEO optimized with meta tags
  - JSON-LD structured data

- **Categories**
  - चुनाव समाचार (Election News)
  - राजनीतिक विश्लेषण (Political Analysis)
  - निर्वाचन आयोग (Election Commission)
  - उम्मीदवार प्रोफाइल (Candidate Profiles)
  - मतदाता जागरूकता (Voter Awareness)

### Admin Features
- **Blog Management Dashboard** (in Admin Panel)
  - Create new blog posts
  - Edit existing posts
  - Delete posts
  - Status management (Draft/Published/Archived)
  - Filter by status
  - View analytics (views)

## Database Schema

### Tables Created

#### Blog_Posts
```sql
- id (PRIMARY KEY)
- title_hindi (VARCHAR 255) *required
- title_english (VARCHAR 255)
- slug (VARCHAR 255 UNIQUE) *required
- content_hindi (TEXT) *required
- content_english (TEXT)
- excerpt_hindi (VARCHAR 500)
- excerpt_english (VARCHAR 500)
- featured_image_url (VARCHAR 255)
- author_id (FK to Admins)
- category (VARCHAR 100)
- tags (VARCHAR 255)
- status (ENUM: draft/published/archived)
- views (INT)
- published_at (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- meta_title (VARCHAR 255)
- meta_description (VARCHAR 500)
- meta_keywords (VARCHAR 255)
```

#### Blog_Categories
```sql
- id (PRIMARY KEY)
- name_hindi (VARCHAR 100)
- name_english (VARCHAR 100)
- slug (VARCHAR 100 UNIQUE)
- description_hindi (TEXT)
- description_english (TEXT)
- created_at (TIMESTAMP)
```

#### Blog_Comments (Optional - for future)
```sql
- id (PRIMARY KEY)
- post_id (FK to Blog_Posts)
- author_name (VARCHAR 100)
- author_email (VARCHAR 100)
- comment_text (TEXT)
- status (ENUM: pending/approved/spam/trash)
- created_at (TIMESTAMP)
```

## API Endpoints

### Public Endpoints

**GET `/api/blog`**
- Query params: `page`, `limit`, `category`
- Returns: Paginated list of published blog posts

**GET `/api/blog/:slug`**
- Returns: Single blog post by slug
- Increments view count automatically

**GET `/api/blog/categories/all`**
- Returns: List of all categories with post counts

**GET `/api/blog/featured/latest`**
- Query params: `limit`
- Returns: Latest featured posts

### Admin Endpoints (Protected)

**GET `/api/blog/admin/all`**
- Auth required
- Query params: `page`, `limit`, `status`
- Returns: All posts including drafts

**POST `/api/blog/admin/create`**
- Auth required
- Body: Blog post data (JSON)
- Creates new blog post

**PUT `/api/blog/admin/:id`**
- Auth required
- Body: Updated blog post data
- Updates existing post

**DELETE `/api/blog/admin/:id`**
- Auth required
- Deletes blog post

**POST `/api/blog/admin/categories`**
- Auth required
- Body: Category data
- Creates new category

## Installation Steps

### 1. Create Database Tables
```bash
ssh -i ~/Downloads/opinionweb.pem ubuntu@15.206.160.149

mysql -u opinion_admin -p'YourSecurePassword123!' bihar_opinion_poll < backend/database/blog_schema.sql
```

### 2. Verify Tables Created
```sql
SHOW TABLES LIKE 'Blog%';
SELECT * FROM Blog_Categories;
```

### 3. Deploy Backend
```bash
# On Server 2
cd ~/opinion-poll/backend
pm2 restart backend

# On Server 3
cd ~/opinion-poll/backend
pm2 restart backend
```

### 4. Deploy Frontend
```bash
# On Server 2
cd ~/opinion-poll
npm run build
pm2 restart frontend

# On Server 3
cd ~/opinion-poll
npm run build
pm2 restart frontend
```

## Usage Guide

### Creating a Blog Post

1. **Login to Admin Panel**
   - Go to `/admin/login`
   - Login with admin credentials

2. **Navigate to Blog Management**
   - Click on "ब्लॉग प्रबंधन" tab

3. **Create New Post**
   - Click "+ नया ब्लॉग" button
   - Fill in the form:
     - **शीर्षक (Hindi)**: Title in Hindi (required)
     - **Title (English)**: Optional English title
     - **Slug**: URL-friendly slug (auto-generated)
     - **सामग्री (Hindi)**: Main content (HTML supported)
     - **अंश (Excerpt)**: Short summary for listing page
     - **Category**: Select from dropdown
     - **Status**: Draft/Published/Archived
     - **Featured Image URL**: Full URL to image
     - **Tags**: Comma-separated tags

4. **HTML Content Support**
   - Use HTML tags for formatting:
     ```html
     <h2>Heading</h2>
     <p>Paragraph text</p>
     <ul>
       <li>List item</li>
     </ul>
     <blockquote>Quote</blockquote>
     <strong>Bold text</strong>
     <em>Italic text</em>
     <a href="url">Link</a>
     ```

5. **Save**
   - Click "Create Post" or "Update Post"
   - Post will be saved with selected status

### Publishing Workflow

1. **Draft**: Work in progress, not visible on website
2. **Published**: Live on website, visible to all users
3. **Archived**: Hidden from website but kept in database

### SEO Best Practices

1. **Title**: Keep under 60 characters
2. **Meta Description**: 150-160 characters
3. **Slug**: Use hyphens, lowercase, descriptive
4. **Featured Image**: 1200x630px recommended
5. **Content**: Minimum 300 words for SEO
6. **Tags**: 3-5 relevant tags per post

## Navigation

Blog section is accessible from:
- Footer: "Blog" link
- Direct URL: `/blog`
- Individual posts: `/blog/[slug]`

## Frontend Components

### Pages
- `/src/app/blog/page.tsx` - Blog listing page
- `/src/app/blog/[slug]/page.tsx` - Individual post page

### Admin Components
- `/src/components/admin/BlogManagement.tsx` - Admin blog management interface

### Features
- Server-side rendering (SSR)
- Dynamic metadata generation
- Automatic sitemap inclusion
- Structured data (JSON-LD)
- Social sharing buttons
- Related posts
- View tracking

## Performance

- **Caching**: 5-minute revalidation for blog listings
- **Images**: Next.js Image optimization
- **Pagination**: Default 12 posts per page
- **Database**: Indexed on slug, status, published_at

## Security

- Admin routes protected with JWT authentication
- SQL injection protection with parameterized queries
- XSS protection for content rendering
- CORS configured properly

## Future Enhancements

- [ ] Comment system
- [ ] Rich text editor (WYSIWYG)
- [ ] Image upload directly in admin panel
- [ ] Draft preview
- [ ] Scheduled publishing
- [ ] Email notifications for new posts
- [ ] RSS feed
- [ ] Blog post search
- [ ] Author profiles
- [ ] Blog post analytics dashboard

## Troubleshooting

### Blog posts not showing
1. Check post status is "published"
2. Check published_at date is not in future
3. Verify database connection
4. Check API endpoint: `curl https://opinionpoll.co.in/api/blog`

### Slug conflicts
- Each slug must be unique
- Use hyphenated lowercase format
- Avoid special characters

### Images not loading
- Use full URLs (https://...)
- Check image exists and is accessible
- Verify no CORS issues

## Database Queries

### Check all published posts
```sql
SELECT id, title_hindi, slug, status, published_at, views 
FROM Blog_Posts 
WHERE status = 'published' 
ORDER BY published_at DESC;
```

### Get post count by category
```sql
SELECT category, COUNT(*) as count 
FROM Blog_Posts 
WHERE status = 'published' 
GROUP BY category;
```

### Update post slug
```sql
UPDATE Blog_Posts 
SET slug = 'new-slug' 
WHERE id = 1;
```

### Delete old drafts
```sql
DELETE FROM Blog_Posts 
WHERE status = 'draft' 
AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

## Support

For issues or questions:
- Check error logs: `pm2 logs backend`
- Database logs: Check MySQL error logs
- Browser console for frontend errors

---

**Last Updated**: January 2025
**Status**: ✅ Production Ready
