import { useState, useEffect, useRef, useCallback } from "react";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const INSTRUMENT_DEFINITIONS = [
  {
    id: "guitar",
    emoji: "🎸",
    tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
    color: "#FF6B35",
    strings: 6,
  },
  {
    id: "bass",
    emoji: "🎸",
    tuning: ["E1", "A1", "D2", "G2"],
    color: "#7B2FF7",
    strings: 4,
  },
  {
    id: "ukulele",
    emoji: "🪕",
    tuning: ["G4", "C4", "E4", "A4"],
    color: "#00C9A7",
    strings: 4,
  },
  {
    id: "violin",
    emoji: "🎻",
    tuning: ["G3", "D4", "A4", "E5"],
    color: "#C4375B",
    strings: 4,
  },
  {
    id: "cello",
    emoji: "🎻",
    tuning: ["C2", "G2", "D3", "A3"],
    color: "#E8871E",
    strings: 4,
  },
  {
    id: "banjo",
    emoji: "🪕",
    tuning: ["G4", "D3", "G3", "B3", "D4"],
    color: "#2D9CDB",
    strings: 5,
  },
  {
    id: "mandolin",
    emoji: "🪕",
    tuning: ["G3", "D4", "A4", "E5"],
    color: "#F2C94C",
    strings: 4,
  },
  {
    id: "chromatic",
    emoji: "🎵",
    tuning: [],
    color: "#56CCF2",
    strings: 0,
  },
];

const PRIMARY_INSTRUMENT_IDS = ["guitar", "bass", "ukulele"];

const COPY = {
  "zh-Hant": {
    documentTitle: "Chord4調音器",
    siteName: "Chord4 調音器",
    searchPlaceholder: "搜尋歌手或歌名...",
    searchButton: "搜尋",
    nav: {
      home: "首頁",
      square: "廣場",
      time: "時刻",
      tablist: "譜單",
      bbs: "論壇區",
      chordsearch: "和弦搜尋",
      backToSite: "返回 Chord4 主站",
    },
    mainMenu: "Chord4 主選單",
    heroDescription: "延續 Chord4 主站導覽體驗，提供簡潔白底的本機麥克風調音工具。",
    heroSearchHint: "歌譜搜尋將另開新分頁",
    referencePitch: "A4 基準",
    referencePitchAria: "A4 基準音高",
    instrumentSection: "樂器選擇",
    selectInstrument: "選擇樂器",
    moreInstruments: "更多樂器",
    collapseInstruments: "收合更多樂器",
    detailsSuffix: "詳細資訊",
    stringLabel: (index, note) => `第 ${index + 1} 弦：${note}，點擊可播放參考音`,
    tunerDisplay: "調音器顯示區",
    tuningStatus: (cents) => `音準：${cents} 音分，${cents > 0 ? "偏高" : "偏低"}`,
    waitingForInput: "等待聲音輸入",
    playPrompt: "請彈奏一個音",
    volumeLabel: (volume) => `輸入音量：${Math.round(volume * 100)}%`,
    startTuner: "● 開始調音",
    stopTuner: "■ 停止調音",
    startTunerAria: "開始調音，需要麥克風權限",
    stopTunerAria: "停止調音",
    tipsAria: "提示",
    tipsTitle: "使用提示",
    tips: [
      "預設提供吉他、貝斯與烏克麗麗，其餘樂器可從更多樂器展開。",
      "點擊開始調音並允許瀏覽器存取本機麥克風。",
      "彈奏單音後，中央指示條會顯示目前偏高或偏低。",
      "點擊弦音按鈕可播放對應參考音，方便快速校準。",
    ],
    footerLinksLabel: "友情鏈接：",
    disclaimer: "免責聲明！本站內容僅供吉他愛好者學習之用。聯繫方式：contact@chord4.com",
    sitemap: "網站地圖",
    mobileVersion: "chord4.com手機版本",
    designedBy: " / chord4.com / designed by reecho @2012-2026",
    openSource: " / 基於 PitchCraft 開源專案改作 · 保留 PitchCraft 引用資訊 · MIT License",
    mobileOpenSource: "基於 PitchCraft 開源專案改作 · PitchCraft · MIT License",
    centsLabels: {
      inTune: "音準準確",
      almost: "接近準確",
      sharp: "偏高",
      flat: "偏低",
    },
    instruments: {
      guitar: { name: "吉他", description: "標準 6 弦調音" },
      bass: { name: "貝斯", description: "標準 4 弦調音" },
      ukulele: { name: "烏克麗麗", description: "標準 GCEA 調音" },
      violin: { name: "小提琴", description: "標準調音" },
      cello: { name: "大提琴", description: "標準調音" },
      banjo: { name: "班卓琴", description: "Open G 調音" },
      mandolin: { name: "曼陀林", description: "標準調音" },
      chromatic: { name: "半音階", description: "所有音高，適用任何樂器" },
    },
  },
  "zh-Hans": {
    documentTitle: "Chord4调音器",
    siteName: "Chord4 调音器",
    searchPlaceholder: "搜索歌手或歌名...",
    searchButton: "搜索",
    nav: {
      home: "首页",
      square: "广场",
      time: "时刻",
      tablist: "谱单",
      bbs: "论坛区",
      chordsearch: "和弦搜索",
      backToSite: "返回 Chord4 主站",
    },
    mainMenu: "Chord4 主菜单",
    heroDescription: "延续 Chord4 主站导航体验，提供简洁白底的本机麦克风调音工具。",
    heroSearchHint: "歌谱搜索将另开新分页",
    referencePitch: "A4 基准",
    referencePitchAria: "A4 基准音高",
    instrumentSection: "乐器选择",
    selectInstrument: "选择乐器",
    moreInstruments: "更多乐器",
    collapseInstruments: "收起更多乐器",
    detailsSuffix: "详细信息",
    stringLabel: (index, note) => `第 ${index + 1} 弦：${note}，点击可播放参考音`,
    tunerDisplay: "调音器显示区",
    tuningStatus: (cents) => `音准：${cents} 音分，${cents > 0 ? "偏高" : "偏低"}`,
    waitingForInput: "等待声音输入",
    playPrompt: "请弹奏一个音",
    volumeLabel: (volume) => `输入音量：${Math.round(volume * 100)}%`,
    startTuner: "● 开始调音",
    stopTuner: "■ 停止调音",
    startTunerAria: "开始调音，需要麦克风权限",
    stopTunerAria: "停止调音",
    tipsAria: "提示",
    tipsTitle: "使用提示",
    tips: [
      "默认提供吉他、贝斯与尤克里里，其余乐器可从更多乐器展开。",
      "点击开始调音并允许浏览器访问本机麦克风。",
      "弹奏单音后，中央指示条会显示当前偏高或偏低。",
      "点击弦音按钮可播放对应参考音，方便快速校准。",
    ],
    footerLinksLabel: "友情链接：",
    disclaimer: "免责声明！本站内容仅供吉他爱好者学习之用。联系方式：contact@chord4.com",
    sitemap: "网站地图",
    mobileVersion: "chord4.com手机版本",
    designedBy: " / chord4.com / designed by reecho @2012-2026",
    openSource: " / 基于 PitchCraft 开源项目改作 · 保留 PitchCraft 引用信息 · MIT License",
    mobileOpenSource: "基于 PitchCraft 开源项目改作 · PitchCraft · MIT License",
    centsLabels: {
      inTune: "音准准确",
      almost: "接近准确",
      sharp: "偏高",
      flat: "偏低",
    },
    instruments: {
      guitar: { name: "吉他", description: "标准 6 弦调音" },
      bass: { name: "贝斯", description: "标准 4 弦调音" },
      ukulele: { name: "尤克里里", description: "标准 GCEA 调音" },
      violin: { name: "小提琴", description: "标准调音" },
      cello: { name: "大提琴", description: "标准调音" },
      banjo: { name: "班卓琴", description: "Open G 调音" },
      mandolin: { name: "曼陀林", description: "标准调音" },
      chromatic: { name: "半音阶", description: "所有音高，适用于任何乐器" },
    },
  },
};

