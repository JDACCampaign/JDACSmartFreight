# JDAC Smart Freight - Project Guide

## 🎯 Overview

**JDAC** is a premium, modern logistics aggregator platform designed for **Surface Cargo** rate comparison. It enables businesses to compare freight rates from multiple vendors and make informed shipping decisions.

**Brand:** THE LOGISTICS AGGREGATOR  
**Primary Colors:** JDAC Blue (#24418D), JDAC Orange (#F15A25)  
**Tech Stack:** Next.js 16.3, React, TypeScript, SCSS, Tailwind CSS

---

## 📦 Current Product Scope

### Surface Cargo Only
- Road freight transportation
- **No Air, Rail, or Sea cargo** in current UI
- Future-ready architecture for expanding modes

### Supported Cargo Types
- Furniture
- Spare Parts
- Garments
- Electronics
- General Cargo
- Other

---

## 🚀 Key Features

### Public Landing Page (/)

#### 1. **Hero Section**
- Main headline: "Compare Surface Cargo Rates. Choose the Right Vendor"
- Quick calculator preview (From/To/Weight)
- CTA buttons: "Calculate Freight" and "Explore How It Works"
- Background visual showing vendor comparison preview

#### 2. **Freight Calculator**
- 8-input form:
  - From/To (City + Pincode)
  - Cargo Type (dropdown)
  - Weight (KG)
  - Dimensions (L × W × H)
  - Number of Pieces
  - Pickup Type (Door Pickup / Drop-off)
  - Delivery Requirement (Standard / Express)

#### 3. **Freight Results**
- Vendor comparison cards sorted by price (default: Low → High)
- Sort options: Price (both ways), Fastest, Best Value, New Vendors
- Each vendor card shows:
  - Price (₹)
  - Service type (Surface Cargo)
  - Delivery time
  - Status badge (Lowest Price, Best Value, Fastest, New Vendor)
  - Rating (when available)
  - "Choose Vendor" CTA

#### 4. **JDAC Smart Suggestion**
- AI-powered vendor recommendation based on:
  - Price
  - Delivery time
  - Serviceability
  - Cargo type & weight
  - Customer requirements
- Highlighted card with orange border
- Explanation: "Best balance of price and delivery time for this shipment"

#### 5. **How It Works**
- 4-step process visualization:
  1. Enter Shipment Details
  2. Compare Freight Rates
  3. Choose Your Vendor
  4. Get Quote / Book Shipment

#### 6. **Why Use JDAC? (Benefits Section)**
- 6 benefit cards with emojis:
  - Better Price Visibility
  - Multiple Vendors
  - Smart Recommendations
  - Faster Decision Making
  - Transparent Comparison
  - Growing Vendor Network

#### 7. **Footer**
- JDAC branding
- Navigation links (How It Works, Benefits, Freight Calculator)
- Company links (About, Contact, Blog)
- Legal links (Privacy Policy, Terms, Cookie Policy)
- CTA: "Calculate Freight"

---

## 🎛️ Admin Dashboard (/admin)

### Sidebar Navigation
- Dashboard
- Vendors
- Freight Rates
- Routes
- Leads
- Campaigns
- Customers
- Analytics
- Settings

### Dashboard Page (/admin/dashboard)
**6 KPI Cards:**
- Total Leads: 127
- Qualified Leads: 64
- Freight Calculations: 214
- Quotes Generated: 89
- Bookings: 32
- Conversion Rate: 25.2%

**Chart Placeholders:**
- Leads by Campaign
- Leads by City
- Leads by Cargo Type
- Quote-to-Booking Conversion

**Recent Leads Table:**
- Lead ID, Name, Business, Route, Weight, Vendor, Campaign, Status, Date

### Vendor Management (/admin/vendors)
**Features:**
- Add new vendors
- View vendor details
- Vendor ratings and performance metrics
- Status badges (Active, Inactive, New)
- Quick actions: Edit, View Rates

**Table Columns:**
- Vendor Name
- Email
- Phone
- Routes Serviced
- Rating
- Status
- Actions

**Mock Data:** 4 vendors (A, B, C, + New Vendor)

### Lead Management (/admin/leads)
**Features:**
- Filter by status (All, New, Contacted, Qualified, Converted)
- View complete lead information
- Track lead lifecycle

**Table Columns:**
- Lead ID
- Name, Business, Phone
- Route (From → To)
- Cargo Type & Weight
- Selected Vendor
- Campaign Attribution
- Lead Status
- Date Created

**Status Badges:**
- New (Blue)
- Contacted (Orange)
- Qualified (Green)
- Converted (Green)

### Campaign Management (/admin/campaigns)
**Features:**
- Create new campaigns
- Set lead goals
- Track campaign progress
- Campaign status tracking (Draft, Active, Paused, Completed)

**Campaign Card Shows:**
- Campaign Name
- From/To locations
- Lead progress bar (e.g., 127/500)
- Status badge
- Actions: Edit, View Leads

**Mock Data:** 3 campaigns (Pune Furniture, Mumbai Logistics, Chennai Trade)

### Placeholder Pages (Coming Soon)
- Freight Rates
- Routes
- Customers
- Analytics
- Settings

---

## 🎨 Design System

### Color Palette
```
Primary Blue:    #24418D (Main actions, links)
Primary Orange:  #F15A25 (CTAs, highlights, recommendations)
White:          #FFFFFF
Light BG:       #F7F9FC
Dark Text:      #1A1A1A
Light Text:     #4A4A4A
Success:        #10B981
Warning:        #F59E0B
Error:          #EF4444
```

### Typography
- Font: System UI (-apple-system, Segoe UI, etc.)
- Sizes: 12px (xs) → 40px (4xl)
- Weights: 400 (regular) → 700 (bold)

### Spacing
- Base unit: 8px (sm: 4px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px)

### Border Radius
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- 2xl: 24px

### Shadows
- sm: subtle drop shadow
- md: medium elevation
- lg: prominent lift
- xl: maximum emphasis

---

## 🏗️ Project Structure

```
jdac-smart-freight/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page (landing)
│   │   ├── globals.css         # Reset CSS
│   │   └── admin/
│   │       ├── page.tsx        # Redirect to dashboard
│   │       ├── dashboard/
│   │       ├── vendors/
│   │       ├── leads/
│   │       ├── campaigns/
│   │       ├── rates/
│   │       ├── routes/
│   │       ├── customers/
│   │       ├── analytics/
│   │       └── settings/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Navbar.module.scss
│   │   ├── Hero.tsx
│   │   ├── Hero.module.scss
│   │   ├── FreightCalculator.tsx
│   │   ├── FreightCalculator.module.scss
│   │   ├── HowItWorks.tsx
│   │   ├── HowItWorks.module.scss
│   │   ├── Benefits.tsx
│   │   ├── Benefits.module.scss
│   │   ├── Footer.tsx
│   │   ├── Footer.module.scss
│   │   └── admin/
│   │       ├── AdminLayout.tsx
│   │       ├── AdminLayout.module.scss
│   │       ├── Dashboard.tsx
│   │       └── Dashboard.module.scss
│   └── styles/
│       ├── variables.scss       # Color, size, spacing tokens
│       └── globals.scss         # Global styles, utilities
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## 🔧 Setup & Running

### Prerequisites
- Node.js 18+ (installed via winget)
- npm or yarn

### Installation
```bash
cd jdac-smart-freight
npm install
```

### Development Server
```bash
npm run dev
# Runs on http://localhost:3000
```

### Build for Production
```bash
npm run build
npm run start
```

### Lint & Format
```bash
npm run lint
```

---

## 💻 Key Component Files

### Landing Page Components
- `Navbar.tsx` - Navigation bar with logo and CTAs
- `Hero.tsx` - Hero section with quick calculator
- `FreightCalculator.tsx` - Full freight calculator form + results
- `HowItWorks.tsx` - 4-step process section
- `Benefits.tsx` - 6-card benefits section
- `Footer.tsx` - Footer with links and CTA

### Admin Components
- `AdminLayout.tsx` - Sidebar navigation + main content wrapper
- `Dashboard.tsx` - KPI cards and recent leads table

### Pages
- `src/app/page.tsx` - Main landing page (uses all components)
- `src/app/admin/dashboard/page.tsx` - Admin dashboard
- `src/app/admin/vendors/page.tsx` - Vendor management
- `src/app/admin/leads/page.tsx` - Lead management
- `src/app/admin/campaigns/page.tsx` - Campaign management

---

## 🗄️ Mock Data Structure

### Vendors
```typescript
interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  routes: number;
  rating?: number;
  status: 'active' | 'inactive' | 'new';
}
```

### Leads
```typescript
interface Lead {
  id: string;
  name: string;
  business: string;
  phone: string;
  route: string;
  cargo: string;
  weight: string;
  vendor: string;
  campaign: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  date: string;
}
```

### Campaigns
```typescript
interface Campaign {
  id: string;
  name: string;
  target: string;      // From city
  destination: string; // To city
  leads: number;       // Current lead count
  goal: number;        // Target lead count
  status: 'draft' | 'active' | 'paused' | 'completed';
  progress: number;    // Percentage
}
```

---

## 🔄 User Flows

### Flow 1: Freight Calculation (Visitor)
1. Land on homepage
2. Click "Calculate Freight"
3. Fill in shipment details (From, To, Cargo Type, Weight, Dimensions, Pickup, Delivery)
4. Click "Calculate Freight"
5. View vendor results sorted by Price (Low → High)
6. See JDAC Smart Suggestion
7. Sort/filter results
8. Click "Choose Vendor"

### Flow 2: Lead Generation
1. Customer completes freight calculation
2. System captures lead data (Location, Cargo Type, Weight, Selected Vendor)
3. Campaign attribution runs (matches customer to active campaign)
4. Lead created and visible in Admin Dashboard
5. Vendor selection tracked for conversion analytics

### Flow 3: Admin Vendor Management
1. Admin logs into /admin
2. Navigate to Vendors
3. View all vendors with ratings
4. Add new vendor
5. Edit vendor details
6. Set freight rates for each vendor

### Flow 4: Admin Campaign Tracking
1. Admin navigates to Campaigns
2. Create campaign (target city, destination, lead goal)
3. Campaign appears in grid with progress bar
4. Leads matching campaign criteria auto-attributed
5. Track conversion: Leads → Quotes → Bookings

---

## 🔮 Future Enhancements

### Phase 1 (Current)
- ✅ Surface Cargo UI & Calculator
- ✅ Vendor Comparison
- ✅ Admin Dashboard (MVP)
- ✅ Lead Management

### Phase 2
- 🚧 Database Integration (Firebase/Firestore)
- 🚧 Real freight rate calculations
- 🚧 User authentication (Admin panel)
- 🚧 Email notifications for leads
- 🚧 WhatsApp integration for lead updates

### Phase 3
- 📋 Add Air Cargo mode
- 📋 Add Rail & Sea Cargo modes
- 📋 Advanced analytics dashboards
- 📋 Vendor rating system
- 📋 Insurance integrations

### Phase 4
- 📋 API integrations (vendor systems)
- 📋 Real-time tracking
- 📋 Multi-vendor booking
- 📋 Invoice management
- 📋 Customer portal

---

## 🛠️ Development Notes

### Adding a New Admin Page
1. Create folder: `src/app/admin/[section]/`
2. Create `page.tsx` with `'use client'` directive
3. Create `[section].module.scss`
4. Import and use `AdminLayout` component
5. Add menu item to `AdminLayout.tsx`

### Styling Best Practices
- Use SCSS variables from `src/styles/variables.scss`
- Use CSS modules for component-scoped styles
- Use utility classes from `src/styles/globals.scss` for common patterns
- Always include responsive breakpoints

### Component Pattern
```typescript
'use client';
import styles from './Component.module.scss';

