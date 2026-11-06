# CLAUDE.md — Travel Plan (แผนเที่ยว)

อ่านไฟล์นี้ก่อนแก้โค้ดทุกครั้ง ข้อมูลในนี้ตรวจกับโค้ดจริงตอนเขียน (v2.5.0: Phase 2a/2b/2c/2d เสร็จ, Phase 4 ทำการ์ด "ตอนนี้ + ถัดไป" แล้ว, เพิ่ม target GitHub Pages เพราะ iPhone ลืมติ๊กบน GAS (Known Issue 23, 24)) ถ้าไม่แน่ใจเรื่องไหน ให้เปิดโค้ดดู อย่าเดา

> **กฎเอกสาร (บังคับทุกครั้ง):** ทุกครั้งที่เพิ่ม/เปลี่ยน/ลบ feature ต้องอัปเดต **ทั้ง `CLAUDE.md` และ `README.md`** ในคอมมิตเดียวกับโค้ด ดูรายการที่ต้องแก้ในข้อ 4 "Definition of Done" งานที่เอกสารยังไม่อัปเดตถือว่ายังไม่เสร็จ
>
> **ถ้าไม่เข้าใจ ให้ถาม Kody ก่อนลงมือเสมอ** (เป้าหมาย ขอบเขต ข้อมูลที่ไม่รู้ ทางเลือกที่มีผลกับการออกแบบ) อย่าเดาแล้วทำไปก่อน

## 1. Project Overview

เว็บแผนเที่ยวแบบ interactive ไฟล์ HTML ไฟล์เดียว (`dist/travel-plan.html`) ไม่มี backend

- **เป้าหมาย:** import แผนเที่ยวจากไฟล์ markdown ที่ Claude สร้างตาม template แล้วแสดงเป็นเว็บที่ใช้ได้จริงบนมือถือระหว่างเที่ยว: ภาพรวมทริป, timeline รายวัน, เช็กลิสต์เตรียมของ, To-do, ข้อมูลอ้างอิง (เบอร์ฉุกเฉิน ประโยคภาษาท้องถิ่น การ์ดแท็กซี่)
- **ผู้ใช้และโมเดลการแชร์ (Kody ตัดสินแล้ว):** ทุกคนที่มี URL **ดูอย่างเดียว** (ติ๊ก checklist ของตัวเองได้) **Kody แก้ได้คนเดียว** แจกเป็น URL ของเว็บ HTML ตอนนี้แผนเดียวคือ เที่ยวไต้หวัน 2026 (title_en: Taiwan Trip, 12–17 พ.ย. 2026, **6 คน** ไทยล้วน ตาม Kody 2026-11-05 · ในเนื้อหาแผนยังมี "8 ที่/8 คน" เช่นจอง Hotpot ที่รวมเพื่อนไต้หวัน ห้ามแก้เอง)
  - **ที่ทำแล้ว (v2.1):** "โหมดเจ้าของ" ซ่อนเครื่องมือแก้ไข/นำเข้า/ส่งออก/หน้าวางแผนจากผู้ชม ปลดล็อกโดยแตะบรรทัดเวอร์ชันในหน้าตั้งค่า 7 ครั้งติด การแก้ไขของเจ้าของอยู่ใน browser เครื่องนั้นเท่านั้น ผู้ชมคนอื่นจะเห็นต่อเมื่อ Kody ส่งออก .md → ส่งให้ Claude → publish ทับลิงก์เดิม
  - **ที่ทำแล้ว (v2.2, Phase 2c):** บน Google Apps Script การแก้ของ Kody ไปถึงทุกคนโดยไม่ต้องส่งไฟล์ แผนอยู่ในไฟล์ `.md` ใน Drive อ่านได้ทุกคน เขียนได้เฉพาะคนที่ส่งรหัสแก้ไขถูก (server ตรวจ) ปุ่มซ่อนในหน้ายังไม่ใช่การป้องกัน ตัวป้องกันจริงคือรหัสฝั่ง server **deploy แล้ว 2026-11-05** ผ่านแล้ว: ผู้ชมอ่านแบบไม่ login, ใส่รหัส, บันทึกขึ้น Drive, backup, deep link · 2026-11-06 บน iPhone (Chrome/Safari): deep link, ลิงก์เก่า, ดาวน์โหลด, ฟอนต์, บันทึกติดกัน ผ่าน · เจอหน้าขาวหลังปัดปิดแอป (Known Issue 23) (ข้อที่เหลือดู ❓ ในข้อ 4)
- **หน้าตา:** ต้นแบบคือ `Original_template.pdf` (ทริปไถจง 4 วัน) แต่ใช้ design system "Dark Tech Workshop" (dark เป็นค่าเริ่มต้น มี light เป็นตัวเลือก)
- **Deploy มี 3 target (2 ตัวแรก Kody ตัดสิน 2026-11-05, GitHub Pages เพิ่ม 2026-11-06) ทุก phase ที่เสร็จต้องใช้งานได้บนทุกที่:**
  1. **Google Apps Script (GAS) web app = ลิงก์หลักที่แจกเพื่อน** โค้ดใน `dist/gas/` ✅ deploy แล้ว 2026-11-05 (ขั้นตอนอยู่ใน `README.md`) · Deploy แบบ Execute as: Me (Kody), Who has access: **Anyone** (ไม่ต้อง login Google) · แผนเก็บเป็น **ไฟล์ `.md` ใน Google Drive ของ Kody** · การบันทึกต้องส่ง **รหัสแก้ไข** ที่ server ตรวจกับค่าใน Script Properties ทุกครั้ง · ผู้ชมทุกคนอ่านอย่างเดียว
  2. **claude.ai Artifact** `https://claude.ai/artifact/DtvUoYKnyT15PwAmGY2omk` (ของเดิม เก็บไว้คู่กัน) เป็นภาพนิ่งของแผนตอน publish (ฝัง seed) ไม่มีที่เก็บกลาง (CSP ของ Artifact บล็อก `fetch` ไป GAS) publish จากแชท claude.ai ด้วยเครื่องมือ Artifact, capability `downloads` การ publish ทับลิงก์เดิมทำให้ทุกคนได้เวอร์ชันใหม่ Claude Code ส่งไฟล์ `dist/travel-plan.html` ให้ Kody publish จากแชทได้
  3. **GitHub Pages** `https://kodyznapper.github.io/travel-plan/` (v2.5.0, Kody ตัดสิน 2026-11-06 ทำก่อนบิน) หน้าเดียวกับ GAS แต่เป็นหน้าหลักของ browser ไม่อยู่ใน iframe ของ Google → `localStorage` เป็น first-party iPhone จึงจำติ๊ก/รหัส/สำเนาแผนได้ และไม่เจอหน้าขาว (Known Issue 23, 24) · คุยกับ `Code.gs` ตัวเดิมด้วย `fetch` ไป URL `/exec` (ใน `pages/config.json`) แผนยังอยู่ไฟล์เดียวกันใน Drive · deploy ด้วย GitHub Actions (`.github/workflows/pages.yml`) เมื่อ `dist/pages/` บน `main` เปลี่ยน · repo เป็น public (Pages ฟรี) · **✅ ลิงก์หลักที่แจกเพื่อน** (Kody ทดสอบบน iPhone 2026-11-06 ผ่านทุกข้อ: เห็นแผน, ติ๊กและรหัสอยู่รอดหลังปัดปิดแอป/เปิดแท็บใหม่, ไม่เจอหน้าขาว) ลิงก์ `/exec` ยังใช้ได้เป็นทางสำรอง

## 2. Tech Stack