const CHORD4_REFERRAL_LINKS = [
  {
    key: "guitarChina",
    href: "https://www.guitarworld.com.cn/",
    labels: { "zh-Hant": "吉他中國", "zh-Hans": "吉他中国" },
  },
  {
    key: "kaopu",
    href: "https://www.douban.com/group/kaopujita/",
    labels: { "zh-Hant": "靠譜吉他小組", "zh-Hans": "靠谱吉他小组" },
  },
  {
    key: "jitashe",
    href: "https://www.jitashe.org/",
    labels: { "zh-Hant": "吉他社", "zh-Hans": "吉他社" },
  },
  {
    key: "chordog",
    href: "https://www.chordog.com/",
    labels: { "zh-Hant": "和弦狗", "zh-Hans": "和弦狗" },
  },
  {
    key: "musicren",
    href: "https://www.musicren.cn/",
    labels: { "zh-Hant": "音樂人網", "zh-Hans": "音乐人网" },
  },
  {
    key: "sendsplit",
    href: "https://sendsplit.com/",
    labels: { "zh-Hant": "SendSplit", "zh-Hans": "SendSplit" },
  },
  {
    key: "coloringease",
    href: "https://coloringease.com/",
    labels: { "zh-Hant": "Coloringease", "zh-Hans": "Coloringease" },
  },
];

function detectLocale() {
  if (typeof window === "undefined") return "zh-Hant";

  const queryLang = new URLSearchParams(window.location.search).get("lang")?.toLowerCase();
  if (queryLang === "zh-hans" || queryLang === "zh-cn" || queryLang === "zh-sg") {
    return "zh-Hans";
  }
  if (queryLang === "zh-hant" || queryLang === "zh-tw" || queryLang === "zh-hk") {
    return "zh-Hant";
  }

  const language = (navigator.languages?.[0] || navigator.language || "").toLowerCase();
  if (language.includes("hans") || /^zh-(cn|sg)/.test(language)) return "zh-Hans";
  if (language.startsWith("zh")) return "zh-Hant";

  return "zh-Hant";
}

function getSiteConfig(locale, copy) {
  const prefix = locale === "zh-Hans" ? "" : "/zh-hant";
  const baseUrl = `https://chord4.com${prefix}`;

  return {
    baseUrl,
    searchUrl: `${baseUrl}/search`,
    chordsearchUrl: `${baseUrl}/chordsearch`,
    navLinks: [
      { key: "home", label: copy.nav.home, href: baseUrl },
      { key: "square", label: copy.nav.square, href: `${baseUrl}/record/square` },
      { key: "time", label: copy.nav.time, href: `${baseUrl}/time` },
      { key: "tablist", label: copy.nav.tablist, href: `${baseUrl}/tablist` },
      { key: "bbs", label: copy.nav.bbs, href: `${baseUrl}/bbs/` },
    ],
    toolLinks: [
      { key: "chordsearch", label: copy.nav.chordsearch, href: `${baseUrl}/chordsearch` },
      { key: "backToSite", label: copy.nav.backToSite, href: baseUrl },
    ],
  };
}

