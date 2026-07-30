#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const context = { window: {} };
vm.runInNewContext(
  fs.readFileSync(path.join(root, "site-localizations.js"), "utf8"),
  context,
  { filename: "site-localizations.js" }
);
vm.runInNewContext(
  fs.readFileSync(path.join(root, "sound-sources-data.js"), "utf8"),
  context,
  { filename: "sound-sources-data.js" }
);

const catalog = context.window.NATURES_HUSH_I18N;
const soundSources = context.window.NATURES_HUSH_SOUND_SOURCES;
const expectedLocales = ["zh-CN", "zh-TW", "en", "ja", "ko", "ru", "de", "fr"];
const pages = ["home", "support", "privacy", "sources"];
const forbiddenMachinePhrases = [
  "回復購買",
  "Kennungen favorisierten",
  "état de droit d’achat",
  "買い切りの解除"
];

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function keys(value) {
  return Object.keys(value).sort().join("\n");
}

function valueAt(locale, keyPath) {
  return keyPath.split(".").reduce((value, key) => value?.[key], locale);
}

if (!catalog || JSON.stringify(catalog.supported) !== JSON.stringify(expectedLocales)) {
  fail("The shared site catalog must declare the eight release locales in a stable order.");
}
if (!soundSources || soundSources.count !== 72 || soundSources.entries?.length !== 72) {
  fail("The public source directory must contain exactly 72 release sounds.");
}
const sourceIds = soundSources.entries.map((entry) => entry.id);
if (new Set(sourceIds).size !== 72) {
  fail("The public source directory contains duplicate sound IDs.");
}
for (const entry of soundSources.entries) {
  for (const field of ["creator", "license", "sourceUrl", "licenseUrl", "attribution"]) {
    if (typeof entry[field] !== "string" || !entry[field].trim()) {
      fail(`Missing public source field ${field} for ${entry.id}`);
    }
  }
  for (const localeName of expectedLocales) {
    if (typeof entry.titles?.[localeName] !== "string" || !entry.titles[localeName].trim()) {
      fail(`Missing localized public source title ${localeName}:${entry.id}`);
    }
  }
}
const cc0Count = soundSources.entries.filter((entry) => entry.license === "CC0").length;
const governmentCount = soundSources.entries.filter(
  (entry) => entry.license === "Public Domain / NPS" ||
    entry.license === "Public Domain / NOAA"
).length;
const publicDomainCount = soundSources.entries.filter(
  (entry) => entry.license.toLowerCase().startsWith("public domain") &&
    entry.license !== "Public Domain / NPS" &&
    entry.license !== "Public Domain / NOAA"
).length;
const ccByCount = soundSources.entries.filter((entry) =>
  entry.license.toLowerCase().includes("cc by")
).length;
if (cc0Count !== 57 || governmentCount !== 11 || publicDomainCount !== 4 || ccByCount !== 0) {
  fail(
    `Unexpected public license composition: CC0=${cc0Count}, ` +
      `U.S. Government=${governmentCount}, public domain=${publicDomainCount}, CC BY=${ccByCount}`
  );
}

const english = catalog.locales.en;
for (const localeName of expectedLocales) {
  const locale = catalog.locales[localeName];
  if (!locale) fail(`Missing site locale: ${localeName}`);
  if (keys(locale.common) !== keys(english.common)) {
    fail(`Common key mismatch for ${localeName}`);
  }
  for (const page of pages) {
    if (!locale[page]) fail(`Missing ${page} catalog for ${localeName}`);
    if (keys(locale[page]) !== keys(english[page])) {
      fail(`${page} key mismatch for ${localeName}`);
    }
    for (const [key, value] of Object.entries(locale[page])) {
      if (typeof value !== "string" || !value.trim()) {
        fail(`Blank ${localeName}.${page}.${key}`);
      }
    }
  }
  if (locale.common.copyright !== "© 2026 fang xu") {
    fail(`Copyright must name the legal publisher for ${localeName}`);
  }
}

for (const localeName of ["en", "ru", "de", "fr"]) {
  const text = JSON.stringify(catalog.locales[localeName]);
  if (/[\u3400-\u9fff]/u.test(text)) {
    fail(`Unexpected Chinese text in the ${localeName} site catalog`);
  }
}

for (const file of ["index.html", "support.html", "privacy.html", "sources.html"]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  for (const phrase of forbiddenMachinePhrases) {
    if (html.includes(phrase)) {
      fail(`${file} contains a known machine-translation regression: ${phrase}`);
    }
  }
  const paths = [
    ...html.matchAll(/data-i18n(?:-html|-aria|-alt)?="([^"]+)"/g)
  ].map((match) => match[1]);
  for (const localeName of expectedLocales) {
    const locale = catalog.locales[localeName];
    for (const keyPath of paths) {
      if (typeof valueAt(locale, keyPath) !== "string") {
        fail(`${file} references missing ${localeName}.${keyPath}`);
      }
    }
  }

  const shell = html
    .replace(/<article class="legal-section"[\s\S]*?<\/article>/g, "")
    .replace(/<option[\s\S]*?<\/option>/g, "");
  if (/[\u3400-\u9fff]/u.test(shell)) {
    fail(`${file} contains fixed Chinese text outside localized legal sections`);
  }
  if (!html.includes('src="site-localizations.js"') || !html.includes('src="site.js"')) {
    fail(`${file} does not load the shared localization runtime`);
  }
}
const sourcesHtml = fs.readFileSync(path.join(root, "sources.html"), "utf8");
if (!sourcesHtml.includes('src="sound-sources-data.js"') || !sourcesHtml.includes('src="sources.js"')) {
  fail("sources.html does not load the generated directory and renderer.");
}

for (const file of ["support.html", "privacy.html", "sources.html"]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const sectionLocales = [...html.matchAll(/data-language="([^"]+)"/g)].map((match) => match[1]);
  if (JSON.stringify(sectionLocales) !== JSON.stringify(expectedLocales)) {
    fail(`${file} must contain one legal section for each release locale`);
  }
}

console.log("Website localization validation passed: 8 locales × 4 pages.");
