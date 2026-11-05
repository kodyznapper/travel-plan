# CLAUDE.md — Travel Plan (แผนเที่ยว)

อ่านไฟล์นี้ก่อนแก้โค้ดทุกครั้ง ข้อมูลในนี้ตรวจกับโค้ดจริงตอนเขียน (Phase 2a/2b/2d เสร็จแล้ว) ถ้าไม่แน่ใจเรื่องไหน ให้เปิดโค้ดดู อย่าเดา

> **กฎเอกสาร (บังคับทุกครั้ง):** ทุกครั้งที่เพิ่ม/เปลี่ยน/ลบ feature ต้องอัปเดต **ทั้ง `CLAUDE.md` และ `README.md`** ในคอมมิตเดียวกับโค้ด ดูรายการที่ต้องแก้ในข้อ 4 "Definition of Done" งานที่เอกสารยังไม่อัปเดตถือว่ายังไม่เสร็จ
>
> **ถ้าไม่เข้าใจ ให้ถาม Kody ก่อนลงมือเสมอ** (เป้าหมาย ขอบเขต ข้อมูลที่ไม่รู้ ทางเลือกที่มีผลกับการออกแบบ) อย่าเดาแล้วทำไปก่อน

## 1. Project Overview

เว็บแผนเที่ยวแบบ interactive ไฟล์ HTML ไฟล์เดียว (`dist/travel-plan.html`) ไม่มี backend

- **เป้าหมาย:** import แผนเที่ยวจากไฟล์ markdown ที่ Claude สร้างตาม template แล้วแสดงเป็นเว็บที่ใช้ได้จริงบนมือถือระหว่างเที่ยว: ภาพรวมทริป, timeline รายวัน, เช็กลิสต์เตรียมของ, To-do, ข้อมูลอ้างอิง (เบอร์ฉุกเฉิน ประโยคภาษาท้องถิ่น การ์ดแท็กซี่)
- **ผู้ใช้และโมเดลการแชร์ (Kody ตัดสินแล้ว):** ทุกคนที่มี URL **ดูอย่างเดียว** (ติ๊ก checklist ของตัวเองได้) **Kody แก้ได้คนเดียว** แจกเป็น URL ของเว็บ HTML ตอนนี้แผนเดียวคือ Taiwan Trip 2026 (12–17 พ.ย. 2026, 8 คน)
  - **ที่ทำแล้ว (v2.1):** "โหมดเจ้าของ" ซ่อนเครื่องมือแก้ไข/นำเข้า/ส่งออก/หน้าวางแผนจากผู้ชม ปลดล็อกโดยแตะบรรทัดเวอร์ชันในหน้าตั้งค่า 7 ครั้งติด การแก้ไขของเจ้าของอยู่ใน browser เครื่องนั้นเท่านั้น ผู้ชมคนอื่นจะเห็นต่อเมื่อ Kody ส่งออก .md → ส่งให้ Claude → publish ทับลิงก์เดิม
  - **ที่ยังไม่ได้ทำ:** ให้การแก้ของ Kody ไปถึงทุกคนโดยไม่ต้องส่งไฟล์ ต้องมีที่เก็บกลางที่ "อ่านได้ทุกคน เขียนได้เฉพาะเจ้าของ" และบังคับฝั่ง server (Phase 2c บน Google Apps Script ดูข้อ 4 "Google Apps Script") ปุ่มซ่อนในหน้าไม่ใช่การป้องกัน
- **หน้าตา:** ต้นแบบคือ `Original_template.pdf` (ทริปไถจง 4 วัน) แต่ใช้ design system "Dark Tech Workshop" (dark เป็นค่าเริ่มต้น มี light เป็นตัวเลือก)
- **Deploy มี 2 target (Kody ตัดสินแล้ว 2026-11-05) ทุก phase ที่เสร็จต้องใช้งานได้บนทั้งสองที่:**
  1. **Google Apps Script (GAS) web app = ลิงก์หลักที่แจกเพื่อน** ⏳ ยังไม่ได้สร้าง · Deploy แบบ Execute as: Me (Kody), Who has access: **Anyone** (ไม่ต้อง login Google) · แผนเก็บเป็น **ไฟล์ `.md` ใน Google Drive ของ Kody** · การบันทึกต้องส่ง **รหัสแก้ไข** ที่ server ตรวจกับค่าใน Script Properties ทุกครั้ง · ผู้ชมทุกคนอ่านอย่างเดียว
  2. **claude.ai Artifact** `https://claude.ai/artifact/DtvUoYKnyT15PwAmGY2omk` (ของเดิม เก็บไว้คู่กัน) เป็นภาพนิ่งของแผนตอน publish (ฝัง seed) ไม่มีที่เก็บกลาง (CSP ของ Artifact บล็อก `fetch` ไป GAS) publish จากแชท claude.ai ด้วยเครื่องมือ Artifact, capability `downloads` การ publish ทับลิงก์เดิมทำให้ทุกคนได้เวอร์ชันใหม่ Claude Code ส่งไฟล์ `dist/travel-plan.html` ให้ Kody publish จากแชทได้

## 2. Tech Stack

| ส่วน | ที่ใช้ |
|---|---|
| ภาษา | JavaScript **ES5 style** (`var`, `function`, IIFE, ไม่มี module/transpile), CSS, HTML หนึ่งไฟล์ |
| Framework | **ไม่มี** (vanilla DOM + string templates + `innerHTML`) |
| Library (runtime) | `marked@12.0.2` UMD จาก `https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js` (ล็อกเวอร์ชัน) ใช้เฉพาะ render markdown |
| ฟอนต์ | IBM Plex Sans Thai (400/500/600/700) + JetBrains Mono (400/500/700) จาก Google Fonts, fallback `Tahoma, sans-serif` / `'Courier New', monospace` |
| ที่เก็บข้อมูล | ตอนนี้: `localStorage` (ต่อ browser ต่อเครื่อง) ไม่มี database · แผน GAS (⏳): ไฟล์ `.md` ใน Drive เป็นแหล่งความจริง + สำเนาใน `localStorage` + ติ๊ก checklist ของผู้ชมอยู่ใน `localStorage` ของเขาเอง |
| Server (⏳) | Google Apps Script (`Code.gs`, V8 runtime) `doGet` ส่งหน้า HtmlService, ฟังก์ชันที่หน้าเรียกผ่าน `google.script.run` |
| Build | `tools/build.py` (Python 3 stdlib) ประกอบ `src/*` + `data/*` เป็นไฟล์เดียว (target GAS ยังไม่มี ⏳) |
| Test | Node (parser, i18n) + Python Playwright/Chromium (e2e) |

