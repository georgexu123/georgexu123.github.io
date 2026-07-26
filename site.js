(() => {
  const catalog = window.NATURES_HUSH_I18N;
  if (!catalog) return;

  const page = document.body.dataset.page || "home";
  const picker = document.querySelector("#language");
  const sections = [...document.querySelectorAll(".legal-section")];
  const storageKey = "nature-sound-box-language";

  function normalizeLanguage(value) {
    if (!value) return null;
    const normalized = value.replace("_", "-").toLowerCase();
    if (normalized.startsWith("zh")) {
      return /(?:hant|tw|hk|mo)/.test(normalized) ? "zh-TW" : "zh-CN";
    }
    if (normalized.startsWith("ja")) return "ja";
    if (normalized.startsWith("ko")) return "ko";
    if (normalized.startsWith("ru")) return "ru";
    if (normalized.startsWith("de")) return "de";
    if (normalized.startsWith("fr")) return "fr";
    if (normalized.startsWith("en")) return "en";
    return null;
  }

  function valueAt(locale, path) {
    return path.split(".").reduce((value, key) => value?.[key], locale);
  }

  function applyText(locale) {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = valueAt(locale, element.dataset.i18n);
      if (typeof value === "string") element.textContent = value;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((element) => {
      const value = valueAt(locale, element.dataset.i18nHtml);
      if (typeof value === "string") element.innerHTML = value;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      const value = valueAt(locale, element.dataset.i18nAria);
      if (typeof value === "string") element.setAttribute("aria-label", value);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      const value = valueAt(locale, element.dataset.i18nAlt);
      if (typeof value === "string") element.setAttribute("alt", value);
    });
  }

  function applyMetadata(locale) {
    const pageText = locale[page];
    if (!pageText) return;
    document.title = pageText.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", pageText.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", pageText.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute(
      "content",
      pageText.ogDescription || pageText.description
    );
  }

  function applyLanguage(language, persist = true) {
    const selected = catalog.locales[language] ? language : "en";
    const locale = catalog.locales[selected];
    document.documentElement.lang = selected;
    document.documentElement.dir = "ltr";
    applyText(locale);
    applyMetadata(locale);
    sections.forEach((section) => {
      section.classList.toggle("active", section.dataset.language === selected);
    });
    if (picker) picker.value = selected;
    if (persist) localStorage.setItem(storageKey, selected);
    document.dispatchEvent(new CustomEvent("site-language-changed", { detail: { language: selected } }));
  }

  const queryLanguage = normalizeLanguage(new URLSearchParams(location.search).get("lang"));
  const storedLanguage = normalizeLanguage(localStorage.getItem(storageKey));
  const browserLanguage = (navigator.languages || [navigator.language])
    .map(normalizeLanguage)
    .find(Boolean);
  const initialLanguage = queryLanguage || storedLanguage || browserLanguage || "en";

  if (picker) {
    picker.addEventListener("change", () => applyLanguage(picker.value));
  }
  applyLanguage(initialLanguage, Boolean(queryLanguage || storedLanguage));

  window.NATURES_HUSH_SITE = {
    normalizeLanguage,
    setLanguage: applyLanguage
  };
})();