const NOTE_FREQUENCIES = {};
for (let octave = 0; octave <= 8; octave++) {
  NOTES.forEach((note, i) => {
    const noteNum = octave * 12 + i - 9;
    NOTE_FREQUENCIES[`${note}${octave}`] = 440 * Math.pow(2, (noteNum - 49) / 12);
  });
}

function getClosestNote(freq) {
  if (!freq || freq < 20 || freq > 5000) return null;
  const noteNum = 12 * (Math.log2(freq / 440)) + 49;
  const rounded = Math.round(noteNum);
  const cents = Math.round((noteNum - rounded) * 100);
  const octave = Math.floor((rounded + 8) / 12);
  const noteIndex = ((rounded + 8) % 12 + 12) % 12;
  return {
    note: NOTES[noteIndex],
    octave,
    cents,
    frequency: freq,
    fullNote: `${NOTES[noteIndex]}${octave}`,
  };
}

// SVG Instrument Illustrations
function GuitarSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="guit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Neck */}
      <rect x="54" y="5" width="12" height="55" rx="3" fill={color} opacity="0.7" />
      <line x1="57" y1="5" x2="57" y2="60" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
      <line x1="60" y1="5" x2="60" y2="60" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
      <line x1="63" y1="5" x2="63" y2="60" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
      {/* Frets */}
      {[15, 25, 35, 45].map((y) => (
        <line key={y} x1="54" y1={y} x2="66" y2={y} stroke="#fff" strokeWidth="1" opacity="0.4" />
      ))}
      {/* Headstock */}
      <rect x="50" y="2" width="20" height="8" rx="3" fill={color} opacity="0.8" />
      <circle cx="53" cy="5" r="1.5" fill="#fff" opacity="0.6" />
      <circle cx="67" cy="5" r="1.5" fill="#fff" opacity="0.6" />
      {/* Body */}
      <ellipse cx="60" cy="78" rx="28" ry="22" fill="url(#guit-grad)" />
      <ellipse cx="60" cy="98" rx="32" ry="20" fill="url(#guit-grad)" />
      {/* Sound hole */}
      <circle cx="60" cy="82" r="10" fill="rgba(0,0,0,0.3)" />
      <circle cx="60" cy="82" r="11" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* Bridge */}
      <rect x="52" y="100" width="16" height="3" rx="1" fill={color} opacity="0.8" />
      {/* Strings on body */}
      {[55, 57, 59, 61, 63, 65].map((x) => (
        <line key={x} x1={x} y1="60" x2={x} y2="100" stroke="#fff" strokeWidth="0.4" opacity="0.5" />
      ))}
    </svg>
  );
}

function BassSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="55" y="3" width="10" height="60" rx="2" fill={color} opacity="0.7" />
      <rect x="51" y="0" width="18" height="8" rx="3" fill={color} opacity="0.8" />
      <circle cx="54" cy="4" r="2" fill="#fff" opacity="0.5" />
      <circle cx="66" cy="4" r="2" fill="#fff" opacity="0.5" />
      {[18, 30, 42, 52].map((y) => (
        <line key={y} x1="55" y1={y} x2="65" y2={y} stroke="#fff" strokeWidth="1" opacity="0.4" />
      ))}
      <path d="M35 70 Q30 85 38 100 Q48 115 60 115 Q72 115 82 100 Q90 85 85 70 Q82 62 60 62 Q38 62 35 70Z" fill="url(#bass-grad)" />
      <ellipse cx="50" cy="82" rx="6" ry="8" fill="rgba(0,0,0,0.25)" />
      <ellipse cx="70" cy="82" rx="6" ry="8" fill="rgba(0,0,0,0.25)" />
      <rect x="54" y="98" width="12" height="3" rx="1" fill={color} opacity="0.8" />
      {[57, 59, 61, 63].map((x) => (
        <line key={x} x1={x} y1="62" x2={x} y2="98" stroke="#fff" strokeWidth="0.5" opacity="0.5" />
      ))}
    </svg>
  );
}

function UkuleleSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="uke-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="55" y="8" width="10" height="42" rx="3" fill={color} opacity="0.7" />
      <rect x="52" y="4" width="16" height="9" rx="4" fill={color} opacity="0.8" />
      <circle cx="55" cy="8" r="1.5" fill="#fff" opacity="0.5" />
      <circle cx="65" cy="8" r="1.5" fill="#fff" opacity="0.5" />
      {[18, 28, 38].map((y) => (
        <line key={y} x1="55" y1={y} x2="65" y2={y} stroke="#fff" strokeWidth="1" opacity="0.4" />
      ))}
      <ellipse cx="60" cy="72" rx="30" ry="28" fill="url(#uke-grad)" />
      <ellipse cx="60" cy="78" rx="28" ry="25" fill="url(#uke-grad)" />
      <circle cx="60" cy="72" r="12" fill="rgba(0,0,0,0.3)" />
      <circle cx="60" cy="72" r="13" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
      <rect x="54" y="94" width="12" height="2.5" rx="1" fill={color} opacity="0.8" />
      {[57, 59, 61, 63].map((x) => (
        <line key={x} x1={x} y1="50" x2={x} y2="94" stroke="#fff" strokeWidth="0.4" opacity="0.5" />
      ))}
    </svg>
  );
}

function ViolinSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="viol-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="57" y="3" width="6" height="38" rx="2" fill={color} opacity="0.7" />
      <rect x="53" y="0" width="14" height="7" rx="3" fill={color} opacity="0.8" />
      <circle cx="56" cy="3" r="1.5" fill="#fff" opacity="0.5" />
      <circle cx="64" cy="3" r="1.5" fill="#fff" opacity="0.5" />
      {/* Upper bout */}
      <ellipse cx="60" cy="52" rx="22" ry="16" fill="url(#viol-grad)" />
      {/* C-bout (waist) */}
      <ellipse cx="60" cy="68" rx="14" ry="8" fill="#0d0d12" />
      <ellipse cx="60" cy="68" rx="16" ry="9" fill="url(#viol-grad)" />
      {/* Lower bout */}
      <ellipse cx="60" cy="85" rx="26" ry="20" fill="url(#viol-grad)" />
      {/* F-holes */}
      <path d="M48 62 Q46 68 48 74" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" fill="none" />
      <path d="M72 62 Q74 68 72 74" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" fill="none" />
      {/* Tailpiece */}
      <rect x="56" y="96" width="8" height="10" rx="2" fill={color} opacity="0.8" />
      {/* Chin rest */}
      <ellipse cx="72" cy="100" rx="8" ry="6" fill={color} opacity="0.5" />
      {/* Strings */}
      {[57, 59, 61, 63].map((x) => (
        <line key={x} x1={x} y1="40" x2={x} y2="96" stroke="#fff" strokeWidth="0.4" opacity="0.5" />
      ))}
      {/* Bridge */}
      <rect x="54" y="78" width="12" height="2" rx="0.5" fill={color} opacity="0.9" />
    </svg>
  );
}

function CelloSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="cello-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Neck */}
      <rect x="56" y="3" width="8" height="30" rx="2" fill={color} opacity="0.7" />
      {/* Scroll */}
      <path d="M56 5 Q52 0 55 -2 Q58 -3 60 0" stroke={color} strokeWidth="2" fill="none" opacity="0.8" />
      {/* Pegs */}
      <circle cx="55" cy="8" r="2" fill="#fff" opacity="0.5" />
      <circle cx="65" cy="8" r="2" fill="#fff" opacity="0.5" />
      {/* Upper bout */}
      <ellipse cx="60" cy="42" rx="24" ry="14" fill="url(#cello-grad)" />
      {/* Waist */}
      <ellipse cx="60" cy="56" rx="16" ry="7" fill="#0d0d12" />
      <ellipse cx="60" cy="56" rx="18" ry="8" fill="url(#cello-grad)" />
      {/* Lower bout */}
      <ellipse cx="60" cy="75" rx="30" ry="22" fill="url(#cello-grad)" />
      {/* F-holes */}
      <path d="M46 50 Q44 56 46 62" stroke="rgba(0,0,0,0.4)" strokeWidth="2" fill="none" />
      <path d="M74 50 Q76 56 74 62" stroke="rgba(0,0,0,0.4)" strokeWidth="2" fill="none" />
      {/* Tailpiece */}
      <rect x="55" y="88" width="10" height="12" rx="2" fill={color} opacity="0.8" />
      {/* Endpin */}
      <line x1="60" y1="100" x2="60" y2="118" stroke={color} strokeWidth="2" opacity="0.6" />
      <circle cx="60" cy="118" r="2" fill={color} opacity="0.8" />
      {/* Strings */}
      {[56, 58.5, 61.5, 64].map((x) => (
        <line key={x} x1={x} y1="33" x2={x} y2="88" stroke="#fff" strokeWidth="0.5" opacity="0.5" />
      ))}
      <rect x="53" y="66" width="14" height="2.5" rx="0.5" fill={color} opacity="0.9" />
    </svg>
  );
}

function BanjoSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="banjo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Neck */}
      <rect x="55" y="5" width="10" height="50" rx="2" fill={color} opacity="0.7" />
      {/* Headstock */}
      <rect x="52" y="0" width="16" height="10" rx="3" fill={color} opacity="0.8" />
      <circle cx="55" cy="4" r="1.5" fill="#fff" opacity="0.5" />
      <circle cx="65" cy="4" r="1.5" fill="#fff" opacity="0.5" />
      {/* Frets */}
      {[18, 28, 38, 46].map((y) => (
        <line key={y} x1="55" y1={y} x2="65" y2={y} stroke="#fff" strokeWidth="1" opacity="0.4" />
      ))}
      {/* Pot (drum body) - circular */}
      <circle cx="60" cy="82" r="32" fill="url(#banjo-grad)" />
      <circle cx="60" cy="82" r="30" stroke={color} strokeWidth="2" fill="none" opacity="0.4" />
      <circle cx="60" cy="82" r="27" stroke={color} strokeWidth="0.5" fill="none" opacity="0.2" />
      {/* Membrane pattern */}
      <circle cx="60" cy="82" r="22" fill="rgba(255,255,255,0.05)" />
      {/* Bridge */}
      <rect x="54" y="82" width="12" height="3" rx="1" fill={color} opacity="0.9" />
      {/* Tailpiece */}
      <rect x="56" y="108" width="8" height="4" rx="1" fill={color} opacity="0.7" />
      {/* Strings */}
      {[56, 58, 60, 62, 64].map((x) => (
        <line key={x} x1={x} y1="55" x2={x} y2="108" stroke="#fff" strokeWidth="0.4" opacity="0.5" />
      ))}
      {/* 5th string peg */}
      <circle cx="55" cy="30" r="1.5" fill="#fff" opacity="0.5" />
    </svg>
  );
}

function MandolinSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="mando-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="55" y="5" width="10" height="40" rx="3" fill={color} opacity="0.7" />
      <rect x="52" y="2" width="16" height="8" rx="3" fill={color} opacity="0.8" />
      <circle cx="55" cy="5" r="1.5" fill="#fff" opacity="0.5" />
      <circle cx="65" cy="5" r="1.5" fill="#fff" opacity="0.5" />
      {[15, 22, 29, 36].map((y) => (
        <line key={y} x1="55" y1={y} x2="65" y2={y} stroke="#fff" strokeWidth="1" opacity="0.4" />
      ))}
      {/* Teardrop body */}
      <ellipse cx="60" cy="68" rx="28" ry="22" fill="url(#mando-grad)" />
      <path d="M40 78 Q50 110 60 112 Q70 110 80 78" fill="url(#mando-grad)" />
      {/* Sound hole */}
      <ellipse cx="60" cy="65" rx="8" ry="6" fill="rgba(0,0,0,0.3)" />
      <ellipse cx="60" cy="65" rx="9" ry="7" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />
      {/* Bridge */}
      <rect x="53" y="82" width="14" height="2.5" rx="1" fill={color} opacity="0.9" />
      {/* Tailpiece */}
      <rect x="56" y="100" width="8" height="5" rx="1.5" fill={color} opacity="0.7" />
      {/* Strings (paired) */}
      {[56, 58, 62, 64].map((x) => (
        <line key={x} x1={x} y1="45" x2={x} y2="100" stroke="#fff" strokeWidth="0.4" opacity="0.5" />
      ))}
    </svg>
  );
}

function ChromaticSVG({ color, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="chrom-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Tuning fork */}
      <rect x="58" y="55" width="4" height="45" rx="2" fill={color} opacity="0.7" />
      <path d="M50 15 Q50 55 58 55" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M70 15 Q70 55 62 55" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* Sound waves */}
      <path d="M38 25 Q32 35 38 45" stroke={color} strokeWidth="1.5" fill="none" opacity="0.3" />
      <path d="M32 20 Q24 35 32 50" stroke={color} strokeWidth="1.5" fill="none" opacity="0.2" />
      <path d="M82 25 Q88 35 82 45" stroke={color} strokeWidth="1.5" fill="none" opacity="0.3" />
      <path d="M88 20 Q96 35 88 50" stroke={color} strokeWidth="1.5" fill="none" opacity="0.2" />
      {/* Musical notes */}
      <circle cx="30" cy="70" r="4" fill={color} opacity="0.3" />
      <line x1="34" y1="55" x2="34" y2="70" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="90" cy="65" r="4" fill={color} opacity="0.3" />
      <line x1="94" y1="50" x2="94" y2="65" stroke={color} strokeWidth="1.5" opacity="0.3" />
      {/* Base */}
      <circle cx="60" cy="105" r="6" fill="url(#chrom-grad)" />
    </svg>
  );
}

const InstrumentSVGs = {
  guitar: GuitarSVG,
  bass: BassSVG,
  ukulele: UkuleleSVG,
  violin: ViolinSVG,
  cello: CelloSVG,
  banjo: BanjoSVG,
  mandolin: MandolinSVG,
  chromatic: ChromaticSVG,
};

const theme = {
  bg: "#f5f6f8",
  surface: "#ffffff",
  surfaceAlt: "#f7f8fa",
  text: "#1f2937",
  textMuted: "#6b7280",
  border: "#e5e7eb",
  shadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
};