**ห้ามใช้ (กฎของหน้าที่ publish เป็น Artifact และกฎของโปรเจกต์ ใช้กับโค้ดฝั่งหน้าเว็บของทั้งสอง target เพราะเป็นไฟล์ HTML ชุดเดียวกัน):**

- React/Vue/Svelte/Tailwind/jQuery หรือ build step ที่ต้อง `npm install` ถ้าจะเพิ่ม library ต้องคุยกับ Kody ก่อน
- script จากโฮสต์อื่นนอกรายการที่ CSP อนุญาต: `cdnjs.cloudflare.com`, `cdn.jsdelivr.net/npm/`, `cdn.tailwindcss.com`, `code.jquery.com` (ล็อกเวอร์ชันเสมอ ห้าม `@latest` ห้ามใช้ release ที่ออกไม่ถึง 2 สัปดาห์) stylesheet ได้เฉพาะ Google Fonts
- `unpkg`, `esm.sh`, รูปจากเว็บนอก, `fetch` ไปเว็บอื่น (ถูก CSP บล็อกแบบเงียบ)
- `window.storage`, `fetch("https://api.anthropic.com/...")`, `window.fs`, `window.claude.complete` (ใช้ได้เฉพาะ preview ในแชท ไม่ใช่หน้าที่ publish) ฟีเจอร์ที่ต้องใช้ Claude/ข้อมูลร่วมให้ใช้ capability `sample` / `db` / `artifact` ผ่าน `claude.use(...)` และเรียก `capabilities` ก่อนเขียนโค้ด
- `<form>` tag ใน UI ใช้ event handler (`data-act` + delegated click)
- สีขาวล้วน `#FFFFFF` / ดำล้วน `#000000` (กฎ design system) และสี accent ตัวที่ 3 (ดูข้อ 4 เรื่องข้อยกเว้นสีสายรถไฟ)
- ขนาดตัวอักษรเล็กกว่า 12px

## 3. Architecture / โครงสร้างโฟลเดอร์

```
travel-plan/
├─ CLAUDE.md
├─ Makefile                  build / test / e2e / serve
├─ src/
│  ├─ parser.js              markdown <-> model (window.TP หรือ module.exports) ไม่แตะ DOM
│  ├─ app.js                 แอปทั้งหมด (IIFE ~1,000 บรรทัด) ดูตารางด้านล่าง
│  └─ styles.css             tokens dark/light + components
├─ data/
│  ├─ seed/*.md              แผนที่ฝังมากับหน้า (window.TP_SEED) ตอนนี้: taiwan-2026.md
│  └─ travel-plan-template.md  template เปล่า + กฎ (ฝังเป็น window.TP_TEMPLATE ปุ่ม "Template (.md)")
├─ tools/build.py            -> dist/travel-plan.html
├─ tests/
│  ├─ parser.test.js         round-trip ของทุก md ใน data/ + line registry
│  ├─ i18n-coverage.js       ทุกข้อความไทยใน T('...') ต้องมีคำแปล EN
│  └─ e2e/ ftest.py ftest2.py shot.py run_all.sh
├─ vendor/marked.min.js      ใช้ใน e2e แทน CDN (offline) ตัวหน้าเว็บยังโหลดจาก CDN
└─ dist/travel-plan.html     ผลลัพธ์ (ไฟล์ที่ publish เป็น Artifact)
```

**ที่วางไว้สำหรับ GAS (⏳ ยังไม่มีในโค้ด ชื่ออาจเปลี่ยนตอนทำจริง ถ้าเปลี่ยนให้แก้ที่นี่):** `gas/Code.gs` (server: `doGet`, `getTrip`, `saveTrip`) · `gas/appsscript.json` (manifest: timezone, webapp access, scopes) · `dist/gas/` (ผลจาก build: `Code.gs` + `index.html` ที่ฝัง CSS/JS แล้ว พร้อม copy ไปวางในโปรเจกต์ Apps Script)

**src/app.js แบ่งตามลำดับในไฟล์:** icons (`IC`, `icon()`) → i18n (`LANG`, `EXACT`, `PHR`, `T()`, `L()`, `cnt()`) → dates → storage/state (`S`, `K`, `initData`, seed) → router (`parseHash`, `go`) → `render()` → dashboard + ปฏิทิน → `tripHtml` + views (`overviewView`, `dayView`, `itemView`, `packView`, `todoView`, `refView`, `planView`) → edit forms (`*Edit`) → `afterRender` + `placeNow` (Today mode) → metro SVG (`drawMetro`) → modal/toast/fullscreen → import/export/settings → event handlers → boot

**Data model** (ดู `TP.emptyTrip()` ใน parser.js): `trip = { id, meta{title,title_en,subtitle,...,timezone}, overview{flights[],stays[],remember,extra[]}, days[{n,date,theme,theme_en,route,stay,summary,summary_en,items[],must[],caution[],extra}], pack[{title,items[{text,done}],note}], todo[{due,text,done}], ref[{title,md}], plan, metaExtra, origin, localEdited, updatedAt }`
item = `{ id, time, title, en, zh, type, status, highlight, line, transport, transport_en, line_alt, transport_alt, transport_alt_en, cost, cost_en, notes, notes_en, map, extra{} }`

**Router:** hash `#home` หรือ `#<tripId>--<tab>` โดย tab = `overview | d1..dN | pack | todo | ref | plan` (`plan` เห็นเฉพาะโหมดวางแผน)

