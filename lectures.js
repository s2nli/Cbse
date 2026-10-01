/* CBSE Class 10 Full Course (PW & Next Toppers) — Subjects -> Chapters -> Lectures drilldown.
   Renders inside the Codexyt layout; routing via #lectures / #lectures/<s> / #lectures/<s>/<c>. */
(function () {
  "use strict";
  const BATCH = {
    _id: "cbse10-full-course",
    name: "CBSE Class 10 Full Course (PW & Next Toppers)",
    byName: "Maths, Science, SST, English & Kannada · one-shot lectures",
    language: "Hinglish",
    previewImage: "assets/cbse10-cover.svg",
    local: "lectures",
    subBatches: [],
    subjectCount: Object.keys(window.LectureData || {}).length
  };
  window.CX_LECTURE_BATCH = BATCH;

  const ICONS = {
    math: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 12h8M12 8v8"/>',
    sci: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)"/>',
    sst: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    eng: '<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/>',
    lang: '<path d="M4 6h9M8.5 4v2M6 6c.5 3.5 3 6 6 7M12 6c-.5 3-2.5 5.5-6 7.5"/><path d="m13 20 4-9 4 9M14.5 17h5"/>'
  };
  function iconFor(name) {
    if (/math/i.test(name)) return ICONS.math;
    if (/social/i.test(name)) return ICONS.sst;
    if (/science/i.test(name)) return ICONS.sci;
    if (/english/i.test(name)) return ICONS.eng;
    if (/kannada/i.test(name)) return ICONS.lang;
    return ICONS.eng;
  }
  const svg = (inner, cls) => `<svg class="${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  const PLAY = '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>';
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));

  const data = () => window.LectureData || {};
  const subjects = () => Object.keys(data());
  const chaptersOf = (s) => Object.keys(data()[s] || {});
  const shortName = (s) => s.replace(/\s*\(\d+\)\s*$/, "");
  const codeOf = (s) => (s.match(/\((\d+)\)/) || [])[1] || "";

  let root, bodyEl, crumbEl, homeSection;

  function ensureDom() {
    if (root) return true;
    const shell = document.querySelector("main .shell");
    homeSection = document.getElementById("courses");
    if (!shell || !homeSection) return false;
    root = document.createElement("section");
    root.id = "lecturesView";
    root.className = "section lectures-view";
    root.hidden = true;
    root.innerHTML = '<div class="lectures-top"><button type="button" class="lectures-back btn btn-quiet" id="lecBackBtn">' +
      svg('<path d="M15 5l-7 7 7 7"/>') + ' <span id="lecBackLabel">All Batches</span></button>' +
      '<nav class="lectures-breadcrumb" id="lecCrumb" aria-label="Breadcrumb"></nav></div>' +
      '<div class="lectures-head"><h1 class="lectures-title" id="lecTitle"></h1><p class="lectures-sub" id="lecSub"></p></div>' +
      '<div class="lectures-content" id="lecBody"></div>';
    shell.appendChild(root);
    bodyEl = root.querySelector("#lecBody");
    crumbEl = root.querySelector("#lecCrumb");
    root.querySelector("#lecBackBtn").addEventListener("click", goBack);
    crumbEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-go]");
      if (b) location.hash = b.dataset.go;
    });
    bodyEl.addEventListener("click", onBodyClick);
    bodyEl.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const t = e.target.closest("[data-go],[data-yt]");
      if (t && t === e.target) { e.preventDefault(); onBodyClick(e); }
    });
    return true;
  }

  function parse() {
    const m = location.hash.match(/^#lectures(?:\/(\d+))?(?:\/(\d+))?/);
    if (!m) return null;
    const subs = subjects();
    const s = m[1] != null ? subs[+m[1]] : null;
    const c = s && m[2] != null ? chaptersOf(s)[+m[2]] : null;
    return { si: s ? +m[1] : null, ci: c ? +m[2] : null, s, c };
  }

  function goBack() {
    const r = parse();
    if (!r || r.s == null) { location.hash = "#home"; return; }
    location.hash = r.c != null ? `#lectures/${r.si}` : "#lectures";
  }

  function crumb(parts) {
    crumbEl.innerHTML = parts.map((p, i) => {
      const last = i === parts.length - 1;
      return (i ? '<span class="breadcrumb-separator" aria-hidden="true">/</span>' : "") +
        (last ? `<span class="breadcrumb-item active" aria-current="page">${esc(p.label)}</span>`
          : `<button type="button" class="breadcrumb-item" data-go="${esc(p.go)}">${esc(p.label)}</button>`);
    }).join("");
  }

  function head(title, sub) {
    root.querySelector("#lecTitle").textContent = title;
    root.querySelector("#lecSub").textContent = sub;
  }

  function renderSubjects() {
    root.querySelector("#lecBackLabel").textContent = "All Batches";
    crumb([{ label: "Batches", go: "#home" }, { label: "CBSE Class 10" }]);
    head("CBSE Class 10 Full Course", "PW & Next Toppers one-shot lectures · pick a subject to begin");
    bodyEl.innerHTML = '<div class="subject-grid">' + subjects().map((s, i) => {
      const chs = chaptersOf(s);
      return `<div class="subject-card" role="button" tabindex="0" data-go="#lectures/${i}" aria-label="${esc(shortName(s))}, ${chs.length} chapters">
        <div class="subject-icon">${svg(iconFor(s))}</div>
        <div class="subject-name">${esc(shortName(s))}</div>
        <div class="subject-meta">${codeOf(s) ? "Code " + esc(codeOf(s)) + " · " : ""}${chs.length} chapters</div></div>`;
    }).join("") + "</div>";
  }

  function renderChapters(r) {
    root.querySelector("#lecBackLabel").textContent = "Subjects";
    crumb([{ label: "Batches", go: "#home" }, { label: "CBSE Class 10", go: "#lectures" }, { label: shortName(r.s) }]);
    head(shortName(r.s), `${chaptersOf(r.s).length} chapters · PW & NT one-shots`);
    bodyEl.innerHTML = '<div class="chapter-list">' + chaptersOf(r.s).map((c, i) =>
      `<div class="chapter-item" role="button" tabindex="0" data-go="#lectures/${r.si}/${i}">
        <span class="chapter-num">${i + 1}</span><span class="chapter-title">${esc(c)}</span>
        <span class="chapter-count">PW &amp; NT</span>${svg('<path d="M9 5l7 7-7 7"/>', "chapter-arrow")}</div>`).join("") + "</div>";
  }

  function card(v, channel, s, c) {
    const q = `${v.title.replace(/\s*\|\s*(PW|NT)\s*$/i, "")} Class 10 CBSE ${channel}`;
    return `<div class="video-card" role="button" tabindex="0" data-yt="${esc(q)}" aria-label="Play ${esc(v.title)}">
      <div class="video-thumb"><img src="${esc(v.thumb)}" alt="" loading="lazy" onerror="this.style.display='none'">
        <span class="video-duration">${esc(v.duration)}</span>
        <span class="play-icon">${svg(PLAY)}</span></div>
      <div class="video-info"><div class="video-title" title="${esc(v.title)}">${esc(v.title)}</div>
        <div class="video-meta"><span>${esc(channel)}</span><span>One Shot</span></div></div></div>`;
  }

  function renderVideos(r) {
    root.querySelector("#lecBackLabel").textContent = shortName(r.s);
    crumb([{ label: "Batches", go: "#home" }, { label: "CBSE Class 10", go: "#lectures" },
      { label: shortName(r.s), go: `#lectures/${r.si}` }, { label: r.c }]);
    head(r.c, `${shortName(r.s)} · choose a teacher`);
    const d = data()[r.s][r.c];
    const cols = [["pw", "Physics Wallah", d.pw], ["nt", "Next Toppers", d.nt]];
    bodyEl.innerHTML = '<div class="lec-tabs" role="tablist">' + cols.map((x, i) =>
      `<button type="button" role="tab" class="lec-tab${i ? "" : " active"}" data-tab="${x[0]}" aria-selected="${!i}">${x[1]}<span>${x[2].length}</span></button>`).join("") + "</div>" +
      '<div class="lec-cols">' + cols.map((x, i) =>
        `<div class="lec-col${i ? "" : " active"}" data-col="${x[0]}"><h3 class="lec-col-title">${x[1]}</h3><div class="video-grid">${x[2].map((v) => card(v, x[1], r.s, r.c)).join("")}</div></div>`).join("") + "</div>";
  }

  function onBodyClick(e) {
    const tab = e.target.closest("[data-tab]");
    if (tab) {
      bodyEl.querySelectorAll(".lec-tab").forEach((t) => { const on = t === tab; t.classList.toggle("active", on); t.setAttribute("aria-selected", String(on)); });
      bodyEl.querySelectorAll(".lec-col").forEach((c) => c.classList.toggle("active", c.dataset.col === tab.dataset.tab));
      return;
    }
    const yt = e.target.closest("[data-yt]");
    if (yt) {
      window.open("https://www.youtube.com/results?search_query=" + encodeURIComponent(yt.dataset.yt), "_blank", "noopener");
      return;
    }
    const go = e.target.closest("[data-go]");
    if (go) location.hash = go.dataset.go;
  }

  function route() {
    const r = parse();
    if (!ensureDom()) return;
    const on = !!r;
    root.hidden = !on;
    homeSection.hidden = on;
    document.body.classList.toggle("lectures-open", on);
    if (!on) return;
    if (!subjects().length) {
      bodyEl.innerHTML = '<div class="empty">Lecture data could not be loaded. Please refresh.</div>';
      return;
    }
    if (r.s == null) renderSubjects();
    else if (r.c == null) renderChapters(r);
    else renderVideos(r);
    window.scrollTo({ top: 0 });
  }

  window.CXLectures = {
    batch: BATCH,
    open() { location.hash = "#lectures"; }
  };
  window.addEventListener("hashchange", route);
  document.addEventListener("DOMContentLoaded", route);
  if (document.readyState !== "loading") route();
})();
