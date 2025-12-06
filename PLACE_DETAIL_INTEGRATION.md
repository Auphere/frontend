# Place Detail Integration - Validation Guide

## 🎯 Overview

This document explains the integration of the Place Detail page with the backend Places microservice and how to validate that everything is working correctly.

## ✅ What Was Updated

### 1. **PlaceDetail.tsx** - Main Component

- ❌ **Before**: Used `mockPlaces` data
- ✅ **After**: Uses `usePlaceDetails` React Query hook to fetch real data from backend

#### Key Changes:

```typescript
// OLD: Mock data
const place = mockPlaces.find((p) => p.id === id);

// NEW: Real API call
const { data: apiPlace, isLoading, isError } = usePlaceDetails(id || null);
const place = apiPlace ? transformAPIPlaceToDetail(apiPlace) : null;
```

### 2. **Data Transformation**

Added `transformAPIPlaceToDetail()` function that maps backend response to frontend format:

- ✅ **Photos**: Extracts `primary_photo` and `photos` array from `customAttributes`
- ✅ **Reviews**: Maps Google reviews with author, rating, text, time
- ✅ **Category**: Intelligently maps types array to frontend categories
- ✅ **Vibe**: Extracts vibes from `customAttributes`
- ✅ **Opening Hours**: Parses `weekday_text` into readable format
- ✅ **Contact Info**: Maps phone, website, email
- ✅ **Amenities**: Extracts from `customAttributes` (outdoor seating, live music, etc.)

### 3. **Loading & Error States**

- ✅ Shows spinner while fetching data
- ✅ Shows error message if request fails
- ✅ Shows "Place not found" if place doesn't exist

### 4. **Removed Temporary Features**

- 🚧 Commented out "Recommended Places" section (needs dedicated API endpoint)

## 🧪 How to Validate

### Prerequisites

1. **Backend Running**: Ensure `auphere-backend` is running on port 8000
2. **Places Service Running**: Ensure `auphere-places` Rust service is running
3. **Database Synced**: Run at least one sync command:
   ```bash
   curl -X POST http://localhost:3001/admin/sync/Zaragoza \
     -H "X-Admin-Token: your-admin-token" \
     -H "Content-Type: application/json" \
     -d '{
       "place_type": "restaurant",
       "cell_size_km": 1.5,
       "radius_m": 1000
     }'
   ```

### Test Steps

#### 1. **Navigate to Explore Page**

```
http://localhost:5173/explore
```

✅ Should see a list of places with real data from Zaragoza

#### 2. **Click on Any Place Card**

✅ Should navigate to `/place/:id` (e.g., `/place/ChIJ...`)
✅ Should see loading spinner briefly
✅ Should then load the full place detail page

#### 3. **Verify Place Details Display**

Check that the following sections render correctly:

**Header Section:**

- ✅ Place name (e.g., "Restaurante Verallia")
- ✅ Address and neighborhood
- ✅ Rating with review count
- ✅ "Open Now" badge (if applicable)
- ✅ Category and vibe badges

**Photo Gallery:**

- ✅ Primary photo displays (or placeholder if none)
- ✅ Photo carousel works (if multiple photos)

**About Section:**

- ✅ Description text displays

**Atmosphere Section:**

- ✅ Crowd level (moderate, busy, etc.)
- ✅ Music type (ambient, live, etc.)

**Contact Section (Desktop Sidebar / Mobile Inline):**

- ✅ Phone number (if available)
- ✅ Website link (if available)
- ✅ Email (if available)
- ✅ Social media links (if available)

**Opening Hours:**

- ✅ Weekly hours displayed by day
- ✅ Proper formatting (e.g., "Monday: 9:00 AM – 10:00 PM")

**Reviews Section:**

- ✅ Google reviews display (if available)
- ✅ Author name, rating, date, comment
- ✅ Review avatars (if available)

**Action Buttons:**

- ✅ "Get Directions" button
- ✅ "Call" button (if phone available)
- ✅ "Visit Website" button (if website available)
- ✅ "Add to Evening Plan" card with link to `/planner`

#### 4. **Test Error Scenarios**

**Invalid Place ID:**

```
http://localhost:5173/place/invalid-id-123
```