**localStorage keys:** `tp1.trips`, `tp1.settings` (`theme`, `planning`, `lang`, `owner`), `tp1.seed` (hash ของ seed ล่าสุด) ถ้าเปลี่ยนรูปแบบข้อมูลแบบที่ของเก่าอ่านไม่ได้ ให้เพิ่มเลขเวอร์ชันของ key (`tp2.*`) พร้อมเขียน migration ห้ามทับเงียบๆ

**Owner mode:** `S.settings.owner` (false เป็นค่าเริ่มต้น) ถ้าเป็น false `render()` บังคับ `planning=false` ทำให้ไม่มีปุ่มแก้ไข แท็บวางแผน badge สถานะ หรือเครื่องมือ import/export (ทุกอย่างผูกกับ `S.settings.planning`) ผู้ใช้เดิมที่เคยเปิดโหมดวางแผนก่อนมีฟีเจอร์นี้ถูก migrate ให้เป็นเจ้าของ (`owner = planning` ตอน `initData`) ปลดล็อก/ออก: ตั้งค่า → แตะบรรทัด `แผนเที่ยว v…` 7 ครั้งใน 1.5 วินาทีต่อครั้ง / ปุ่ม "ออกจากโหมดเจ้าของ" `APP_VERSION` อยู่ต้นไฟล์ `app.js` ให้เพิ่มเลขทุกครั้งที่ release

**Seed:** ตอนโหลด ถ้า hash ของ seed เปลี่ยน → แผนที่ผู้ใช้ไม่เคยแก้ (`localEdited=false`) ถูกแทนด้วยเวอร์ชันใหม่ ส่วนแผนที่แก้แล้วจะขึ้น dialog ให้เลือก "ใช้เวอร์ชันใหม่ / เก็บของในเครื่อง" (ติ๊ก checklist ถูกคัดลอกข้ามเวอร์ชันโดยจับคู่จากข้อความ)

**รูปแบบ markdown** (กฎละเอียดอยู่ในคอมเมนต์หัวไฟล์ `data/travel-plan-template.md` ซึ่งเป็นแหล่งความจริงของ schema): front matter `---` → `# ภาพรวม` (`## เที่ยวบิน` ตาราง, `## ที่พัก` ตาราง, `## จำไว้ตลอดทริป`) → `# Day N — YYYY-MM-DD · ธีม` (บรรทัด `route/stay/summary` แล้ว `### เวลา · ชื่อ` ตามด้วย `- key: value` หนึ่งบรรทัดต่อ field, `## ห้ามพลาดวันนี้`, `## ข้อควรระวัง`, `## ข้อมูลเพิ่มเติม`) → `# เตรียมของ` → `# To-do` → `# ข้อมูลอ้างอิง` → `# วางแผน` (เห็นเฉพาะโหมดวางแผน)

## 4. Coding Standards & Rules

**สไตล์โค้ด**
- syntax เป็น ES5 เท่านั้น: `var`, `function () {}`, ห้าม arrow function / `let` / `const` / template literal / `class` / `import` (ทั้ง `src/app.js` และ `src/parser.js` ตรวจแล้วไม่มี) แต่ใช้ API ระดับ ES2015+ ของ browser ปัจจุบันได้ที่ใช้อยู่แล้ว เช่น `Object.assign`, `Array.from`, `String.prototype.padStart`/`normalize`, `Intl.DateTimeFormat`, `ResizeObserver`
- indent 2 space, single quote, semicolon ทุกบรรทัด, ไฟล์ UTF-8
- `parser.js` ห้ามแตะ DOM และต้องรันใน Node ได้ (ใช้ใน test) · `app.js` ห้าม `require`
- UI หลักใช้ event delegation ที่ `document` ผ่าน `data-act` / `data-b` / `data-chk` (ดู handler `click` / `input` / `change` ท้ายไฟล์) ส่วน modal, import และ settings ผูก handler เฉพาะตัวใน `onOpen` ของ `modal()` ห้ามผูก handler ทีละ element ในหน้าปกติ
- ฟังก์ชัน `*View` / `*Edit` คืน HTML string แล้ว `render()` ใส่ `innerHTML` ครั้งเดียว ไม่มี state ใน DOM ยกเว้นสถานะชั่วคราวที่เก็บใน `S` (เช่น `S.open`)
- ไม่มีเพดานจำนวนบรรทัดต่อฟังก์ชันที่บังคับ แต่ฟังก์ชันใหม่ควรทำหน้าที่เดียว ถ้าเกิน ~60 บรรทัดให้แยก

**ความปลอดภัย (ห้ามพลาด)**
- ข้อความที่มาจาก md / ผู้ใช้ทุกชิ้นต้องผ่าน `esc()` หรือ `inl()` (escape แล้วค่อยใส่ **bold** / `code`) ก่อนเข้า `innerHTML` markdown ผ่าน `mdHtml()` ซึ่ง escape `<` ก่อน (`prepMd`) ห้ามเปิดให้ md ใส่ HTML ดิบ
- URL ใน `map:` ต้องขึ้นต้น `http(s)://` (เช็กใน `mapUrl`) ลิงก์ภายนอกใช้ `target="_blank" rel="noopener"`
- ค่า style ที่มาจากข้อมูล (สีสาย) ต้องผ่านรูปแบบ `#RRGGBB` เท่านั้น (`parseLines` บังคับ regex)

