export default {
	get years() {
		const thisYear = new Date().getFullYear();
		const years = [];
		// my blog started in 2008
		for (let y = 2008; y <= thisYear; y++) {
			years.push(y);
		}

		return years;
	},
	random() {
		const segment = () => {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		return `${segment()}-${segment()}-${segment()}`;
	},
	now: Date.now(),
};