| ส่วน | ที่ใช้ |
|---|---|
| ภาษา | JavaScript **ES5 style** (`var`, `function`, IIFE, ไม่มี module/transpile), CSS, HTML หนึ่งไฟล์ |
| Framework | **ไม่มี** (vanilla DOM + string templates + `innerHTML`) |
| Library (runtime) | `marked@12.0.2` UMD จาก `https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js` (ล็อกเวอร์ชัน) ใช้เฉพาะ render markdown |
| ฟอนต์ | IBM Plex Sans Thai (400/500/600/700) + JetBrains Mono (400/500/700) จาก Google Fonts, fallback `Tahoma, sans-serif` / `'Courier New', monospace` |
| ที่เก็บข้อมูล | Artifact: `localStorage` (ต่อ browser ต่อเครื่อง) · GAS / Pages: ไฟล์ `.md` ใน Drive เป็นแหล่งความจริง + สำเนาใน `localStorage` (เปิดได้ตอนเน็ตหลุด) + ติ๊ก checklist และการแก้ที่ยังไม่บันทึกอยู่ใน `localStorage` ของแต่ละเครื่อง (บน iPhone เฉพาะ Pages ที่อยู่ถาวร Known Issue 24) |
| Server | Google Apps Script (`gas/Code.gs`, V8) `doGet` ส่งหน้า HtmlService · `getTrip` / `checkKey` / `saveTrip` เรียกจากหน้า GAS ผ่าน `google.script.run` และจากหน้า Pages ผ่าน JSON API (`doPost` body `{fn, args}` แบบ `text/plain`, `doGet?api=getTrip` อ่านแบบผู้ชม) · `setup` รันครั้งเดียวจาก editor |
| Build | `tools/build.py` (Python 3 stdlib) ได้ 3 target: `dist/travel-plan.html` (ฝัง seed), `dist/gas/` (`index.html` ไม่ฝัง seed, `Code.gs` ฝัง seed ไว้ให้ `setup()`, `appsscript.json`) และ `dist/pages/index.html` (ไม่ฝัง seed, ฝัง `window.TP_API` = URL `/exec` จาก `pages/config.json`, meta `noindex`) แยกด้วย `window.TP_TARGET` (`'static'` / `'gas'` / `'pages'`) |
| Test | Node (parser, i18n, `gas.test.js` รัน `dist/gas/Code.gs` กับ GAS จำลอง) + Python Playwright/Chromium (e2e รวม `ftest4.py` ที่หน้า GAS คุยกับ Code.gs จริงผ่าน GAS จำลอง และ `ftest6.py` ที่หน้า Pages ส่ง `fetch` ไป `doPost`/`doGet` ของ Code.gs จริงผ่าน GAS จำลอง) |

**ห้ามใช้ (กฎของหน้าที่ publish เป็น Artifact และกฎของโปรเจกต์ ใช้กับโค้ดฝั่งหน้าเว็บของทั้งสอง target เพราะเป็นไฟล์ HTML ชุดเดียวกัน):**

- React/Vue/Svelte/Tailwind/jQuery หรือ build step ที่ต้อง `npm install` ถ้าจะเพิ่ม library ต้องคุยกับ Kody ก่อน
- script จากโฮสต์อื่นนอกรายการที่ CSP อนุญาต: `cdnjs.cloudflare.com`, `cdn.jsdelivr.net/npm/`, `cdn.tailwindcss.com`, `code.jquery.com` (ล็อกเวอร์ชันเสมอ ห้าม `@latest` ห้ามใช้ release ที่ออกไม่ถึง 2 สัปดาห์) stylesheet ได้เฉพาะ Google Fonts
- `unpkg`, `esm.sh`, รูปจากเว็บนอก, `fetch` ไปเว็บอื่น (ถูก CSP บล็อกแบบเงียบ) **ข้อยกเว้นเดียว:** target `pages` เรียก `fetch` ไป URL `/exec` ใน `window.TP_API` (ใน `rpc()` เท่านั้น) target อื่นไม่มี `TP_API`
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
├─ gas/
│  ├─ Code.gs                server ของ Apps Script (มี placeholder `/*@@SEED_MD@@*/null` ให้ build ใส่ seed)
│  └─ appsscript.json        manifest (timezone, V8, webapp: execute as owner, access anyone)
├─ pages/config.json         URL `/exec` ของ Apps Script ที่หน้า Pages เรียก (public อยู่แล้ว)
├─ .github/workflows/pages.yml  deploy dist/pages/ ขึ้น GitHub Pages เมื่อ push เข้า main
├─ tools/build.py            -> dist/travel-plan.html + dist/gas/{index.html, Code.gs, appsscript.json} + dist/pages/index.html
├─ tests/
│  ├─ parser.test.js         round-trip ของทุก md ใน data/ + line registry
│  ├─ i18n-coverage.js       ทุกข้อความไทยใน T('...') ต้องมีคำแปล EN
│  ├─ gas.test.js            logic ของ Code.gs: setup, ตัด # วางแผน, รหัส, conflict, backup, lockout, ไฟล์ว่าง (36 checks)
│  ├─ gas/fake-gas.js        DriveApp/PropertiesService/LockService/CacheService/Session จำลอง (เท่าที่ Code.gs ใช้)
│  ├─ gas/call.js            เรียกฟังก์ชัน public ของ Code.gs หนึ่งครั้ง state เก็บในไฟล์ (ใช้ใน ftest4, ftest6 · คำตอบ ContentService ส่งกลับเป็น `{raw}`)
│  └─ e2e/ ftest.py ftest2.py ftest3.py ftest4.py ftest5.py ftest6.py shot.py run_all.sh
├─ vendor/marked.min.js      ใช้ใน e2e แทน CDN (offline) ตัวหน้าเว็บยังโหลดจาก CDN
└─ dist/                     ผลลัพธ์ (commit ไว้ใน repo ให้ copy ได้จาก GitHub): travel-plan.html (Artifact), gas/ (Apps Script), pages/ (GitHub Pages)
```

**src/app.js แบ่งตามลำดับในไฟล์:** icons (`IC`, `icon()`) → i18n (`LANG`, `EXACT`, `PHR`, `T()`, `L()`, `cnt()`) → dates → storage/state (`S`, `K`, `initData`, seed) → server GAS (`rpc`, `loadRemote`, `saveRemote`, `askKey`, `syncBarHtml`) → router (`parseHash`, `go`) → `render()` → dashboard + ปฏิทิน → `tripHtml` + views (`overviewView`, `dayView`, `itemView`, `packView`, `todoView`, `refView`, `planView`) → edit forms (`*Edit`) → `afterRender` + `placeNow` (Today mode) + การ์ด "ตอนนี้ + ถัดไป" (`nowNext`, `nowCardHtml`, `refreshNowCard`, `scrollToItem`) → metro SVG (`drawMetro`) → modal/toast/fullscreen → import/export/settings → event handlers → boot

**Data model** (ดู `TP.emptyTrip()` ใน parser.js): `trip = { id, meta{title,title_en,subtitle,...,timezone}, overview{flights[],stays[],remember,extra[]}, days[{n,date,theme,theme_en,route,stay,summary,summary_en,items[],must[],caution[],extra}], pack[{title,items[{text,done}],note}], todo[{due,text,done}], ref[{title,md}], plan, metaExtra, origin, localEdited, updatedAt, remoteVersion, remoteFull }` · `origin` = `seed | import | server` (`server` = แผนจาก Drive บน GAS มีได้แผนเดียว) · `remoteVersion` = เวลาแก้ล่าสุดของไฟล์ใน Drive ตอนโหลด (ใช้กันเขียนทับ) · `remoteFull` = โหลดมาพร้อม `# วางแผน` แล้ว (มีรหัส) ห้ามบันทึกถ้าเป็น false ไม่งั้นหัวข้อวางแผนใน Drive จะหาย
item = `{ id, time, title, en, zh, type, status, highlight, line, transport, transport_en, line_alt, transport_alt, transport_alt_en, cost, cost_en, notes, notes_en, map, extra{} }`

**Router:** hash `#home` หรือ `#<tripId>--<tab>` โดย tab = `overview | d1..dN | pack | todo | ref | plan` (`plan` เห็นเฉพาะโหมดวางแผน)

