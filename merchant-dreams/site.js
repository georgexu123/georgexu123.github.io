document.documentElement.classList.add('js');
const picker = document.querySelector('#language');
const sections = [...document.querySelectorAll('article.language-section')];
const labels = {
  en: ['Support', 'Privacy', 'Player support', 'Need a hand on your journey?', 'Merchant Dreams is a trading and company management game for iPhone, iPad, and Mac. Find the basics here, or write to us.', 'Privacy policy', 'Your game stays on your device.', 'Effective September 24, 2026. This policy covers Merchant Dreams for iPhone, iPad, and Mac.', 'Reading language'],
  'zh-Hans': ['支持', '隐私', '玩家支持', '旅途中遇到问题？', '《白手起家》支持 iPhone、iPad 和 Mac。你可以先查看常见问题，也可以直接写信给我们。', '隐私政策', '游戏进度留在你的设备上。', '生效日期：2026 年 9 月 24 日。本政策适用于 iPhone、iPad 和 Mac 版《白手起家》。', '阅读语言'],
  'zh-Hant': ['支援', '隱私', '玩家支援', '旅途中遇到問題？', '《白手起家》支援 iPhone、iPad 和 Mac。你可先查看常見問題，也可直接寫信給我們。', '隱私權政策', '遊戲進度留在你的裝置上。', '生效日期：2026 年 9 月 24 日。本政策適用於 iPhone、iPad 和 Mac 版《白手起家》。', '閱讀語言'],
  ja: ['サポート', 'プライバシー', 'プレイヤーサポート', '旅の途中で困ったら', '『ゼロから商い』は iPhone、iPad、Mac で遊べます。よくある質問を読むか、メールでお問い合わせください。', 'プライバシーポリシー', 'プレイ記録は端末の中に。', '施行日：2026年9月24日。本ポリシーは iPhone、iPad、Mac 版に適用されます。', '表示言語'],
  ko: ['지원', '개인정보', '플레이어 지원', '도움이 필요하신가요?', '《맨손으로 시작》은 iPhone, iPad, Mac에서 즐길 수 있습니다. 먼저 안내를 살펴보거나 메일로 문의하세요.', '개인정보 처리방침', '게임 기록은 기기에 남습니다.', '시행일: 2026년 9월 24일. 이 방침은 iPhone, iPad, Mac 버전에 적용됩니다.', '읽기 언어'],
  de: ['Hilfe', 'Datenschutz', 'Spielerhilfe', 'Brauchst du Hilfe auf deiner Reise?', 'Aus eigener Kraft läuft auf iPhone, iPad und Mac. Hier findest du Antworten und unsere Kontaktadresse.', 'Datenschutzerklärung', 'Dein Spiel bleibt auf deinem Gerät.', 'Gültig ab 24. September 2026. Diese Erklärung gilt für iPhone, iPad und Mac.', 'Sprache'],
  fr: ['Assistance', 'Confidentialité', 'Assistance aux joueurs', 'Besoin d’aide en chemin ?', 'Partir de rien est disponible sur iPhone, iPad et Mac. Vous trouverez ici des réponses et notre adresse de contact.', 'Politique de confidentialité', 'Votre partie reste sur votre appareil.', 'En vigueur le 24 septembre 2026. Cette politique concerne les versions iPhone, iPad et Mac.', 'Langue'],
  ru: ['Поддержка', 'Конфиденциальность', 'Помощь игрокам', 'Нужна помощь в пути?', '«С нуля» доступна на iPhone, iPad и Mac. Здесь есть ответы на основные вопросы и наш адрес для связи.', 'Политика конфиденциальности', 'Ваш прогресс остаётся на устройстве.', 'Действует с 24 сентября 2026 года. Политика относится к версиям для iPhone, iPad и Mac.', 'Язык']
};
const requested = new URLSearchParams(location.search).get('lang');
const browserLanguage = navigator.language.toLowerCase();
const preferred = requested || (browserLanguage.startsWith('zh') ? (browserLanguage.includes('tw') || browserLanguage.includes('hk') ? 'zh-Hant' : 'zh-Hans') : browserLanguage.slice(0, 2));
function showLanguage(language) {
  const chosen = sections.some(section => section.dataset.language === language) ? language : 'en';
  for (const section of sections) section.classList.toggle('active', section.dataset.language === chosen);
  picker.value = chosen;
  document.documentElement.lang = chosen;
  const words = labels[chosen];
  for (const element of document.querySelectorAll('[data-i18n]')) element.textContent = words[Number(element.dataset.i18n)];
  for (const link of document.querySelectorAll('[data-local-link]')) link.search = '?lang=' + encodeURIComponent(chosen);
}
picker.addEventListener('change', () => showLanguage(picker.value));
showLanguage(preferred);
