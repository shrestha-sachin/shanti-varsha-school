# Public Assets Folder

This folder contains static assets that are served directly by Vite. Files in this folder are accessible at the root path.

## Folder Structure

### `/logos/`
Place your school logo here.

**Usage:**
- Add your logo as `logo.png` (or `logo.jpg`, `logo.svg`)
- The Navbar component will automatically use it
- Recommended format: PNG with transparent background
- Recommended size: 200x200px or similar square dimensions

**Example:**
```
/logos/logo.png
```

### `/images/`
Place general images here (hero backgrounds, banners, etc.).

**Usage:**
- Hero background: Add as `hero-background.jpg` for the homepage hero section
- Access in code: `/images/your-image.jpg`
- Recommended formats: JPG for photos, PNG for graphics with transparency

**Example:**
```
/images/hero-background.jpg
/images/banner.jpg
```

### `/gallery/`
Place gallery images here.

**Usage:**
1. Add your images to this folder (e.g., `gallery1.jpg`, `gallery2.jpg`)
2. Update the `galleryImages` array in `src/pages/Gallery.jsx` with your image filenames
3. Images will automatically display in the gallery

**Example:**
```
/gallery/gallery1.jpg
/gallery/gallery2.jpg
/gallery/gallery3.jpg
```

Then in `Gallery.jsx`:
```javascript
const galleryImages = [
  'gallery1.jpg',
  'gallery2.jpg',
  'gallery3.jpg',
]
```

## How to Reference Images

In your React components, reference images from the public folder using absolute paths starting with `/`:

```jsx
// Logo
<img src="/logos/logo.png" alt="School Logo" />

// General images
<img src="/images/hero-background.jpg" alt="Hero" />

// Gallery images
<img src="/gallery/image1.jpg" alt="Gallery" />
```

## Image Optimization Tips

- **Logos**: Use PNG format with transparent background, optimize size (under 100KB)
- **Photos**: Use JPG format, optimize for web (recommended: 1200px width max)
- **Gallery**: Resize images to 800x600px or 1200x900px for best performance
- Use tools like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/) to compress images

## Notes

- Files in the `public` folder are copied as-is during build
- Changes to files in `public` require a server restart to see updates
- The `.gitkeep` files ensure empty folders are tracked by Git
