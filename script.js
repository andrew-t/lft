document.addEventListener('input', update);
document.addEventListener('DOMContentLoaded', update);

const percent = new Set(['lftPpp', 'xLftNpp', 'pcrPpp', 'xPcrNpp', 'prevalence', 'lftFalsePositive', 'lftFalseNegative', 'pcrFalsePositive', 'pcrFalseNegative']);

function update() {
	const vals = {};
	for (const el of document.getElementsByTagName('input'))
		vals[el.id] = parseFloat(el.value);

	vals.infected = vals.population * vals.prevalence / 100;
	vals.uninfected = vals.population - vals.infected;

	vals.falseLftNegatives = vals.infected * vals.lftFalseNegative / 100;
	vals.trueLftPositives = vals.infected - vals.falseLftNegatives;

	vals.falseLftPositives = vals.uninfected * vals.lftFalsePositive / 100;
	vals.trueLftNegatives = vals.uninfected - vals.falseLftPositives;

	vals.totalLftNegatives = vals.falseLftNegatives + vals.trueLftNegatives;
	vals.totalLftPositives = vals.falseLftPositives + vals.trueLftPositives;

	vals.xLftNpp = vals.falseLftNegatives * 100 / vals.totalLftNegatives;
	vals.lftPpp = vals.trueLftPositives * 100 / vals.totalLftPositives;

	vals.falsePcrNegatives = vals.trueLftPositives * vals.pcrFalseNegative / 100;
	vals.truePcrPositives = vals.trueLftPositives - vals.falsePcrNegatives;

	vals.falsePcrPositives = vals.falseLftPositives * vals.pcrFalsePositive / 100;
	vals.truePcrNegatives = vals.falseLftPositives - vals.falsePcrPositives;

	vals.totalPcrNegatives = vals.falsePcrNegatives + vals.truePcrNegatives;
	vals.totalPcrPositives = vals.falsePcrPositives + vals.truePcrPositives;

	vals.xPcrNpp = vals.falsePcrNegatives * 100 / vals.totalPcrNegatives;
	vals.pcrPpp = vals.truePcrPositives * 100 / vals.totalPcrPositives;

	console.log(vals);

	for (const key in vals)
		for (const el of document.querySelectorAll(`[data-tag=${key}]`)) {
			el.innerHTML = percent.has(key)
				? vals[key].toFixed(2)
				: Math.round(vals[key]).toLocaleString();
			el.title = vals[key];
		}
}

const hovers = {
	infected: ['population', 'prevalence'],
	uninfected: ['population', 'infected'],
	falseLftNegatives: ['infected', 'lftFalseNegative'],
	trueLftPositives: ['infected', 'lftFalseNegative'],
	falseLftPositives: ['uninfected', 'lftFalsePositive'],
	trueLftNegatives: ['uninfected', 'falseLftPositives'],
	totalLftNegatives: ['falseLftNegatives', 'trueLftNegatives'],
	totalLftPositives: ['falseLftPositives', 'trueLftPositives'],
	xLftNpp: ['falseLftNegatives', 'totalLftNegatives'],
	lftPpp: ['trueLftPositives', 'totalLftPositives'],
	falsePcrNegatives: ['trueLftPositives', 'pcrFalseNegative'],
	truePcrPositives: ['trueLftPositives', 'pcrFalsePositive'],
	falsePcrPositives: ['falseLftPositives', 'pcrFalsePositive'],
	truePcrNegatives: ['falseLftPositives', 'falsePcrPositives'],
	totalPcrNegatives: ['falsePcrNegatives', 'truePcrNegatives'],
	totalPcrPositives: ['falsePcrPositives', 'truePcrPositives'],
	xPcrNpp: ['falsePcrNegatives', 'totalPcrNegatives'],
	pcrPpp: ['truePcrPositives', 'totalPcrPositives'],
}

const highlight = className => e => {
	const el = e.target;
	const tag = el.getAttribute('data-tag');
	if (!tag) return;
	for (const src of hovers[tag] ?? [])
		for (const el of document.querySelectorAll(`[data-tag=${src}], #${src}`))
			el.classList.add(className);
	for (const el of document.querySelectorAll(`[data-tag=${tag}], #${tag}`))
		el.classList.add(className);
};

const unhighlight = className => () => {
	for (const el of document.querySelectorAll(`.${className}`))
		el.classList.remove(className);
};

document.addEventListener('DOMContentLoaded', () => {
	document.body.addEventListener('mouseover', highlight('hover-source'));
	document.body.addEventListener('mouseout', unhighlight('hover-source'));
	document.body.addEventListener('focusin', highlight('focus-source'));
	document.body.addEventListener('focusout', unhighlight('focus-source'));
	for (const el of document.querySelectorAll('[data-tag]'))
		el.setAttribute('tabindex', 0);
});
