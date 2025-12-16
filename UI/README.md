# Partner Portal UI

Enterprise Partner Portal built with React, TypeScript, Vite, and Tailwind CSS.

## Design System

### Theme: Enterprise Modern
- Clean, Professional, Data-Rich interface
- High contrast for readability
- Subtle shadows for depth
- Rounded corners for modern feel

### Color Palette
- **Primary**: `#1E40AF` (Royal Blue) - Key actions & Sidebar
- **Background**: `#F1F5F9` (Cool Gray) - Page background
- **Surface**: `#FFFFFF` (White) - Cards & Containers
- **Text Main**: `#1E293B` (Deep Slate) - Headings & Body
- **Text Muted**: `#64748B` (Gray) - Meta-data & IDs
- **Status Success**: `#10B981` (Green)
- **Status Error**: `#EF4444` (Red)
- **Status Warning**: `#F59E0B` (Amber)

### Typography & Spacing
- **Font**: Inter, sans-serif
- **Scale**: 14px (Base), 12px (Small/Meta), 18px (Card Titles)
- **Grid**: 12-column system, 24px gutter
- **Border Radius**: 12px (Cards), 8px (Buttons/Inputs)

### Core Layout
- **Navigation**: Vertical Sidebar (Left), fixed 260px, Primary Blue
- **Top Bar**: Global Search, User Profile, Notifications
- **Main Content**: Multi-column dashboard grid

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Navigate to UI directory
cd UI

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server
The app will run on `http://localhost:3000`

## Project Structure

```
UI/
├── src/
│   ├── components/
│   │   └── Layout/
│   │       ├── Layout.tsx       # Main layout wrapper
│   │       ├── Sidebar.tsx      # Left navigation
│   │       └── TopBar.tsx       # Top search & user bar
│   ├── pages/
│   │   └── Dashboard.tsx        # Dashboard page
│   ├── App.tsx                  # App router
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles + Tailwind
├── index.html
├── package.json
├── tailwind.config.js           # Design system config
├── tsconfig.json
└── vite.config.ts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- **React 18.2** - UI Framework
- **TypeScript 5.2** - Type safety
- **Vite 5.0** - Build tool
- **Tailwind CSS 3.3** - Styling
- **React Router 6.20** - Routing
- **Axios 1.6** - HTTP client
- **Lucide React 0.294** - Icons
- **Recharts 2.10** - Charts
- **date-fns 2.30** - Date utilities

## Next Steps

1. Implement API integration with backend service
2. Add authentication & authorization
3. Create additional pages (Customers, Consultations, Knowledge Base, etc.)
4. Implement charts with Recharts
5. Add form validation and error handling
