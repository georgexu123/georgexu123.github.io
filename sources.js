(() => {
  const data = window.NATURES_HUSH_SOUND_SOURCES;
  const grid = document.querySelector("#sound-source-grid");
  const input = document.querySelector("#source-search-input");
  if (!data || !grid || !input) return;

  const text = {
    "zh-CN": {
      kicker: "逐条来源目录", title: "72 段内置声音",
      summary: "45 段 CC0 · 13 段 CC BY · 14 段公共领域或公共来源",
      search: "搜索目录", placeholder: "声音、作者或许可", empty: "没有匹配的声音。",
      creator: "作者/机构", source: "原始来源", license: "许可正文", attribution: "署名与处理",
      record: "复核日期：{date}。本页由候选发布目录生成；目录 SHA-256：{sha}。"
    },
    "zh-TW": {
      kicker: "逐項來源目錄", title: "72 段內建聲音",
      summary: "45 段 CC0 · 13 段 CC BY · 14 段公眾領域或公開來源",
      search: "搜尋目錄", placeholder: "聲音、作者或授權", empty: "找不到相符的聲音。",
      creator: "作者／機構", source: "原始來源", license: "授權全文", attribution: "署名與處理",
      record: "複核日期：{date}。本頁由候選發布目錄產生；目錄 SHA-256：{sha}。"
    },
    en: {
      kicker: "ITEMIZED DIRECTORY", title: "72 bundled recordings",
      summary: "45 CC0 · 13 CC BY · 14 public-domain or public-source records",
      search: "Search the directory", placeholder: "Sound, creator, or license", empty: "No matching sounds.",
      creator: "Creator / Organization", source: "Original source", license: "License terms", attribution: "Attribution & processing",
      record: "Reviewed {date}. Generated from the release-candidate catalog; catalog SHA-256: {sha}."
    },
    ja: {
      kicker: "音源別一覧", title: "同梱音源 72件",
      summary: "CC0 45件 · CC BY 13件 · パブリックドメイン／公開音源 14件",
      search: "一覧を検索", placeholder: "音源、作者、ライセンス", empty: "一致する音源がありません。",
      creator: "作者／団体", source: "元の出典", license: "ライセンス条項", attribution: "クレジットと処理",
      record: "確認日：{date}。リリース候補の音源一覧から生成。カタログ SHA-256：{sha}。"
    },
    ko: {
      kicker: "항목별 출처 목록", title: "포함된 음원 72개",
      summary: "CC0 45개 · CC BY 13개 · 퍼블릭 도메인/공개 출처 14개",
      search: "목록 검색", placeholder: "음원, 창작자 또는 라이선스", empty: "일치하는 음원이 없습니다.",
      creator: "창작자 / 기관", source: "원본 출처", license: "라이선스 조건", attribution: "저작자 표시 및 처리",
      record: "검토일: {date}. 출시 후보 목록에서 생성됨. 카탈로그 SHA-256: {sha}."
    },
    ru: {
      kicker: "ПОЛНЫЙ СПИСОК", title: "72 встроенные записи",
      summary: "45 CC0 · 13 CC BY · 14 записей из общественного достояния или открытых источников",
      search: "Поиск по списку", placeholder: "Звук, автор или лицензия", empty: "Совпадений нет.",
      creator: "Автор / Организация", source: "Исходная страница", license: "Условия лицензии", attribution: "Атрибуция и обработка",
      record: "Проверено {date}. Сформировано из каталога кандидата на выпуск; SHA-256 каталога: {sha}."
    },
    de: {
      kicker: "EINZELNACHWEISE", title: "72 enthaltene Aufnahmen",
      summary: "45 CC0 · 13 CC BY · 14 gemeinfreie oder öffentlich bereitgestellte Aufnahmen",
      search: "Verzeichnis durchsuchen", placeholder: "Klang, Urheber oder Lizenz", empty: "Keine passenden Klänge.",
      creator: "Urheber / Organisation", source: "Originalquelle", license: "Lizenzbedingungen", attribution: "Namensnennung & Bearbeitung",
      record: "Geprüft am {date}. Aus dem Veröffentlichungskatalog erzeugt; Katalog-SHA-256: {sha}."
    },
    fr: {
      kicker: "RÉPERTOIRE DÉTAILLÉ", title: "72 enregistrements intégrés",
      summary: "45 CC0 · 13 CC BY · 14 éléments du domaine public ou de source publique",
      search: "Rechercher", placeholder: "Son, auteur ou licence", empty: "Aucun son correspondant.",
      creator: "Auteur / Organisme", source: "Source originale", license: "Conditions de licence", attribution: "Attribution et traitement",
      record: "Vérifié le {date}. Généré depuis le catalogue candidat ; SHA-256 du catalogue : {sha}."
    }
  };

  let language = "en";

  function link(label, href) {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = label;
    return anchor;
  }

  function render() {
    const labels = text[language] || text.en;
    const query = input.value.trim().toLocaleLowerCase(language);
    const matches = data.entries.filter((entry) => {
      const haystack = [
        entry.titles[language] || entry.titles.en,
        entry.creator,
        entry.license,
        entry.attribution
      ].join(" ").toLocaleLowerCase(language);
      return !query || haystack.includes(query);
    });

    grid.replaceChildren();
    for (const entry of matches) {
      const card = document.createElement("article");
      card.className = "sound-source-card";

      const heading = document.createElement("h3");
      heading.textContent = entry.titles[language] || entry.titles.en;
      card.append(heading);

      const id = document.createElement("p");
      id.className = "source-id";
      id.textContent = entry.id;
      card.append(id);

      const creator = document.createElement("p");
      creator.append(Object.assign(document.createElement("strong"), { textContent: `${labels.creator}: ` }));
      creator.append(entry.creator);
      card.append(creator);

      const licenseName = document.createElement("p");
      licenseName.append(Object.assign(document.createElement("strong"), { textContent: `${labels.license}: ` }));
      licenseName.append(entry.license);
      card.append(licenseName);

      const attribution = document.createElement("p");
      attribution.className = "source-attribution";
      attribution.append(Object.assign(document.createElement("strong"), { textContent: `${labels.attribution}: ` }));
      attribution.append(entry.attribution);
      card.append(attribution);

      const actions = document.createElement("div");
      actions.className = "source-actions";
      actions.append(link(labels.source, entry.sourceUrl));
      actions.append(link(labels.license, entry.licenseUrl));
      card.append(actions);
      grid.append(card);
    }
    document.querySelector("#source-empty").hidden = matches.length !== 0;
  }

  function applyLanguage(nextLanguage) {
    language = text[nextLanguage] ? nextLanguage : "en";
    const labels = text[language];
    document.querySelector("#source-directory-kicker").textContent = labels.kicker;
    document.querySelector("#source-directory-title").textContent = labels.title;
    document.querySelector("#source-directory-summary").textContent = labels.summary;
    document.querySelector("#source-search-label").textContent = labels.search;
    document.querySelector("#source-search-input").placeholder = labels.placeholder;
    document.querySelector("#source-empty").textContent = labels.empty;
    document.querySelector("#source-record-note").textContent = labels.record
      .replace("{date}", data.reviewedAt)
      .replace("{sha}", data.catalogSha256);
    render();
  }

  input.addEventListener("input", render);
  document.addEventListener("site-language-changed", (event) => {
    applyLanguage(event.detail.language);
  });
  applyLanguage(document.documentElement.lang);
})();
