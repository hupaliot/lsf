/* Recherche de vidéos LSF sous licence libre.
 *
 * 1. Vidéos personnelles déclarées dans LSF_DATA.localVideos (dossier videos/).
 * 2. Enregistrements Lingua Libre déposés sur Wikimedia Commons. Leurs fichiers
 *    sont nommés « LL-Q<langue> (fsl)-<contributeur>-<mot>.<ext> » ; on interroge
 *    l'API publique de Commons depuis le navigateur et on garde les fichiers
 *    dont le mot correspond exactement.
 * Les résultats sont mis en cache localement pour éviter de refaire les requêtes. */

window.LSF_VIDEOS = (function () {
  "use strict";

  const API = "https://commons.wikimedia.org/w/api.php";
  const CACHE_KEY = "signons:videos:v1";
  const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
  const TITLE_RE = /^File:LL-Q\d+ \(fsl\)-(.+?)-(.+)\.(webm|ogv|ogg|mp4)$/i;

  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch (e) { /* stockage indisponible */ }
  const pending = {};

  function saveCache() {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) { /* ignore */ }
  }

  function normalize(s) {
    return s.normalize("NFC").toLowerCase().replace(/[’_]/g, (c) => (c === "_" ? " " : "'")).trim();
  }

  function stripHtml(s) {
    const div = document.createElement("div");
    div.innerHTML = s || "";
    return div.textContent.trim();
  }

  async function searchCommons(word) {
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      origin: "*",
      generator: "search",
      gsrnamespace: "6",
      gsrlimit: "20",
      gsrsearch: `intitle:fsl intitle:"${word.replace(/"/g, "")}"`,
      prop: "imageinfo",
      iiprop: "url|extmetadata|mime",
      iiextmetadatafilter: "Artist|LicenseShortName|LicenseUrl"
    });
    const res = await fetch(API + "?" + params);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const json = await res.json();
    const pages = Object.values((json.query && json.query.pages) || {});
    const target = normalize(word);
    return pages
      .map((p) => {
        const m = TITLE_RE.exec(p.title);
        const info = p.imageinfo && p.imageinfo[0];
        if (!m || !info || normalize(m[2]) !== target) return null;
        const meta = info.extmetadata || {};
        return {
          src: info.url,
          page: info.descriptionurl,
          author: stripHtml(meta.Artist && meta.Artist.value) || m[1],
          license: stripHtml(meta.LicenseShortName && meta.LicenseShortName.value) || "Licence libre",
          licenseUrl: meta.LicenseUrl ? meta.LicenseUrl.value : info.descriptionurl,
          source: "Lingua Libre / Wikimedia Commons"
        };
      })
      .filter(Boolean);
  }

  /* Renvoie une liste (éventuellement vide) de vidéos pour un mot. */
  function find(word) {
    const local = (window.LSF_DATA.localVideos || {})[word];
    if (local) {
      return Promise.resolve([{ src: local.src || local, author: local.author || "", license: local.license || "", source: "Vidéo personnelle" }]);
    }
    const hit = cache[word];
    if (hit && Date.now() - hit.at < CACHE_TTL) return Promise.resolve(hit.videos);
    if (!pending[word]) {
      pending[word] = searchCommons(word)
        .then((videos) => {
          cache[word] = { at: Date.now(), videos };
          saveCache();
          return videos;
        })
        .finally(() => delete pending[word]);
    }
    return pending[word];
  }

  return { find };
})();