**Design system (Dark Tech Workshop)**
- ยึดจาก README ของ artifact `https://claude.ai/code/artifact/74f59b44-935f-45a6-8413-7facdf562393` ซึ่งมีไฟล์เดียวคือ `project/README.md` **ไม่มี** `tokens.json` / `slide-patterns.md` ค่าสีใน `styles.css` เป็นค่าที่เราเสนอเอง (Dark: surface `#0E1116`, card `#1C222B`, ส้ม `#F05032`, cyan `#22D3EE` · Light: surface `#F3F5F8`, ส้ม `#C2410C`, cyan `#0E7490`) contrast ที่วัดแล้ว: Dark ส้ม/surface 5.31, cyan/surface 10.46 (README 5.3 / 10.5) · Light ส้ม 4.74, cyan 4.91 ถ้าได้ `tokens.json` จริง ให้แทนค่าใน `:root` ของ `styles.css` ที่เดียว
- accent มี 2 สี: **ส้ม = ปัญหา/จุดสำคัญ/ตัวเลขใหญ่, cyan = ข้อมูลเสริม/ความรู้** สีที่ 3 ห้าม **ข้อยกเว้นเดียว: สีสายรถไฟ (`.lchip`, `.lblk`) เป็น "ข้อมูล" ไม่ใช่ accent ของ UI** และต้องมีข้อความรหัส/ชื่อสายกำกับเสมอ ไม่ใช้สีอย่างเดียว
- สถานะสำคัญต้องมีข้อความกำกับ (badge มีทั้ง emoji และคำ)
- ตัวอักษรบน chip สีสายเลือกขาว/ดำตาม contrast สูงสุด (`inkFor`) ห้ามแก้เป็นค่าคงที่
- checkbox วาดด้วย `<i class="cb">` + SVG ข้างๆ `<input>` ที่ซ่อนไว้ (`.ck input:checked + .cb`) **ห้ามใช้ `::after` บน `<input>`** เคยทำให้เครื่องหมายถูกเลื่อนไปติดขอบล่างบน browser ของ Kody (`ftest3.py` เช็กว่าเครื่องหมายอยู่กลางกรอบ ±1px)
- ธีม: ทุกสีใช้ตัวแปรใน `:root` (`--s1 --card --text --or --cy ...`) ห้าม hard-code hex ใน component ยกเว้นสีสายและ `#0E1116`/`#FBFCFD` ใน `inkFor`
- มือถือ: `viewport-fit=cover` + safe-area ที่ `:root`, `body::before`, `.topbar`, `.tabs` **อย่าลบ** sticky offset (`--tb` = 56px) ผูกกับ `.tabs` และ `scroll-padding-top`
- `prefers-reduced-motion` ต้องปิด animation (มีกฎรวมท้าย `styles.css`) motion ที่ใช้: เส้น metro วาดครั้งแรกต่อทริป, เปิด/ปิดการ์ด

**i18n (TH/EN)**
- ข้อความ UI ภาษาไทยทุกชิ้นใน `app.js` ต้องอยู่ในรูป `T('...')` หรือบรรทัดที่ลงท้าย `/*noT*/` (ตารางสองภาษาที่เขียนครบทั้งสองฝั่งแล้ว) `tests/i18n-coverage.js` จะล้มถ้ามีข้อความไทยที่ไม่ผ่านทั้งสองทาง
- `T()` ทำงานแบบ: ตรงทั้งสตริงใน `EXACT` ก่อน ไม่งั้นแทนที่วลีใน `PHR` เรียงจากยาวไปสั้น **ระวัง:** คีย์ใน `PHR` สั้นๆ อาจไปชนกลางคำอื่น (เช่น `ปิด` อยู่ใน `เปิด`) ให้ใส่คีย์ที่มี context (`data-res="x">ปิด</button>`) แล้วอ่านผลแปลจริงทุกครั้ง ไม่ใช่แค่ดูว่าผ่านเทสต์
- เนื้อหาจาก md ใช้ `L(obj, 'field')` (คืน `field_en` เมื่ออยู่โหมด EN และมีค่า ไม่งั้นคืน `field` เดิม) ชื่อสถานที่: โหมด EN ใช้ `en` เป็นชื่อหลัก มี `title` ไทยเป็นบรรทัดรอง
- จำนวนที่มีหน่วยใช้ `cnt(n, 'item'|'night'|'day'|'person'|'stop'|'plan')` (จัดเอกพจน์/พหูพจน์อังกฤษให้)
- ข้อความเตือนจาก `parser.js` ยังเป็นภาษาไทยอย่างเดียว (ดูข้อ 6)

**เมื่อเพิ่ม field ใหม่ให้ item** ต้องแก้ครบ: (1) `ITEM_KEYS` ใน parser.js (ลำดับที่นี่คือลำดับตอน export) (2) กฎในคอมเมนต์ของ `data/travel-plan-template.md` + ตัวอย่าง (3) `itemView` (4) ฟอร์มใน `dayEdit` (5) เพิ่มข้อมูลตัวอย่างใน seed ถ้าจำเป็น (6) รัน test ทั้งชุด — round-trip test จะจับกรณีลืม serialize

**เมื่อเพิ่มสายรถไฟใหม่** ใส่ใน `LINES` ที่ parser.js (hex, en, th, zh) แล้วตรวจ contrast ของข้อความบน chip ≥ 4.5:1 หรือให้ผู้ใช้ใช้ `ชื่อ#RRGGBB` ใน md โดยไม่ต้องแก้โค้ด

**Google Apps Script (target หลัก) — กฎที่ทุก phase ต้องผ่าน**

ข้อเท็จจริงด้านล่างมาจากความรู้ทั่วไปเรื่อง GAS ยังไม่ได้ทดสอบกับโปรเจกต์นี้ ข้อที่ติด `❓` ต้องทดสอบบน deployment จริงก่อนถือว่าใช้ได้ ทดสอบแล้วให้แก้ข้อความตรงนี้เป็นผลจริง

