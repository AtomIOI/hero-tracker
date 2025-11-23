# Hero Tracker PWA

Progressive Web App version of Hero Tracker with vintage comic book aesthetic.

## Setup

1. **Install Dependencies**
   - No build process required
   - Uses Vue.js 3 from CDN

2. **Serve Locally**
   ```bash
   # Python
   python -m http.server 3000
   
   # Node.js
   npx http-server -p 3000
   
   # Or use any static file server
   ```

3. **Access**
   - Desktop: `http://localhost:3000`
   - Mobile (same network): `http://[your-ip]:3000`

## Deploy to tek Mini PC

### Option 1: Simple HTTP Server
```bash
cd /path/to/hero-tracker-pwa
python3 -m http.server 80
```

### Option 2: Nginx (Recommended)
```nginx
server {
    listen 80;
    server_name tek.local;
    root /path/to/hero-tracker-pwa;
    index index.html;
    
    location /sw.js {
        add_header Cache-Control "no-cache";
    }
    
    location /manifest.json {
        add_header Content-Type application/manifest+json;
    }
}
```

## PWA Features

- ✅ Offline support via Service Worker
- ✅ Installable to home screen
- ✅ Responsive (mobile-first)
- ✅ Touch-optimized controls
- ✅ Haptic feedback
- ✅ Web Share API
- ✅ Screen wake lock

## Icons Needed

Create the following icons and place in `assets/icons/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)  
- `icon-maskable.png` (512x512 with safe zone)

Use the vintage comic book style with bold outlines and CMYK colors.

## Project Structure

```
hero-tracker-pwa/
├── index.html          # Main app
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
├── css/
│   ├── variables.css   # CSS custom properties
│   ├── base.css        # Reset & global styles
│   ├── comic-theme.css # Comic book aesthetic
│   ├── mobile.css      # Mobile layout
│   └── desktop.css     # Desktop layout
├── js/
│   ├── app.js          # Vue app (to be created)
│   ├── storage.js      # localStorage utilities
│   └── pwa.js          # PWA manager
└── assets/
    └── icons/          # App icons
```

## Next Steps

1. Create `index.html` with responsive layout
2. Create `js/app.js` with Vue application
3. Generate PWA icons
4. Test PWA installation
5. Deploy to tek