export default function ChromaticTuner() {
  const [locale] = useState(detectLocale);
  const copy = COPY[locale];
  const siteConfig = getSiteConfig(locale, copy);
  const instruments = INSTRUMENT_DEFINITIONS.map((instrument) => ({
    ...instrument,
    name: copy.instruments[instrument.id].name,
    description: copy.instruments[instrument.id].description,
  }));
  const primaryInstruments = instruments.filter((instrument) =>
    PRIMARY_INSTRUMENT_IDS.includes(instrument.id)
  );
  const secondaryInstruments = instruments.filter(
    (instrument) => !PRIMARY_INSTRUMENT_IDS.includes(instrument.id)
  );

  const [selectedInstrumentId, setSelectedInstrumentId] = useState(INSTRUMENT_DEFINITIONS[0].id);
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState(null);
  const [referenceA, setReferenceA] = useState(440);
  const [showMoreInstruments, setShowMoreInstruments] = useState(false);
  const [selectedString, setSelectedString] = useState(null);
  const [volume, setVolume] = useState(0);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  const textScale = 1;
  const transition = "all 0.25s ease";
  const selectedInstrument = instruments.find((instrument) => instrument.id === selectedInstrumentId) || instruments[0];
  const secondaryExpanded = showMoreInstruments || secondaryInstruments.some(
    (instrument) => instrument.id === selectedInstrument.id
  );

  const autoCorrelate = useCallback((buf, sampleRate) => {
    let size = buf.length;
    let rms = 0;
    for (let i = 0; i < size; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / size);
    if (rms < 0.01) return -1;

    let r1 = 0, r2 = size - 1;
    const thresh = 0.2;
    for (let i = 0; i < size / 2; i++) {
      if (Math.abs(buf[i]) < thresh) { r1 = i; break; }
    }
    for (let i = 1; i < size / 2; i++) {
      if (Math.abs(buf[size - i]) < thresh) { r2 = size - i; break; }
    }

    buf = buf.slice(r1, r2);
    size = buf.length;

    const c = new Array(size).fill(0);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - i; j++) {
        c[i] += buf[j] * buf[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;

    let maxVal = -1, maxPos = -1;
    for (let i = d; i < size; i++) {
      if (c[i] > maxVal) { maxVal = c[i]; maxPos = i; }
    }

    let t0 = maxPos;
    const x1 = c[t0 - 1], x2 = c[t0], x3 = c[t0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) t0 = t0 - b / (2 * a);

    return sampleRate / t0;
  }, []);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);

      const detect = () => {
        const buf = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(buf);

        let rms = 0;
        for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
        rms = Math.sqrt(rms / buf.length);
        setVolume(Math.min(rms * 5, 1));

        const freq = autoCorrelate(buf, audioContext.sampleRate);
        if (freq > 0) {
          const noteInfo = getClosestNote(freq);
          if (noteInfo) setDetectedNote(noteInfo);
        }

        animFrameRef.current = requestAnimationFrame(detect);
      };
      detect();
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  }, [autoCorrelate]);

  const stopListening = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    setIsListening(false);
    setDetectedNote(null);
    setVolume(0);
  }, []);

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = copy.documentTitle;
  }, [copy.documentTitle, locale]);

  // Play reference tone
  const playTone = useCallback((freq) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  }, []);

  const getNoteFrequency = (noteStr) => {
    const note = noteStr.replace(/[0-9]/g, "");
    const octave = parseInt(noteStr.replace(/[^0-9]/g, ""));
    const noteIndex = NOTES.indexOf(note);
    const semitonesFromA4 = (octave - 4) * 12 + (noteIndex - 9);
    return referenceA * Math.pow(2, semitonesFromA4 / 12);
  };

  const getCentsColor = (cents) => {
    if (!cents && cents !== 0) return theme.textMuted;
    const abs = Math.abs(cents);
    if (abs <= 5) return "#22c55e";
    if (abs <= 15) return "#eab308";
    return "#ef4444";
  };

  const getCentsLabel = (cents) => {
    if (!cents && cents !== 0) return "";
    const abs = Math.abs(cents);
    if (abs <= 5) return copy.centsLabels.inTune;
    if (abs <= 15) return copy.centsLabels.almost;
    return cents > 0 ? copy.centsLabels.sharp : copy.centsLabels.flat;
  };

  const InstrumentIcon = InstrumentSVGs[selectedInstrument.id];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily:
          '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif',
        fontSize: `${14 * textScale}px`,
        transition,
        overflow: "auto",
      }}
    >
      <header className="chord4-site-header">
        <div className="chord4-topbar desktop-only">
          <div className="chord4-topbar-inner">
            <a className="chord4-logo" href={siteConfig.baseUrl}>
              chord4
            </a>
            <form
              action={siteConfig.searchUrl}
              method="get"
              target="_blank"
              className="chord4-search-form chord4-search-form-desktop"
            >
              <input
                name="search_text"
                type="text"
                maxLength="60"
                placeholder={copy.searchPlaceholder}
                aria-label={copy.searchPlaceholder}
              />
              <button type="submit">{copy.searchButton}</button>
            </form>
            <nav className="chord4-nav" aria-label={copy.mainMenu}>
              {siteConfig.navLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="chord4-mobile-header mobile-only">
          <div className="chord4-mobile-brand-row">
            <a className="chord4-logo" href={siteConfig.baseUrl}>
              chord4
            </a>
          </div>
          <form
            action={siteConfig.searchUrl}
            method="get"
            target="_blank"
            className="chord4-search-form chord4-search-form-mobile"
          >
            <input
              name="search_text"
              type="search"
              placeholder={copy.searchPlaceholder}
              aria-label={copy.searchPlaceholder}
            />
            <button type="submit">{copy.searchButton}</button>
          </form>
          <nav className="chord4-mobile-nav" aria-label={copy.mainMenu}>
            {siteConfig.navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}            
          </nav>
        </div>
      </header>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px" }}>
        <section
          style={{
            background: theme.surface,
            borderRadius: "22px",
            border: `1px solid ${theme.border}`,
            padding: "24px 28px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            boxShadow: theme.shadow,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                background: `linear-gradient(135deg, ${selectedInstrument.color}, ${selectedInstrument.color}bb)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "20px",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              ♪
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: `${28 * textScale}px`,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                {copy.siteName}
              </h1>
            </div>
          </div>

          <div className="tuner-hero-actions">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: theme.surfaceAlt,
                borderRadius: "10px",
                padding: "8px 12px",
                border: `1px solid ${theme.border}`,
              }}
            >
              <label
                htmlFor="ref-pitch"
                style={{ fontSize: `${12 * textScale}px`, color: theme.textMuted }}
              >
                {copy.referencePitch}
              </label>
              <select
                id="ref-pitch"
                value={referenceA}
                onChange={(e) => setReferenceA(Number(e.target.value))}
                aria-label={copy.referencePitchAria}
                style={{
                  background: "transparent",
                  border: "none",
                  color: theme.text,
                  fontSize: `${13 * textScale}px`,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {[432, 435, 438, 440, 442, 444].map((hz) => (
                  <option key={hz} value={hz} style={{ background: theme.surface }}>
                    {hz} Hz
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section aria-label={copy.instrumentSection}>
          <h2 className="sr-only" style={{ position: "absolute", left: "-9999px" }}>
            {copy.selectInstrument}
          </h2>

          <div style={{ marginBottom: "32px" }}>
            <div className="instrument-grid">
              {primaryInstruments.map((inst) => {
                const isActive = selectedInstrument.id === inst.id;
                const SVGComponent = InstrumentSVGs[inst.id];

                return (
                  <button
                    key={inst.id}
                    onClick={() => {
                      setSelectedInstrumentId(inst.id);
                      setSelectedString(null);
                    }}
                    aria-pressed={isActive}
                    aria-label={`${inst.name}：${inst.description}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      padding: "14px 8px",
                      borderRadius: "14px",
                      border: `2px solid ${isActive ? inst.color : theme.border}`,
                      background: isActive ? inst.color + "12" : theme.surface,
                      color: isActive ? inst.color : theme.text,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition,
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: isActive ? "none" : theme.shadow,
                    }}
                  >
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "3px",
                          background: inst.color,
                          borderRadius: "2px 2px 0 0",
                        }}
                      />
                    )}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SVGComponent color={isActive ? inst.color : theme.textMuted} size={48} />
                    </div>
                    <span
                      style={{
                        fontSize: `${12 * textScale}px`,
                        fontWeight: isActive ? 700 : 500,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {inst.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: "14px" }}>
              <button
                onClick={() => setShowMoreInstruments((value) => !value)}
                aria-expanded={secondaryExpanded}
                aria-controls="more-instruments-panel"
                style={{
                  padding: "10px 16px",
                  borderRadius: "999px",
                  border: `1px solid ${theme.border}`,
                  background: theme.surface,
                  color: theme.text,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: `${13 * textScale}px`,
                  boxShadow: theme.shadow,
                  transition,
                }}
              >
                {secondaryExpanded ? copy.collapseInstruments : copy.moreInstruments}
              </button>
            </div>

            {secondaryExpanded && (
              <div
                id="more-instruments-panel"
                className="instrument-grid instrument-grid-secondary"
                style={{ marginTop: "14px" }}
              >
                {secondaryInstruments.map((inst) => {
                  const isActive = selectedInstrument.id === inst.id;
                  const SVGComponent = InstrumentSVGs[inst.id];

                  return (
                    <button
                      key={inst.id}
                      onClick={() => {
                        setSelectedInstrumentId(inst.id);
                        setSelectedString(null);
                      }}
                      aria-pressed={isActive}
                      aria-label={`${inst.name}：${inst.description}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                        padding: "14px 8px",
                        borderRadius: "14px",
                        border: `2px solid ${isActive ? inst.color : theme.border}`,
                        background: isActive ? inst.color + "12" : theme.surface,
                        color: isActive ? inst.color : theme.text,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition,
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: isActive ? "none" : theme.shadow,
                      }}
                    >
                      {isActive && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "3px",
                            background: inst.color,
                            borderRadius: "2px 2px 0 0",
                          }}
                        />
                      )}
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SVGComponent color={isActive ? inst.color : theme.textMuted} size={48} />
                      </div>
                      <span
                        style={{
                          fontSize: `${12 * textScale}px`,
                          fontWeight: isActive ? 700 : 500,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {inst.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <div className="tuner-content-grid">
          <div>
            <section
              aria-label={`${selectedInstrument.name} ${copy.detailsSuffix}`}
              style={{
                background: theme.surface,
                borderRadius: "20px",
                border: `1px solid ${theme.border}`,
                padding: "28px",
                marginBottom: "24px",
                display: "flex",
                gap: "28px",
                alignItems: "center",
                flexWrap: "wrap",
                boxShadow: theme.shadow,
              }}
            >
              <div
                style={{
                  background: selectedInstrument.color + "10",
                  borderRadius: "16px",
                  padding: "12px",
                  border: `1px solid ${selectedInstrument.color}22`,
                  flexShrink: 0,
                }}
              >
                <InstrumentIcon color={selectedInstrument.color} size={100} />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h2
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: `${22 * textScale}px`,
                    fontWeight: 800,
                    color: selectedInstrument.color,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {selectedInstrument.name}
                </h2>
                <p
                  style={{
                    margin: "0 0 16px 0",
                    color: theme.textMuted,
                    fontSize: `${13 * textScale}px`,
                  }}
                >
                  {selectedInstrument.description}
                </p>

                {selectedInstrument.tuning.length > 0 && (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {selectedInstrument.tuning.map((note, i) => {
                      const isSelected = selectedString === i;

                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedString(i);
                            playTone(getNoteFrequency(note));
                          }}
                          aria-label={copy.stringLabel(i, note)}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "10px",
                            border: `2px solid ${isSelected ? selectedInstrument.color : theme.border}`,
                            background: isSelected ? selectedInstrument.color + "22" : theme.surfaceAlt,
                            color: isSelected ? selectedInstrument.color : theme.text,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            fontSize: `${14 * textScale}px`,
                            fontWeight: 700,
                            transition,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "2px",
                            minWidth: 52,
                          }}
                        >
                          <span>{note}</span>
                          <span
                            style={{
                              fontSize: `${9 * textScale}px`,
                              color: theme.textMuted,
                              fontWeight: 400,
                            }}
                          >
                            {Math.round(getNoteFrequency(note))} Hz
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            <section
              aria-label={copy.tunerDisplay}
              aria-live="polite"
              style={{
                background: theme.surface,
                borderRadius: "20px",
                border: `1px solid ${theme.border}`,
                padding: "32px",
                textAlign: "center",
                marginBottom: "24px",
                boxShadow: theme.shadow,
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: 12,
                  borderRadius: 6,
                  background: theme.surfaceAlt,
                  overflow: "hidden",
                  marginBottom: "28px",
                  border: `1px solid ${theme.border}`,
                }}
                role="meter"
                aria-label={
                  detectedNote
                    ? copy.tuningStatus(detectedNote.cents)
                    : copy.waitingForInput
                }
                aria-valuemin={-50}
                aria-valuemax={50}
                aria-valuenow={detectedNote ? detectedNote.cents : 0}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: "#22c55e",
                    transform: "translateX(-50%)",
                    zIndex: 2,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "45%",
                    width: "10%",
                    top: 0,
                    bottom: 0,
                    background: "#22c55e20",
                    zIndex: 1,
                  }}
                />
                {detectedNote && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${50 + detectedNote.cents}%`,
                      top: -2,
                      bottom: -2,
                      width: 8,
                      borderRadius: 4,
                      background: getCentsColor(detectedNote.cents),
                      transform: "translateX(-50%)",
                      transition: "left 0.1s ease",
                      zIndex: 3,
                      boxShadow: `0 0 12px ${getCentsColor(detectedNote.cents)}88`,
                    }}
                  />
                )}
                {[-40, -30, -20, -10, 0, 10, 20, 30, 40].map((tick) => (
                  <div
                    key={tick}
                    style={{
                      position: "absolute",
                      left: `${50 + tick}%`,
                      top: tick === 0 ? 0 : "30%",
                      bottom: tick === 0 ? 0 : "30%",
                      width: 1,
                      background: theme.textMuted + "44",
                    }}
                  />
                ))}
              </div>

              <div style={{ marginBottom: "8px" }}>
                <span
                  style={{
                    fontSize: `${72 * textScale}px`,
                    fontWeight: 900,
                    color: detectedNote ? getCentsColor(detectedNote.cents) : theme.textMuted + "44",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    transition,
                    textShadow: detectedNote
                      ? `0 0 40px ${getCentsColor(detectedNote.cents)}22`
                      : "none",
                  }}
                >
                  {detectedNote ? detectedNote.note : "—"}
                </span>
                <span
                  style={{
                    fontSize: `${28 * textScale}px`,
                    color: theme.textMuted,
                    fontWeight: 600,
                    verticalAlign: "super",
                  }}
                >
                  {detectedNote ? detectedNote.octave : ""}
                </span>
              </div>

              <div style={{ marginBottom: "4px" }}>
                <span
                  style={{
                    fontSize: `${16 * textScale}px`,
                    color: theme.textMuted,
                    fontFamily: "inherit",
                  }}
                >
                  {detectedNote ? `${detectedNote.frequency.toFixed(1)} Hz` : copy.playPrompt}
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: `${14 * textScale}px`,
                    fontWeight: 700,
                    color: detectedNote ? getCentsColor(detectedNote.cents) : "transparent",
                    letterSpacing: "0.04em",
                  }}
                >
                  {detectedNote ? getCentsLabel(detectedNote.cents) : "."}
                </span>
                {detectedNote && (
                  <span
                    style={{
                      display: "block",
                      fontSize: `${12 * textScale}px`,
                      color: theme.textMuted,
                      marginTop: "4px",
                    }}
                  >
                    {detectedNote.cents > 0 ? "+" : ""}
                    {detectedNote.cents} 音分
                  </span>
                )}
              </div>

              {isListening && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "3px",
                    marginTop: "20px",
                    alignItems: "flex-end",
                    height: 20,
                  }}
                  aria-label={copy.volumeLabel(volume)}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 4,
                        height: `${Math.max(4, (i < volume * 12 ? (i + 1) / 12 : 0.15) * 20)}px`,
                        borderRadius: 2,
                        background:
                          i < volume * 12 ? selectedInstrument.color : theme.surfaceAlt,
                        transition: "height 0.1s, background 0.1s",
                      }}
                    />
                  ))}
                </div>
              )}

              <button
                onClick={isListening ? stopListening : startListening}
                aria-label={isListening ? copy.stopTunerAria : copy.startTunerAria}
                style={{
                  marginTop: "28px",
                  padding: "14px 40px",
                  borderRadius: "14px",
                  border: "none",
                  background: isListening
                    ? "#ef4444"
                    : `linear-gradient(135deg, ${selectedInstrument.color}, ${selectedInstrument.color}cc)`,
                  color: "#fff",
                  fontSize: `${16 * textScale}px`,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  boxShadow: isListening
                    ? "0 4px 24px #ef444444"
                    : `0 4px 24px ${selectedInstrument.color}33`,
                  transition,
                }}
              >
                {isListening ? copy.stopTuner : copy.startTuner}
              </button>
            </section>
          </div>

          <aside>
            <section
              aria-label={copy.tipsAria}
              style={{
                background: theme.surface,
                borderRadius: "16px",
                border: `1px solid ${theme.border}`,
                padding: "20px 24px",
                marginBottom: "24px",
                boxShadow: theme.shadow,
                position: "sticky",
                top: 24,
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: `${13 * textScale}px`,
                  fontWeight: 700,
                  color: theme.textMuted,
                  letterSpacing: "0.04em",
                }}
              >
                {copy.tipsTitle}
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "12px",
                }}
              >
                {[
                  { icon: "🎯", text: copy.tips[0] },
                  { icon: "🎤", text: copy.tips[1] },
                  { icon: "🎵", text: copy.tips[2] },
                  { icon: "🔊", text: copy.tips[3] },
                ].map((tip, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      padding: "12px",
                      borderRadius: "12px",
                      background: theme.surfaceAlt,
                    }}
                  >
                    <span style={{ fontSize: "20px", flexShrink: 0 }} aria-hidden="true">
                      {tip.icon}
                    </span>
                    <span
                      style={{
                        fontSize: `${12 * textScale}px`,
                        color: theme.textMuted,
                        lineHeight: 1.6,
                      }}
                    >
                      {tip.text}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <footer className="chord4-footer">
          <div className="desktop-only chord4-footer-desktop">
            <div className="chord4-referral-links">
              <span>{copy.footerLinksLabel}</span>
              <div className="chord4-referral-list">
                {CHORD4_REFERRAL_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="nofollow ugc noreferrer"
                  >
                    {link.labels[locale]}
                  </a>
                ))}
              </div>
            </div>

            <div className="chord4-footer-meta">
              <p>{copy.disclaimer}</p>
              <p>
                <a href="https://chord4.com/sitemap.xml">{copy.sitemap}</a>
                <span>{copy.designedBy}</span>
              </p>
            </div>
          </div>

          <div className="mobile-only chord4-footer-mobile">
            <p>
              {copy.mobileVersion} /
              <a href="https://chord4.com/sitemap.xml">{copy.sitemap}</a>
              /@2012-2026
            </p>
            <p>{copy.mobileOpenSource}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
