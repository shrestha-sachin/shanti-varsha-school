# Shanti Varsha Angreji Ma. Vi. - School Website

A modern, responsive website for Shanti Varsha Angreji Ma. Vi. located in Vyas-5, Chapaghat, Damauli, Tanahun, Nepal.

## Tech Stack

- **React** (with Vite)
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **JavaScript** (no TypeScript)

## Features

- 🏠 **Home Page** with hero section and notice board
- 📋 **Notices & Announcements** - Dynamic notice board with localStorage
- 👥 **About Us** - Principal's message, school history, and mission
- 📸 **Gallery** - Image gallery (placeholder ready for images)
- 📞 **Contact** - Contact form and school information
- 🔐 **Admin Dashboard** - Add new notices (stored in localStorage)

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx      # Sticky navigation with mobile menu
│   ├── Footer.jsx      # Footer with address and social links
│   └── NoticeBoard.jsx # Reusable notice board component
├── pages/
│   ├── Home.jsx        # Homepage with hero and notices
│   ├── About.jsx       # About page
│   ├── Notices.jsx     # All notices page
│   ├── Gallery.jsx     # Gallery page
│   ├── Contact.jsx     # Contact page
│   └── Admin.jsx       # Admin dashboard for adding notices
├── App.jsx             # Main app with routing
├── main.jsx            # Entry point
└── index.css           # Tailwind CSS imports
```

## Color Palette

- **Deep Blue** (`#0d47a1`) - Primary color (navy)
- **Vibrant Orange-Gold** (`#ff6f00`) - Accent color (gold)
- **White** - Background and text
- Color scheme updated to match school branding

## Admin Features

The Admin Dashboard allows you to:
- Add new notices with title and date
- Notices are stored in browser localStorage
- Notices automatically appear on the homepage and notices page
- Sample notices are included on first load

## Customization

- Update school information in `Footer.jsx` and `Contact.jsx`
- Modify colors in `tailwind.config.js`
- Add actual images to the Gallery page
- Customize content in `About.jsx`

## Browser Support

Modern browsers that support ES6+ and localStorage.
