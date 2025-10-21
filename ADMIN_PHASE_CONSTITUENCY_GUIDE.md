# Admin Panel - Phase & Constituency Management Guide

## Overview
The admin panel now includes comprehensive phase management and constituency management features with full integration.

## 🎯 New Features

### 1. **Enhanced Phase Management**
- **View All Phases**: See all election phases with detailed information
- **Constituency Count**: Each phase now displays the number of constituencies assigned to it
- **Quick Navigation**: Click "View All" on a phase to see all constituencies in that phase
- **Phase Details**:
  - Phase Number
  - Voting Date
  - Result Date
  - Status (Upcoming, Voting, Completed)
  - 48-hour blackout period details
  - **Constituency Count** (NEW)

### 2. **New Constituencies Tab**
A dedicated tab for managing all constituencies with:

#### **Filter & Search**
- Filter by Election Phase (Phase 1, Phase 2, or Unassigned)
- Filter by District
- Search by constituency name or seat number

#### **Summary Statistics**
- Total constituencies count
- Phase 1 constituencies count
- Phase 2 constituencies count
- Reserved constituencies count

#### **Constituency Information Display**
Each constituency shows:
- Seat Number
- Name (Hindi)
- Name (English)
- District
- Assigned Phase
- Reservation Status (SC/ST/Women)

#### **Actions Available**
- **Add**: Create new constituencies
- **Edit**: Update constituency details
- **Delete**: Remove constituencies (with validation)

### 3. **Add/Edit Constituency Modal**
Complete form for managing constituencies:

**Fields:**
- Seat Number (required)
- District (required, dropdown)
- Name in Hindi (required)
- Name in English (required)
- Election Phase (optional, dropdown showing all phases)
- Reserved Constituency (checkbox)
  - If checked, select type: SC/ST/Women

**Validation:**
- Seat number must be unique
- All required fields must be filled
- Cannot delete constituency with candidates

## 🗄️ Database Structure

### Constituencies Table
```sql
CREATE TABLE Constituencies (
    id INT PRIMARY KEY,
    seat_no INT UNIQUE,
    name_hindi VARCHAR(255),
    name_english VARCHAR(255),
    district_id INT,
    phase_id INT (nullable),
    is_reserved TINYINT(1),
    reservation_type VARCHAR(10), -- 'SC', 'ST', 'Women'
    FOREIGN KEY (district_id) REFERENCES Districts(id),
    FOREIGN KEY (phase_id) REFERENCES Election_Phases(id)
)
```

## 🔌 API Endpoints

### New Endpoints Added

#### Get All Constituencies with Phase Info
```
GET /api/admin/constituencies
Headers: Authorization: Bearer {token}
Response: Array of constituencies with district and phase details
```

#### Add New Constituency
```
POST /api/admin/constituencies
Headers: Authorization: Bearer {token}
Body: {
  seat_no: number,
  name_hindi: string,
  name_english: string,
  district_id: number,
  phase_id: number | null,
  is_reserved: boolean,
  reservation_type: string | null
}
```

#### Update Constituency
```
PUT /api/admin/constituencies/:id
Headers: Authorization: Bearer {token}
Body: Same as POST
```

#### Delete Constituency
```
DELETE /api/admin/constituencies/:id
Headers: Authorization: Bearer {token}
Note: Will fail if constituency has candidates
```

#### Get All Districts
```
GET /api/admin/districts
Headers: Authorization: Bearer {token}
Response: Array of districts
```

#### Get Phases with Constituency Count
```
GET /api/admin/phases
Headers: Authorization: Bearer {token}
Response: Array of phases with constituency_count field
```

## 📊 Current Database Status

### Bihar Election 2025 - Phase Distribution

**Phase 1** - Voting: November 6, 2025
- **121 Constituencies** covering:
  - Madhepura, Saharsa, Darbhanga, Muzaffarpur
  - Gopalganj, Siwan, Saran, Vaishali
  - Samastipur, Begusarai, Khagaria, Munger
  - Lakhisarai, Sheikhpura, Nalanda, Patna
  - Bhojpur, Buxar districts

**Phase 2** - Voting: November 11, 2025
- **122 Constituencies** covering:
  - West Champaran, East Champaran, Sheohar
  - Sitamarhi, Madhubani, Supaul, Araria
  - Kishanganj, Purnia, Katihar, Bhagalpur
  - Banka, Kaimur, Rohtas, Arwal
  - Jehanabad, Aurangabad, Gaya, Nawada, Jamui districts

**Total: 243 Constituencies** (All assigned to phases)

## 🎨 UI Features

### Phase Card Enhancement
- Shows constituency count badge
- "View All" button filters constituencies by phase
- Color-coded status badges
- Blackout period warnings

### Constituencies Table
- Sortable by seat number
- Color-coded phase badges (Blue for Phase 1, Purple for Phase 2)
- Orange badges for reserved constituencies
- Gray badge for unassigned constituencies
- Responsive design with hover effects

### Filters & Search
- Real-time filtering
- Multiple filter combinations
- Instant search results
- Clear filter states

## 🔒 Permission Requirements

All constituency management operations require:
- Admin authentication
- Super Admin role for Add/Edit/Delete operations
- Regular admins can view only

## 🚀 Usage Workflow

### To Add a New Constituency:
1. Go to Admin Dashboard
2. Click on "Constituencies" tab
3. Click "Add Constituency" button
4. Fill in the form:
   - Enter seat number (unique)
   - Select district
   - Enter names in Hindi and English
   - Optionally assign to a phase
   - Mark as reserved if applicable
5. Click "Add Constituency"

### To Assign Constituencies to Phases:
1. Go to "Constituencies" tab
2. Click "Edit" on any constituency
3. Select the desired phase from dropdown
4. Click "Update Constituency"

### To View Phase-Specific Constituencies:
1. Go to "Election Phases" tab
2. Click "View All" on any phase card
3. Automatically switches to Constituencies tab with phase filter applied

## 📱 Responsive Design

- Desktop: Full table layout with all columns
- Tablet: Responsive grid with scroll
- Mobile: Stacked cards (optimized for touch)

## 🔄 Real-time Updates

All changes are reflected immediately:
- Add constituency → Updates count in phase cards
- Edit phase assignment → Updates filters
- Delete constituency → Updates statistics

## 🎯 Key Benefits

1. **Complete Phase Visibility**: See exactly which constituencies are in each phase
2. **Easy Management**: Add, edit, delete constituencies with validation
3. **Flexible Assignment**: Assign/reassign constituencies to phases anytime
4. **Comprehensive Filtering**: Find constituencies quickly
5. **Data Integrity**: Validation prevents conflicts and errors
6. **ECI Compliance**: Proper phase management ensures compliance

## 📝 Notes

- All 243 Bihar constituencies are already loaded in the database
- Both phases are currently set to "Upcoming" status
- Blackout periods are automatically calculated (48 hours before voting)
- Reserved constituencies properly marked with SC/ST/Women types

## 🐛 Error Handling

- Duplicate seat numbers prevented
- Required field validation
- Cannot delete constituencies with candidates
- Network error handling with user-friendly messages
- Loading states for all operations

---

**Last Updated**: October 16, 2025
**Version**: 1.0.0
