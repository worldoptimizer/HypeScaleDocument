/*!
 * Hype Scale Document v1.0.4
 * Copyright (2025) Max Ziebell, (https://maxziebell.de). MIT-license
 */

/*
 * Version-History
* 1.0.0 Initial version created with scaleMode
* 1.0.1 Added minScale and maxScale options
* 1.0.2 Added alignment options as alignment
* 1.0.3 Added scaleFactor option with default value of 1
* 1.0.4 If document width/height is 100% avoid scaling the document
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
			scaleFactor: 1
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
			// Guard: scaling disabled
			if (_default.scaleMode === 'none') {
				if (document.documentElement.style.overflow) {
					document.documentElement.style.removeProperty('overflow');
				}
				return;
			}

			const container = document.getElementById(hypeDocument.documentId());
			if (!container) return;

			// Special case: let CSS handle layout if width or height is 100%
			if (container.style.width === '100%' || container.style.height === '100%') {
				container.style.removeProperty('position');
				container.style.removeProperty('left');
				container.style.removeProperty('top');
				container.style.removeProperty('transform-origin');
				container.style.removeProperty('transform');
				document.documentElement.style.removeProperty('overflow');
				return;
			}

			document.documentElement.style.overflow = 'hidden';

			var parentWidth = window.innerWidth;
			var parentHeight = window.innerHeight;
			var docWidth = container.offsetWidth;
			var docHeight = container.offsetHeight;
			var scaleX = parentWidth / docWidth;
			var scaleY = parentHeight / docHeight;
			var scale = (_default.scaleMode === 'contain') ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY);
			if (_default.minScale !== null) scale = Math.max(_default.minScale, scale);
			if (_default.maxScale !== null) scale = Math.min(_default.maxScale, scale);
			scale = scale * _default.scaleFactor;

			container.style.position = 'absolute';
			container.style.left = '50%';
			container.style.transform = 'scale(' + scale + ')';

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

		}

		function HypeDocumentLoad(hypeDocument, element, event) {
			// Guard: scaling disabled if initial scaleMode is 'none'
			if (_default.scaleMode === 'none') return;

			// delay on layout request	
			requestAnimationFrame(function () {
				scaleHypeDocument(hypeDocument);
			});
			window.addEventListener('resize', function () {
				scaleHypeDocument(hypeDocument);
			});
		}

		function HypeLayoutRequest(hypeDocument, element, event) {
			// delay on layout request
			requestAnimationFrame(function () {
				scaleHypeDocument(hypeDocument);
			});
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