- **โค้ดหน้าเว็บชุดเดียวใช้ได้ทั้งสอง target** แยกพฤติกรรมด้วยการตรวจ environment ตอนรัน (`window.google && google.script && google.script.run`) ห้าม fork เป็น `app.js` สองไฟล์ ห้ามให้หน้าพังเมื่อไม่มี `google.script` (Artifact, `make serve`, e2e) หรือไม่มี `window.claude` (GAS)
- **สิทธิ์เขียนบังคับฝั่ง server เท่านั้น:** `saveTrip(md, editKey, baseVersion)` ใน `Code.gs` เทียบ `editKey` กับ `PropertiesService.getScriptProperties().getProperty('EDIT_KEY')` ถ้าไม่ตรงให้ throw โดยไม่เขียนอะไร · **ห้ามฝังรหัสแก้ไขใน HTML/JS/repo** (Kody ตั้งเองใน Script Properties) · ฝั่งหน้าเก็บรหัสไว้ใน `localStorage` เครื่องเจ้าของหลังกรอกครั้งแรก · โหมดเจ้าของ (`S.settings.owner`) ยังเป็นแค่ตัวซ่อนปุ่ม
- **กันเขียนทับ:** `saveTrip` รับ `baseVersion` (เช่น `updatedAt` หรือ revision ของไฟล์) ถ้าไฟล์ใน Drive ใหม่กว่า ให้ปฏิเสธแล้วให้หน้าถามว่าจะโหลดใหม่หรือเขียนทับ · ทุกครั้งที่บันทึกให้สำรองไฟล์เดิมไว้ในโฟลเดอร์ backup ใน Drive (ไม่พึ่งประวัติเวอร์ชันของ Drive อย่างเดียว)
- **ผู้ชมไม่ได้รับหัวข้อ `# วางแผน`:** `getTrip()` ที่ไม่มีรหัสแก้ไขให้ตัดหัวข้อนี้ออกฝั่ง server ก่อนส่ง (แก้ Known Issue 14 สำหรับ target GAS) · ข้อมูลส่วนตัวที่ไม่อยากให้เพื่อนเห็นอย่าใส่ใน md
- **ที่เก็บ:** ไฟล์ `.md` ใน Drive (ระบุด้วย file id ใน Script Properties `TRIP_FILE_ID`) ห้ามใช้ Script Properties เก็บตัวแผน (จำกัด ~9KB ต่อค่า seed ไต้หวัน 57KB) · Sheet ไม่ใช้ (1 cell ≤ 50,000 ตัวอักษร)
- **HtmlService:** หน้าอยู่ใน iframe ของ `*.googleusercontent.com` · ต้องตั้ง viewport ฝั่ง server ด้วย `HtmlOutput.addMetaTag('viewport', ...)` (meta viewport ใน HTML ไม่มีผล) และ `setTitle()` · `google.script.run` เป็น async ใช้ `withSuccessHandler` / `withFailureHandler` ทุกครั้ง พร้อมสถานะกำลังโหลด/บันทึก และข้อความ error ที่อ่านรู้เรื่อง (ผ่าน `T()`)
- **Router ❓:** hash ของ iframe ไม่สะท้อนขึ้น URL ด้านบน ลิงก์ที่แชร์แบบ `...exec#trip--d3` อาจไม่เปิดตรงหน้า ต้องใช้ `google.script.url.getLocation()` / `google.script.history` หรือ query `?tab=` ที่ `doGet(e)` อ่าน ทดสอบก่อนเลือก
- **localStorage ❓:** iframe เป็น third-party ของ `script.google.com` Safari/iOS อาจแยกหรือล้าง storage ทำให้ติ๊ก checklist ของผู้ชมหาย ต้องทดสอบบน iPhone จริง ถ้าใช้ไม่ได้ หน้าต้องยังทำงานได้ (อ่านแผนได้ แค่ไม่จำติ๊ก) และบอกผู้ใช้
- **ดาวน์โหลดไฟล์ ❓:** ปุ่มดาวน์โหลดแบบ `<a download>` + Blob อาจถูก sandbox ของ iframe บล็อก ต้องมี fallback (แสดงข้อความให้คัดลอก หรือให้เจ้าของบันทึก/สำรองลง Drive ผ่าน server)
- **CDN และฟอนต์:** ยึดรายการโฮสต์ในข้อ 2 เหมือนเดิม (เป็นจุดร่วมของทั้งสอง target) ❓ ยังไม่ได้ทดสอบว่า GAS โหลด `cdn.jsdelivr.net` / Google Fonts ได้ปกติ
- **ห้ามใช้บน GAS:** capability ของ claude.ai (`claude.use(...)`) ไม่มีบน GAS ฟีเจอร์ที่พึ่งมันต้องซ่อนหรือมีทางเลือกอื่น (ดู Phase 4/5) · ห้าม `UrlFetchApp` ไปเว็บนอกโดยไม่คุยกับ Kody ก่อน
- **Quota ❓:** GAS มีโควตาการรันต่อวันของบัญชี Gmail ส่วนตัว ผู้ชม 8 คนน่าจะไม่ถึง แต่ยังไม่ได้ตรวจตัวเลข อย่าโหลดซ้ำถี่ (เช่น poll) โดยไม่จำเป็น

**Definition of Done (ทุก feature / ทุก phase)**
1. ใช้งานได้บน **GAS** (หรือถ้า GAS target ยังไม่ถูกสร้าง: ไม่ใช้อะไรที่ขัดกับกฎ GAS ข้างบน) และบน **Artifact** / `make serve`
2. `make e2e` ผ่านทั้งหมด + มีเทสต์ใหม่สำหรับ feature นั้น (เทสต์ฝั่ง GAS ที่รันอัตโนมัติไม่ได้ ให้เขียน checklist ทดสอบมือไว้ใน `README.md`)
3. **อัปเดต `CLAUDE.md`:** สถานะใน Phase (ข้อ 8), โครงสร้าง/ไฟล์ใหม่ (ข้อ 3, 7), คำสั่งใหม่ (ข้อ 5), Known Issues ที่เพิ่ม/หายไป (ข้อ 6), ผลทดสอบข้อที่ติด `❓`
4. **อัปเดต `README.md`:** รายการ feature ที่ผู้ใช้เห็น, วิธีใช้/วิธี deploy ที่เปลี่ยน, สถานะ Phase
5. เพิ่ม `APP_VERSION` ใน `app.js` ถ้าเป็นการ release

**การทำงานกับ Kody**
- ตอบภาษาไทย ตรงไปตรงมา ไม่ใช้ภาษาทางการเกินจำเป็น ศัพท์เทคนิคทับศัพท์อังกฤษ
- **ไม่เข้าใจให้ถามก่อนเสมอ** โดยเฉพาะเรื่องที่มีผลกับการออกแบบ (ที่เก็บข้อมูล, สิทธิ์, สิ่งที่ผู้ชมเห็น) ถามเป็นตัวเลือกพร้อมบอกว่าแนะนำข้อไหน
- ห้ามเดา: ถ้าข้อมูลไม่รู้ให้ใส่ `❓` ใน md / บอกตรงๆ ว่ายังไม่ได้ตรวจ ถ้าเจอข้อมูลขัดกันให้ชี้ให้เห็นชัดๆ อย่าแก้เงียบๆ
- ส่งมอบงานที่ใช้ได้ทันที (build ผ่าน, test ผ่าน) และบอกขอบเขตที่ทำ/ไม่ได้ทำ