**localStorage keys:** `tp1.trips`, `tp1.settings` (`theme`, `planning`, `lang`, `owner`, `syncHide` = เจ้าของปิดแถบ "ตรงกับแผนบน Drive" ไว้ เฉพาะ GAS), `tp1.seed` (hash ของ seed ล่าสุด ไม่ใช้บน GAS), `tp1.key` (รหัสแก้ไขที่ยืนยันแล้ว เฉพาะ GAS เก็บแบบข้อความธรรมดา ลบเมื่อกด "ลืมรหัส" / ออกจากโหมดเจ้าของ / server ตอบ BAD_KEY) ถ้าเปลี่ยนรูปแบบข้อมูลแบบที่ของเก่าอ่านไม่ได้ ให้เพิ่มเลขเวอร์ชันของ key (`tp2.*`) พร้อมเขียน migration ห้ามทับเงียบๆ

**Owner mode:** `S.settings.owner` (false เป็นค่าเริ่มต้น) ถ้าเป็น false `render()` บังคับ `planning=false` ทำให้ไม่มีปุ่มแก้ไข แท็บวางแผน badge สถานะ หรือเครื่องมือ import/export (ทุกอย่างผูกกับ `S.settings.planning`) ผู้ใช้เดิมที่เคยเปิดโหมดวางแผนก่อนมีฟีเจอร์นี้ถูก migrate ให้เป็นเจ้าของ (`owner = planning` ตอน `initData`) ปลดล็อก/ออก: ตั้งค่า → แตะบรรทัด `แผนเที่ยว v…` 7 ครั้งใน 1.5 วินาทีต่อครั้ง / ปุ่ม "ออกจากโหมดเจ้าของ" `APP_VERSION` อยู่ต้นไฟล์ `app.js` ให้เพิ่มเลขทุกครั้งที่ release

**GAS flow (`TP_TARGET === 'gas'`):** แผนที่อยู่แค่ในเครื่อง (`origin` ≠ `server` เช่น นำเข้าตอน Drive ยังโหลดไม่ได้) เจ้าของเห็นแถบส้ม "ยังไม่ได้อยู่บน Drive" + ปุ่ม **ใช้แผนนี้เป็นแผนบน Drive** (`promoteTrip`: ยืนยัน → รหัส → `saveTrip(..., force)` → กลายเป็นแผน server แผนเดียว) · เปิดหน้า → แสดงสำเนาใน `localStorage` ทันที (ถ้ามี) → `getTrip(key)` → parse → ล้างติ๊กจาก server แล้วคัดลอกติ๊กของเครื่องนี้มา (`carryChecks`) → ถ้าเครื่องนี้มีการแก้ที่ยังไม่บันทึกและ version บน Drive เปลี่ยน ถามว่าจะใช้อันไหน · เจ้าของแก้ = เก็บในเครื่อง (`localEdited`) แถบ `.syncbar` ขึ้นสีส้ม → "บันทึกขึ้น Drive" → ถ้ายังไม่มีรหัสจะถาม (`checkKey`) แล้วโหลดฉบับเต็มก่อน → `saveTrip(md ที่ล้างติ๊กแล้ว, key, remoteVersion)` → ถ้า version ไม่ตรงขึ้น dialog conflict (บันทึกทับ / โหลดของบน Drive) · กลับมาที่แท็บหลังห่างไป 5 นาทีโหลดใหม่ (ไม่ poll) · deep link: อ่าน hash จาก `google.script.url.getLocation` และเขียนกลับด้วย `google.script.history.replace` (หลัง getLocation ตอบแล้วเท่านั้น)

**Seed:** (เฉพาะ Artifact) ตอนโหลด ถ้า hash ของ seed เปลี่ยน → แผนที่ผู้ใช้ไม่เคยแก้ (`localEdited=false`) ถูกแทนด้วยเวอร์ชันใหม่ ส่วนแผนที่แก้แล้วจะขึ้น dialog ให้เลือก "ใช้เวอร์ชันใหม่ / เก็บของในเครื่อง" (ติ๊ก checklist ถูกคัดลอกข้ามเวอร์ชันโดยจับคู่จากข้อความ)

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

โค้ดทำตามกฎข้างล่างครบแล้ว (v2.2) และผ่านเทสต์กับ GAS จำลอง (`tests/gas/`) แต่ GAS จำลองเช็กได้แค่ logic ของเรา ไม่ใช่พฤติกรรมของ Google ข้อที่ติด `❓` ยังต้องทดสอบบน deployment จริง ทดสอบแล้วให้แก้ข้อความตรงนี้เป็นผลจริง

