import rssPlugin from '@11ty/eleventy-plugin-rss';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';

// Import filters
import dateFilter from './_11ty/filters/date-filter.js';
import yearFilter from './_11ty/filters/year-filter.js';
import { library as markdownLibrary, filter as markdownFilter } from './_11ty/filters/markdown-filter.js';
import w3DateFilter from './_11ty/filters/w3-date-filter.js';
import skipTag from './_11ty/filters/skip-tag.js';
import prepend from './_11ty/filters/prepend.js';

// Import transforms
import htmlMinTransform from './_11ty/transforms/html-min-transform.js';
import parseTransform from './_11ty/transforms/parse-transform.js';

// Import data files
import site from './_data/site.json' with { type: 'json' };

const prodMode = process.env.ELEVENTY_ENV !== 'development';

export default function (config) {
	config.setLibrary('md', markdownLibrary);
	// Filters
	config.addFilter('dateFilter', dateFilter);
	config.addFilter('yearFilter', yearFilter);
	config.addFilter('markdownFilter', markdownFilter);
	config.addFilter('w3DateFilter', w3DateFilter);
	config.addFilter('skipTag', skipTag);
	config.addFilter('prepend', prepend);

	// Layout aliases
	config.addLayoutAlias('home', 'layouts/home.njk');
	config.addLayoutAlias('post', 'layouts/post.njk');
	config.addLayoutAlias('page', 'layouts/page.njk');
	config.addLayoutAlias('archive', 'layouts/archive.njk');

	// Transforms
	config.addTransform('parse', parseTransform);
	if (prodMode) config.addTransform('htmlmin', htmlMinTransform);

	// Passthrough copy
	config.addPassthroughCopy('./_redirects');
	config.addPassthroughCopy('./fonts');
	config.addPassthroughCopy('./images');
	config.addPassthroughCopy('./js');
	// co-located page assets (e.g. python_class/week_7_homework/*.png)
	config.addPassthroughCopy('./python_class/**/*.png');
	config.addPassthroughCopy('./python_class/**/*.zip');
	config.addPassthroughCopy('./robots.txt');
	config.addPassthroughCopy('node_modules/nunjucks/browser/nunjucks-slim.js');
	// submodule pass through
	config.addPassthroughCopy('./slides');

	const now = new Date();

	// Custom collections
	const livePosts = (post) => post.date <= now && !post.data.draft;
	config.addCollection('posts', (collection) => {
		return [
			...collection
				.getFilteredByGlob('./posts/**/*.{md,html}')
				.filter(livePosts),
		].reverse();
	});

	config.addCollection('postFeed', (collection) => {
		return [
			...collection
				.getFilteredByGlob('./posts/**/*.{md,html}')
				.filter(livePosts),
		]
			.reverse()
			.slice(0, site.maxPostsPerPage);
	});

	// Plugins
	config.addPlugin(rssPlugin);
	config.addPlugin(syntaxHighlight);

	return {
		dir: {
			input: '.',
			output: '_site',
		},
	};
}