## 5. Commands

```bash
make build            # python3 tools/build.py -> dist/travel-plan.html
make test             # node: parser round-trip + i18n coverage (ไม่ต้องมี browser)
make e2e              # build + test + Playwright ทั้งชุด (bash tests/e2e/run_all.sh)
make serve            # http://localhost:8000/travel-plan.html (python http.server, dir dist/)

node tests/parser.test.js
node tests/i18n-coverage.js
node --check src/app.js && node --check src/parser.js     # syntax

# e2e ต้องติดตั้งครั้งแรก
pip install playwright && playwright install chromium
python3 tests/e2e/ftest.py      # import/ซ้ำ/แก้/ย้าย/ลบ+undo/checklist/export/seed conflict (12 checks)
python3 tests/e2e/ftest2.py     # สลับ TH/EN, chip+block สายรถไฟ, field _en (14 checks)
python3 tests/e2e/ftest3.py     # โหมดเจ้าของ/ผู้ชม (ซ่อนเครื่องมือ, 7 taps, migration) + เครื่องหมายถูกของ checkbox อยู่กลางกรอบ (14 checks)

# screenshot ตรวจหน้าตา (ผลที่ /tmp/tp-shots/)
python3 tests/e2e/shot.py "run(p,'d5-m',390,844,'#taiwan-trip-2026-2026-11-12--d5')" \
                          "run(p,'ov-en',1280,900,'#taiwan-trip-2026-2026-11-12',lang='en',theme='light')"
# พารามิเตอร์ run(): name,w,h,hash,theme,planning,clock,actions,full,lang   (clock='2026-11-13T10:40:00Z' ทดสอบ Today mode)
```

**ขั้นตอน release:** แก้ `src/` หรือ `data/` → `make e2e` ต้องผ่านทั้งหมด → อัปเดต `CLAUDE.md` + `README.md` → `dist/travel-plan.html` → ส่งให้ Kody publish ทับลิงก์ Artifact เดิม (เก็บ URL เดิมไว้ เพื่อให้ลิงก์ที่แชร์ไปแล้วอัปเดตตาม) · GAS (⏳ เมื่อมี target แล้ว): วางไฟล์ใน `dist/gas/` ลงโปรเจกต์ Apps Script → Deploy → **Manage deployments → แก้ deployment เดิมเป็นเวอร์ชันใหม่** (ห้ามกด New deployment เพราะจะได้ URL ใหม่ ลิงก์ที่แจกไปแล้วจะไม่อัปเดต) → ทดสอบมือตาม checklist ใน `README.md`

**ทดสอบ Today mode:** เทสต์ e2e ใช้เวลาจริงของเครื่อง ถ้าอยากเห็นเส้น "ตอนนี้" ให้ใช้ `clock=` ใน `shot.py` (Playwright `page.clock.install`)

## 6. Known Issues / ข้อควรระวัง