- **โค้ดหน้าเว็บชุดเดียวใช้ได้ทุก target** แยกด้วย flag ต้น `app.js`: `IN_GAS` (หน้าอยู่ใน iframe ของ Google: `google.script.run`, `getLocation`/`history.replace`, ส่งออกแบบกล่องคัดลอก) · `IS_PAGES` (หน้าปกติ: `fetch` ไป `TP_API`, hash ปกติ, ดาวน์โหลดตรง) · `HAS_SERVER` = สองอย่างนี้ (แผนจาก Drive, แถบ sync, รหัสแก้ไข, ไม่มี seed) · `rpc()` เป็นจุดเดียวที่ต่างกัน คืน Promise และ error แบบเดียวกัน (`{error: 'BAD_KEY'}` จาก API กลายเป็น `Error('BAD_KEY')`) ห้าม fork เป็น `app.js` สองไฟล์ ห้ามให้หน้าพังเมื่อไม่มี `google.script` (Artifact, `make serve`, e2e) หรือไม่มี `window.claude` (GAS, Pages)
- **สิทธิ์เขียนบังคับฝั่ง server เท่านั้น:** `saveTrip(md, editKey, baseVersion)` ใน `Code.gs` เทียบ `editKey` กับ `PropertiesService.getScriptProperties().getProperty('EDIT_KEY')` ถ้าไม่ตรงให้ throw โดยไม่เขียนอะไร · **ห้ามฝังรหัสแก้ไขใน HTML/JS/repo** (Kody ตั้งเองใน Script Properties) · ฝั่งหน้าเก็บรหัสไว้ใน `localStorage` เครื่องเจ้าของหลังกรอกครั้งแรก · โหมดเจ้าของ (`S.settings.owner`) ยังเป็นแค่ตัวซ่อนปุ่ม
- **กันเขียนทับ:** `saveTrip` รับ `baseVersion` = `getLastUpdated()` ของไฟล์ตอนโหลด ถ้าไม่ตรงกับตอนนี้ ตอบ `{conflict:true}` แล้วหน้าถามว่าจะบันทึกทับหรือโหลดของบน Drive · ใช้ `LockService` กันสองคนบันทึกพร้อมกัน · ทุกครั้งที่บันทึกสำรองไฟล์เดิมไว้ในโฟลเดอร์ `travel-plan backups` (ยกเว้นไฟล์เดิมว่าง ไม่สร้าง backup เปล่า) ✅ ยืนยันบน Google จริงแล้วว่า backup ถูกสร้าง ✅ (2026-11-06) `getLastUpdated()` อ่านค่าใหม่ทันทีหลัง `setContent`: บันทึกหลายรอบติดกันไม่ขึ้น dialog conflict หลอก และผู้ชมเห็นฉบับล่าสุด
- **ลิมิตการเดารหัส:** ผิดครบ 10 ครั้งใน 10 นาที (นับรวมทุกคน เพราะผู้ใช้ไม่มีตัวตน) ล็อกการบันทึก/ตรวจรหัส 10 นาที การอ่านไม่ถูกล็อก · ฟังก์ชันที่ชื่อลงท้าย `_` หน้าเว็บเรียกไม่ได้ (กฎของ GAS) ฟังก์ชัน public มีแค่ `doGet doPost getTrip checkKey saveTrip setup` (`gas.test.js` เช็ก) · JSON API (`doPost`/`doGet?api=`) เรียกได้แค่ `getTrip checkKey saveTrip` (`setup`, ชื่อลงท้าย `_`, ชื่อ prototype → `BAD_REQUEST`) · **รหัสแก้ไขส่งใน body ของ POST เท่านั้น** GET ไม่รับรหัส (URL ไปอยู่ใน log) · CORS: ✅ (2026-11-06) เรียกจากโดเมนอื่นได้ทั้ง GET และ POST `text/plain` (ไม่มี preflight) Google redirect ไป `script.googleusercontent.com` ที่ตอบ `Access-Control-Allow-Origin: *` ใช้เวลา ~2–3 วินาที · `setup()` ยอมรันเฉพาะเจ้าของจาก editor (`Session.getActiveUser()` ต้องตรงกับเจ้าของ)
- **ผู้ชมไม่ได้รับหัวข้อ `# วางแผน` และ `<!-- -->`:** `getTrip()` ที่ไม่มีรหัสถูกตัดสองอย่างนี้ออกฝั่ง server (`viewerMd_`) ก่อนส่ง (แก้ Known Issue 14 สำหรับ target GAS) · ข้อมูลส่วนตัวที่ไม่อยากให้เพื่อนเห็นอย่าใส่ในส่วนอื่นของ md
- **ติ๊ก checklist ไม่ขึ้น server:** บันทึกด้วย md ที่ `clearChecks` แล้ว และตอนโหลดล้างติ๊กจาก server เสมอ ติ๊กเป็นของแต่ละเครื่อง
- **ที่เก็บ:** ไฟล์ `.md` ใน Drive (file id ใน Script Properties `TRIP_FILE_ID`, backup folder ใน `BACKUP_FOLDER_ID` สร้างโดย `setup()`) ห้ามใช้ Script Properties เก็บตัวแผน (จำกัด ~9KB ต่อค่า seed ไต้หวัน 57KB) · Sheet ไม่ใช้ (1 cell ≤ 50,000 ตัวอักษร) · หลัง setup แล้ว seed ใน build ไม่มีผลกับ GAS อีก แผนใหม่ต้องนำเข้าแล้วบันทึกขึ้น Drive หรือแก้ไฟล์ใน Drive ตรงๆ
- **HtmlService:** หน้าอยู่ใน iframe ของ `*.googleusercontent.com` · viewport ตั้งฝั่ง server ด้วย `addMetaTag('viewport', ...)` (meta viewport ใน HTML อาจไม่มีผล) และ `setTitle()` · `google.script.run` เป็น async ใช้ `rpc()` ที่ห่อ `withSuccessHandler` / `withFailureHandler` เป็น Promise ทุกครั้ง error แปลงเป็นข้อความผ่าน `errText()` (รหัส error จาก server: `BAD_KEY LOCKED BUSY EMPTY TOO_BIG NOT_A_PLAN NOT_SET_UP WRITE_FAILED` + ฝั่งหน้า `EMPTY_PLAN` เมื่อ `getTrip` ได้ md ว่าง) · **error ทุกตัวต้องไปถึงหน้าจอ:** `loadRemote` ส่งผลไป `applyRemote` ใน try/catch → `remoteFail` (เจ้าของเห็นแถบ `.syncbar` สีส้มค้างไว้, ผู้ชมที่ยังไม่มีสำเนาเห็นการ์ด error + ลองใหม่) ห้ามโยน error ใน success handler ของ `.then(ok, fail)` เพราะ `fail` จับไม่ได้ หน้าจะค้าง "กำลังโหลด" (เคยเกิดจริงบน deployment แรก)
- **Router ✅:** hash ของ iframe ไม่ขึ้น URL ด้านบนเอง ทำแล้ว: อ่าน hash ตอนเปิดจาก `google.script.url.getLocation()` และเขียนกลับด้วย `google.script.history.replace()` ทุกครั้งที่ render ยืนยันบน Google จริง (Chrome desktop, 2026-11-05): URL ด้านบนเปลี่ยนตามแท็บ และเปิด `…/exec#<trip>--d3` แบบโหลดหน้าใหม่แล้วไปตรงวัน (ขึ้นภาพรวมแวบหนึ่งก่อน getLocation ตอบ) · ✅ iPhone (2026-11-06) รวมลิงก์เก่า `taiwan-trip-2026-2026-11-12--d3` · ถ้าเปลี่ยนแค่ hash ใน URL ด้านบนโดยไม่โหลดหน้าใหม่ iframe จะไม่รู้ (พฤติกรรมของ browser ไม่ใช่บั๊ก)
- **localStorage ❌ บน iPhone (GAS):** iframe ของ `…googleusercontent.com` เป็น third-party ของ `script.google.com` iOS (Safari และ Chrome = WebKit) ให้ storage แบบแยกและชั่วคราว ทดสอบ 2026-11-06: รีเฟรชในแท็บเดิมติ๊กยังอยู่ แต่เปิดแท็บใหม่/ปัดปิดแอป ติ๊ก รหัส และสำเนาแผนหาย (Known Issue 24) แก้จากหน้าใน iframe ไม่ได้ (Storage Access API ต้องเคยเปิดโดเมนนั้นเป็น first-party, cookie third-party ถูกบล็อก) → ทางแก้คือ target Pages · หน้ายังทำงานได้ถ้า storage ใช้ไม่ได้ (อ่านแผนได้ แค่ไม่จำ)
- **ดาวน์โหลดไฟล์:** บน GAS ไม่พึ่งดาวน์โหลดอย่างเดียว ส่งออก/Template เปิดกล่องข้อความให้คัดลอกพร้อมปุ่ม "ดาวน์โหลด" เสมอ ✅ (2026-11-06) ปุ่มดาวน์โหลดใน iframe ของ Google ได้ไฟล์
- **CDN และฟอนต์:** ยึดรายการโฮสต์ในข้อ 2 เหมือนเดิม (เป็นจุดร่วมของทุก target) ✅ (2026-11-06) Google Fonts และ `marked` จาก `cdn.jsdelivr.net` โหลดได้บน GAS (หน้า "ข้อมูลอ้างอิง" เป็นตาราง)
- **ห้ามใช้บน GAS:** capability ของ claude.ai (`claude.use(...)`) ไม่มีบน GAS ฟีเจอร์ที่พึ่งมันต้องซ่อนหรือมีทางเลือกอื่น (ดู Phase 4/5) · ห้าม `UrlFetchApp` ไปเว็บนอกโดยไม่คุยกับ Kody ก่อน
- **Quota ❓:** GAS มีโควตาการรันต่อวันของบัญชี Gmail ส่วนตัว ผู้ชม 6–8 คนน่าจะไม่ถึง แต่ยังไม่ได้ตรวจตัวเลข อย่าโหลดซ้ำถี่ (เช่น poll) โดยไม่จำเป็น

**Definition of Done (ทุก feature / ทุก phase)**
1. ใช้งานได้บน **GAS**, **GitHub Pages** และ **Artifact** / `make serve`
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
python3 tests/e2e/ftest2.py     # สลับ TH/EN, chip+block สายรถไฟ, field _en, ป้าย "สถานที่น่าสนใจรอบๆ", ชื่อแท็บ, รายการเขตเวลาทั้งโลก + UTC (21 checks)
python3 tests/e2e/ftest3.py     # โหมดเจ้าของ/ผู้ชม (ซ่อนเครื่องมือ, 7 taps, migration) + เครื่องหมายถูกของ checkbox อยู่กลางกรอบ (14 checks)
python3 tests/e2e/ftest5.py     # การ์ด "ตอนนี้ + ถัดไป" (นาฬิกาจำลองเวลาไทเป: ระหว่างวัน, รีเฟรชทุกนาที, แตะไปรายการ, หลังรายการสุดท้าย, ก่อน/หลังทริป, EN, โหมดแก้ไข) + id ทริปจาก title ละติน + ลิงก์เก่าหลังเปลี่ยนชื่อ + seed ที่เปลี่ยนชื่อแทนของเดิม (22 checks)
python3 tests/e2e/ftest4.py     # หน้า GAS + Code.gs จริงบน GAS จำลอง: ผู้ชมอ่าน, deep link, เจ้าของใส่รหัส/บันทึก, conflict, ทิ้งการแก้, นำเข้า .md ทับแผนบน Drive แล้วบันทึก, ไฟล์ใน Drive ว่าง + ปุ่มใช้แผนนี้เป็นแผนบน Drive, ปุ่ม X ปิดแถบ sync, ลิงก์ที่ id ไม่ตรงเปิดแผนบน Drive, EN (44 checks)
python3 tests/e2e/ftest6.py     # หน้า Pages (http://127.0.0.1) + fetch ไป doPost/doGet ของ Code.gs จริงบน GAS จำลอง: ผู้ชมอ่าน, ติ๊ก/รหัสอยู่รอดหลัง "ปิดแอป" (ปิด context ไม่มี pagehide แล้วเปิดใหม่ด้วย storage เดิม), deep link, เจ้าของใส่รหัส/บันทึก, รหัสไม่อยู่ใน URL, conflict, ดาวน์โหลดตรง, server ล่ม/กลับมา (23 checks)
node tests/gas.test.js          # logic ของ dist/gas/Code.gs (ต้อง build ก่อน; make test ทำให้)

