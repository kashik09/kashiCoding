# Uploads Directory

This directory contains uploaded files for the portfolio application.

## Structure

- **`/projects`** - Project screenshots and images
- **`/thumbnails`** - Thumbnail images for projects
- **`/digital-products`** - Product images and files

## Usage

When uploading project images through the admin panel, use these paths:

- Project thumbnail: `/uploads/projects/your-image.png`
- Product thumbnail: `/uploads/digital-products/product-image.png`

## Notes

- Files in this directory are served statically by Next.js
- Actual uploaded files are ignored by git (only directory structure is tracked)
- Maximum recommended file size: 5MB per image
- Supported formats: PNG, JPG, JPEG, WebP, GIF
