# JDAC Smart Freight - Quick Start Guide

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### 2. Clone or Navigate to Project

```bash
# If cloning from repository
git clone https://github.com/JDACCampaign/JDACSmartFreight.git
cd jdac-smart-freight

# Or navigate to existing project
cd "D:\Landing Page\JDAC Smart Freight\jdac-smart-freight"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Output:
```
> jdac-smart-freight@0.1.0 dev
> next dev

▲ Next.js 16.3.5
- Local:         http://localhost:3000
- Network:       http://192.168.x.x:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home/Landing page
│   └── admin/                # Admin dashboard pages
├── components/
│   ├── Navbar.tsx            # Navigation
│   ├── Hero.tsx              # Hero section
│   ├── FreightCalculator.tsx # Freight calculator (main feature)
│   ├── HowItWorks.tsx        # How it works section
│   ├── Benefits.tsx          # Benefits section
│   ├── Footer.tsx            # Footer
│   └── admin/                # Admin components
│       ├── AdminLayout.tsx   # Admin sidebar + layout
│       └── Dashboard.tsx     # Admin dashboard
└── styles/
    ├── variables.scss        # Color/spacing tokens
    └── globals.scss          # Global styles
```

---

## 🎯 Key Pages

### Public Pages
- **Homepage** → `http://localhost:3000/`
  - Landing page with freight calculator
  - Vendor comparison results
  - Benefits & how it works sections

### Admin Pages
- **Dashboard** → `http://localhost:3000/admin/dashboard`
  - KPI cards, recent leads table
  
- **Vendors** → `http://localhost:3000/admin/vendors`
  - Vendor management interface
  
- **Leads** → `http://localhost:3000/admin/leads`
  - Lead tracking and filtering
  
- **Campaigns** → `http://localhost:3000/admin/campaigns`
  - Campaign management with progress tracking

---

## 🛠️ Available Scripts

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

---

## 📱 Responsive Design

The site is fully responsive:
- **Mobile**: 375px (tested)
- **Tablet**: 768px (tested)
- **Desktop**: 1024px+ (tested)

Test responsive design:
1. Open DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select different devices

---

## 🎨 Customization

### Change Brand Colors
Edit `src/styles/variables.scss`:
```scss
$primary-blue: #24418D;      // Main color
$primary-orange: #F15A25;    // Accent color
```

### Add New Page
1. Create folder: `src/app/[page-name]/`
2. Add `page.tsx`:
   ```typescript
   export default function Page() {
     return <div>Your content</div>;
   }
   ```
3. Access at `http://localhost:3000/[page-name]`

### Modify Freight Calculator Form
Edit `src/components/FreightCalculator.tsx`:
- Add/remove form fields
- Update validation logic
- Modify vendor calculation

---

## 🗄️ Mock Data

Currently uses hardcoded mock data for:
- Vendors (4 vendors)
- Leads (3 sample leads)
- Campaigns (3 sample campaigns)

**Location:** 
- Vendors: `FreightCalculator.tsx` (~line 67)
- Leads: `src/app/admin/leads/page.tsx` (~line 24)
- Campaigns: `src/app/admin/campaigns/page.tsx` (~line 27)

To connect real database (Firebase):
1. Install Firebase SDK: `npm install firebase`
2. Initialize Firebase in `src/lib/firebase.ts`
3. Replace mock data with database queries

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel
```

### Deploy to Other Platforms
- **Next.js on Netlify**: [Guide](https://docs.netlify.com/integrations/frameworks/next-js)
- **Next.js on AWS**: [Guide](https://aws.amazon.com/blogs/mobile/deploying-next-js-apps-to-aws-amplify)
- **Docker Deployment**: Create `Dockerfile`

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Styles Not Loading
- Check `src/styles/globals.scss` imported in `src/app/layout.tsx`
- Verify SCSS files have `.module.scss` extension for CSS modules

### Component Not Found
- Check file path and spelling
- Ensure `export default` statement exists
- Verify path alias in `tsconfig.json`

---

## 📚 Learning Resources

- **Next.js Tutorial**: [nextjs.org/learn](https://nextjs.org/learn)
- **React Docs**: [react.dev](https://react.dev)
- **SCSS Guide**: [sass-lang.com/guide](https://sass-lang.com/guide)
- **TypeScript Handbook**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs)

---

## ✅ Testing the App

1. **Homepage**
   - ✅ Navbar displays correctly
   - ✅ Hero section shows freight calculator preview
   - ✅ Click "Calculate Freight" → opens calculator form

2. **Freight Calculator**
   - ✅ Fill form and click "CALCULATE FREIGHT"
   - ✅ See vendor comparison results
   - ✅ JDAC Smart Suggestion visible
   - ✅ Sort by different options works

3. **Admin Dashboard**
   - ✅ Navigate to `/admin` → redirects to `/admin/dashboard`
   - ✅ KPI cards display correctly
   - ✅ Click sidebar menu items → pages load
   - ✅ Tables display mock data

---

## 🤔 Common Questions

**Q: How do I change the theme color?**  
A: Edit `$primary-blue` and `$primary-orange` in `src/styles/variables.scss`

**Q: How do I add a new admin page?**  
A: Create folder `src/app/admin/[name]/page.tsx` and import `AdminLayout` component

**Q: Can I use this with a real database?**  
A: Yes! Current code uses mock data. Replace data fetching logic with your DB queries (Firebase, PostgreSQL, etc.)

**Q: How do I deploy this?**  
A: Use `vercel deploy` or any Next.js-compatible hosting (Netlify, AWS, etc.)

---

## 📞 Support

For issues:
1. Check terminal output for errors
2. Review [JDAC-PROJECT-GUIDE.md](./JDAC-PROJECT-GUIDE.md) for detailed docs
3. Check component source code for inline comments

---

**Happy Coding! 🚀**

