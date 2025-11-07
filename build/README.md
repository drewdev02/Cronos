# Build Resources

This directory contains build resources for the Electron app.

## Icons

To add application icons, place the following files in this directory:

- `icon.ico` - Windows icon (256x256 pixels recommended)
- `icon.png` - Linux icon (256x256 pixels recommended)  
- `icon.icns` - macOS icon (various sizes bundled)

## Icon Requirements

- **Windows**: `.ico` format, multiple sizes (16x16, 32x32, 48x48, 256x256)
- **macOS**: `.icns` format, multiple sizes bundled
- **Linux**: `.png` format, 256x256 pixels recommended

Without custom icons, electron-builder will use the default Electron icon.