/* Theme switch: dark is the default, the choice is remembered per browser. */
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;

  const label = () =>
    document.documentElement.dataset.theme === 'light'
      ? 'Dunkle Darstellung einschalten'
      : 'Helle Darstellung einschalten';

  toggle.setAttribute('aria-label', label());

  toggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    toggle.setAttribute('aria-label', label());
    try {
      localStorage.setItem('theme', next);
    } catch (error) {
      /* Speichern ist optional; die Umschaltung wirkt auch ohne. */
    }
  });
})();

/* Inhaltsverzeichnis einer Doku-Seite.
   Zweierlei: auf schmalen Geräten zugeklappt starten — ausgeliefert wird es
   offen, damit ohne JavaScript nichts fehlt, hier wird nur zugeklappt, was
   sonst drei Bildschirme füllt, bevor der Text beginnt. Und: der Abschnitt,
   in dem man gerade liest, ist hervorgehoben, beim Scrollen wie beim Klicken. */
(function () {
  const toc = document.querySelector('[data-doc-toc]');
  if (!toc) return;

  if (window.matchMedia('(max-width: 768px)').matches) toc.open = false;

  const liste = toc.querySelector('ul');
  const marken = [...toc.querySelectorAll('a[href^="#"]')]
    .map((link) => ({ link, ziel: document.getElementById(decodeURIComponent(link.hash.slice(1))) }))
    .filter((marke) => marke.ziel);

  if (!marken.length) return;

  let aktuell = null;

  /** Den hervorgehobenen Eintrag im mitlaufenden Verzeichnis sichtbar halten. */
  function inSicht(link) {
    if (!liste || liste.scrollHeight <= liste.clientHeight) return;

    const eintrag = link.getBoundingClientRect();
    const kasten = liste.getBoundingClientRect();

    if (eintrag.top < kasten.top) liste.scrollTop -= kasten.top - eintrag.top + 8;
    else if (eintrag.bottom > kasten.bottom) liste.scrollTop += eintrag.bottom - kasten.bottom + 8;
  }

  function hervorheben(marke) {
    if (!marke || marke === aktuell) return;

    aktuell?.link.classList.remove('is-active');
    marke.link.classList.add('is-active');
    aktuell = marke;
    inSicht(marke.link);
  }

  function pruefen() {
    // Unterhalb der klebenden Kopfzeile: was darüber steht, ist gelesen.
    const grenze = 120;
    let treffer = marken[0];

    for (const marke of marken) {
      if (marke.ziel.getBoundingClientRect().top > grenze) break;
      treffer = marke;
    }

    // Am Seitenende bleibt sonst der vorletzte Abschnitt hängen, weil der letzte
    // nie mehr bis unter die Kopfzeile wandert.
    const amEnde = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    hervorheben(amEnde ? marken[marken.length - 1] : treffer);
  }

  let angefordert = false;
  document.addEventListener(
    'scroll',
    () => {
      if (angefordert) return;
      angefordert = true;
      requestAnimationFrame(() => {
        angefordert = false;
        pruefen();
      });
    },
    { passive: true },
  );

  // Beim Klick sofort, statt erst wenn das weiche Scrollen angekommen ist.
  for (const marke of marken) {
    marke.link.addEventListener('click', () => hervorheben(marke));
  }

  pruefen();
})();

/* Client-side filtering: module, title search, version range and the version-free view. */
(function () {
  const filters = document.querySelector('[data-filters]');
  if (!filters) return;

  const chips = [...filters.querySelectorAll('[data-filter-module]')];
  const search = filters.querySelector('[data-search]');
  const counter = filters.querySelector('[data-result-count]');
  const fromSelect = filters.querySelector('[data-version-from]');
  const toSelect = filters.querySelector('[data-version-to]');
  const flatToggle = filters.querySelector('[data-flat-toggle]');

  const versionView = document.querySelector('[data-view="versions"]');
  const flatView = document.querySelector('[data-view="flat"]');

  let activeModule = '*';

  // Ranks run from 0 (newest release) upwards, so the older bound is the higher number.
  if (fromSelect && toSelect) {
    fromSelect.value = String(fromSelect.options.length - 1);
    toSelect.value = '0';
  }

  function activeView() {
    return flatToggle && flatToggle.checked ? flatView : versionView || document;
  }

  function apply() {
    const term = (search.value || '').trim().toLowerCase();
    const oldest = fromSelect ? Number(fromSelect.value) : null;
    const newest = toSelect ? Number(toSelect.value) : null;

    const scope = activeView();
    const issues = [...scope.querySelectorAll('.issue')];
    let visible = 0;

    for (const issue of issues) {
      const rank = issue.dataset.rank == null ? null : Number(issue.dataset.rank);
      const inRange = rank == null || oldest == null || (rank <= oldest && rank >= newest);
      const show =
        inRange &&
        (activeModule === '*' || issue.dataset.module === activeModule) &&
        (!term || issue.dataset.title.includes(term));

      issue.classList.toggle('is-hidden', !show);
      if (show) visible++;
    }

    // Collapse containers that no longer hold a visible entry.
    for (const group of scope.querySelectorAll('.type-group, .module-group, .block, .release')) {
      const hasIssues = group.querySelector('.issue');
      const hasVisible = group.querySelector('.issue:not(.is-hidden)');
      group.classList.toggle('is-hidden', hasIssues && !hasVisible);
    }

    // While filtering, collapsed releases would hide their own matches.
    if (term || activeModule !== '*') {
      for (const release of scope.querySelectorAll('.release:not(.is-hidden)')) release.open = true;
    }

    counter.textContent = visible === issues.length ? '' : `${visible} von ${issues.length}`;
  }

  function switchView() {
    if (!flatView || !versionView) return;
    const flat = flatToggle.checked;

    flatView.classList.toggle('is-hidden', !flat);
    versionView.classList.toggle('is-hidden', flat);
    apply();
  }

  for (const chip of chips) {
    chip.addEventListener('click', () => {
      activeModule = chip.dataset.filterModule;
      for (const other of chips) other.classList.toggle('is-active', other === chip);
      apply();
    });
  }

  search.addEventListener('input', apply);
  flatToggle?.addEventListener('change', switchView);

  for (const select of [fromSelect, toSelect]) {
    select?.addEventListener('change', () => {
      // Keep the range valid regardless of which end the user moved.
      if (Number(fromSelect.value) < Number(toSelect.value)) {
        (select === fromSelect ? toSelect : fromSelect).value = select.value;
      }
      apply();
    });
  }

  // Deep links like ?modul=Jobby preselect a module.
  const requested = new URLSearchParams(location.search).get('modul');
  if (requested) {
    const chip = chips.find((c) => c.dataset.filterModule.toLowerCase() === requested.toLowerCase());
    if (chip) chip.click();
  }
})();
