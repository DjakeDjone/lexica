# Lexica Image Fix VS Code Extension

`Lexica-img-fix` is a Visual Studio Code extension that automatically fixes image links from Lexica in your Markdown files. It ensures that pasted or referenced Lexica images are properly formatted and displayed within VS Code.

## Features

- Detects and corrects Lexica image URLs in Markdown files.
- Automatically updates image links to use direct image sources.
- Works seamlessly when pasting or editing Markdown content.

## Installation

1. Download or clone this repository.
2. Open the folder in VS Code.
3. Run `npm install` to install dependencies.
4. Press `F5` to launch the extension in a new Extension Development Host window.

## Usage

- Open a Markdown file.
- Paste or edit Lexica image links.
- The extension will automatically fix the image URLs for proper display.

## Extension Settings

This extension contributes the following settings:

* `lexica-img-fix.destinationFolder`: The folder (relative to workspace root) where images will be moved. Default is `public/images`.
* `lexica-img-fix.markdownPathPrefix`: The path prefix to use in the updated markdown image links. Default is `/images/`.

## Release Notes

### 0.0.5

- Added configuration for destination folder and markdown path prefix.
- Implemented image moving functionality.