export default function Component() {
  return (
    <div className={styles.container}>
      {/* Content */}
    </div>
  );
}
```

---

## 📊 Analytics & Metrics Tracked

### Lead Metrics
- Total Leads
- Leads by Status (New, Contacted, Qualified, Converted)
- Leads by Campaign
- Leads by City
- Leads by Cargo Type
- Lead Source (Freight Calculator, Direct, API, etc.)

### Conversion Metrics
- Quote-to-Booking Conversion Rate
- Lead Quality Score
- Vendor Selection Frequency
- Average Time to Quote

### Campaign Metrics
- Lead Goal vs. Actual
- Cost per Lead
- Campaign ROI
- Lead Status Breakdown by Campaign

---

## 🚨 Important Notes

### Surface Cargo Only
- Do NOT add Air, Rail, Sea in current UI
- Architecture supports future additions without UI changes
- Cargo Type enum can be extended when adding new modes

### Vendor Recommendation Logic
- Currently mocked (Vendor A always recommended)
- Should be replaced with configurable business rules:
  - Price weight (40%)
  - Delivery time weight (35%)
  - Serviceability/rating weight (25%)
- Rules should be configurable in admin settings

### Responsive Design
- Mobile: 375px viewport
- Tablet: 768px viewport
- Desktop: 1024px+ viewport
- All pages tested and working on all breakpoints

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [SCSS Docs](https://sass-lang.com/documentation)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

---

## 🤝 Support

For issues or questions about this project:
1. Check existing code patterns
2. Review component examples
3. Refer to this documentation
4. Check inline code comments

---

**Last Updated:** September 21, 2025  
**Version:** 1.0.0 (MVP - Public Landing Page + Admin Dashboard)  
**Status:** ✅ Live & Tested