# ถ้า pip ติดตั้งลง Python ของระบบไม่ได้ (macOS/Homebrew) ให้ใช้ venv:
#   python3 -m venv .venv && .venv/bin/pip install playwright && .venv/bin/playwright install chromium
#   PATH=.venv/bin:$PATH make e2e

# screenshot ตรวจหน้าตา (ผลที่ /tmp/tp-shots/)
python3 tests/e2e/shot.py "run(p,'d5-m',390,844,'#taiwan-trip-2026-11-12--d5')" \
                          "run(p,'ov-en',1280,900,'#taiwan-trip-2026-11-12',lang='en',theme='light')"
# พารามิเตอร์ run(): name,w,h,hash,theme,planning,clock,actions,full,lang   (clock='2026-11-13T10:40:00Z' ทดสอบ Today mode)
```

**ขั้นตอน release:** แก้ `src/` หรือ `data/` → `make e2e` ต้องผ่านทั้งหมด → อัปเดต `CLAUDE.md` + `README.md` → `dist/travel-plan.html` → ส่งให้ Kody publish ทับลิงก์ Artifact เดิม (เก็บ URL เดิมไว้ เพื่อให้ลิงก์ที่แชร์ไปแล้วอัปเดตตาม) · GAS: วาง `dist/gas/index.html` และ `dist/gas/Code.gs` ทับไฟล์เดิมในโปรเจกต์ Apps Script → Deploy → **Manage deployments → ✏️ แก้ deployment เดิม → Version: New version** (ห้ามกด New deployment เพราะจะได้ URL ใหม่ ลิงก์ที่แจกไปแล้วจะไม่อัปเดต) → ทดสอบมือตาม checklist ใน `README.md` (ขั้นตอนเต็มอยู่ใน README "วิธีเอาขึ้น Google Apps Script") · Pages: merge เข้า `main` (มี `dist/pages/` ที่ build แล้ว) → GitHub Actions deploy เอง ถ้า `Code.gs` เปลี่ยน API ต้อง deploy GAS **ก่อน** merge ไม่งั้นหน้า Pages ใหม่จะเรียก API ที่ยังไม่มี

**ทดสอบ Today mode:** เทสต์ e2e ส่วนใหญ่ใช้เวลาจริงของเครื่อง ถ้าอยากเห็นเส้น "ตอนนี้" / การ์ด "ถัดไป" ให้ใช้ `clock=` ใน `shot.py` (Playwright `page.clock.install`) `ftest5.py` ตั้งนาฬิกาเอง

## 6. Known Issues / ข้อควรระวัง

1. **เส้น "ตอนนี้" ใช้ timezone เดียวทั้งทริป** (`meta.timezone`) รายการที่เขียนเป็นเวลาไทย (FD230 07:45 ออกดอนเมือง) จะเลื่อนผิด 1 ชม. เฉพาะช่วงรายการนั้น แก้จริงต้องมี timezone ต่อรายการ (Phase 3)
2. **ข้อมูลอยู่ใน browser เครื่องเดียว** ไม่ sync ข้ามเครื่อง ล้าง browser = หาย (เหลือแค่ export .md/.json) เพื่อนเห็นแผนที่ฝังมากับลิงก์เท่านั้น ไม่เห็นการแก้ไขในเครื่องคุณ (เฉพาะ target Artifact · บน GAS/Pages แก้แล้วใน 2c: แผนอยู่บน Drive การแก้ไปถึงทุกคนเมื่อกดบันทึก)
3. **EN mode แปลแค่ UI + field `_en` ที่ใส่ไว้** ใน seed ไต้หวันมีเฉพาะ `summary_en` ทุกวัน + `style_en` ที่เหลือ (transport/notes/cost, ห้ามพลาด/ข้อควรระวัง, เที่ยวบิน/ที่พัก, ข้อมูลอ้างอิง, เตรียมของ) ยังเป็นภาษาไทย ไม่มีการแปลอัตโนมัติ และ `summary_en` ที่มีอยู่เป็น "ร่างที่ Claude เขียน" ยังไม่ได้ให้ Kody ตรวจ
4. **สีสายรถไฟมาจากความจำ ไม่ใช่ค่า official** (`LINES` ใน parser.js) ชื่อจีนของสาย R/BL/G/O/BR ตรงกับตารางศัพท์ใน md; ชื่อและสีของ Airport MRT / HSR / TRA / Circular ไม่ได้มาจากข้อมูลของ Kody ต้องตรวจก่อนใช้ในทริปอื่น สี G (`#008357`) และ TRA (`#52708F`) ถูกขยับเล็กน้อยให้ข้อความบน chip ผ่าน 4.5:1
5. **Seed `line:`/`line_alt:` ใน taiwan-2026.md** ใส่เฉพาะสายที่ข้อความ transport ระบุไว้ตรงๆ (23 รายการ + 6 รายการ alt) เช่น Day 3 15:00 ช่วง "MRT Beitou → Xinbeitou" ไม่ได้ติดสาย เพราะ md ไม่ได้ระบุสี และ Day 1 19:30 "MRT ย้อนเส้นทางเดิม" ไม่ได้ติดสาย
6. **ข้อความเตือนของ parser เป็นภาษาไทยอย่างเดียว** (หน้าตรวจก่อน import ในโหมด EN จะมีข้อความไทยปน)
7. **เทสต์ไม่ได้ครอบคลุม:** มือถือจริง (ทดสอบที่ viewport 390px และ 1280px ใน Chromium เท่านั้น), Safari/iOS, การลากสลับลำดับ (drag-and-drop บน desktop ยังไม่มี e2e), ฟอนต์จริงจาก Google Fonts (เทสต์บล็อกไว้ ใช้ fallback), การดาวน์โหลดผ่าน capability `downloads` ในหน้าที่ publish จริง (เทสต์ใช้ปุ่มดาวน์โหลดแบบ anchor)
8. **ไม่มีเน็ต:** ฟอนต์ตกไป fallback, markdown (ข้อมูลอ้างอิง/ข้อมูลเพิ่มเติม/จำไว้ตลอดทริป) แสดงเป็นข้อความธรรมดาเพราะ `marked` ไม่โหลด (`mdHtml` มี fallback) ออฟไลน์เต็มรูปแบบไม่รับประกัน
9. **parser:** (ก) ค่าของ field ต้องอยู่บรรทัดเดียว (ข) `<!-- ... -->` ถูกลบทั้งไฟล์ก่อน parse รวมถึงที่อยู่ในเนื้อหา (ค) head ที่ไม่รู้จักใน front matter เก็บไว้ใน `metaExtra` พร้อมเตือน (ง) `##` ที่ไม่รู้จักใน Day ถูกย้ายไป "ข้อมูลเพิ่มเติม" พร้อมเตือน (จ) `id` ของ item/วัน สุ่มใหม่ทุกครั้งที่ parse เทสต์จึงตัด `id` ก่อนเทียบ
10. **Router:** `tripId` ห้ามมี `--` (ใช้เป็นตัวคั่น tab) `makeId` สร้างจาก title ตัวแรกที่มีตัวอักษรละติน (`title` แล้ว `title_en`) + วันเริ่ม ไม่มีเลยได้ `trip-<date>` (v2.4.0: ชื่อไทย "เที่ยวไต้หวัน 2026" → `taiwan-trip-2026-11-12`) · id ถูกสร้างครั้งเดียวต่อ browser แล้วเก็บไว้ คนละเครื่องอาจได้ id ไม่เหมือนกัน (เช่น เครื่องที่เปิดก่อนเปลี่ยนชื่อยังเป็น `taiwan-trip-2026-2026-11-12`) จึงมีทางสำรอง 2 ชั้นใน `render()`: ไม่เจอ id → ใช้ทริปที่ `meta.start` ตรงกับวันที่ท้าย id (ถ้ามีทริปเดียว) → บน GAS ใช้แผนบน Drive · seed ที่เปลี่ยนชื่อ (`initData`) แทนสำเนาเก่าที่ `origin=seed` และวันเริ่มตรงกัน (เก็บ id และติ๊กเดิม)
11. **สถานะ emoji ผูกกับโค้ดหลายจุด:** `TP.STATUS` (parser), `STATUS_CLS`/`statusLabel` และ `EMO_RE` (ลบ emoji ตอนปิดโหมดวางแผน) ถ้าเพิ่ม/เปลี่ยน emoji สถานะ ต้องแก้ทั้งสามที่
12. **การย้ายรายการบนมือถือ** ใช้ปุ่ม ↑↓ (ลากใช้ได้เฉพาะ pointer แบบ fine บน desktop)
13. **ห้ามเรียก `window.claude.use(...)` แล้วอ่านผลทันที** namespace มาทีหลังเสมอ ออกแบบให้หน้าทำงานได้เมื่อเป็น `null` (ตอนนี้ใช้แค่ `downloads`)
14. **โหมดเจ้าของเป็นแค่ตัวกั้นหน้าจอ ไม่ใช่ความปลอดภัย:** ข้อมูลทุกอย่างฝังอยู่ในไฟล์ HTML ใครมีลิงก์กด view source ก็อ่านได้ รวมถึงหัวข้อ `# วางแผน` (จุดขัดแย้ง ❓⚠️ ที่ Claude ร่างไว้) ถ้าไม่อยากให้เพื่อนเห็น ต้องตัดส่วนนั้นออกจากเวอร์ชันที่ publish (ยังไม่มีตัวเลือกนี้ใน `tools/build.py`) การแก้ไขของผู้ชมแต่ละคนอยู่ในเครื่องเขาเท่านั้น ไม่ไปถึงใคร แต่ผู้ชมที่ปลดล็อกโหมดเจ้าของเองบนเครื่องตัวเองก็แก้ของตัวเองได้ (บน GAS: ผู้ชมที่ปลดล็อกจะแก้ได้แค่ในเครื่องตัวเอง บันทึกขึ้น Drive ไม่ได้ถ้าไม่มีรหัสแก้ไข และ server ตัด `# วางแผน` ออกก่อนส่งให้ผู้ชม)
15. **เนื้อหาทริปไม่ได้ตรวจซ้ำ** เวลา ราคา เส้นทางใน `data/seed/taiwan-2026.md` ยกมาจากไฟล์ของ Kody ตามเดิม รายการที่ติด `❓`/`⚠️` คือยังไม่ยืนยัน ห้ามลบเครื่องหมายเอง และกล่อง "ห้ามพลาด / ข้อควรระวัง" ทุกวันเป็นร่างที่ Claude สรุปจากข้อมูลในไฟล์ (ติด `❓` ทุกบรรทัด รอ Kody ตรวจ)
16. **GAS: ทดสอบบน Google จริงแล้วบางส่วน** (2026-11-05, Chrome desktop) เทสต์อัตโนมัติยังใช้ GAS จำลอง (`tests/gas/fake-gas.js`) 2026-11-06 ทดสอบบน iPhone (Chrome/Safari) ผ่าน Safari Web Inspector แล้ว ข้อที่ยังติด `❓` ในข้อ 4 "Google Apps Script" ต้องเช็กตาม checklist ใน README (`marked` จาก CDN, ติ๊กอยู่รอดบน iPhone)
17. **GAS: ใครก็ล็อกการบันทึกได้ 10 นาที** ด้วยการเดารหัสผิด 10 ครั้ง (ลิมิตนับรวมเพราะไม่มีตัวตนผู้ใช้) อ่านแผนยังได้ปกติ ถ้าเจอบ่อยค่อยเปลี่ยนเป็นลิมิตแยกตามอย่างอื่น
18. **GAS: รหัสแก้ไขเก็บใน `localStorage` แบบข้อความธรรมดา** บนเครื่องเจ้าของ ใครใช้ browser นั้นได้ก็บันทึกได้ ถ้ารหัสหลุด เปลี่ยน `EDIT_KEY` ใน Script Properties ได้ทันที (รหัสเก่าที่จำไว้จะใช้ไม่ได้)
19. **GAS: แผนเดียวต่อ deployment** (v2.2.1 แก้บั๊ก: ตอนนำเข้าทับ `replaceTrip` ทิ้ง `remoteVersion`/`remoteFull` ทำให้กดบันทึกแล้วเด้ง dialog ซ้ำ 2–3 รอบ) แผนอื่นที่นำเข้าในหน้า GAS อยู่แค่ในเครื่อง ไม่ขึ้น Drive ถ้าจะเปลี่ยนแผนบน Drive ให้นำเข้า md ที่ชื่อทริป+วันเริ่มตรงกัน แล้วเลือก "เขียนทับแผนเดิม" จากนั้นกดบันทึกขึ้น Drive
20. **GAS deployment แรก (2026-11-05): `getTrip` ส่ง `md: ""`** ไฟล์ `travel-plan.md` ที่ `setup()` สร้างอ่านออกมาว่าง (เวลาแก้ไขตรงกับตอน setup) และหน้าค้าง "กำลังโหลดแผน…" เพราะ error ถูกกลืน ❓ ยังไม่รู้ว่าทำไมไฟล์ที่ `setup()` (โค้ด v2.2.1) สร้างถึงว่าง v2.2.2: `createFile` ใช้ `Utilities.newBlob`, `setup()` เติมไฟล์ว่างจาก seed, `saveTrip` อ่านกลับแล้วโยน `WRITE_FAILED` ถ้า Drive ไม่เก็บ, `getTrip` ส่ง `size` · **ผลจริงหลัง v2.2.2:** Kody กด "ใช้แผนนี้เป็นแผนบน Drive" แล้ว `getTrip` ของผู้ชมได้ `size: 33371` แผนแสดงครบ (แปลว่า `setContent` + อ่านกลับทำงานบน Drive จริง) · backup ไฟล์แรกว่างเพราะเป็นสำเนาของไฟล์ว่างก่อนบันทึก (Code.gs หลังจากนี้ไม่สร้าง backup เปล่าแล้ว)
21. **ใช้กับประเทศอื่น (ยังไม่แก้ วางแผนหลังทริป):** (ก) `LINES` มีแต่สายไทเป รหัสอย่าง `G` จะได้สีไทเปแม้เป็นสาย Ginza ของโตเกียว (template v2 สั่งให้เขียน `ชื่อ#RRGGBB` นอกไทเป) (ข) ชื่อท้องถิ่น `zh` ใส่ `lang="zh-Hant"` + ฟอนต์จีนตัวเต็มเสมอ คันจิญี่ปุ่นแสดงรูปแบบจีน และ `hasCJK` ไม่รู้จักคานะ/ฮันกึล (ตารางประโยคเกาหลี/คานะล้วนไม่ขยายใหญ่ตอนเต็มจอ) (ค) timezone เดียวทั้งทริป (ข้อ 1)
22. **การ์ด "ตอนนี้ + ถัดไป" ข้ามรายการที่เวลาไม่มีตัวเลข HH:MM** (เช่น "เช้า", "บ่าย", "❓") และใช้ timezone ของทริป รายการที่เขียนเป็นเวลาไทยเพี้ยน 1 ชม. เหมือนข้อ 1 · ถือว่ารายการเรียงตามเวลาในไฟล์
23. **GAS + iOS: หน้าขาวทั้งจอหลังปัดปิดแอปแล้วเปิดใหม่** (ทดสอบ 2026-11-06, iPhone 15 Pro Max, Chrome และ Safari) แท็บที่ iOS เปิดกลับมามี URL ระดับบนเป็นกรอบชั้นในของ Google `https://n-…-script.googleusercontent.com/userCodeAppPanel?createOAuthDialog=true#<hash>` แทน `…/exec` หน้านั้นรอให้หน้าแม่ส่ง HTML มาทาง `postMessage` แต่ไม่มีหน้าแม่ ตัวโหลดของ Google รายงาน `Invalid window in postMessage handler` แล้วค้างที่ `userHtmlFrame` = `/blank` **โค้ดเราไม่ได้รันเลย** จึงแก้หรือกู้ในหน้าไม่ได้ (เปิด URL นั้นใน Chrome desktop ก็ขาวเหมือนกัน) · รีเฟรชไม่หาย (โหลด URL เดิม) · แท็บใหม่ / Incognito / โน้ตบุ๊ก / `/exec#…--overview` เปิดได้ปกติ · เกิดในลำดับ: ติ๊กในแท็บเตรียมของ → กลับภาพรวม → ปัดปิดแอป ส่วนเปิดแท็บ D3 ค้างไว้โดยไม่ติ๊กแล้วปิดแอปไม่เกิด ❓ ยังไม่รู้ว่าทำไม iOS กู้แท็บเป็นกรอบชั้นใน และทำไมผูกกับการติ๊ก · ทางเลี่ยง: ปิดแท็บแล้วเปิดลิงก์ `/exec` ใหม่ (อยู่ใน README "แก้ปัญหา") · ทางที่อาจลองหลังทริป (เดา ยังไม่พิสูจน์): เลิกเรียก `google.script.history.replace` (เสียการที่ URL ด้านบนเปลี่ยนตามแท็บ) แล้วทดสอบบน iPhone ซ้ำ · **v2.5.0: ลิงก์ GitHub Pages ไม่มี iframe จึงไม่เกิดปัญหานี้** · วิธีดีบัก: iPhone เปิด Web Inspector (Settings → Apps → Safari → Advanced และใน Chrome: Settings → Content Settings) ต่อสายกับ Mac → Safari → Develop → ชื่อ iPhone · หน้าของเราอยู่ใน context `userHtmlFrame (userCodeAppPanel)`
24. **GAS + iOS: ติ๊ก รหัสแก้ไข และสำเนาแผนหายเมื่อเปิดแท็บใหม่/ปัดปิดแอป** (ทดสอบ 2026-11-06 iPhone Chrome) iOS ให้ `localStorage` ของหน้าใน iframe ของ Google (third-party) แบบแยกและชั่วคราว ([WebKit tracking prevention](https://webkit.org/tracking-prevention/)) แก้ในหน้าไม่ได้ → v2.5.0 เพิ่ม target GitHub Pages ที่เป็น first-party (e2e `ftest6.py` จำลองการปิดแอปแล้วติ๊กยังอยู่ · ✅ ยืนยันบน iPhone จริง 2026-11-06: ติ๊กและรหัสแก้ไขอยู่รอดหลังปัดปิดแอปและเปิดแท็บใหม่) · Safari ลบ storage ของเว็บที่ไม่ได้เปิดเกิน 7 วัน (ITP) ไม่กระทบระหว่างทริป แต่ติ๊กเก่ามากอาจหาย

## 7. ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
|---|---|
| `src/parser.js` | `TP.parse(md)` → `{trip, warnings}` · `TP.toMarkdown(trip)` · `TP.parseLines()` · `TP.LINES` · ค่าคงที่ (`STATUS`, `TYPES`, `ITEM_KEYS`, `META_KEYS`) |
| `src/app.js` | แอปทั้งหมด (ตารางลำดับในข้อ 3) |
| `src/styles.css` | tokens + components (ส่วนท้ายไฟล์: chip/block สายรถไฟ, reduced-motion) |
| `data/travel-plan-template.md` | **template v2:** schema + กฎของไฟล์ + กฎสำหรับ Claude (A–F: ห้ามเดา, ความหมายสถานะ, ร่างได้แต่ติด ❓, หนึ่ง field หนึ่งภาษา, เวลา HH:MM, ไฟล์ยาว) + ตัวอย่างที่ใส่ข้อมูลครบ · **กฎที่ Claude ในแชทต้องรู้ต้องอยู่ในไฟล์นี้** (Claude บน claude.ai ไม่เห็น CLAUDE.md/README) เพิ่ม field ใหม่ต้องแก้คอมเมนต์ที่นี่ด้วย · ข้อความสั่ง Claude อยู่ใน README "สร้างแผนใหม่ด้วย Claude" |
| `data/seed/taiwan-2026.md` | แผนไต้หวัน (6 วัน 5 คืน, 6 คน) **สำเนาของ `travel-plan.md` บน Drive** ดึงมา 2026-11-05 (v2.4.0) ให้ Artifact ตรงกับ GAS · แหล่งความจริงคือไฟล์บน Drive ถ้า Kody แก้บน GAS แล้วอยากให้ Artifact ตาม ให้ดาวน์โหลดไฟล์จาก Drive มาแทนไฟล์นี้ |
| `README.md` | คำอธิบายโปรเจกต์สำหรับคนทั่วไป: feature, วิธีใช้, วิธี deploy, สถานะ Phase, checklist ทดสอบมือบน GAS (อัปเดตทุกครั้งที่เพิ่ม feature) |
| `gas/Code.gs` | server ของ Apps Script: `doGet` (หน้า หรือ `?api=getTrip` JSON) · `doPost` (JSON API ของหน้า Pages) · `getTrip(key)` → `{md, version, owner, size}` (`size` = จำนวนตัวอักษรดิบในไฟล์ ดูได้ว่าไฟล์ว่างไหม) · `checkKey(key)` · `saveTrip(md, key, baseVersion, force)` → `{ok, version}` หรือ `{conflict}` · `setup()` |
| `tests/gas/*`, `tests/gas.test.js`, `tests/e2e/ftest4.py`, `ftest6.py` | GAS จำลอง + เทสต์ฝั่ง server, หน้า GAS และหน้า Pages |
| `pages/config.json`, `.github/workflows/pages.yml` | URL `/exec` ที่หน้า Pages เรียก · workflow deploy `dist/pages/` |
| `Original_template.pdf` (อยู่นอก repo, Kody ถือ) | ต้นแบบหน้าตา ถ้าต้องการให้ Claude Code เห็นให้ Kody ใส่ไว้ที่ `docs/` |
| Artifact "Dark Tech Workshop" (URL ข้อ 4) | design system (README อย่างเดียว) |

## 8. Phases

**Phase 1 ✅ (v1) — ดูแผน + แก้ไข + import/export พื้นฐาน**
dashboard + ปฏิทินรายเดือน · เมนูตาม section · timeline แบบย่อ/ขยาย · Today mode · metro map ต่อวัน/ทั้งทริป · เต็มจอสำหรับประโยค/การ์ดแท็กซี่ · checklist + To-do · dark/light · โหมดวางแผน (badge สถานะ, แก้ทุก field, เพิ่ม/ลบ/ย้าย, undo ตอนลบ) · import .md/.json พร้อม preview · export .md/.json · template md

**Phase 2 — ปรับให้ใช้งานคนเดียวจริงจัง**
- 2a ✅ บล็อกสีตามสายรถไฟ/MRT (`line`, `line_alt`, chip + บล็อกใน detail + legend "สายที่ใช้วันนี้")
- 2b ✅ สลับ EN/TH (UI ทั้งหมด + `*_en` แบบไม่บังคับ)
- 2d ✅ โหมดเจ้าของ (ทุกคนดูอย่างเดียว) + แก้เครื่องหมายถูกของ checkbox (v2.1)
- 2c ✅ โค้ด / ✅ deploy แล้ว 2026-11-05 / ✅ ทดสอบบน iPhone + desktop 2026-11-06 (v2.2) **Google Apps Script + ที่เก็บกลางแบบ "ทุกคนอ่าน เจ้าของเขียนคนเดียว"** Kody ตัดสิน 2026-11-05: GAS, ไฟล์ `.md` ใน Drive, รหัสแก้ไขฝั่ง server, เปิดให้ Anyone, เก็บ Artifact ไว้คู่กัน, **บันทึกด้วยปุ่ม** (ไม่ auto), **copy-paste** ขึ้น Apps Script (ไม่ใช้ clasp), **1 แผนต่อ 1 deployment**
  1. ✅ target GAS: `build.py` สร้าง `dist/gas/` (`index.html` + `Code.gs` + `appsscript.json`)
  2. ✅ อ่านจาก Drive: `getTrip()` ตัด `# วางแผน` + comment สำหรับผู้ชม หน้าแสดงสำเนาในเครื่องก่อนแล้วอัปเดตจาก server ติ๊กของผู้ชมอยู่ในเครื่องเขา
  3. ✅ บันทึกของเจ้าของ: ใส่รหัส (ตั้งค่า หรือตอนกดบันทึก), `saveTrip` ตรวจรหัส + กันเขียนทับ + backup, แถบสถานะบันทึกแล้ว/ยังไม่บันทึก, ทิ้งการแก้ไข
  4. ✅ ไม่ใช้ seed บน GAS (seed ใช้แค่ `setup()` ครั้งแรก) · sync มือถือ↔โน้ตบุ๊ก = โหลดจาก Drive ทุกครั้งที่เปิด/กลับมาที่แท็บหลัง 5 นาที
  5. ✅ (v2.3.0) แถบ "ตรงกับแผนบน Drive" มีปุ่ม X ปิดได้ (จำในเครื่อง `tp1.settings.syncHide`) แถบสีส้ม (ยังไม่บันทึก / error / แผนยังไม่อยู่บน Drive) ปิดไม่ได้ และเมื่อเกิดสถานะสีส้ม `syncHide` ถูกล้าง แถบสีฟ้าจึงกลับมาหลังบันทึกครั้งถัดไป (logic อยู่ใน `syncBarHtml` / `syncHide`)
  - ✅ (2026-11-06) ทดสอบตาม checklist ใน README แล้ว: บันทึกติดกัน, ดาวน์โหลด, ฟอนต์, deep link + ลิงก์เก่าบนมือถือ ผ่าน · เจอ Known Issue 23 (หน้าขาวบน iOS หลังปัดปิดแอป มีทางเลี่ยง) · ❓ ที่เหลือ: `marked` จาก CDN, ติ๊กอยู่รอดบน iPhone · ทางเลือกเดิม (capability `db`/`user` ของ Artifact) พักไว้

- v2.5.0 ✅ โค้ด / ✅ ทดสอบ iPhone (2026-11-06) **target GitHub Pages = ลิงก์หลัก** แก้ Known Issue 23, 24: `Code.gs` มี JSON API (`doPost`, `doGet?api=getTrip`) · `app.js` แยก `IN_GAS` / `IS_PAGES` / `HAS_SERVER` และ `rpc()` ใช้ `fetch` บน Pages · `build.py` สร้าง `dist/pages/` · workflow deploy · e2e `ftest6.py` · CORS ทดสอบกับ deployment จริงแล้ว (อ่านอย่างเดียว)
- v2.4.0 ✅ (2026-11-05) template v2 (กฎสำหรับ Claude + ตัวอย่างครบ ทดสอบด้วย Claude ตัวใหม่ทั้งก่อน/หลัง ผลอยู่ใน README) · seed = สำเนาไฟล์บน Drive · id ทริปจาก title ละติน + ลิงก์เก่ายังเปิดได้ · การ์ด "ตอนนี้ + ถัดไป" (ดู Phase 4)
- v2.3.0 ✅ ปรับ UI ตามที่ Kody ขอ (2026-11-05): ช่องเขตเวลาแนะนำเขตเวลาทั้งโลกจาก `Intl.supportedValuesOf('timeZone')` (browser ที่ไม่มีใช้ `TZ` 14 เมืองเดิม) พร้อม label UTC ณ วันเริ่มทริป (`tzOptions`, cache ต่อวันที่) ยังเป็นช่องพิมพ์ + `<datalist>` · ป้าย field `notes` = "สถานที่น่าสนใจรอบๆ / หมายเหตุ" (EN "Nearby places / notes") คีย์ `notes:` ใน md ไม่เปลี่ยน · ชื่อแท็บ `Trip Plans - วางแผนเที่ยว` คงที่ทุกภาษา (Artifact: `<title>` ใน `build.py` + `D.title` ใน `render()` · GAS: `setTitle()` ใน `Code.gs`) · ปุ่ม X ปิดแถบ sync (ดู 2c ข้อ 5)

**Phase 3 ⏳ — สร้าง/แก้แผนในเว็บได้ครบ**
ปุ่ม "แผนใหม่" (เปล่า / คัดลอกโครง) · preview markdown ข้างช่องแก้ · ตรวจข้อมูลแล้วเตือน (เวลาซ้อน/ไม่เรียง, วันที่นอกช่วงทริป, วันไม่มี route) · ปุ่มเรียงตามเวลา · undo/redo หลายขั้น · field timezone ต่อรายการ (แก้ปัญหาข้อ 6.1) · เพิ่มคำแปล `_en` ให้ field ที่ยังไม่มี (must/caution/flights/stays)

**Phase 4 🟡 — ใช้ระหว่างเที่ยว** (Kody ตัดสิน 2026-11-05: ทำแบบย่อก่อนทริป = การ์ด "ถัดไป" + template v2 ส่วนอื่นหลังทริป)
- ✅ (v2.4.0) การ์ด "ตอนนี้ + ถัดไป" บนสุดของแท็บภาพรวมและแท็บของวันนี้ ผู้ชมทุกคนเห็น: เวลาท้องถิ่น + รายการที่เริ่มไปแล้วล่าสุด · รายการถัดไป (เวลา ชื่อ อีกกี่นาที transport หลัก + chip สาย cost ปุ่มแผนที่) แตะแล้วไปแท็บวันนั้น เปิดรายการ เลื่อนไปกลางจอ · หลังรายการสุดท้าย "วันนี้ครบทุกรายการแล้ว · พรุ่งนี้ (Day N) เริ่ม …" · วันสุดท้ายหลังรายการสุดท้าย / ก่อนทริป / หลังทริป / โหมดแก้ไข ไม่แสดง · รีเฟรชทุก 60 วินาทีและตอนกลับมาที่แท็บ (ในเครื่อง ไม่เรียก server) · ข้อความสองภาษาอยู่ใน `NC` (`/*noT*/`)
- ⏳ ติ๊กรายการ "ไปแล้ว / ข้าม" · แนบไฟล์ต่อแผน/รายการ (QR TWAC, ตั๋ว, ใบจอง): **บน GAS เก็บในโฟลเดอร์ Drive ของ Kody** อัปโหลดได้เฉพาะเจ้าของ (ตรวจรหัสแก้ไขฝั่ง server) ❓ ยังไม่ได้เลือกว่าผู้ชมเปิดไฟล์ผ่าน server หรือผ่านลิงก์แชร์ของ Drive · บน Artifact ใช้ capability `assets` หรือซ่อนฟีเจอร์ · ลดการพึ่ง CDN (ฝัง `marked` ลงในหน้าตอน build ได้ ฟอนต์ยังต้องโหลดจาก Google Fonts)

**Phase 5 ⏸ (พักไว้) — ให้ Claude ช่วยในเว็บ**
ช่อง "วางโน้ตดิบ" แปลงเป็นแผนตาม template · ปุ่มให้ Claude ตรวจจุดขัดแย้งแล้วเติม ⚠️❓ · บน Artifact ใช้ capability `sample` ได้ แต่ **บน GAS ไม่มีทางเทียบเท่า** (ต้องใช้ Anthropic API key ซึ่งมีค่าใช้จ่าย) Kody ตัดสิน 2026-11-05 ให้พักไว้ ห้ามเริ่มทำจนกว่าจะคุยใหม่

อัปเดตสถานะของ Phase ในไฟล์นี้ **และใน `README.md`** ทุกครั้งที่ทำเสร็จ และถ้าโค้ดกับไฟล์นี้ไม่ตรงกัน ให้แก้ไฟล์นี้ในคอมมิตเดียวกัน (ดู Definition of Done ในข้อ 4)
