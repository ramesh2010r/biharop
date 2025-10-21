# Party Logo & Candidate Photo Upload System

## ✅ Features Implemented

### 1. Server-Side File Upload
- Upload party logos directly to your server
- Upload candidate photos to your server
- No need for external hosting services (Imgur, ImgBB, etc.)
- Files stored locally for full control

### 2. File Storage Structure
```
backend/
└── public/
    └── uploads/
        ├── party-symbols/     # Party logos stored here
        └── candidate-photos/  # Candidate photos stored here
```

### 3. Supported File Formats
**Party Symbols:**
- PNG (recommended for transparent backgrounds)
- JPG/JPEG
- SVG
- GIF
- WEBP

**Candidate Photos:**
- JPG/JPEG (recommended)
- PNG
- GIF
- WEBP

### 4. File Size Limits
- **Party Symbols**: Max 2MB
- **Candidate Photos**: Max 5MB

## 🎯 How to Upload

### For Party Logos:
1. Go to **Admin Dashboard** → **Parties** tab
2. Click **"Add Party"** or **"Edit"** existing party
3. Find **"Party Symbol"** section
4. Click green **"📤 Upload Symbol to Server"** button
5. Select your logo file from computer
6. See instant preview
7. Click **"Update Party"**

### For Candidate Photos:
1. Go to **Admin Dashboard** → **Candidates** tab
2. Click **"Add Candidate"** or **"Edit"** existing candidate
3. Find **"Photo (Optional)"** section
4. Click green **"📤 Upload Photo to Server"** button
5. Select candidate photo from computer
6. See instant preview
7. Click **"Update Candidate"**

## 📁 File URLs Generated

When you upload a file, it's stored on your server and given a URL:

**Party Symbol Example:**
```
/images/party-logos/cpim-flag.svg
```
Accessible at: `http://localhost:5001/images/party-logos/cpim-flag.svg`

**Candidate Photo Example:**
```
/images/candidate-photos/rajesh-kumar.jpg
```
Accessible at: `http://localhost:5001/images/candidate-photos/rajesh-kumar.jpg`

## 🔧 Technical Implementation

### Backend API Endpoints

**Upload Party Symbol:**
```http
POST /api/admin/upload/party-symbol
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body: FormData with 'symbol' field
Response: { url: '/images/party-logos/filename.png' }
```

**Upload Candidate Photo:**
```http
POST /api/admin/upload/candidate-photo
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body: FormData with 'photo' field
Response: { url: '/images/candidate-photos/filename.jpg' }
```

### File Naming Convention
Files are automatically renamed to prevent conflicts:
```
Original: party-logo.png
Stored as: party-symbols-1729012345678.png
           └──────────┘ └──────────┘
           prefix       timestamp
```

### Database Storage
Only the file URL is stored in the database:
```sql
-- Parties table
symbol_url: '/images/party-logos/bjp-lotus.png'

-- Candidates table
photo_url: '/images/candidate-photos/candidate-1234.jpg'
```

## 🛡️ Security Features

### 1. Authentication Required
- Only logged-in admins can upload files
- JWT token verification on all uploads

### 2. File Type Validation
- Server checks file extensions
- Only allowed formats are accepted
- Rejects executables, scripts, etc.

### 3. File Size Limits
- Enforced at server level
- Prevents large file uploads
- Saves server storage

### 4. Unique Filenames
- Timestamp-based naming
- Prevents filename conflicts
- No file overwriting

## 📸 Image Guidelines

### Party Symbols
**Best Practices:**
- Use transparent PNG for professional look
- Size: 200x200px to 512x512px
- Clear, recognizable symbol
- High contrast colors
- Simple design (avoid too much detail)

**Example Party Symbols:**
- BJP: Lotus flower
- INC: Open palm/hand
- RJD: Lantern
- JDU: Arrow
- CPI(M): Hammer & sickle with star
- IND (Independent): Scales, wheel, or generic symbol

### Candidate Photos
**Best Practices:**
- Professional headshot
- Plain light background
- Clear face visibility
- Size: 300x400px (portrait)
- Good lighting
- Formal attire

**Avoid:**
- Group photos
- Cropped or blurry images
- Dark or cluttered backgrounds
- Casual photos

## 🔄 Updating Files

### To Change a Party Symbol:
1. Edit the party
2. Upload new symbol file
3. Old file remains on server (doesn't auto-delete)
4. New file path is saved to database

### To Change a Candidate Photo:
1. Edit the candidate
2. Upload new photo file
3. Old file remains on server
4. New file path is saved to database

**Note**: Old files are not automatically deleted to prevent breaking any cached references.

## 📊 File Management

### View Uploaded Files:
```bash
# List party symbols
ls -lh backend/public/uploads/party-symbols/

# List candidate photos
ls -lh backend/public/uploads/candidate-photos/
```

### Manual Cleanup (Optional):
```bash
# Remove unused files (be careful!)
cd backend/public/uploads/party-symbols
# Check database first, then delete unused files manually
```

## 🚀 Advantages of Server Upload

### ✅ Pros:
1. **Full Control**: You own the files
2. **No External Dependencies**: No reliance on Imgur, ImgBB, etc.
3. **Faster Loading**: Files served from same server
4. **Privacy**: Images not publicly indexed by third parties
5. **Reliability**: No risk of external service going down
6. **No Ads**: Third-party hosts may inject ads
7. **Consistent URLs**: URLs never change

### ⚠️ Considerations:
1. **Storage**: Uses your server disk space
2. **Bandwidth**: Your server serves the images
3. **Backups**: Remember to backup the uploads folder

## 🔐 Production Deployment

### Before Going Live:

1. **Add File Size Monitoring**
2. **Set up CDN** (optional, for faster global delivery)
3. **Regular Backups** of uploads folder
4. **Image Optimization** (compress files)
5. **Add Virus Scanning** (optional, for extra security)

### Recommended CDN Services (Optional):
- Cloudflare (free tier available)
- AWS CloudFront
- Google Cloud CDN
- Azure CDN

## 📝 Summary

**What Changed:**
- ❌ Removed URL input fields
- ✅ Upload directly to server
- ✅ Files stored in `/backend/public/uploads/`
- ✅ Auto-generated unique filenames
- ✅ Instant preview
- ✅ Server serves files via `/images/` route

**User Experience:**
- Click upload button → Choose file → Instant upload → See preview → Done!
- No need to use external services
- Simpler, cleaner interface

**Files are now stored locally and fully under your control! 🎉**