1. **เส้น "ตอนนี้" ใช้ timezone เดียวทั้งทริป** (`meta.timezone`) รายการที่เขียนเป็นเวลาไทย (FD230 07:45 ออกดอนเมือง) จะเลื่อนผิด 1 ชม. เฉพาะช่วงรายการนั้น แก้จริงต้องมี timezone ต่อรายการ (Phase 3)
2. **ข้อมูลอยู่ใน browser เครื่องเดียว** ไม่ sync ข้ามเครื่อง ล้าง browser = หาย (เหลือแค่ export .md/.json) เพื่อนเห็นแผนที่ฝังมากับลิงก์เท่านั้น ไม่เห็นการแก้ไขในเครื่องคุณ (Phase 2c บน GAS จะแก้ข้อนี้ ส่วน target Artifact จะยังเป็นแบบนี้ต่อ)
3. **EN mode แปลแค่ UI + field `_en` ที่ใส่ไว้** ใน seed ไต้หวันมีเฉพาะ `summary_en` ทุกวัน + `style_en` ที่เหลือ (transport/notes/cost, ห้ามพลาด/ข้อควรระวัง, เที่ยวบิน/ที่พัก, ข้อมูลอ้างอิง, เตรียมของ) ยังเป็นภาษาไทย ไม่มีการแปลอัตโนมัติ และ `summary_en` ที่มีอยู่เป็น "ร่างที่ Claude เขียน" ยังไม่ได้ให้ Kody ตรวจ
4. **สีสายรถไฟมาจากความจำ ไม่ใช่ค่า official** (`LINES` ใน parser.js) ชื่อจีนของสาย R/BL/G/O/BR ตรงกับตารางศัพท์ใน md; ชื่อและสีของ Airport MRT / HSR / TRA / Circular ไม่ได้มาจากข้อมูลของ Kody ต้องตรวจก่อนใช้ในทริปอื่น สี G (`#008357`) และ TRA (`#52708F`) ถูกขยับเล็กน้อยให้ข้อความบน chip ผ่าน 4.5:1
5. **Seed `line:`/`line_alt:` ใน taiwan-2026.md** ใส่เฉพาะสายที่ข้อความ transport ระบุไว้ตรงๆ (23 รายการ + 6 รายการ alt) เช่น Day 3 15:00 ช่วง "MRT Beitou → Xinbeitou" ไม่ได้ติดสาย เพราะ md ไม่ได้ระบุสี และ Day 1 19:30 "MRT ย้อนเส้นทางเดิม" ไม่ได้ติดสาย
6. **ข้อความเตือนของ parser เป็นภาษาไทยอย่างเดียว** (หน้าตรวจก่อน import ในโหมด EN จะมีข้อความไทยปน)
7. **เทสต์ไม่ได้ครอบคลุม:** มือถือจริง (ทดสอบที่ viewport 390px และ 1280px ใน Chromium เท่านั้น), Safari/iOS, การลากสลับลำดับ (drag-and-drop บน desktop ยังไม่มี e2e), ฟอนต์จริงจาก Google Fonts (เทสต์บล็อกไว้ ใช้ fallback), การดาวน์โหลดผ่าน capability `downloads` ในหน้าที่ publish จริง (เทสต์ใช้ปุ่มดาวน์โหลดแบบ anchor)
8. **ไม่มีเน็ต:** ฟอนต์ตกไป fallback, markdown (ข้อมูลอ้างอิง/ข้อมูลเพิ่มเติม/จำไว้ตลอดทริป) แสดงเป็นข้อความธรรมดาเพราะ `marked` ไม่โหลด (`mdHtml` มี fallback) ออฟไลน์เต็มรูปแบบไม่รับประกัน
9. **parser:** (ก) ค่าของ field ต้องอยู่บรรทัดเดียว (ข) `<!-- ... -->` ถูกลบทั้งไฟล์ก่อน parse รวมถึงที่อยู่ในเนื้อหา (ค) head ที่ไม่รู้จักใน front matter เก็บไว้ใน `metaExtra` พร้อมเตือน (ง) `##` ที่ไม่รู้จักใน Day ถูกย้ายไป "ข้อมูลเพิ่มเติม" พร้อมเตือน (จ) `id` ของ item/วัน สุ่มใหม่ทุกครั้งที่ parse เทสต์จึงตัด `id` ก่อนเทียบ
10. **Router:** `tripId` ห้ามมี `--` (ใช้เป็นตัวคั่น tab) `makeId` สร้างจาก title ภาษาอังกฤษ + วันเริ่ม ชื่อทริปที่ไม่มีตัวอักษรละตินจะได้ `trip-<date>`
11. **สถานะ emoji ผูกกับโค้ดหลายจุด:** `TP.STATUS` (parser), `STATUS_CLS`/`statusLabel` และ `EMO_RE` (ลบ emoji ตอนปิดโหมดวางแผน) ถ้าเพิ่ม/เปลี่ยน emoji สถานะ ต้องแก้ทั้งสามที่
12. **การย้ายรายการบนมือถือ** ใช้ปุ่ม ↑↓ (ลากใช้ได้เฉพาะ pointer แบบ fine บน desktop)
13. **ห้ามเรียก `window.claude.use(...)` แล้วอ่านผลทันที** namespace มาทีหลังเสมอ ออกแบบให้หน้าทำงานได้เมื่อเป็น `null` (ตอนนี้ใช้แค่ `downloads`)
14. **โหมดเจ้าของเป็นแค่ตัวกั้นหน้าจอ ไม่ใช่ความปลอดภัย:** ข้อมูลทุกอย่างฝังอยู่ในไฟล์ HTML ใครมีลิงก์กด view source ก็อ่านได้ รวมถึงหัวข้อ `# วางแผน` (จุดขัดแย้ง ❓⚠️ ที่ Claude ร่างไว้) ถ้าไม่อยากให้เพื่อนเห็น ต้องตัดส่วนนั้นออกจากเวอร์ชันที่ publish (ยังไม่มีตัวเลือกนี้ใน `tools/build.py`) การแก้ไขของผู้ชมแต่ละคนอยู่ในเครื่องเขาเท่านั้น ไม่ไปถึงใคร แต่ผู้ชมที่ปลดล็อกโหมดเจ้าของเองบนเครื่องตัวเองก็แก้ของตัวเองได้ (บน GAS: ผู้ชมที่ปลดล็อกจะแก้ได้แค่ในเครื่องตัวเอง บันทึกขึ้น Drive ไม่ได้ถ้าไม่มีรหัสแก้ไข และ server ตัด `# วางแผน` ออกก่อนส่งให้ผู้ชม)
15. **เนื้อหาทริปไม่ได้ตรวจซ้ำ** เวลา ราคา เส้นทางใน `data/seed/taiwan-2026.md` ยกมาจากไฟล์ของ Kody ตามเดิม รายการที่ติด `❓`/`⚠️` คือยังไม่ยืนยัน ห้ามลบเครื่องหมายเอง และกล่อง "ห้ามพลาด / ข้อควรระวัง" ทุกวันเป็นร่างที่ Claude สรุปจากข้อมูลในไฟล์ (ติด `❓` ทุกบรรทัด รอ Kody ตรวจ)

## 7. ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
|---|---|
| `src/parser.js` | `TP.parse(md)` → `{trip, warnings}` · `TP.toMarkdown(trip)` · `TP.parseLines()` · `TP.LINES` · ค่าคงที่ (`STATUS`, `TYPES`, `ITEM_KEYS`, `META_KEYS`) |
| `src/app.js` | แอปทั้งหมด (ตารางลำดับในข้อ 3) |
| `src/styles.css` | tokens + components (ส่วนท้ายไฟล์: chip/block สายรถไฟ, reduced-motion) |
| `data/travel-plan-template.md` | schema + กฎ + ตัวอย่างเปล่า ใช้ให้ Claude สร้างแผนใหม่: แนบไฟล์นี้ + ข้อมูลดิบ แล้วสั่ง "สร้างตาม template ห้ามเปลี่ยนชื่อหัวข้อ/field อะไรไม่รู้ใส่ ❓ ห้ามเดา" |
| `data/seed/taiwan-2026.md` | แผนไต้หวัน v4.1 (6 วัน 5 คืน, 8 คน) แปลงจาก v3 เป็น schema ใหม่ |
| `README.md` | คำอธิบายโปรเจกต์สำหรับคนทั่วไป: feature, วิธีใช้, วิธี deploy, สถานะ Phase, checklist ทดสอบมือบน GAS (อัปเดตทุกครั้งที่เพิ่ม feature) |
| `gas/*` (⏳) | server ของ Google Apps Script (ดูข้อ 3) |
| `Original_template.pdf` (อยู่นอก repo, Kody ถือ) | ต้นแบบหน้าตา ถ้าต้องการให้ Claude Code เห็นให้ Kody ใส่ไว้ที่ `docs/` |
| Artifact "Dark Tech Workshop" (URL ข้อ 4) | design system (README อย่างเดียว) |

## 8. Phases

