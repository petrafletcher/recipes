// Filters the server-rendered recipe cards on the home page.
// Selected labels are combined with AND; search words must all appear in the
// recipe's title, description, source, labels or ingredients.
// State is mirrored in the URL (?q=...&labels=a,b) so searches can be bookmarked.
(() => {
  const root = document.querySelector('[data-search]');
  if (!root) return;

  const input = document.getElementById('q');
  const chips = [...document.querySelectorAll('.chip')];
  const count = document.getElementById('count');
  const empty = document.getElementById('empty');
  const clear = document.getElementById('clear');
  const selected = new Set();

  const recipes = [...document.querySelectorAll('#results .card')].map((el) => ({
    el,
    labels: new Set(el.dataset.labels.split(' ').filter(Boolean)),
    text: el.dataset.text,
  }));

  const words = () => input.value.toLowerCase().split(/\s+/).filter(Boolean);

  const matches = (recipe, terms, labels) => {
    for (const label of labels) if (!recipe.labels.has(label)) return false;
    return terms.every((t) => recipe.text.includes(t));
  };

  function readUrl() {
    const params = new URLSearchParams(location.search);
    input.value = params.get('q') || '';
    selected.clear();
    for (const label of (params.get('labels') || '').split(',')) {
      if (label) selected.add(label);
    }
  }

  function writeUrl() {
    const params = new URLSearchParams();
    const q = input.value.trim();
    if (q) params.set('q', q);
    if (selected.size) params.set('labels', [...selected].join(','));
    const qs = params.toString().replace(/%2C/g, ',');
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  }

  function update() {
    const terms = words();
    let shown = 0;
    for (const recipe of recipes) {
      const visible = matches(recipe, terms, selected);
      recipe.el.hidden = !visible;
      if (visible) shown++;
    }

    // Each chip shows how many recipes you'd get by adding it to the filter.
    for (const chip of chips) {
      const label = chip.dataset.label;
      const active = selected.has(label);
      const withLabel = new Set(selected).add(label);
      const n = recipes.filter((r) => matches(r, terms, withLabel)).length;
      chip.setAttribute('aria-pressed', String(active));
      chip.querySelector('.count').textContent = n;
      chip.disabled = !active && n === 0;
    }

    count.textContent = `${shown} ${shown === 1 ? 'recipe' : 'recipes'}`;
    empty.hidden = shown !== 0;
    clear.hidden = !selected.size && !terms.length;
    writeUrl();
  }

  input.addEventListener('input', update);

  for (const chip of chips) {
    chip.addEventListener('click', () => {
      const label = chip.dataset.label;
      if (selected.has(label)) selected.delete(label);
      else selected.add(label);
      update();
    });
  }

  clear.addEventListener('click', () => {
    input.value = '';
    selected.clear();
    update();
    input.focus();
  });

  readUrl();
  update();
})();
