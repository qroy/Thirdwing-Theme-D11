# Thirdwing D11 Theme

A modern, responsive Drupal 11 theme for thirdwing.nl that combines the classic Thirdwing design elements with contemporary web standards and accessibility best practices.

## Features

### Design & Layout
- **Responsive Design**: Mobile-first approach with breakpoints at 768px, 1024px, and 1200px
- **Flexible Grid System**: CSS Grid-based layout with support for multiple sidebar configurations
- **Modern Typography**: System font stack with optimized readability
- **Color System**: CSS custom properties with support for dark mode and high contrast

### Navigation
- **Mobile-First Navigation**: Collapsible hamburger menu for mobile devices
- **Accessible Menus**: Full keyboard navigation and screen reader support
- **Multi-level Menus**: Support for dropdown submenus with hover and focus states
- **Skip Links**: Built-in accessibility navigation

### Performance
- **Optimized Assets**: Minified CSS and JavaScript with smart loading
- **Critical CSS**: Above-the-fold styling inlined for faster rendering
- **Progressive Enhancement**: Works without JavaScript, enhanced with it
- **PWA Ready**: Service worker and manifest configuration included

### Accessibility
- **WCAG 2.1 AA Compliant**: Meets modern accessibility standards
- **Keyboard Navigation**: Full keyboard support throughout the interface
- **Screen Reader Optimized**: Proper ARIA labels and semantic markup
- **High Contrast Support**: Automatic adaptation for high contrast preferences
- **Focus Management**: Clear focus indicators and logical tab order

### Developer Experience
- **Modular CSS**: Component-based architecture with CSS custom properties
- **Twig Templates**: Clean, maintainable template structure
- **Theme Hooks**: Comprehensive preprocessing and suggestion functions
- **Documentation**: Well-documented code with inline comments

## Installation

1. Download the theme files to your Drupal 11 site's themes directory:
   ```
   themes/custom/thirdwing/
   ```

2. Enable the theme in Drupal:
   ```bash
   drush theme:enable thirdwing
   drush config:set system.theme default thirdwing
   ```

3. Clear the cache:
   ```bash
   drush cache:rebuild
   ```

## File Structure

```
thirdwing/
├── assets/
│   ├── css/
│   │   ├── base/
│   │   │   ├── normalize.css
│   │   │   └── typography.css
│   │   ├── layout/
│   │   │   ├── layout.css
│   │   │   └── grid.css
│   │   ├── components/
│   │   │   ├── navigation.css
│   │   │   ├── buttons.css
│   │   │   ├── forms.css
│   │   │   ├── messages.css
│   │   │   ├── tabs.css
│   │   │   ├── breadcrumb.css
│   │   │   ├── blocks.css
│   │   │   ├── content.css
│   │   │   ├── sidebar.css
│   │   │   ├── footer.css
│   │   │   ├── header.css
│   │   │   └── user.css
│   │   ├── theme/
│   │   │   ├── colors.css
│   │   │   └── print.css
│   │   └── responsive/
│   │       ├── mobile.css
│   │       ├── tablet.css
│   │       └── desktop.css
│   ├── js/
│   │   ├── thirdwing.js
│   │   └── navigation.js
│   ├── images/
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── apple-touch-icon.png
│   │   └── og-image.jpg
│   ├── manifest.json
│   └── sw.js
├── templates/
│   ├── html.html.twig
│   ├── page.html.twig
│   ├── node.html.twig
│   ├── block.html.twig
│   ├── menu.html.twig
│   ├── breadcrumb.html.twig
│   ├── comment.html.twig
│   └── field.html.twig
├── thirdwing.info.yml
├── thirdwing.libraries.yml
├── thirdwing.theme
├── thirdwing.breakpoints.yml
├── screenshot.png
└── README.md
```

## Configuration

### Color Customization

The theme uses CSS custom properties for easy color customization. Edit `assets/css/theme/colors.css`:

```css
:root {
  --color-primary: #3c329b;       /* Purple - main brand color */
  --color-secondary: #eb7314;     /* Orange - accent color */
  --color-accent: #aad563;        /* Green - success/accent */
  /* Add your custom colors here */
}
```

### Breakpoints