**Phase 1 ✅ (v1) — ดูแผน + แก้ไข + import/export พื้นฐาน**
dashboard + ปฏิทินรายเดือน · เมนูตาม section · timeline แบบย่อ/ขยาย · Today mode · metro map ต่อวัน/ทั้งทริป · เต็มจอสำหรับประโยค/การ์ดแท็กซี่ · checklist + To-do · dark/light · โหมดวางแผน (badge สถานะ, แก้ทุก field, เพิ่ม/ลบ/ย้าย, undo ตอนลบ) · import .md/.json พร้อม preview · export .md/.json · template md

**Phase 2 — ปรับให้ใช้งานคนเดียวจริงจัง**
- 2a ✅ บล็อกสีตามสายรถไฟ/MRT (`line`, `line_alt`, chip + บล็อกใน detail + legend "สายที่ใช้วันนี้")
- 2b ✅ สลับ EN/TH (UI ทั้งหมด + `*_en` แบบไม่บังคับ)
- 2d ✅ โหมดเจ้าของ (ทุกคนดูอย่างเดียว) + แก้เครื่องหมายถูกของ checkbox (v2.1)
- 2c ⏳ **Google Apps Script + ที่เก็บกลางแบบ "ทุกคนอ่าน เจ้าของเขียนคนเดียว"** (เลือกแล้ว 2026-11-05: GAS, ไฟล์ `.md` ใน Drive, รหัสแก้ไขฝั่ง server, เปิดให้ Anyone, เก็บ Artifact ไว้คู่กัน) ทำตามลำดับ แต่ละขั้นต้องใช้งานได้ก่อนไปขั้นต่อไป:
  1. **target GAS แบบดูอย่างเดียว:** `build.py` สร้าง `dist/gas/` (`Code.gs` + `index.html`) `doGet` ส่งหน้าที่ฝัง seed ไว้ (ยังไม่อ่าน Drive) · ทดสอบข้อ `❓` ในกฎ GAS (router, localStorage บน iPhone, ดาวน์โหลด, CDN) แล้วแก้ข้อความใน CLAUDE.md เป็นผลจริง
  2. **อ่านจาก Drive:** `getTrip()` อ่านไฟล์ `TRIP_FILE_ID` ตัด `# วางแผน` สำหรับผู้ชม หน้าแสดงแผนจาก server แทน seed (fallback: สำเนาใน `localStorage` → seed) ติ๊ก checklist ของผู้ชมยังอยู่ในเครื่องเขา
  3. **บันทึกของเจ้าของ:** ช่องกรอกรหัสแก้ไขในโหมดเจ้าของ, `saveTrip(md, editKey, baseVersion)` ตรวจรหัส + กันเขียนทับ + สำรองไฟล์เดิม, สถานะ "บันทึกแล้ว/ยังไม่บันทึก" ในหน้า
  4. **ตัดกลไก seed/republish บน GAS** (บน Artifact ยังใช้ seed เหมือนเดิม) + sync มือถือ↔โน้ตบุ๊กของเจ้าของ (โหลดจาก Drive ทุกครั้งที่เปิด)
  - การเขียนต้องบังคับฝั่ง server ห้ามพึ่งแค่ `S.settings.owner` · ❓ ยังไม่ได้ตัดสิน: ใช้ `clasp` push โค้ดอัตโนมัติ หรือ Kody copy-paste เอง · ทางเลือกเดิม (capability `db`/`user` ของ Artifact) พักไว้

**Phase 3 ⏳ — สร้าง/แก้แผนในเว็บได้ครบ**
ปุ่ม "แผนใหม่" (เปล่า / คัดลอกโครง) · preview markdown ข้างช่องแก้ · ตรวจข้อมูลแล้วเตือน (เวลาซ้อน/ไม่เรียง, วันที่นอกช่วงทริป, วันไม่มี route) · ปุ่มเรียงตามเวลา · undo/redo หลายขั้น · field timezone ต่อรายการ (แก้ปัญหาข้อ 6.1) · เพิ่มคำแปล `_en` ให้ field ที่ยังไม่มี (must/caution/flights/stays)

**Phase 4 ⏳ — ใช้ระหว่างเที่ยว** (ถ้าต้องการให้ทันทริป 12 พ.ย. ให้ดึงขึ้นมาก่อน)
การ์ด "ถัดไป" บนสุดของวันนี้ (รายการถัดไป วิธีเดินทาง เวลาที่เหลือ) · ติ๊กรายการ "ไปแล้ว / ข้าม" · แนบไฟล์ต่อแผน/รายการ (QR TWAC, ตั๋ว, ใบจอง): **บน GAS เก็บในโฟลเดอร์ Drive ของ Kody** อัปโหลดได้เฉพาะเจ้าของ (ตรวจรหัสแก้ไขฝั่ง server) ❓ ยังไม่ได้เลือกว่าผู้ชมเปิดไฟล์ผ่าน server หรือผ่านลิงก์แชร์ของ Drive · บน Artifact ใช้ capability `assets` หรือซ่อนฟีเจอร์ · ลดการพึ่ง CDN (ฝัง `marked` ลงในหน้าตอน build ได้ ฟอนต์ยังต้องโหลดจาก Google Fonts)

**Phase 5 ⏸ (พักไว้) — ให้ Claude ช่วยในเว็บ**
ช่อง "วางโน้ตดิบ" แปลงเป็นแผนตาม template · ปุ่มให้ Claude ตรวจจุดขัดแย้งแล้วเติม ⚠️❓ · บน Artifact ใช้ capability `sample` ได้ แต่ **บน GAS ไม่มีทางเทียบเท่า** (ต้องใช้ Anthropic API key ซึ่งมีค่าใช้จ่าย) Kody ตัดสิน 2026-11-05 ให้พักไว้ ห้ามเริ่มทำจนกว่าจะคุยใหม่

อัปเดตสถานะของ Phase ในไฟล์นี้ **และใน `README.md`** ทุกครั้งที่ทำเสร็จ และถ้าโค้ดกับไฟล์นี้ไม่ตรงกัน ให้แก้ไฟล์นี้ในคอมมิตเดียวกัน (ดู Definition of Done ในข้อ 4)
