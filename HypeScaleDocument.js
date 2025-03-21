/*!
 * Hype Scale Document
 * Copyright (2025) Max Ziebell, (https://maxziebell.de). MIT-license
 */

/*
 * Version-History
* 1.0.0 Initial version created with scaleMode
* 1.0.1 Added minScale and maxScale options
* 1.0.2 Added alignment options as alignment
* 1.0.3 Added scaleFactor option with default value of 1
* 1.0.4 Added support for scaling based on parent container size
 */

// Ensure the extension isn't redefined
if ('HypeScaleDocument' in window === false) {
	window['HypeScaleDocument'] = (function () {

		// Define default settings for the extension
		var _default = {
			scaleMode: 'none', // Options: 'none', 'contain', or 'cover'
			maxScale: null,
			minScale: null,
			alignment: 'center', // Options: 'top', 'center', 'bottom'
			scaleFactor: 1,
			useParentContainer: true // New option to enable/disable parent container scaling
		};

		function setDefault(key, value) {
			if (typeof key === 'object') {
				_default = Object.assign(_default, key);
			} else {
				_default[key] = value;
			}
		}

		function getDefault(key) {
			return key ? _default[key] : _default;
		}

		function scaleHypeDocument(hypeDocument) {
			// Early return if scaling is disabled
			if (_default.scaleMode === 'none') {
				document.documentElement.style.overflow = '';
				return;
			}

			const container = document.getElementById(hypeDocument.documentId());
			if (!container) return;

			document.documentElement.style.overflow = 'hidden';

			// Determine if container is directly under body or has another parent
			const isDirectChildOfBody = container.parentElement === document.body;
			
			// Get parent dimensions based on container position
			var parentWidth, parentHeight;
			
			if (!isDirectChildOfBody && _default.useParentContainer) {
				// Use parent container dimensions
				const parent = container.parentElement;
				parentWidth = parent.clientWidth;
				parentHeight = parent.clientHeight;
			} else {
				// Use window dimensions (original behavior)
				parentWidth = window.innerWidth;
				parentHeight = window.innerHeight;
			}

			var docWidth = container.offsetWidth;
			var docHeight = container.offsetHeight;

			var scaleX = parentWidth / docWidth;
			var scaleY = parentHeight / docHeight;

			var scale = (_default.scaleMode === 'contain') ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY);

			if (_default.minScale !== null) scale = Math.max(_default.minScale, scale);
			if (_default.maxScale !== null) scale = Math.min(_default.maxScale, scale);
			
			// Apply the scale factor
			scale = scale * _default.scaleFactor;

			// Keep the original positioning approach for both scenarios
			container.style.position = 'absolute';
			container.style.left = '50%';
			
			switch (_default.alignment) {
				case 'center':
					container.style.top = '50%';
					container.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
					container.style.transformOrigin = 'center center';
					break;
				case 'top':
					container.style.top = '0';
					container.style.transform = 'translate(-50%, 0) scale(' + scale + ')';
					container.style.transformOrigin = 'top center';
					break;
				case 'bottom':
					container.style.top = '100%';
					container.style.transform = 'translate(-50%, -100%) scale(' + scale + ')';
					container.style.transformOrigin = 'bottom center';
					break;
			}
			
			// If in a parent container, ensure the parent has position relative
			if (!isDirectChildOfBody && _default.useParentContainer) {
				const parent = container.parentElement;
				if (window.getComputedStyle(parent).position === 'static') {
					parent.style.position = 'relative';
				}
			}
		}

		function HypeDocumentLoad(hypeDocument, element, event) {
			// Early return if scaling is disabled
			if (_default.scaleMode === 'none') return;

			scaleHypeDocument(hypeDocument);
			window.addEventListener('resize', function () {
				scaleHypeDocument(hypeDocument);
			});
		}

		function HypeLayoutRequest(hypeDocument, element, event) {
			// Early return if scaling is disabled
			if (_default.scaleMode === 'none') return;
			
			scaleHypeDocument(hypeDocument);
		}

		if ('HYPE_eventListeners' in window === false) {
			window.HYPE_eventListeners = Array();
		}

		window.HYPE_eventListeners.push({ type: 'HypeDocumentLoad', callback: HypeDocumentLoad });
		window.HYPE_eventListeners.unshift({ type: 'HypeLayoutRequest', callback: HypeLayoutRequest });

		return {
			version: '1.0.4',
			setDefault: setDefault,
			getDefault: getDefault
		};

	})();
}