✅ Should show "Place not found" message
✅ "Back to Explore" button works

**Backend Down:**

- Stop the backend service
- Navigate to any place detail
  ✅ Should show "Error loading place" message
  ✅ "Back to Explore" button works

#### 5. **Test Navigation**

**From Detail Back to Explore:**

- Click "Back" button in place detail
  ✅ Should navigate back to `/explore`
  ✅ Previous scroll position maintained (if using infinite scroll)

**From Explore to Detail Multiple Times:**

- Click different place cards
  ✅ Each should load correctly
  ✅ Data should be cached (React Query)
  ✅ Subsequent loads should be instant

## 📊 Expected Data Flow

```
1. User clicks PlaceCard in Explore
   ↓
2. Navigation to /place/:id
   ↓
3. usePlaceDetails hook triggers
   ↓
4. GET /api/v1/places/:id
   ↓
5. Backend calls Rust microservice
   ↓
6. GET http://localhost:3001/places/:id
   ↓
7. Rust service queries PostgreSQL
   ↓
8. Data returned with photos, reviews, etc.
   ↓
9. transformAPIPlaceToDetail() formats data
   ↓
10. PlaceDetail component renders
```

## 🐛 Common Issues & Solutions

### Issue 1: "Place not found" for all places

**Cause**: Backend not connected to Rust service
**Solution**:

1. Check `.env` in `auphere-backend`:
   ```env
   PLACES_SERVICE_URL=http://localhost:3001
   ```
2. Ensure Rust service is running: `cargo run` in `auphere-places`

### Issue 2: Photos not displaying

**Cause**: Photo references not in database OR Google API key issues
**Solution**:

1. Check if places have photos: Query database `SELECT custom_attributes->>'photos' FROM places;`
2. Verify Google Places API is enabled and has quota
3. Fallback placeholder image will show if no photos available

### Issue 3: Reviews not showing

**Cause**: Reviews not synced from Google
**Solution**:

1. Check sync command includes reviews
2. Verify `custom_attributes->>'reviews'` in database
3. May need to re-sync with updated schema

### Issue 4: Loading spinner never stops

**Cause**: Backend/Rust service not responding
**Solution**:

1. Check backend logs: `uvicorn app.main:app --reload`
2. Check Rust logs: Look for errors in terminal
3. Verify network connectivity between services

## 🔄 Testing Checklist

Use this checklist to validate the integration:

- [ ] Explore page loads places
- [ ] Clicking a place card navigates to detail
- [ ] Place detail shows loading spinner
- [ ] Place name and address display
- [ ] Rating and review count display
- [ ] Photos load (or placeholder shows)
- [ ] Vibe badges display
- [ ] Opening hours show correctly
- [ ] Contact information displays (if available)
- [ ] Action buttons are clickable
- [ ] "Back" button returns to Explore
- [ ] Invalid place ID shows error message
- [ ] Network errors are handled gracefully
- [ ] Multiple place details can be viewed in succession
- [ ] Browser back/forward buttons work
- [ ] Deep linking to place detail works (refresh page)

## 📝 Notes for Future Development

### Recommended Places

Currently commented out. To implement:

1. Create endpoint: `GET /api/v1/places/:id/recommendations`
2. Implement similarity algorithm (same category, vibe, neighborhood)
3. Uncomment `<RecommendedPlaces />` in PlaceDetail.tsx

### Real-time Updates

Consider implementing:

1. WebSocket for live crowd level updates
2. Real-time status messages ("Live music starting in 30 min")
3. Current wait times

### Enhanced Photos

Future improvements:

1. Full-screen photo viewer
2. User-uploaded photos
3. Photo credits/attributions from Google
4. 360° photos integration

## 🎉 Success Criteria

✅ **Integration is successful when:**

1. All places from Explore are accessible via detail page
2. All data sections render without errors
3. Loading and error states work correctly
4. Navigation flows smoothly
5. No console errors in browser
6. Performance is acceptable (<2s load time)

## 📞 Support

If you encounter issues not covered here:

1. Check browser console for errors
2. Check backend logs (`uvicorn`)
3. Check Rust service logs (`cargo run`)
4. Verify database has data (`psql` or GUI)
5. Ensure all environment variables are set correctly
