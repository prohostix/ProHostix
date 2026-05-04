# Top Clients Feature

## Overview
Added a "Top Clients" section to the homepage that displays client logos in a grid layout. The feature includes a full admin panel for managing client logos.

## What Was Added

### 1. Database Model
- **File**: `lib/models/Client.js`
- **Fields**:
  - `name`: Client name (required)
  - `logo`: Base64 encoded logo image (required)
  - `website`: Optional client website URL
  - `order`: Display order (for sorting)
  - `active`: Boolean to show/hide clients
  - `description`: Optional client description

### 2. API Routes
- **GET/POST** `/api/clients` - List all clients / Create new client
- **GET/PUT/DELETE** `/api/clients/[id]` - Get/Update/Delete specific client
- **POST** `/api/upload/client-logo` - Upload client logo (converts to base64)

### 3. Admin Panel
- **File**: `components/admin/dashboard/Clients.tsx`
- **Features**:
  - Grid view of all clients
  - Add/Edit/Delete clients
  - Upload logos (converted to base64)
  - Set display order
  - Toggle active/inactive status
  - Add website links and descriptions

### 4. Frontend Component
- **File**: `components/home/TopClients.tsx`
- **Features**:
  - Responsive grid layout (2-6 columns based on screen size)
  - Grayscale logos that become colored on hover
  - Clickable logos (if website URL provided)
  - Tooltip showing client name on hover
  - Only displays active clients
  - Auto-hides if no clients exist

### 5. Integration
- **Updated**: `app/(site)/HomeClient.tsx`
  - Added `<TopClients />` component after `<PioneerWork />`
  - Section appears between "Featured Client Work" and "Latest Insights"

- **Updated**: `app/admin/dashboard/page.tsx`
  - Added "Top Clients" menu item with Building2 icon
  - Integrated Clients component into admin dashboard

### 6. Seed Data
- **Updated**: `scripts/masterSeed.js`
  - Added 6 sample clients with placeholder logos
  - Clients are seeded automatically on `npm run seed`

## How to Use

### Admin Panel
1. Navigate to Admin Dashboard
2. Click "Top Clients" in the sidebar
3. Click "Add Client" to create a new client
4. Upload logo, enter name, and optional details
5. Set display order and active status
6. Save

### Frontend Display
- Clients automatically appear on the homepage
- Only active clients are shown to public users
- Logos are displayed in a responsive grid
- Hover effects provide visual feedback

## Technical Details

### Authentication
- All admin endpoints require authentication
- Uses existing `protect` and `admin` middleware
- Public GET endpoint shows only active clients

### Image Handling
- Logos are converted to base64 and stored in MongoDB
- Follows the same pattern as other image uploads in the project
- No external blob storage required

### Styling
- Matches existing ProHostix design system
- Uses emerald accent color
- Responsive grid with Tailwind CSS
- Framer Motion animations

## Files Modified/Created

### Created:
- `lib/models/Client.js`
- `lib/controllers/clientController.js`
- `app/api/clients/route.ts`
- `app/api/clients/[id]/route.ts`
- `app/api/upload/client-logo/route.ts`
- `components/admin/dashboard/Clients.tsx`
- `components/home/TopClients.tsx`

### Modified:
- `app/(site)/HomeClient.tsx`
- `app/admin/dashboard/page.tsx`
- `scripts/masterSeed.js`
- `lib/controllers/uploadController.js`

## Testing
1. Run `npm run seed` to populate sample clients
2. Start dev server: `npm run dev`
3. Visit homepage to see client logos
4. Login to admin panel to manage clients
5. Test CRUD operations (Create, Read, Update, Delete)

## Future Enhancements
- Drag-and-drop reordering
- Bulk upload
- Client categories/tags
- Analytics tracking for client logo clicks
- Client testimonials integration
