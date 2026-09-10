import path from 'path';
import { JSDOM } from 'jsdom';
import slugify from 'slugify';
import getImageInfo from '../utils/image-info.js';
import minify from '../utils/minify.js';

const solidImgReg = /\.(jpg|jpeg)/i;

export default async function(content, outputPath) {
	if (outputPath.endsWith('.html')) {
		// Eleventy 3 transform context: source template path, for resolving relative image srcs
		const templateInputPath = this.page && this.page.inputPath;
		const DOM = new JSDOM(content);

		const document = DOM.window.document;

		const articleImages = [...document.querySelectorAll('main article img')];
		const articleHeadings = [...document.querySelectorAll('main article h2, main article h3')];
		const articleEmbeds = [...document.querySelectorAll('main article iframe')];

		if (articleImages.length) {
			await Promise.all(
				articleImages
					.filter((image) => {
						return !image.classList.contains('events__item__logo');
					})
					.map(async (image) => {
						// assign loading lazy to optimize above the fold load size and time
						image.setAttribute('loading', 'lazy');

						const file = image.getAttribute('src');

						// append size to images to prevent layout shift and let lazy loading work
						if (!file.includes('http')) {
							// let dimensions = { width: 20, height: 20 };
							// [red, green, blue, alpha, width, height]
							let info = [127, 127, 127, 255, 50, 50];
							try {
								// absolute srcs (/images/...) live at site root, relative srcs (./img.png)
								// live next to the source template
								let imagePath = path.resolve('.' + file);
								if (templateInputPath && !path.isAbsolute(file)) {
									imagePath = path.resolve(path.dirname(templateInputPath), file);
								}
								info = await getImageInfo(imagePath);
								console.log('Processing image', file);
								// this image processing maybe costly but OK for now,
								// I'll consider go back to `image-size` if needed and use a single neutral color
								// const getSize = require('image-size');
								// dimensions = getSize('./' + file);
							} catch {
								console.log('Cannot getImageInfo', file);
							}

							image.setAttribute('width', info[4]);
							image.setAttribute('height', info[5]);

							// apply background color as placeholder, but not for transparent images
							if (solidImgReg.test(file)) {
								image.style.backgroundColor = `rgb(${info[0]}, ${info[1]}, ${info[2]})`;
							}
						}

						const imgParent = image.parentElement;

						// skip figure transform for some known parent
						if (
							imgParent.tagName === 'FIGURE' ||
							imgParent.classList.contains('no-replace')
						)
							return;

						// selectively convert post img to figure
						const figure = document.createElement('figure');
						const figCaption = document.createElement('figcaption');

						// Handle my special MD notation: ![alt](image/url) _image caption_
						const emCaption =
							imgParent.querySelector('img + em') ||
							(imgParent.nextElementSibling &&
								imgParent.nextElementSibling.tagName === 'EM' &&
								imgParent.nextElementSibling);
						if (emCaption) {
							figCaption.innerHTML = emCaption.innerHTML;
							emCaption.parentElement.removeChild(emCaption);
						} else if (image.hasAttribute('title')) {
							// If an image has a title it means that the user added a caption
							// so replace the image with a figure containing that image and a caption
							figCaption.innerHTML = image.getAttribute('title');
							image.removeAttribute('title');
						}

						if (imgParent.tagName === 'A') {
							// image with anchor wrapper
							figure.appendChild(imgParent.cloneNode(true));
							imgParent.replaceWith(figure);
						} else {
							figure.appendChild(image.cloneNode(true));
							image.replaceWith(figure);
						}
						figure.appendChild(figCaption);
					})
			);
		}

		// unwrap figures from p because p cannot contains figure
		const figures = [...document.querySelectorAll('figure')];
		figures.forEach((figure) => {
			const outerP = figure.closest('p');

			if (outerP) {
				if (figure.parentElement === outerP) outerP.removeChild(figure); // in case img is not direct child of outerP
				if (outerP.textContent.trim()) {
					// if p contains some texts, insert figure after it
					outerP.insertAdjacentElement('afterend', figure);
				} else {
					// if p contains no texts, just replace it
					outerP.replaceWith(figure);
				}
			}
		});

		if (articleHeadings.length) {
			// Loop each heading and add a little anchor and an ID to each one
			articleHeadings.forEach((heading) => {
				const headingSlug = slugify(heading.textContent.toLowerCase());
				const anchor = document.createElement('a');

				anchor.setAttribute('href', `#heading-${headingSlug}`);
				anchor.classList.add('heading-permalink');
				anchor.innerHTML = minify(`
        <span class="visually-hidden"> permalink</span>
        <svg fill="currentColor" aria-hidden="true" focusable="false" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M9.199 13.599a5.99 5.99 0 0 0 3.949 2.345 5.987 5.987 0 0 0 5.105-1.702l2.995-2.994a5.992 5.992 0 0 0 1.695-4.285 5.976 5.976 0 0 0-1.831-4.211 5.99 5.99 0 0 0-6.431-1.242 6.003 6.003 0 0 0-1.905 1.24l-1.731 1.721a.999.999 0 1 0 1.41 1.418l1.709-1.699a3.985 3.985 0 0 1 2.761-1.123 3.975 3.975 0 0 1 2.799 1.122 3.997 3.997 0 0 1 .111 5.644l-3.005 3.006a3.982 3.982 0 0 1-3.395 1.126 3.987 3.987 0 0 1-2.632-1.563A1 1 0 0 0 9.201 13.6zm5.602-3.198a5.99 5.99 0 0 0-3.949-2.345 5.987 5.987 0 0 0-5.105 1.702l-2.995 2.994a5.992 5.992 0 0 0-1.695 4.285 5.976 5.976 0 0 0 1.831 4.211 5.99 5.99 0 0 0 6.431 1.242 6.003 6.003 0 0 0 1.905-1.24l1.723-1.723a.999.999 0 1 0-1.414-1.414L9.836 19.81a3.985 3.985 0 0 1-2.761 1.123 3.975 3.975 0 0 1-2.799-1.122 3.997 3.997 0 0 1-.111-5.644l3.005-3.006a3.982 3.982 0 0 1 3.395-1.126 3.987 3.987 0 0 1 2.632 1.563 1 1 0 0 0 1.602-1.198z"/>
        </svg>`);

				heading.setAttribute('id', `heading-${headingSlug}`);
				heading.appendChild(anchor);
			});
		}

		// Look for videos are wrap them in a container element
		if (articleEmbeds.length) {
			articleEmbeds.forEach((embed) => {
				if (embed.hasAttribute('allowfullscreen')) {
					const player = document.createElement('div');

					player.classList.add('video-player');

					player.appendChild(embed.cloneNode(true));

					embed.replaceWith(player);
				}
			});
		}

		// add rel=noopener to all anchors with targer=_blank
		const blankLinks = [...document.querySelectorAll('main article a[target=_blank]')];
		if (blankLinks.length) {
			blankLinks.forEach((link) => {
				link.setAttribute('rel', 'noopener');
			});
		}

		return '<!DOCTYPE html>\r\n' + document.documentElement.outerHTML;
	}
	return content;
}