Responsive breakpoints are defined in `thirdwing.breakpoints.yml`:

- **mobile**: up to 767px
- **tablet**: 768px to 1023px
- **desktop**: 1024px and above
- **wide**: 1200px and above

### Regions

The theme provides the following regions:

- **topbar**: Secondary navigation and utility links
- **header**: Site branding and main navigation
- **primary_menu**: Main navigation menu
- **secondary_menu**: Secondary navigation
- **breadcrumb**: Breadcrumb navigation
- **highlighted**: Important announcements
- **help**: Help text and messages
- **content**: Main content area
- **sidebar_first**: Left sidebar
- **sidebar_second**: Right sidebar
- **footer_first**: Footer column 1
- **footer_second**: Footer column 2
- **footer_third**: Footer column 3

## Customization

### Adding Custom CSS

1. Create a new CSS file in the appropriate component directory
2. Add it to `thirdwing.libraries.yml`
3. Clear the cache

### Creating Template Overrides

1. Copy the template from `core/modules/[module]/templates/`
2. Place it in the `templates/` directory
3. Rename following Drupal naming conventions
4. Clear the cache

### Theme Hook Suggestions

The theme provides automatic template suggestions for:

- **Pages**: `page--node--[content-type].html.twig`
- **Nodes**: `node--[content-type]--[view-mode].html.twig`
- **Blocks**: `block--[region]--[plugin-id].html.twig`

## Migration from Drupal 6/7

This theme is designed to work with content migrated from your Drupal 6 site. Key considerations:

### Content Types
- **nieuws** (news)
- **activiteit** (activities)
- **pagina** (pages)
- **repertoire** (repertoire)
- **profiel** (profiles)

### Fields
The theme anticipates common field types from your migration:
- Text fields
- Image fields
- Date fields
- File attachments
- Taxonomy references

### Menus
- **Primary links** → **Main navigation**
- **Secondary links** → **Secondary menu**

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement**: Basic functionality in older browsers
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+

## Performance Optimization

### CSS
- Critical CSS inlined in `<head>`
- Non-critical CSS loaded asynchronously
- CSS custom properties for efficient theming

### JavaScript
- Progressive enhancement approach
- Modern ES6+ syntax with fallbacks
- Lazy loading for non-critical scripts

### Images
- Responsive images with `srcset`
- WebP format support where available
- Lazy loading for below-the-fold content

## Accessibility Features

### Keyboard Navigation
- Full keyboard support
- Logical tab order
- Skip links to main content
- Focus indicators

### Screen Readers
- Semantic HTML5 markup
- ARIA labels and descriptions
- Screen reader only text where needed
- Proper heading hierarchy

### Visual Accessibility
- High contrast mode support
- Reduced motion preferences
- Scalable text up to 200%
- Color contrast ratios meet WCAG AA standards

## Development

### Prerequisites
- Drupal 11
- Node.js 16+ (for development tools)
- Modern browser for testing

### Development Workflow
1. Make changes to source files
2. Test in multiple browsers
3. Validate accessibility
4. Clear Drupal cache
5. Deploy

### Debugging
Enable Twig debugging in `settings.php`:
```php
$settings['twig_debug'] = TRUE;
$settings['twig_auto_reload'] = TRUE;
$settings['twig_cache'] = FALSE;
```

## Contributing

When contributing to this theme:

1. Follow Drupal coding standards
2. Test accessibility with screen readers
3. Ensure responsive design works on all devices
4. Add appropriate documentation
5. Update this README if needed

## Support

For theme-specific issues:
1. Check the Drupal logs
2. Validate HTML/CSS
3. Test with default theme to isolate issues
4. Review browser console for JavaScript errors

## License

This theme is licensed under the GPL-2.0+ license, consistent with Drupal core.

## Changelog

### Version 4.0 (Current)
- Initial Drupal 11 implementation
- Modern CSS Grid layout
- Enhanced accessibility features
- Progressive Web App capabilities
- Component-based architecture

### Migration Notes from Previous Versions
- **3.0**: Drupal 7 version with LESS preprocessing
- **2.4**: Drupal 6 responsive version
- **2.3**: Drupal 6 with basic responsive features

---

**Thirdwing D11 Theme** - Bridging classic design with modern web standards.