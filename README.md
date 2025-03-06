# Hype Scale Document

![Hype-AnimationFrame](https://playground.maxziebell.de/Hype/ScaleDocument/HypeScaleDocument.jpg)

A Tumult Hype extension for scaling documents to fit different screen sizes. This extension allows Hype documents to automatically scale according to various modes and constraints, making responsive design simpler and more flexible.

## Description

HypeScaleDocument provides a way to automatically scale your Hype documents using different scaling modes like 'contain' or 'cover'. It handles resizing events and applies transformations to maintain your document's aspect ratio while fitting it within the viewport according to your preferences.

## Default Configuration Options

The extension comes with the following default settings:

| Option | Default Value | Available Options | Description |
|--------|--------------|-------------------|-------------|
| `scaleMode` | `'none'` | `'none'`, `'contain'`, `'cover'` | Determines how the document scales within the viewport |
| `maxScale` | `null` | Any number or `null` | Maximum scaling factor allowed |
| `minScale` | `null` | Any number or `null` | Minimum scaling factor allowed |
| `alignment` | `'center'` | `'top'`, `'center'`, `'bottom'` | Vertical alignment of the scaled document |
| `scaleFactor` | `1` | Any number | Additional multiplier applied to the calculated scale |

## Usage

After including the extension in your Hype document, you can configure it using the `setDefault` method:

```javascript
// Basic configuration
HypeScaleDocument.setDefault('scaleMode', 'contain');

// Or set multiple options at once
HypeScaleDocument.setDefault({
  scaleMode: 'cover',
  minScale: 0.5,
  maxScale: 2,
  alignment: 'center',
  scaleFactor: 0.9
});
```

You can set these options in a Hype document head HTML or in on-scene load functions depending on your needs.
