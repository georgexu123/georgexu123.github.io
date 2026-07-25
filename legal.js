const picker = document.querySelector("#language");
const sections = [...document.querySelectorAll(".legal-section")];

function showLanguage(language) {
  sections.forEach((section) => {
    section.classList.toggle("active", section.dataset.language === language);
  });
  document.documentElement.lang = language;
  localStorage.setItem("nature-sound-box-language", language);
}

if (picker) {
  const supported = sections.map((section) => section.dataset.language);
  const stored = localStorage.getItem("nature-sound-box-language");
  const browser = navigator.language;
  const exact = supported.find((language) => browser.startsWith(language));
  const initial = supported.includes(stored) ? stored : (exact || "en");
  picker.value = initial;
  showLanguage(initial);
  picker.addEventListener("change", () => showLanguage(picker.value));
}
