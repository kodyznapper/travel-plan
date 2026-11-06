(function () {
  'use strict';
  var TP = window.TP;
  var D = document;
  function $(s, el) { return (el || D).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || D).querySelectorAll(s)); }

  /* ---------------- icons ---------------- */
  var IC = {
    flight: '<path d="M21 4 3 11l7 2 2 7 3-5 4 3z"/><path d="m10 13 5-4"/>',
    train: '<rect x="6" y="3" width="12" height="14" rx="3"/><path d="M6 10h12M9 17l-2 4M15 17l2 4"/><circle cx="9.5" cy="13.5" r="1"/><circle cx="14.5" cy="13.5" r="1"/>',
    bus: '<rect x="4" y="3" width="16" height="15" rx="2.5"/><path d="M4 10h16M8 18v2M16 18v2"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/>',
    taxi: '<path d="M5 17v-5l2-5h10l2 5v5z"/><path d="M5 12h14M10 4h4v3"/><circle cx="8.5" cy="17" r="1.8"/><circle cx="15.5" cy="17" r="1.8"/>',
    walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="m10 21 2.5-6 2.5 2.5V21M12.5 15l-1-5.5 3.5-1.5 2 4 3 1M11.5 9.5 8 12v3"/>',
    hotel: '<path d="M3 19V6M3 14h18v5M21 14v-2.5A2.5 2.5 0 0 0 18.5 9H11v5"/><circle cx="7" cy="11" r="1.8"/>',
    food: '<path d="M3 12h18a9 8 0 0 1-18 0z"/><path d="M14 3l-2.5 6M19 4l-4.5 5"/>',
    cafe: '<path d="M4 9h12v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3M12 3v3M3 21h15"/>',
    market: '<path d="M3 9 5 4h14l2 5z"/><path d="M5 11v9h14v-9M10 20v-5h4v5"/>',
    temple: '<path d="M2 9.5 12 4l10 5.5z"/><path d="M5 9.5V12h14V9.5M6 12v8M18 12v8M3 20h18M10 20v-4h4v4"/>',
    museum: '<path d="M3 9 12 4l9 5z"/><path d="M5 9v8M9.5 9v8M14.5 9v8M19 9v8M3 17h18M2 20h20"/>',
    shopping: '<path d="M5 8h14l-1.2 13H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    onsen: '<path d="M3 13h18c0 4.4-4 7-9 7s-9-2.6-9-7z"/><path d="M8 3c-1 1.5 1 2.5 0 4.5M12 3c-1 1.5 1 2.5 0 4.5M16 3c-1 1.5 1 2.5 0 4.5"/>',
    nature: '<path d="M2 20 9 8l4 6 3-4 6 10z"/><circle cx="17" cy="5" r="2"/>',
    nightlife: '<path d="M5 4h14l-7 8z"/><path d="M12 12v7M8 20h8M15 6.5l3-3"/>',
    free: '<path d="M12 3l2.4 6.2L21 12l-6.6 2.8L12 21l-2.4-6.2L3 12l6.6-2.8z"/>',
    other: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="12" r=".9"/><circle cx="12" cy="12" r=".9"/><circle cx="16" cy="12" r=".9"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
    gear: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    back: '<path d="m15 5-7 7 7 7"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    up: '<path d="m6 14 6-6 6 6"/>',
    down: '<path d="m6 10 6 6 6-6"/>',
    grip: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
    pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
    download: '<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    check: '<path d="m5 12 4.5 4.5L19 7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>'
  };
  function icon(n) { return '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[n] || IC.other) + '</svg>'; }

  var LANG = 'th';
  var APP_VERSION = 'v2.5.0';
  var IN_GAS = window.TP_TARGET === 'gas';       // Google Apps Script page: runs inside Google's iframe, talks to Code.gs through google.script.run
  var IS_PAGES = window.TP_TARGET === 'pages';   // GitHub Pages page: a normal top-level page (iPhone keeps its storage), talks to the same Code.gs with fetch(window.TP_API)
  var HAS_SERVER = IN_GAS || IS_PAGES;           // plan lives in Drive (one plan per deployment), owner saves with the edit key
  var CHECK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>';

  var EXACT = {"เสร็จ": "Done", "แก้ไข": "Edit", "ภาพรวม": "Overview", "เตรียมของ": "Packing", "ข้อมูลอ้างอิง": "Reference", "วางแผน": "Planning", "วันที่": "Date", "เที่ยวบิน": "Flight", "เส้นทาง": "Route", "สถานะ": "Status", "ออก": "Departs", "ถึง": "Arrives", "หมายเหตุ": "Notes", "ชื่อ": "Name", "เช็กอิน": "Check-in", "เช็กเอาต์": "Check-out", "ที่อยู่": "Address", "ข้อความ": "Text", "หัวข้อ": "Section", "เนื้อหา": "Content", "สรุปวัน": "Day summary", "เวลา": "Time", "ประเภท": "Type", "หมวด": "Group", "ชื่อทริป": "Trip name", "เมืองหลัก": "Main city", "ประเทศ": "Country", "เวอร์ชัน": "Version", "จำนวนคน": "Travelers", "เขตเวลา": "Time zone", "วันเริ่ม": "Start date", "วันสิ้นสุด": "End date", "ธีมของวัน": "Day theme", "ห้ามพลาดวันนี้": "Must-do today", "ข้อควรระวัง": "Watch out", "คืนนี้นอนที่": "Tonight’s stay", "ปลายทางคืนนี้": "Tonight’s destination", "เดินทางหลัก": "Main transport", "เดินทางรอง": "Alternative transport", "เวลา / ค่าใช้จ่าย": "Time / cost", "สถานที่น่าสนใจรอบๆ / หมายเหตุ": "Nearby places / notes", "ย่อทั้งหมด": "Collapse all", "ขยายทั้งหมด": "Expand all", "ไม่ระบุ": "Not set", "รายการใหม่": "New item", "หัวข้อใหม่": "New section", "หมวดใหม่": "New group", "บันทึกไฟล์แล้ว": "File saved", "คัดลอกแล้ว": "Copied", "เลือกข้อความแล้ว กดคัดลอกเอง": "Text selected — press copy yourself", "เขียนทับแผนแล้ว": "Plan overwritten", "นำเข้าแผนแล้ว": "Plan imported", "รีเซ็ตแล้ว": "Reset done", "ลบแผนแล้ว": "Plan deleted", "ลบแล้ว": "Deleted", "เปลี่ยนเป็นธีมสว่าง": "Switch to light theme", "เปลี่ยนเป็นธีมมืด": "Switch to dark theme", "ชื่อประเทศภาษาท้องถิ่น": "Country name (local language)", "รูปแบบการเดินทาง": "Travel style", "ลิงก์ Google Maps": "Google Maps link", "รายการสำคัญ": "Mark as important", "ชื่อ (ไทย)": "Name (Thai)", "เนื้อหา (markdown)": "Content (markdown)", "ชื่อหมวด": "Group name", "หมายเหตุของหมวด (markdown)": "Group notes (markdown)", "เส้นทาง (คั่นด้วย →)": "Route (separate with →)", "เพิ่มวัน": "Add day", "เพิ่มเที่ยวบิน": "Add flight", "เพิ่มที่พัก": "Add stay", "เพิ่มหัวข้อ": "Add section", "เพิ่มรายการ": "Add item", "เพิ่มหมวด": "Add group", "เพิ่มงาน": "Add task", "เว้นว่าง = ค้นจากชื่อจีน · ใส่ - = ไม่มีลิงก์": "Leave blank = search by Chinese name · enter - = no link", "09:00 หรือ 09:00–10:30": "09:00 or 09:00–10:30", "中文 / ชื่อท้องถิ่น": "中文 / local name", "สายที่ใช้วันนี้": "Lines used today", "สายรถไฟ / MRT (เดินทางหลัก)": "Transit line (main)", "สายรถไฟ / MRT (เดินทางรอง)": "Transit line (alternative)", "BL, G, AIRPORT หรือ ชื่อ#RRGGBB": "BL, G, AIRPORT or Name#RRGGBB", "ภาษา / Language": "Language", "แผนเที่ยว": "Trip Plans", "ที่พัก": "Stay", "(ไม่มีชื่อ)": "(untitled)", "จบแล้ว": "Finished", "ธีม": "Theme", "ตั้งค่า": "Settings", "เปิดโหมดเจ้าของแล้ว": "Owner mode on", "ออกจากโหมดเจ้าของแล้ว": "Left owner mode", "</h2><p>กดดาวน์โหลด ถ้าไม่มีไฟล์ออกมา ให้คัดลอกข้อความด้านล่างไปบันทึกเป็นไฟล์แทน</p><textarea class=\"copybox\" readonly>": "</h2><p>Press Download. If no file appears, copy the text below and save it as a file instead.</p><textarea class=\"copybox\" readonly>", "</p><div class=\"tools\"><button class=\"btn pri\" data-act=\"reload-remote\">ลองใหม่</button></div></div>": "</p><div class=\"tools\"><button class=\"btn pri\" data-act=\"reload-remote\">Try again</button></div></div>", "<div class=\"card empty\" aria-busy=\"true\"><h2>กำลังโหลดแผน…</h2><p>ดึงแผนล่าสุดจาก Drive</p></div>": "<div class=\"card empty\" aria-busy=\"true\"><h2>Loading the plan…</h2><p>Fetching the latest plan from Drive</p></div>", "<div class=\"card empty\"><h2>โหลดแผนไม่ได้</h2><p>": "<div class=\"card empty\"><h2>Couldn’t load the plan</h2><p>", "<div class=\"mbtns\"><button class=\"btn\" data-res=\"cancel\">ยกเลิก</button><button class=\"btn pri\" data-key-ok>ยืนยัน</button></div>": "<div class=\"mbtns\"><button class=\"btn\" data-res=\"cancel\">Cancel</button><button class=\"btn pri\" data-key-ok>Confirm</button></div>", "<div class=\"set\"><div><b>รหัสแก้ไข</b><p class=\"muted\">ต้องใส่ก่อนบันทึกขึ้น Drive</p></div><button class=\"btn sm pri\" data-set=\"key\">ใส่รหัส</button></div>": "<div class=\"set\"><div><b>Edit key</b><p class=\"muted\">Required before saving to Drive</p></div><button class=\"btn sm pri\" data-set=\"key\">Enter key</button></div>", "<div class=\"set\"><div><b>รหัสแก้ไข</b><p class=\"muted\">ยืนยันแล้ว จำไว้ในเครื่องนี้</p></div><button class=\"btn sm\" data-set=\"key-forget\">ลืมรหัสในเครื่องนี้</button></div>": "<div class=\"set\"><div><b>Edit key</b><p class=\"muted\">Confirmed and remembered on this device</p></div><button class=\"btn sm\" data-set=\"key-forget\">Forget key on this device</button></div>", "<div class=\"set\"><div><b>โหมดเจ้าของ</b><p class=\"muted\">เปิดโหมดวางแผนและการแก้ไข แก้แล้วกด “บันทึกขึ้น Drive” คนอื่นจึงจะเห็น</p></div><button class=\"btn sm\" data-set=\"owner-off\">ออกจากโหมดเจ้าของ</button></div>": "<div class=\"set\"><div><b>Owner mode</b><p class=\"muted\">Unlocks planning mode and editing. Others see your edits after you press “Save to Drive”</p></div><button class=\"btn sm\" data-set=\"owner-off\">Leave owner mode</button></div>", "<h2>ทิ้งการแก้ไขในเครื่องนี้?</h2><p>การแก้ไขที่ยังไม่บันทึกขึ้น Drive จะหายไป แล้วโหลดแผนจาก Drive มาแทน</p><div class=\"mbtns\"><button class=\"btn\" data-res=\"no\">ยกเลิก</button><button class=\"btn danger\" data-res=\"yes\">ทิ้งการแก้ไข</button></div>": "<h2>Discard edits on this device?</h2><p>Edits not saved to Drive will be lost, and the plan will be reloaded from Drive</p><div class=\"mbtns\"><button class=\"btn\" data-res=\"no\">Cancel</button><button class=\"btn danger\" data-res=\"yes\">Discard edits</button></div>", "<h2>รหัสแก้ไข</h2><p>ใส่รหัสที่ตั้งไว้ใน Script Properties (EDIT_KEY) ของ Apps Script รหัสจะจำไว้ในเบราว์เซอร์เครื่องนี้</p>": "<h2>Edit key</h2><p>Enter the key set in the Apps Script Script Properties (EDIT_KEY). It is remembered in this browser.</p>", "<h2>แผนบน Drive ถูกแก้หลังจากที่คุณโหลดมา</h2><p>ถ้าบันทึกทับ ของที่แก้บน Drive จะหายจากไฟล์หลัก (ยังมีสำเนาในโฟลเดอร์ backup)</p><div class=\"mbtns col\"><button class=\"btn pri\" data-res=\"force\">บันทึกทับด้วยของในเครื่อง</button><button class=\"btn\" data-res=\"load\">โหลดของบน Drive (ทิ้งของในเครื่อง)</button><button class=\"btn\" data-res=\"cancel\">ยกเลิก</button></div>": "<h2>The plan on Drive changed after you loaded it</h2><p>If you overwrite it, the changes on Drive leave the main file (a copy stays in the backup folder)</p><div class=\"mbtns col\"><button class=\"btn pri\" data-res=\"force\">Overwrite with my version</button><button class=\"btn\" data-res=\"load\">Load the Drive version (discard mine)</button><button class=\"btn\" data-res=\"cancel\">Cancel</button></div>", "<h2>แผนบน Drive มีเวอร์ชันใหม่</h2><p>ในเครื่องนี้มีการแก้ไขที่ยังไม่ได้บันทึกขึ้น Drive จะใช้อันไหน</p><div class=\"mbtns col\"><button class=\"btn pri\" data-res=\"new\">ใช้เวอร์ชันบน Drive</button><button class=\"btn\" data-res=\"keep\">เก็บของในเครื่อง</button></div>": "<h2>Drive has a newer version of this plan</h2><p>This device has edits that aren’t saved to Drive yet. Which one do you want to use?</p><div class=\"mbtns col\"><button class=\"btn pri\" data-res=\"new\">Use the Drive version</button><button class=\"btn\" data-res=\"keep\">Keep local version</button></div>", "<span>โหมดแก้ไข · เก็บในเครื่องนี้ก่อน กด “บันทึกขึ้น Drive” เมื่อพร้อมให้คนอื่นเห็น</span></div>": "<span>Edit mode · changes stay on this device until you press “Save to Drive”</span></div>", "กำลังติดต่อ Drive…": "Talking to Drive…", "ดาวน์โหลด": "Download", "ดาวน์โหลดไม่ได้ ใช้ปุ่มคัดลอกแทน": "Download failed. Use Copy instead", "ตรงกับแผนบน Drive": "In sync with the plan on Drive", "ติดต่อเซิร์ฟเวอร์ไม่ได้": "Can’t reach the server", "ทิ้งการแก้ไข": "Discard edits", "บันทึกขึ้น Drive": "Save to Drive", "บันทึกขึ้น Drive แล้ว": "Saved to Drive", "มีการบันทึกอื่นอยู่ ลองใหม่อีกครั้ง": "Another save is in progress. Try again", "มีการแก้ไขที่ยังไม่บันทึกขึ้น Drive (คนอื่นยังเห็นเวอร์ชันเดิม)": "Edits not saved to Drive yet (others still see the old version)", "ยืนยันรหัสแล้ว": "Key confirmed", "รหัสแก้ไข": "Edit key", "รหัสแก้ไขไม่ถูกต้อง": "Wrong edit key", "ลบรหัสออกจากเครื่องนี้แล้ว": "Key removed from this device", "เซิร์ฟเวอร์ยังไม่ได้ตั้งค่า (ยังไม่ได้รัน setup)": "The server isn’t set up yet (setup has not been run)", "แผนหลักอยู่บน Drive ของเจ้าของ การแก้ไขที่ยังไม่บันทึกและการติ๊กเก็บในเครื่องนี้": "The main plan lives in the owner’s Drive. Unsaved edits and checkmarks are kept on this device", "แผนโหลดจาก Drive ของเจ้าของ การติ๊กเก็บในเครื่องนี้เท่านั้น": "The plan is loaded from the owner’s Drive. Checkmarks are stored on this device only", "โหลดแผนฉบับเต็มไม่ได้ ยังไม่ได้บันทึก": "Couldn’t load the full plan. Nothing was saved", "โหลดแผนล่าสุดจาก Drive ไม่ได้ แสดงสำเนาในเครื่อง": "Couldn’t load the latest plan from Drive. Showing the copy on this device", "ใส่รหัสผิดหลายครั้ง ระบบล็อกไว้ 10 นาที": "Too many wrong keys. Locked for 10 minutes", "ไฟล์แผนไม่ถูกต้อง": "The plan file isn’t valid", "ไฟล์แผนบน Drive ว่างเปล่า": "The plan file on Drive is empty", "Drive ไม่ได้เก็บไฟล์ที่บันทึก ลองใหม่อีกครั้ง": "Drive didn’t keep the saved file. Try again", "ใช้แผนนี้เป็นแผนบน Drive": "Use this plan on Drive", "โหลดแผนจาก Drive ไม่ได้: ": "Couldn’t load the plan from Drive: ", "ลองใหม่": "Try again", " aria-label=\"ปิดแถบนี้\" title=\"ปิดแถบนี้\">": " aria-label=\"Close this bar\" title=\"Close this bar\">", "แผนนี้อยู่ในเครื่องนี้เท่านั้น ยังไม่ได้อยู่บน Drive (คนอื่นไม่เห็น)": "This plan is only on this device, not on Drive (others can’t see it)", "ใช้แผนนี้บน Drive แล้ว ทุกคนที่เปิดลิงก์จะเห็นแผนนี้": "This plan is now on Drive. Everyone with the link will see it", "<h2>ใช้แผนนี้เป็นแผนบน Drive?</h2><p>แผนบน Drive ตอนนี้จะถูกแทนที่ด้วยแผนนี้ (ของเดิมมีสำเนาในโฟลเดอร์ backup) แล้วทุกคนที่เปิดลิงก์จะเห็นแผนนี้</p><div class=\"mbtns\"><button class=\"btn\" data-res=\"no\">ยกเลิก</button><button class=\"btn pri\" data-res=\"yes\">ใช้แผนนี้</button></div>": "<h2>Use this plan on Drive?</h2><p>The plan on Drive now will be replaced by this one (the old one is copied to the backup folder), and everyone with the link will see this plan</p><div class=\"mbtns\"><button class=\"btn\" data-res=\"no\">Cancel</button><button class=\"btn pri\" data-res=\"yes\">Use this plan</button></div>"};
  var PHR = {"กลับหน้ารวมแผน": "Back to all plans", "</span>แผนเที่ยว</a>": "</span>Trip Plans</a>", "<h1>แผนเที่ยว</h1>": "<h1>Trip Plans</h1>", "aria-label=\"ตั้งค่า\"": "aria-label=\"Settings\"", "<span>นำเข้าแผน</span>": "<span>Import plan</span>", "<h2>นำเข้าแผน</h2>": "<h2>Import plan</h2>", "<span>สำรองทั้งหมด (.json)</span>": "<span>Back up all (.json)</span>", "<span>กำลังเที่ยว ": "<span>On trip: ", " · วันที่ ": " · day ", " จาก ": " of ", " — เปิดแผนวันนี้</span></a>": " — open today’s plan</span></a>", "<h2>ยังไม่มีแผน</h2>": "<h2>No plans yet</h2>", "นำเข้าไฟล์ .md ที่สร้างตาม template เพื่อเริ่มใช้งาน": "Import an .md file created from the template to get started", "><summary><span>ปฏิทิน · ": "><summary><span>Calendar · ", "</b><span>กำลังเที่ยว</span>": "</b><span>On trip</span>", "<span>จบแล้ว</span>": "<span>Finished</span>", "<span>วันที่ยังไม่ครบ</span>": "<span>Dates incomplete</span>", "<dt>วันที่</dt>": "<dt>Dates</dt>", "<dt>ระยะเวลา</dt>": "<dt>Duration</dt>", "<dt>ผู้เดินทาง</dt>": "<dt>Travelers</dt>", "aria-label=\"เดือนก่อน\"": "aria-label=\"Previous month\"", "aria-label=\"เดือนถัดไป\"": "aria-label=\"Next month\"", ">เดือนนี้</button>": ">This month</button>", " aria-label=\"วันที่ ": " aria-label=\"Day ", "title=\"วันนี้\"": "title=\"Today\"", "<span class=\"today-chip\">วันนี้</span>": "<span class=\"today-chip\">Today</span>", "<span>โหมดแก้ไข · บันทึกอัตโนมัติในเครื่องนี้ ส่งออก .md หรือ .json เพื่อเก็บสำรอง</span>": "<span>Edit mode · changes save automatically on this device. Export .md or .json for a backup</span>", "aria-label=\"ส่วนของแผน\"": "aria-label=\"Plan sections\"", "<span>กำลังเที่ยว วันที่ ": "<span>On trip · day ", "<span>ทริปนี้จบแล้ว</span>": "<span>This trip has finished</span>", "<dt>การเดินทาง</dt>": "<dt>Travel style</dt>", "<h2>เส้นทางทั้งทริป</h2>": "<h2>Whole-trip route</h2>", "<h2>แผนรายวัน</h2>": "<h2>Daily plan</h2>", "<h2>เดินทางและที่พัก</h2>": "<h2>Flights and stays</h2>", "เที่ยวบิน</h2>": "Flights</h2>", "ที่พัก</h2>": "Stays</h2>", "จำไว้ตลอดทริป</h2>": "Keep in mind</h2>", "เวอร์ชัน ": "Version ", "แก้ไขล่าสุดในเครื่องนี้ ": "Last edited on this device: ", "<span>ส่งออก .md</span>": "<span>Export .md</span>", "<span>ส่งออก .json</span>": "<span>Export .json</span>", "<span>ลบแผนนี้</span>": "<span>Delete this plan</span>", "<span>วันที่</span>": "<span>Day</span>", " · แตะเพื่อดูวิธีเดินทางและรายละเอียด": " · tap an item for transport and details", "ห้ามพลาดวันนี้</h3>": "Must-do today</h3>", "ข้อควรระวัง</h3>": "Watch out</h3>", "<span>ข้อมูลเพิ่มเติม</span>": "<span>More info</span>", "<span>ภาพรวม</span>": "<span>Overview</span>", "<span>เตรียมของ</span>": "<span>Packing</span>", "<span class=\"badge hl\">สำคัญ</span>": "<span class=\"badge hl\">Important</span>", "<span>เปิดใน Google Maps</span>": "<span>Open in Google Maps</span>", "<h1>เตรียมของ</h1>": "<h1>Packing</h1>", "<p class=\"muted\">ยังไม่มีรายการ</p>": "<p class=\"muted\">No items yet</p>", "การติ๊กเก็บในเครื่องนี้เท่านั้น": "Checkmarks are stored on this device only", "<h1>To-do ก่อนเดินทาง</h1>": "<h1>Pre-trip to-dos</h1>", " · เลยกำหนด": " · overdue", " · วันที่เทียบตามเวลาของปลายทาง": " · dates are compared using destination time", "แตะแถวเพื่อเปิดเต็มจอ": "Tap a row to view full screen", "<h1>ข้อมูลอ้างอิง</h1>": "<h1>Reference</h1>", "<p class=\"muted\">ยังไม่มีข้อมูล</p>": "<p class=\"muted\">No data yet</p>", "<span>เต็มจอ</span>": "<span>Full screen</span>", "<h1>วางแผน</h1>": "<h1>Planning</h1>", "เห็นเฉพาะโหมดวางแผน": "Visible in planning mode only", "aria-label=\"ย้ายขึ้น\"": "aria-label=\"Move up\"", "aria-label=\"ย้ายลง\"": "aria-label=\"Move down\"", "aria-label=\"ลบ\"": "aria-label=\"Delete\"", "title=\"ลากเพื่อย้าย\"": "title=\"Drag to move\"", "<h1>แก้ไขภาพรวม</h1>": "<h1>Edit overview</h1>", "<h2>วันในทริป</h2>": "<h2>Trip days</h2>", "<h2>จำไว้ตลอดทริป</h2>": "<h2>Keep in mind</h2>", "<h2>หัวข้ออื่นในภาพรวม</h2>": "<h2>Other overview sections</h2>", "<h1>แก้ไข Day ": "<h1>Edit Day ", "<h2>รายการ</h2>": "<h2>Items</h2>", "font-size:15px\">รายการ</h2>": "font-size:15px\">Items</h2>", "aria-label=\"รายการ\"": "aria-label=\"Item\"", "<h2>กล่องท้ายวัน</h2>": "<h2>End-of-day boxes</h2>", "หนึ่งบรรทัดต่อหนึ่งข้อ": "one per line", "<h2>ข้อมูลเพิ่มเติม</h2>": "<h2>More info</h2>", "<h1>แก้ไขเตรียมของ</h1>": "<h1>Edit packing list</h1>", "<h1>แก้ไข To-do</h1>": "<h1>Edit to-dos</h1>", "กำหนด เช่น \"ก่อน 2026-11-12\" — ใส่วันที่แบบ YYYY-MM-DD เพื่อให้เว็บเตือนเมื่อเลยกำหนด": "Due date, e.g. \"before 2026-11-12\" — use YYYY-MM-DD so the app can flag overdue tasks", "placeholder=\"กำหนด\" aria-label=\"กำหนด\"": "placeholder=\"Due\" aria-label=\"Due\"", "placeholder=\"งาน\" aria-label=\"งาน\"": "placeholder=\"Task\" aria-label=\"Task\"", "<h1>แก้ไขข้อมูลอ้างอิง</h1>": "<h1>Edit reference</h1>", "<h1>แก้ไขวางแผน</h1>": "<h1>Edit planning notes</h1>", "ตอนนี้ (เวลาท้องถิ่น)": "Now (local time)", "เส้นทาง: ": "Route: ", "<button class=\"btn sm\">เลิกทำ</button>": "<button class=\"btn sm\">Undo</button>", "aria-label=\"ปิด\"": "aria-label=\"Close\"", "แตะที่ใดก็ได้เพื่อปิด": "Tap anywhere to close", "ดาวน์โหลดจากหน้านี้ไม่ได้ คัดลอกข้อความด้านล่างไปบันทึกเป็นไฟล์แทน": "Downloads aren’t available on this page. Copy the text below and save it as a file instead.", "data-res=\"x\">ปิด</button>": "data-res=\"x\">Close</button>", "data-copy>คัดลอก</button>": "data-copy>Copy</button>", "<li>รวม ": "<li>Total items: ", " รายการ · เตรียมของ ": " · packing items: ", " ชิ้น · To-do ": " · to-dos: ", " · ข้อมูลอ้างอิง ": " · reference sections: ", " หัวข้อ</li></ul>": "</li></ul>", "<div class=\"warns\"><b>ต้องตรวจ ": "<div class=\"warns\"><b>Needs review: ", " จุด</b><ul>": "</b><ul>", "อ่านได้ครบ ไม่พบปัญหา": "Read fully, no problems found", "ไฟล์ .md ตาม template หรือไฟล์สำรอง .json จากเว็บนี้": ".md files that follow the template, or .json backups from this site", "<span>เลือกไฟล์</span>": "<span>Choose file</span>", "วางหรือแก้ข้อความ markdown ก่อนบันทึก": "Paste or edit markdown before saving", "placeholder=\"วางเนื้อหาไฟล์ .md ที่นี่\"": "placeholder=\"Paste the contents of an .md file here\"", "ตรวจข้อความ": "Check text", "data-res=\"cancel\">ยกเลิก</button>": "data-res=\"cancel\">Cancel</button>", "disabled>บันทึกแผน</button>": "disabled>Save plan</button>", "<div class=\"impsum\"><h3>ไฟล์สำรอง ": "<div class=\"impsum\"><h3>Backup file · plans: ", " แผน</h3><ul>": "</h3><ul>", "อ่านไฟล์ JSON ไม่ได้ ตรวจว่าเป็นไฟล์สำรองจากเว็บนี้": "Can’t read this JSON file. Check that it’s a backup from this site.", "บันทึกไม่ได้: ต้องมี title, start, end และอย่างน้อย 1 Day": "Can’t save: title, start, end and at least 1 Day are required", "อ่านไฟล์ไม่ได้": "Can’t read this file", "<h2>มีแผนนี้อยู่แล้ว</h2>": "<h2>This plan already exists</h2>", " มีอยู่ในเครื่องนี้แล้ว": " already exists on this device", ">เขียนทับแผนเดิม</button>": ">Overwrite existing plan</button>", ">เก็บเป็นอีกแผน</button>": ">Keep as a separate plan</button>", "<h2>ตั้งค่า</h2>": "<h2>Settings</h2>", "<b>ธีม</b>": "<b>Theme</b>", "<b>ภาษา / Language</b>": "<b>Language</b>", "เริ่มต้นเป็นธีมมืด": "Dark by default", "\">มืด</button>": "\">Dark</button>", "\">สว่าง</button>": "\">Light</button>", "<b>โหมดวางแผน</b>": "<b>Planning mode</b>", "แสดงสถานะข้อมูล หน้าวางแผน และเครื่องมือแก้ไข นำเข้า ส่งออก": "Shows data status, the planning page, and tools for editing, importing and exporting", "aria-label=\"โหมดวางแผน\"": "aria-label=\"Planning mode\"", "<b>ใช้แผนที่มากับลิงก์</b>": "<b>Use the plan from the link</b>", "ล้างการแก้ไขในเครื่องนี้ของแผนที่มากับลิงก์ แล้วโหลดใหม่ (การติ๊กยังอยู่)": "Clears this device’s edits to link-provided plans and reloads them (checkmarks are kept)", "data-set=\"reset\">รีเซ็ต</button>": "data-set=\"reset\">Reset</button>", "แผน การแก้ไข และการติ๊ก เก็บในเบราว์เซอร์ของเครื่องนี้เท่านั้น": "Plans, edits and checkmarks are stored in this browser only", "เบราว์เซอร์นี้ไม่ให้บันทึกข้อมูล การแก้ไขจะหายเมื่อปิดหน้า": "This browser doesn’t allow saving data. Edits will be lost when you close the page.", "data-res=\"ok\">เสร็จ</button>": "data-res=\"ok\">Done</button>", "<h2>รีเซ็ตแผนจากลิงก์</h2>": "<h2>Reset link-provided plans</h2>", "การแก้ไขในเครื่องนี้ของแผนที่มากับลิงก์จะหายไป ส่งออก .md หรือ .json เก็บไว้ก่อนถ้ายังต้องใช้": "Your edits to link-provided plans on this device will be lost. Export .md or .json first if you still need them.", "data-res=\"yes\">รีเซ็ต</button>": "data-res=\"yes\">Reset</button>", "<h2>ลบแผนนี้?</h2>": "<h2>Delete this plan?</h2>", "” จะถูกลบจากเครื่องนี้ ส่งออก .md เก็บไว้ก่อนถ้ายังต้องใช้": "” will be deleted from this device. Export .md first if you still need it.", "data-res=\"no\">ยกเลิก</button>": "data-res=\"no\">Cancel</button>", "data-res=\"yes\">ลบแผน</button>": "data-res=\"yes\">Delete plan</button>", "<h2>แผนนี้มีเวอร์ชันใหม่จากลิงก์</h2>": "<h2>A newer version of this plan came with the link</h2>", "มากับลิงก์นี้ แต่ในเครื่องนี้มีการแก้ไขไว้": "came with this link, but this device has local edits", "data-res=\"new\">ใช้เวอร์ชันใหม่</button>": "data-res=\"new\">Use new version</button>", "data-res=\"keep\">เก็บของในเครื่อง</button>": "data-res=\"keep\">Keep local version</button>", "<b>โหมดเจ้าของ</b>": "<b>Owner mode</b>", "เปิดโหมดวางแผน การแก้ไข นำเข้า ส่งออก การแก้ไขอยู่ในเครื่องนี้เท่านั้น คนอื่นไม่เห็น": "Unlocks planning mode, editing, import and export. Edits stay on this device — nobody else sees them", "data-set=\"owner-off\">ออกจากโหมดเจ้าของ</button>": "data-set=\"owner-off\">Leave owner mode</button>"};
  var PHR_KEYS = Object.keys(PHR).sort(function (a, b) { return b.length - a.length; });
  var T_CACHE = {};
  function T(s) {
    if (LANG !== 'en') return s;
    var c = T_CACHE[s]; if (c !== undefined) return c;
    var o = s;
    if (Object.prototype.hasOwnProperty.call(EXACT, s)) o = EXACT[s];
    else for (var i = 0; i < PHR_KEYS.length; i++) { var k = PHR_KEYS[i]; if (o.indexOf(k) >= 0) o = o.split(k).join(PHR[k]); }
    T_CACHE[s] = o; return o;
  }
  var TYPE_TH = { flight: 'เครื่องบิน', train: 'รถไฟ / MRT', bus: 'รถเมล์', taxi: 'แท็กซี่ / รถ', walk: 'เดิน', hotel: 'ที่พัก', food: 'อาหาร', cafe: 'คาเฟ่', market: 'ตลาด / ถนนคนเดิน', temple: 'วัด / ศาลเจ้า', museum: 'พิพิธภัณฑ์ / ศิลปะ', shopping: 'ช้อปปิ้ง', onsen: 'ออนเซ็น / สปา', nature: 'ธรรมชาติ', nightlife: 'บาร์ / กลางคืน', free: 'เวลาว่าง', other: 'อื่นๆ' }; /*noT*/
  var TYPE_EN = { flight: 'Flight', train: 'Train / MRT', bus: 'Bus', taxi: 'Taxi / car', walk: 'Walk', hotel: 'Stay', food: 'Food', cafe: 'Cafe', market: 'Market / street', temple: 'Temple / shrine', museum: 'Museum / art', shopping: 'Shopping', onsen: 'Onsen / spa', nature: 'Nature', nightlife: 'Bars / nightlife', free: 'Free time', other: 'Other' };
  function typeLabel(x) { return (LANG === 'en' ? TYPE_EN : TYPE_TH)[x] || ''; }
  var STATUS_CLS = { '✅': 'b-ok', '🔎': 'b-ok', '📄': 'b-doc', '⚠️': 'b-warn', '❓': 'b-warn' };
  var STATUS_TH = {}; TP.STATUS.forEach(function (s) { STATUS_TH[s[0]] = s[1]; });
  var STATUS_EN = { '✅': 'Confirmed', '📄': 'From document', '🔎': 'Web-checked', '⚠️': 'Needs check', '❓': 'Unknown' };
  function statusLabel(x) { return (LANG === 'en' ? STATUS_EN : STATUS_TH)[x] || ''; }
  function statusOpts() { return [['', T('ไม่ระบุ')]].concat(TP.STATUS.map(function (x) { return [x[0], x[0] + ' ' + statusLabel(x[0])]; })); }
  /* counts with units (noT: both languages written out here) */
  var UNITS = { plan: ['แผน', 'plan', 'plans'], night: ['คืน', 'night', 'nights'], day: ['วัน', 'day', 'days'], person: ['คน', 'person', 'people'], stop: ['จุด', 'stop', 'stops'], item: ['รายการ', 'item', 'items'] }; /*noT*/
  function unit(n, u) { var x = UNITS[u]; return LANG === 'en' ? (n === 1 ? x[1] : x[2]) : x[0]; }
  function cnt(n, u) { return n + ' ' + unit(n, u); }
  function durLabel(n) { return LANG === 'en' ? cnt(n, 'day') + ' ' + cnt(Math.max(0, n - 1), 'night') : n + ' วัน ' + Math.max(0, n - 1) + ' คืน'; } /*noT*/
  function countdown(n) { return LANG === 'en' ? 'Departs in ' + cnt(n, 'day') : 'อีก ' + n + ' วันจะออกเดินทาง'; } /*noT*/
  function daysToGo(n) { return LANG === 'en' ? (n === 1 ? 'day to go' : 'days to go') : 'วันก่อนเดินทาง'; } /*noT*/
  /* content in the current language: field_en when present, else the base field */
  function L(o, k) { if (!o) return ''; if (LANG === 'en') { var v = o[k + '_en']; if (v != null && String(v).trim()) return v; } return o[k] == null ? '' : o[k]; }
  var TZ = ['Asia/Bangkok', 'Asia/Taipei', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Hong_Kong', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Ho_Chi_Minh', 'Asia/Kuala_Lumpur', 'Europe/London', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Australia/Sydney'];

  /* ---------------- text ---------------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var EMO_RE = /[ \t]?(?:✅|📄|🔎|⚠\uFE0F?|❓)\uFE0F?/gu;
  function stripE(s) {
    return String(s == null ? '' : s).replace(EMO_RE, '').replace(/\([ \t]*\)/g, '').replace(/[ \t]{2,}/g, ' ')
      .replace(/^([ \t]*[-*|]?[ \t]*)·[ \t]*/gm, '$1').replace(/·[ \t]*·/g, '·').replace(/[ \t]*·[ \t]*$/gm, '').trim();
  }
  function vis(s) { return S.settings.planning ? String(s == null ? '' : s) : stripE(s); }
  function inl(s) {
    return esc(vis(s)).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
  }
  function prepMd(s) { return vis(s).replace(/</g, '&lt;'); }
  function linkify(h) { return h.replace(/<a href=/g, '<a target="_blank" rel="noopener" href='); }
  function wrapTables(h) { return h.replace(/<table>/g, '<div class="tw"><table>').replace(/<\/table>/g, '</table></div>'); }
  function mdHtml(s) {
    if (!String(s || '').trim()) return '';
    if (!window.marked) return '<p>' + esc(vis(s)).replace(/\n/g, '<br>') + '</p>';
    return linkify(wrapTables(window.marked.parse(prepMd(s))));
  }
  function hasCJK(s) { return /[\u3400-\u9FFF\uF900-\uFAFF]/.test(s || ''); }

  /* ---------------- dates ---------------- */
  var MON_S = { th: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'], en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] }; /*noT*/
  var MON_F = { th: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'], en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] }; /*noT*/
  var WD_L = { th: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'], en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }; /*noT*/
  var WD_C = { th: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'], en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] }; /*noT*/
  function MS() { return MON_S[LANG]; }
  function MF() { return MON_F[LANG]; }
  function WD() { return WD_L[LANG]; }
  function dp(s) { var a = s.split('-').map(Number); return { y: a[0], m: a[1], d: a[2], wd: new Date(Date.UTC(a[0], a[1] - 1, a[2])).getUTCDay() }; }
  function addDays(s, n) { return new Date(Date.parse(s + 'T00:00:00Z') + n * 864e5).toISOString().slice(0, 10); }
  function diffDays(a, b) { return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 864e5); }
  function fmtDate(s, wd, year) {
    if (!TP.isDate(s)) return s || '';
    var p = dp(s);
    return (wd ? WD()[p.wd] + ' ' : '') + p.d + ' ' + MS()[p.m - 1] + (year === false ? '' : ' ' + p.y);
  }
  function fmtRange(a, b) {
    if (!TP.isDate(a) || !TP.isDate(b)) return [a, b].filter(Boolean).join(' – ');
    var A = dp(a), B = dp(b);
    if (a === b) return fmtDate(a);
    if (A.y === B.y && A.m === B.m) return A.d + '–' + B.d + ' ' + MS()[A.m - 1] + ' ' + A.y;
    if (A.y === B.y) return A.d + ' ' + MS()[A.m - 1] + ' – ' + B.d + ' ' + MS()[B.m - 1] + ' ' + A.y;
    return fmtDate(a) + ' – ' + fmtDate(b);
  }
  function nowIn(tz) {
    var o = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }, parts;
    try { if (tz) o.timeZone = tz; parts = new Intl.DateTimeFormat('en-CA', o).formatToParts(new Date()); }
    catch (e) { delete o.timeZone; parts = new Intl.DateTimeFormat('en-CA', o).formatToParts(new Date()); }
    function g(t) { var p = parts.filter(function (x) { return x.type === t; })[0]; return p ? p.value : '00'; }
    var h = g('hour') === '24' ? '00' : g('hour');
    return { date: g('year') + '-' + g('month') + '-' + g('day'), min: (+h) * 60 + (+g('minute')), hm: h + ':' + g('minute') };
  }
  /* time-zone suggestions: every zone the browser knows (falls back to TZ), labelled with its UTC offset on the trip's start date */
  var tzCache = {};
  function tzOffset(z, d) {
    try {
      var p = {}, f = new Intl.DateTimeFormat('en-US', { timeZone: z, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
      f.formatToParts(d).forEach(function (x) { p[x.type] = +x.value; });
      var m = Math.round((Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute) - d.getTime()) / 60000);
      var a = Math.abs(m);
      return 'UTC' + (m < 0 ? '-' : '+') + Math.floor(a / 60) + (a % 60 ? ':' + ('0' + (a % 60)).slice(-2) : '');
    } catch (e) { return ''; }
  }
  function tzList() {
    var all = [];
    try { if (Intl.supportedValuesOf) all = Intl.supportedValuesOf('timeZone'); } catch (e) { all = []; }
    var seen = {}, out = [];
    TZ.concat(all).forEach(function (z) { if (!seen[z]) { seen[z] = 1; out.push(z); } });
    return out.sort();
  }
  function tzOptions(date) {
    var key = TP.isDate(date) ? date : '';
    if (!tzCache[key]) {
      var d = key ? new Date(key + 'T12:00:00Z') : new Date(Math.floor(Date.now() / 60000) * 60000);
      tzCache[key] = tzList().map(function (z) { var o = tzOffset(z, d); return '<option value="' + esc(z) + '"' + (o ? ' label="' + o + '"' : '') + '>'; }).join('');
    }
    return tzCache[key];
  }
  function startMin(time) { var m = String(time || '').match(/(\d{1,2}):(\d{2})/); return m ? (+m[1]) * 60 + (+m[2]) : -1; }
  function tripState(t) {
    var mt = t.meta, n = nowIn(mt.timezone), today = n.date;
    if (!TP.isDate(mt.start) || !TP.isDate(mt.end)) return { status: 'unknown', today: today };
    var total = diffDays(mt.start, mt.end) + 1;
    if (today < mt.start) return { status: 'upcoming', today: today, left: diffDays(today, mt.start), total: total };
    if (today > mt.end) return { status: 'past', today: today, total: total };
    var idx = -1; t.days.forEach(function (d, i) { if (d.date === today) idx = i; });
    return { status: 'ongoing', today: today, dayIdx: idx, k: diffDays(mt.start, today) + 1, total: total };
  }
  function dayCls(i) { return i % 2 ? 'c' : 'o'; }
  function tripCls(i) { return i % 2 ? 'c' : 'o'; }

  /* ---------------- state + storage ---------------- */
  var K = { trips: 'tp1.trips', set: 'tp1.settings', seed: 'tp1.seed', key: 'tp1.key' };
  var storageOK = true;
  function lsGet(k) { try { var v = localStorage.getItem(k); return v == null ? null : JSON.parse(v); } catch (e) { storageOK = false; return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { storageOK = false; return false; } }
  var S = { trips: [], settings: { theme: 'dark', planning: false, lang: 'th', owner: false }, edit: false, open: {}, cal: null, calOpen: null, cur: null, tab: 'overview', focus: null, drawn: {},
    remote: { state: HAS_SERVER ? 'loading' : 'off', busy: false, at: 0, err: '', first: true } };
  var saveT = null;
  function saveSoon() { clearTimeout(saveT); saveT = setTimeout(saveNow, 300); }
  function saveNow() { clearTimeout(saveT); lsSet(K.trips, S.trips); }
  function edited() { if (S.cur) { S.cur.localEdited = true; S.cur.updatedAt = Date.now(); } saveSoon(); refreshSyncBar(); }

  function fnv(s) { var h = 0x811c9dc5; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(16); }
  var SEEDS = (window.TP_SEED || []).slice();
  var SEED_HASH = fnv(SEEDS.join('\n<<seed>>\n'));

  function makeId(meta) {
    function slug(x) { return String(x || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
    // the first title that has Latin letters (a Thai title like "เที่ยวไต้หวัน 2026" falls back to title_en)
    var base = [meta.title, meta.title_en].map(slug).filter(function (x) { return /[a-z]/.test(x); })[0] || slug(meta.title) || 'trip';
    if (/^comment-/.test(base)) base = 't-' + base;
    base += '-' + (TP.isDate(meta.start) ? meta.start : 'x');
    var id = base, k = 2;
    while (S.trips.some(function (t) { return t.id === id; })) id = base + '-' + (k++);
    return id;
  }
  function clearChecks(t) { (t.pack || []).forEach(function (g) { g.items.forEach(function (x) { x.done = false; }); }); (t.todo || []).forEach(function (x) { x.done = false; }); }
  function carryChecks(oldT, newT) {
    var pm = {}, tm = {};
    (oldT.pack || []).forEach(function (g) { g.items.forEach(function (x) { pm[g.title + '|' + x.text] = x.done; }); });
    (oldT.todo || []).forEach(function (x) { tm[x.due + '|' + x.text] = x.done; });
    (newT.pack || []).forEach(function (g) { g.items.forEach(function (x) { var k = g.title + '|' + x.text; if (k in pm) x.done = pm[k]; }); });
    (newT.todo || []).forEach(function (x) { var k = x.due + '|' + x.text; if (k in tm) x.done = tm[k]; });
  }
  function normalizeTrip(x) {
    var t = TP.emptyTrip();
    t.meta = Object.assign(t.meta, x.meta || {});
    t.metaExtra = x.metaExtra || {};
    t.overview = Object.assign(t.overview, x.overview || {});
    ['days', 'pack', 'todo', 'ref'].forEach(function (k) { if (Array.isArray(x[k])) t[k] = x[k]; });
    t.plan = x.plan || '';
    t.days.forEach(function (d) { d.id = d.id || TP.uid(); d.items = d.items || []; d.must = d.must || []; d.caution = d.caution || []; d.items.forEach(function (it) { it.id = it.id || TP.uid(); it.extra = it.extra || {}; }); });
    return t;
  }
  function sameTrip(a, b) { return a.meta.title === b.meta.title && a.meta.start === b.meta.start; }

  function seedTrips() { return SEEDS.map(function (md) { var t = TP.parse(md).trip; clearChecks(t); return t; }); }

  function initData() {
    var tr = lsGet(K.trips);
    S.trips = Array.isArray(tr) ? tr.map(function (x) { var t = normalizeTrip(x); t.id = x.id; t.origin = x.origin; t.localEdited = x.localEdited; t.updatedAt = x.updatedAt; return t; }) : [];
    var savedSet = lsGet(K.set) || {};
    if (savedSet.owner === undefined) savedSet.owner = !!savedSet.planning;   // anyone who already used planning mode before owner mode existed is the owner
    S.settings = Object.assign({ theme: 'dark', planning: false, lang: 'th', owner: false }, savedSet);
    var conflicts = [];
    if (!HAS_SERVER && lsGet(K.seed) !== SEED_HASH) {   // GAS has no seed: the plan comes from Drive (loadRemote)
      seedTrips().forEach(function (t) {
        // a renamed seed (same start date) still replaces its old copy, keeping its id (links) and the viewer's ticks
        var ex = S.trips.filter(function (x) { return sameTrip(x, t); })[0] || S.trips.filter(function (x) { return x.origin === 'seed' && x.meta.start === t.meta.start; })[0];
        if (!ex) { t.id = makeId(t.meta); t.origin = 'seed'; t.localEdited = false; t.updatedAt = Date.now(); S.trips.push(t); }
        else if (!ex.localEdited) { replaceTrip(ex, t, false); }
        else conflicts.push([ex, t]);
      });
      lsSet(K.seed, SEED_HASH); saveNow();
    }
    return conflicts;
  }
  function replaceTrip(oldT, newT, edited_) {
    carryChecks(oldT, newT);
    newT.id = oldT.id; newT.origin = oldT.origin || 'seed'; newT.localEdited = !!edited_; newT.updatedAt = Date.now();
    newT.remoteVersion = oldT.remoteVersion; newT.remoteFull = oldT.remoteFull;   // GAS: importing over the Drive plan must keep the Drive version it is based on
    S.trips[S.trips.indexOf(oldT)] = newT;
    return newT;
  }

  /* ---------------- server (Google Apps Script) ----------------
     One plan per deployment, stored as .md in the owner's Drive (gas/Code.gs).
     Reading is open to everyone; saving needs the edit key, which the server checks.
     GAS page: google.script.run. Pages page: POST {fn, args} to the /exec URL (text/plain = no CORS preflight), answer {ok} or {error}. */
  var API_URL = String(window.TP_API || '');
  function hasRpc() { return IS_PAGES ? /^https:\/\//.test(API_URL) && typeof fetch === 'function' : !!(window.google && window.google.script && window.google.script.run); }
  function rpc(name) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (IS_PAGES) {
      if (!hasRpc()) return Promise.reject(new Error('NO_SERVER'));
      return fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ fn: name, args: args }), cache: 'no-store' })
        .then(function (r) { if (!r.ok) throw new Error('HTTP_' + r.status); return r.json(); })
        .then(function (o) { if (!o || o.error) throw new Error(String((o && o.error) || 'NO_ANSWER')); return o.ok; });
    }
    return new Promise(function (res, rej) {
      if (!hasRpc()) { rej(new Error('NO_SERVER')); return; }
      var r = window.google.script.run.withSuccessHandler(res).withFailureHandler(function (e) { rej(e instanceof Error ? e : new Error(String((e && e.message) || e))); });
      r[name].apply(r, args);
    });
  }
  function errCode(e) { var m = /(BAD_KEY|LOCKED|BUSY|EMPTY_PLAN|EMPTY|TOO_BIG|NOT_A_PLAN|NOT_SET_UP|NO_SERVER|WRITE_FAILED)/.exec(String((e && e.message) || e || '')); return m ? m[1] : 'OTHER'; }
  function errText(e) {
    var c = errCode(e);
    if (c === 'BAD_KEY') return T('รหัสแก้ไขไม่ถูกต้อง');
    if (c === 'LOCKED') return T('ใส่รหัสผิดหลายครั้ง ระบบล็อกไว้ 10 นาที');
    if (c === 'BUSY') return T('มีการบันทึกอื่นอยู่ ลองใหม่อีกครั้ง');
    if (c === 'NOT_SET_UP') return T('เซิร์ฟเวอร์ยังไม่ได้ตั้งค่า (ยังไม่ได้รัน setup)');
    if (c === 'EMPTY_PLAN') return T('ไฟล์แผนบน Drive ว่างเปล่า');
    if (c === 'WRITE_FAILED') return T('Drive ไม่ได้เก็บไฟล์ที่บันทึก ลองใหม่อีกครั้ง');
    if (c === 'EMPTY' || c === 'TOO_BIG' || c === 'NOT_A_PLAN') return T('ไฟล์แผนไม่ถูกต้อง');
    return T('ติดต่อเซิร์ฟเวอร์ไม่ได้');
  }
  function editKey() { var k = lsGet(K.key); return typeof k === 'string' ? k : ''; }
  function serverTrip() { return S.trips.filter(function (t) { return t.origin === 'server'; })[0] || null; }
  function asServer(t, r) { t.origin = 'server'; t.remoteVersion = r.version; t.remoteFull = !!r.owner; return t; }
  function loadRemote() {
    if (!HAS_SERVER) return Promise.resolve();
    S.remote.busy = true; refreshSyncBar();
    return rpc('getTrip', editKey()).then(function (r) {
      try { return applyRemote(r); } catch (e) { remoteFail(e); }   // an error here used to vanish and leave the page "loading" forever
    }, remoteFail);
  }
  function remoteFail(e) {
    S.remote.busy = false; S.remote.state = 'error'; S.remote.err = errText(e);
    render(true);
    if (serverTrip()) toast(T('โหลดแผนล่าสุดจาก Drive ไม่ได้ แสดงสำเนาในเครื่อง'));
  }
  function applyRemote(r) {
    if (!r || !String(r.md || '').trim()) throw new Error('EMPTY_PLAN');
    var nt = TP.parse(String(r.md)).trip;
    if (!nt.days.length) throw new Error('NOT_A_PLAN');
      clearChecks(nt);   // ticks are personal: never take them from the server copy
      S.remote.busy = false; S.remote.at = Date.now(); S.remote.state = 'ok'; S.remote.err = '';
      var ex = serverTrip() || S.trips.filter(function (x) { return sameTrip(x, nt); })[0];
      if (!ex) { nt.id = makeId(nt.meta); nt.localEdited = false; nt.updatedAt = Date.now(); S.trips.push(asServer(nt, r)); }
      else if (!ex.localEdited) asServer(replaceTrip(ex, nt, false), r);
      else if (ex.origin === 'server' && ex.remoteVersion === r.version) {   // unsaved local edits on top of the current server copy
        if (r.owner && !ex.remoteFull) { if (!String(ex.plan || '').trim()) ex.plan = nt.plan; ex.remoteFull = true; }
      } else {
        saveNow(); remoteDone();
        return modal(T('<h2>แผนบน Drive มีเวอร์ชันใหม่</h2><p>ในเครื่องนี้มีการแก้ไขที่ยังไม่ได้บันทึกขึ้น Drive จะใช้อันไหน</p><div class="mbtns col"><button class="btn pri" data-res="new">ใช้เวอร์ชันบน Drive</button><button class="btn" data-res="keep">เก็บของในเครื่อง</button></div>'), { sticky: true }).then(function (c) {
          if (c === 'new') asServer(replaceTrip(ex, nt, false), r);
          else { ex.origin = 'server'; if (r.owner) ex.remoteFull = true; }   // keeps the old remoteVersion, so saving asks before overwriting
          saveNow(); render(true);
        });
      }
      saveNow(); remoteDone();
  }
  function remoteDone() {
    var first = S.remote.first; S.remote.first = false;
    var t = serverTrip();
    if (first && t && parseHash().view === 'home') { go(landing(t)); return; }
    render(true);
  }
  function landing(t) { var st = tripState(t); return t.id + (st.status === 'ongoing' && st.dayIdx >= 0 ? '--d' + (st.dayIdx + 1) : ''); }
  function saveRemote(force) {
    var t = serverTrip(); if (!t || S.remote.busy) return Promise.resolve();
    if (!editKey()) return askKey().then(function (ok) { if (ok) return saveRemote(force); });
    if (!t.remoteFull) return loadRemote().then(function () { var t2 = serverTrip(); if (t2 && t2.remoteFull) return saveRemote(force); toast(T('โหลดแผนฉบับเต็มไม่ได้ ยังไม่ได้บันทึก')); });
    var copy = JSON.parse(JSON.stringify(t)); clearChecks(copy);
    S.remote.busy = true; refreshSyncBar();
    return rpc('saveTrip', TP.toMarkdown(copy), editKey(), t.remoteVersion || '', !!force).then(function (r) {
      S.remote.busy = false;
      if (r && r.conflict) { refreshSyncBar(); return conflictSave(); }
      t.remoteVersion = r.version; t.localEdited = false; S.remote.at = Date.now(); saveNow(); render(true);
      toast(T('บันทึกขึ้น Drive แล้ว'));
    }, function (e) {
      S.remote.busy = false;
      if (errCode(e) === 'BAD_KEY') lsSet(K.key, '');
      render(true); toast(errText(e));
    });
  }
  function conflictSave() {
    return modal(T('<h2>แผนบน Drive ถูกแก้หลังจากที่คุณโหลดมา</h2><p>ถ้าบันทึกทับ ของที่แก้บน Drive จะหายจากไฟล์หลัก (ยังมีสำเนาในโฟลเดอร์ backup)</p><div class="mbtns col"><button class="btn pri" data-res="force">บันทึกทับด้วยของในเครื่อง</button><button class="btn" data-res="load">โหลดของบน Drive (ทิ้งของในเครื่อง)</button><button class="btn" data-res="cancel">ยกเลิก</button></div>'), { sticky: true }).then(function (c) {
      if (c === 'force') return saveRemote(true);
      if (c === 'load') return discardLocal();
    });
  }
  function discardLocal() { var t = serverTrip(); if (t) t.localEdited = false; return loadRemote(); }
  function askKey(noReload) {
    var okKey = false;
    return modal(T('<h2>รหัสแก้ไข</h2><p>ใส่รหัสที่ตั้งไว้ใน Script Properties (EDIT_KEY) ของ Apps Script รหัสจะจำไว้ในเบราว์เซอร์เครื่องนี้</p>') +
      '<input type="password" data-key autocomplete="current-password" aria-label="' + T('รหัสแก้ไข') + '"><p class="err" data-key-err hidden></p>' +
      T('<div class="mbtns"><button class="btn" data-res="cancel">ยกเลิก</button><button class="btn pri" data-key-ok>ยืนยัน</button></div>'), {
      sticky: true,
      onOpen: function (m, close) {
        var inp = $('[data-key]', m), err = $('[data-key-err]', m), btn = $('[data-key-ok]', m);
        function fail(msg) { btn.disabled = false; err.hidden = false; err.textContent = msg; }
        function submit() {
          var v = inp.value.trim(); if (!v || btn.disabled) return;
          btn.disabled = true;
          rpc('checkKey', v).then(function (r) { if (r && r.ok) { lsSet(K.key, v); okKey = true; close('ok'); } else fail(T('รหัสแก้ไขไม่ถูกต้อง')); }, function (e) { fail(errText(e)); });
        }
        btn.addEventListener('click', submit);
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
        setTimeout(function () { try { inp.focus(); } catch (e) { } }, 30);
      }
    }).then(function () {
      if (!okKey) return false;
      toast(T('ยืนยันรหัสแล้ว'));
      if (noReload) return true;
      return loadRemote().then(function () { return true; });
    });
  }
  function syncBarHtml(t) {
    if (!HAS_SERVER || !S.settings.planning || !t) return '';
    var busy = S.remote.busy, dis = busy ? ' disabled' : '', local = t.origin !== 'server';
    var promote = '<button class="btn sm pri" data-act="promote"' + dis + '>' + icon('upload') + '<span>' + T('ใช้แผนนี้เป็นแผนบน Drive') + '</span></button>';
    if (local || (!busy && S.remote.state === 'error')) syncHide(false);
    if (!busy && S.remote.state === 'error') return '<div class="syncbar dirty" data-syncbar>' + icon('alert') + '<span>' + T('โหลดแผนจาก Drive ไม่ได้: ') + esc(S.remote.err) + '</span><button class="btn sm ghost" data-act="reload-remote">' + T('ลองใหม่') + '</button>' + (local ? promote : '') + '</div>';
    if (local) return '<div class="syncbar dirty" data-syncbar>' + icon('alert') + '<span>' + (busy ? T('กำลังติดต่อ Drive…') : T('แผนนี้อยู่ในเครื่องนี้เท่านั้น ยังไม่ได้อยู่บน Drive (คนอื่นไม่เห็น)')) + '</span>' + promote + '</div>';
    var dirty = !!t.localEdited;
    if (dirty) syncHide(false);   // closing only hides the "in sync" bar: unsaved edits bring it back, and it stays back after the next save
    else if (S.settings.syncHide) return '<i hidden data-syncbar></i>';
    var msg = busy ? T('กำลังติดต่อ Drive…') : dirty ? T('มีการแก้ไขที่ยังไม่บันทึกขึ้น Drive (คนอื่นยังเห็นเวอร์ชันเดิม)') : T('ตรงกับแผนบน Drive');
    return '<div class="syncbar' + (dirty ? ' dirty' : '') + '" data-syncbar>' + icon(dirty ? 'alert' : 'check') + '<span>' + msg + '</span>' +
      (dirty ? '<button class="btn sm ghost" data-act="discard-local"' + dis + '>' + T('ทิ้งการแก้ไข') + '</button><button class="btn sm pri" data-act="save-remote"' + dis + '>' + icon('upload') + '<span>' + T('บันทึกขึ้น Drive') + '</span></button>' :
        busy ? '' : '<button class="ibtn sm sb-x" data-act="sync-hide"' + T(' aria-label="ปิดแถบนี้" title="ปิดแถบนี้">') + icon('x') + '</button>') + '</div>';
  }
  /* remembered per device (tp1.settings.syncHide); only the green "in sync" bar can be closed */
  function syncHide(on) {
    if (!!S.settings.syncHide === on) return;
    S.settings.syncHide = on; lsSet(K.set, S.settings);
  }
  /* make a local-only plan (e.g. imported) the plan on Drive: replaces the Drive file (backed up first) */
  function promoteTrip(t) {
    if (!t || S.remote.busy) return Promise.resolve();
    return modal(T('<h2>ใช้แผนนี้เป็นแผนบน Drive?</h2><p>แผนบน Drive ตอนนี้จะถูกแทนที่ด้วยแผนนี้ (ของเดิมมีสำเนาในโฟลเดอร์ backup) แล้วทุกคนที่เปิดลิงก์จะเห็นแผนนี้</p><div class="mbtns"><button class="btn" data-res="no">ยกเลิก</button><button class="btn pri" data-res="yes">ใช้แผนนี้</button></div>')).then(function (c) {
      if (c !== 'yes') return;
      return (editKey() ? Promise.resolve(true) : askKey(true)).then(function (ok) {
        if (!ok) return;
        var copy = JSON.parse(JSON.stringify(t)); clearChecks(copy);
        S.remote.busy = true; refreshSyncBar();
        return rpc('saveTrip', TP.toMarkdown(copy), editKey(), '', true).then(function (r) {
          S.remote.busy = false;
          S.trips = S.trips.filter(function (x) { return x === t || x.origin !== 'server'; });   // one Drive plan per deployment
          t.origin = 'server'; t.remoteVersion = r.version; t.remoteFull = true; t.localEdited = false;
          S.remote.state = 'ok'; S.remote.err = ''; S.remote.at = Date.now();
          saveNow(); render(true); toast(T('ใช้แผนนี้บน Drive แล้ว ทุกคนที่เปิดลิงก์จะเห็นแผนนี้'));
        }, function (e) {
          S.remote.busy = false;
          if (errCode(e) === 'BAD_KEY') lsSet(K.key, '');
          render(true); toast(errText(e));
        });
      });
    });
  }
  function refreshSyncBar() { var el = $('[data-syncbar]'); if (el) el.outerHTML = syncBarHtml(S.cur); }

  /* ---------------- router ---------------- */
  function parseHash() {
    var h = decodeURIComponent(location.hash.slice(1));
    if (!h || h === 'home') return { view: 'home' };
    var i = h.indexOf('--');
    return { view: 'trip', id: i < 0 ? h : h.slice(0, i), tab: i < 0 ? 'overview' : h.slice(i + 2) };
  }
  function go(h) { if (location.hash === '#' + h) render(true); else location.hash = h; }

  /* ---------------- render root ---------------- */
  function applyTheme() {
    D.documentElement.setAttribute('data-theme', S.settings.theme);
    var m = $('meta[name="theme-color"]'); if (m) m.setAttribute('content', S.settings.theme === 'light' ? '#F3F5F8' : '#0E1116');
  }
  function render(keep) {
    var y = window.scrollY;
    applyTheme();
    LANG = S.settings.lang === 'en' ? 'en' : 'th'; D.documentElement.setAttribute('lang', LANG);
    if (!S.settings.owner) S.settings.planning = false;   // viewers never get planning/edit tools
    var r = parseHash(), trip = null;
    if (r.view === 'trip') {
      trip = S.trips.filter(function (t) { return t.id === r.id; })[0];
      if (!trip && /\d{4}-\d{2}-\d{2}$/.test(r.id)) {   // link made before the trip was renamed: the id still ends with the start date
        var byDate = S.trips.filter(function (t) { return t.meta.start === r.id.slice(-10); });
        if (byDate.length === 1) trip = byDate[0];
      }
      if (!trip && HAS_SERVER) trip = serverTrip();   // one plan per deployment: its id differs between browsers (made from the title on first load), so any trip link opens it
      var waiting = HAS_SERVER && S.remote.state === 'loading' && !serverTrip();   // deep link on a first visit: keep the hash until Drive answers
      if (!trip) { if (!waiting) history.replaceState(null, '', '#home'); r = { view: 'home' }; }
    }
    if (!trip) S.edit = false;
    if (!S.settings.planning) S.edit = false;
    S.cur = trip;
    var tab = trip ? validTab(trip, r.tab) : '';
    S.tab = tab;
    $('#topbar').innerHTML = topbarHtml(trip);
    $('#app').innerHTML = trip ? tripHtml(trip, tab) : dashHtml();
    D.title = 'Trip Plans - วางแผนเที่ยว';   /*noT*/ // same tab name in both languages and on both targets (GAS sets it in Code.gs)
    afterRender();
    if (keep) window.scrollTo(0, y);
    mirrorHash();
  }
  function validTab(t, tab) {
    if (tab === 'overview' || tab === 'pack' || tab === 'todo' || tab === 'ref') return tab;
    if (tab === 'plan') return S.settings.planning ? 'plan' : 'overview';
    var m = /^d(\d+)$/.exec(tab || '');
    if (m && +m[1] >= 1 && +m[1] <= t.days.length) return tab;
    return 'overview';
  }
  function topbarHtml(trip) {
    var left = trip
      ? T('<a class="ibtn" href="#home" aria-label="กลับหน้ารวมแผน">') + icon('back') + '</a><div class="tb-title"><b>' + esc(L(trip.meta, 'title')) + '</b><small>' + esc(fmtRange(trip.meta.start, trip.meta.end)) + '</small></div>'
      : T('<a class="brand" href="#home"><span class="mark" aria-hidden="true"><i></i><i></i></span>แผนเที่ยว</a>');
    var edit = (trip && S.settings.planning) ? '<button class="btn edbtn ' + (S.edit ? 'cy' : '') + '" data-act="edit-toggle" aria-label="' + (S.edit ? T('เสร็จ') : T('แก้ไข')) + '" aria-pressed="' + S.edit + '">' + icon(S.edit ? 'check' : 'edit') + '<span>' + (S.edit ? T('เสร็จ') : T('แก้ไข')) + '</span></button>' : '';
    var dark = S.settings.theme !== 'light';
    return '<div class="tb-in">' + left + '<div class="tb-sp"></div>' + edit +
      '<button class="ibtn lang" data-act="lang" aria-label="' + (LANG === 'en' ? 'Switch to Thai' : 'Switch to English') + '">' + (LANG === 'en' ? 'TH' : 'EN') + '</button>' +
      '<button class="ibtn" data-act="theme" aria-label="' + (dark ? T('เปลี่ยนเป็นธีมสว่าง') : T('เปลี่ยนเป็นธีมมืด')) + '">' + icon(dark ? 'sun' : 'moon') + '</button>' +
      T('<button class="ibtn" data-act="settings" aria-label="ตั้งค่า">') + icon('gear') + '</button></div>';
  }

  /* ---------------- dashboard ---------------- */
  function gasEmptyHtml() {
    if (S.remote.state === 'error') return T('<div class="card empty"><h2>โหลดแผนไม่ได้</h2><p>') + esc(S.remote.err) + T('</p><div class="tools"><button class="btn pri" data-act="reload-remote">ลองใหม่</button></div></div>');
    return T('<div class="card empty" aria-busy="true"><h2>กำลังโหลดแผน…</h2><p>ดึงแผนล่าสุดจาก Drive</p></div>');
  }
  function sortedTrips() {
    var rank = { ongoing: 0, upcoming: 1, unknown: 2, past: 3 };
    return S.trips.map(function (t, i) { return { t: t, i: i, s: tripState(t) }; }).sort(function (a, b) {
      if (rank[a.s.status] !== rank[b.s.status]) return rank[a.s.status] - rank[b.s.status];
      if (a.s.status === 'past') return a.t.meta.start < b.t.meta.start ? 1 : -1;
      return a.t.meta.start < b.t.meta.start ? -1 : 1;
    });
  }
  function dashHtml() {
    var list = sortedTrips();
    var tools = S.settings.planning
      ? '<div class="tools"><button class="btn pri" data-act="import">' + icon('upload') + T('<span>นำเข้าแผน</span></button><button class="btn" data-act="export-all"') + (S.trips.length ? '' : ' disabled') + '>' + icon('download') + T('<span>สำรองทั้งหมด (.json)</span></button><button class="btn" data-act="template">') + icon('download') + '<span>Template (.md)</span></button></div>'
      : '';
    var ongoing = list.filter(function (x) { return x.s.status === 'ongoing'; })[0];
    var banner = ongoing ? '<a class="now-banner" href="#' + esc(ongoing.t.id) + (ongoing.s.dayIdx >= 0 ? '--d' + (ongoing.s.dayIdx + 1) : '') + '">' + icon('clock') + T('<span>กำลังเที่ยว ') + esc(L(ongoing.t.meta, 'title')) + T(' · วันที่ ') + ongoing.s.k + T(' จาก ') + ongoing.s.total + T(' — เปิดแผนวันนี้</span></a>') : '';
    var cards = list.length ? list.map(function (x) { return tripCard(x.t, x.s, x.i); }).join('')
      : HAS_SERVER ? gasEmptyHtml()
      : T('<div class="card empty"><h2>ยังไม่มีแผน</h2><p>นำเข้าไฟล์ .md ที่สร้างตาม template เพื่อเริ่มใช้งาน</p><div class="tools"><button class="btn pri" data-act="import">') + icon('upload') + T('<span>นำเข้าแผน</span></button><button class="btn" data-act="template">') + icon('download') + '<span>Template (.md)</span></button></div></div>';
    if (S.calOpen == null) S.calOpen = window.matchMedia('(min-width:960px)').matches;
    if (!S.cal) S.cal = defaultCalMonth(list);
    return T('<div class="wrap"><div class="dash-head"><div><h1>แผนเที่ยว</h1><p class="muted">') + cnt(S.trips.length, 'plan') + '</p></div>' + tools + '</div>' + banner +
      '<div class="dash-grid"><div class="tlist">' + cards + '</div><details class="cal-det"' + (S.calOpen ? ' open' : '') + T('><summary><span>ปฏิทิน · ') + calLabel() + '</span>' + icon('chev') + '</summary>' + calHtml() + '</details></div></div>';
  }
  function tripCard(t, s, i) {
    var mt = t.meta, n = s.total || 0;
    var state = s.status === 'upcoming' ? '<b>' + s.left + '</b><span>' + daysToGo(s.left) + '</span>'
      : s.status === 'ongoing' ? '<b>' + s.k + '/' + s.total + T('</b><span>กำลังเที่ยว</span>')
        : s.status === 'past' ? T('<span>จบแล้ว</span>') : T('<span>วันที่ยังไม่ครบ</span>');
    var place = [L(mt, 'subtitle'), mt.country].filter(Boolean).join(', ');
    return '<a class="tcard ' + tripCls(i) + (s.status === 'past' ? ' past' : '') + '" href="#' + esc(t.id) + '"><div>' +
      '<div class="tc-state">' + state + '</div><h2>' + esc(L(mt, 'title')) + '</h2>' + (place ? '<p class="tc-place">' + esc(place) + '</p>' : '') +
      T('<dl class="facts"><div><dt>วันที่</dt><dd>') + esc(fmtRange(mt.start, mt.end)) + '</dd></div>' +
      (n ? T('<div><dt>ระยะเวลา</dt><dd>') + durLabel(n) + '</dd></div>' : '') +
      (mt.travelers ? T('<div><dt>ผู้เดินทาง</dt><dd>') + esc(mt.travelers) + ' ' + unit(+mt.travelers, 'person') + '</dd></div>' : '') + '</dl></div>' +
      (mt.country_native ? stamp(mt.country_native, '') : '') + '</a>';
  }
  function stamp(s, cls) {
    var ch = Array.from(String(s).trim());
    var vertical = ch.length <= 4 && ch.every(function (c) { return hasCJK(c); });
    return '<div class="stamp ' + cls + (vertical ? '' : ' wide') + '" aria-hidden="true">' + (vertical ? ch.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') : esc(s)) + '</div>';
  }
  function defaultCalMonth(list) {
    var x = list.filter(function (x) { return x.s.status === 'ongoing' || x.s.status === 'upcoming'; })[0];
    if (x && TP.isDate(x.t.meta.start)) return x.t.meta.start.slice(0, 7);
    return nowIn().date.slice(0, 7);
  }
  function calLabel() { var a = S.cal.split('-').map(Number); return MF()[a[1] - 1] + ' ' + a[0]; }
  function calHtml() {
    var a = S.cal.split('-').map(Number), y = a[0], mo = a[1], first = S.cal + '-01';
    var startWd = dp(first).wd, dim = new Date(Date.UTC(y, mo, 0)).getUTCDate();
    var weeks = Math.ceil((startWd + dim) / 7), gs = addDays(first, -startWd), today = nowIn().date, rows = '';
    var order = sortedTrips().map(function (x) { return x; });
    for (var w = 0; w < weeks; w++) {
      var ws = addDays(gs, w * 7), we = addDays(ws, 6), cells = '';
      for (var k = 0; k < 7; k++) {
        var d = addDays(ws, k), p = dp(d);
        cells += '<div class="cd' + (p.m !== mo ? ' out' : '') + (d === today ? ' today' : '') + '" style="grid-column:' + (k + 1) + '"><span>' + p.d + '</span></div>';
      }
      var segs = [];
      order.forEach(function (x) {
        var t = x.t, s0 = t.meta.start, e0 = t.meta.end;
        if (!TP.isDate(s0) || !TP.isDate(e0) || e0 < ws || s0 > we) return;
        var s = s0 < ws ? ws : s0, e = e0 > we ? we : e0;
        segs.push({ x: x, c0: diffDays(ws, s), c1: diffDays(ws, e), cl: s0 < ws, cr: e0 > we });
      });
      segs.sort(function (p, q) { return p.c0 - q.c0; });
      var lanes = [], bars = '';
      segs.forEach(function (sg) {
        var lane = -1; for (var j = 0; j < lanes.length; j++) if (lanes[j] < sg.c0) { lane = j; break; }
        if (lane < 0) { lane = lanes.length; lanes.push(sg.c1); } else lanes[lane] = sg.c1;
        bars += '<a class="cbar ' + tripCls(sg.x.i) + (sg.x.s.status === 'past' ? ' past' : '') + (sg.cl ? ' cl' : '') + (sg.cr ? ' cr' : '') + '" href="#' + esc(sg.x.t.id) + '" style="grid-column:' + (sg.c0 + 1) + ' / ' + (sg.c1 + 2) + ';grid-row:' + (lane + 2) + '" title="' + esc(L(sg.x.t.meta, 'title')) + '">' + esc(L(sg.x.t.meta, 'title')) + '</a>';
      });
      rows += '<div class="cw">' + cells + bars + '</div>';
    }
    return T('<div class="cal"><div class="cal-head"><button class="ibtn sm" data-act="cal" data-d="-1" aria-label="เดือนก่อน">') + icon('back') + '</button><b>' + calLabel() + T('</b><button class="ibtn sm" data-act="cal" data-d="1" aria-label="เดือนถัดไป"><span class="flip">') + icon('back') + '</span></button></div>' +
      '<div class="cal-wd">' + WD_C[LANG].map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>' + rows +
      T('<div class="cal-foot"><button class="btn sm ghost" data-act="cal" data-d="0">เดือนนี้</button></div></div>');
  }

  /* ---------------- trip shell ---------------- */
  function tripHtml(t, tab) {
    var st = tripState(t), tabs = '';
    function tb(id, label, cls) { var a = tab === id; return '<a class="tab ' + (cls || '') + '" href="#' + esc(t.id) + '--' + id + '"' + (a ? ' aria-current="page"' : '') + '>' + label + '</a>'; }
    tabs += tb('overview', T('ภาพรวม'));
    t.days.forEach(function (d, i) {
      var p = TP.isDate(d.date) ? dp(d.date) : null, a = tab === 'd' + (i + 1);
      tabs += '<a class="tab day ' + dayCls(i) + '" href="#' + esc(t.id) + '--d' + (i + 1) + '"' + (a ? ' aria-current="page"' : '') + T(' aria-label="วันที่ ') + (i + 1) + (p ? ' ' + fmtDate(d.date) : '') + '"><b>D' + (i + 1) + '</b><small>' + (p ? p.d + ' ' + MS()[p.m - 1] : '') + '</small>' + (st.status === 'ongoing' && st.dayIdx === i ? T('<i class="tdot" title="วันนี้"></i>') : '') + '</a>';
    });
    tabs += tb('pack', T('เตรียมของ')) + tb('todo', 'To-do') + tb('ref', T('ข้อมูลอ้างอิง'));
    if (S.settings.planning) tabs += tb('plan', T('วางแผน'), 'plan');
    var body;
    if (tab === 'overview') body = S.edit ? overviewEdit(t) : overviewView(t, st);
    else if (tab === 'pack') body = S.edit ? packEdit(t) : packView(t);
    else if (tab === 'todo') body = S.edit ? todoEdit(t) : todoView(t, st);
    else if (tab === 'ref') body = S.edit ? refEdit(t) : refView(t);
    else if (tab === 'plan') body = S.edit ? planEdit(t) : planView(t);
    else { var di = +tab.slice(1) - 1; body = S.edit ? dayEdit(t, di) : dayView(t, di, st); }
    var gasT = HAS_SERVER && t.origin === 'server';
    var bar = (S.edit ? '<div class="editbar">' + icon('edit') + (gasT ? T('<span>โหมดแก้ไข · เก็บในเครื่องนี้ก่อน กด “บันทึกขึ้น Drive” เมื่อพร้อมให้คนอื่นเห็น</span></div>') : T('<span>โหมดแก้ไข · บันทึกอัตโนมัติในเครื่องนี้ ส่งออก .md หรือ .json เพื่อเก็บสำรอง</span></div>')) : '') + syncBarHtml(t);
    return T('<nav class="tabs" aria-label="ส่วนของแผน"><div class="tabs-in">') + tabs + '</div></nav><div class="wrap">' + bar + body + '</div>';
  }

  function statusBadge(s) { if (!S.settings.planning || !s) return ''; return '<span class="badge ' + (STATUS_CLS[s] || 'b-doc') + '">' + s + ' ' + esc(statusLabel(s)) + '</span>'; }

  /* ---------------- overview ---------------- */
  function overviewView(t, st) {
    var mt = t.meta, n = st.total || 0;
    var place = [L(mt, 'subtitle'), mt.country].filter(Boolean).join(', ');
    var state = st.status === 'upcoming' ? icon('clock') + '<span>' + countdown(st.left) + '</span>'
      : st.status === 'ongoing' ? icon('clock') + T('<span>กำลังเที่ยว วันที่ ') + st.k + T(' จาก ') + st.total + '</span>'
        : st.status === 'past' ? T('<span>ทริปนี้จบแล้ว</span>') : '';
    var h = nowCardHtml(t, 'ov') + '<section class="ov-hero o"><div>' + (place ? '<p class="ov-place">' + esc(place) + '</p>' : '') + '<h1>' + esc(L(mt, 'title')) + '</h1>' +
      T('<dl class="facts"><div><dt>วันที่</dt><dd>') + esc(fmtRange(mt.start, mt.end)) + '</dd></div>' +
      (n ? T('<div><dt>ระยะเวลา</dt><dd>') + durLabel(n) + '</dd></div>' : '') +
      (mt.travelers ? T('<div><dt>ผู้เดินทาง</dt><dd>') + esc(mt.travelers) + ' ' + unit(+mt.travelers, 'person') + '</dd></div>' : '') +
      (L(mt, 'style') ? T('<div><dt>การเดินทาง</dt><dd>') + inl(L(mt, 'style')) + '</dd></div>' : '') + '</dl>' +
      (state ? '<p class="ov-state">' + state + '</p>' : '') + '</div>' +
      (mt.country_native ? stamp(mt.country_native, 'lg') : '') + '</section>';
    if (t.days.some(function (d) { return d.route; })) h += T('<section class="card metro-card"><h2>เส้นทางทั้งทริป</h2><div class="metro" data-metro="trip"></div></section>');
    h += T('<div class="sec-h"><h2>แผนรายวัน</h2></div><div class="dlist">') + t.days.map(function (d, i) {
      var today = st.status === 'ongoing' && st.dayIdx === i;
      return '<a class="drow ' + dayCls(i) + '" href="#' + esc(t.id) + '--d' + (i + 1) + '"><span class="dn">' + (i + 1) + '</span><div><p class="dd">' + esc(fmtDate(d.date, true, false)) + (today ? T('<span class="today-chip">วันนี้</span>') : '') + '</p><h3>' + inl(L(d, 'theme') || 'Day ' + (i + 1)) + '</h3>' + (d.route ? '<p class="dr">' + inl(d.route) + '</p>' : '') + '</div><span class="dc-n">' + cnt(d.items.length, 'stop') + '</span></a>';
    }).join('') + '</div>';
    var fl = t.overview.flights, stays = t.overview.stays;
    if (fl.length || stays.length) {
      h += T('<div class="sec-h"><h2>เดินทางและที่พัก</h2></div><div class="two">');
      if (fl.length) h += '<section class="card"><h2 class="ch">' + icon('flight') + T('เที่ยวบิน</h2><div class="fl">') + fl.map(function (f) {
        return '<div class="flt"><span class="code">' + esc(f.flight) + '</span><span class="route">' + inl(f.route) + '</span><span class="time">' + esc(fmtDate(f.date, true, false)) + ' · ' + inl(f.dep) + ' → ' + inl(f.arr) + '</span>' + ((f.note || f.status) ? '<span class="meta">' + statusBadge(f.status) + ' ' + inl(f.note) + '</span>' : '') + '</div>';
      }).join('') + '</div></section>';
      if (stays.length) h += '<section class="card"><h2 class="ch">' + icon('hotel') + T('ที่พัก</h2><div class="fl">') + stays.map(function (s) {
        var nights = TP.isDate(s.checkin) && TP.isDate(s.checkout) ? diffDays(s.checkin, s.checkout) : 0;
        return '<div class="flt"><span class="stay-name" style="grid-column:1/-1">' + inl(s.name) + '</span><span class="time">' + esc(fmtRange(s.checkin, s.checkout)) + (nights ? ' · ' + cnt(nights, 'night') : '') + '</span>' + (s.address ? '<span class="meta">' + inl(s.address) + '</span>' : '') + ((s.note || s.status) ? '<span class="meta">' + statusBadge(s.status) + ' ' + inl(s.note) + '</span>' : '') + '</div>';
      }).join('') + '</div></section>';
      h += '</div>';
    }
    if ((t.overview.remember || '').trim()) h += '<div class="sec-h"></div><section class="bar"><h2>' + icon('star') + T('จำไว้ตลอดทริป</h2><div class="md">') + mdHtml(t.overview.remember) + '</div></section>';
    t.overview.extra.forEach(function (s) { h += '<div class="sec-h">' + (s.title ? '<h2>' + inl(s.title) + '</h2>' : '') + '</div><section class="card"><div class="md">' + mdHtml(s.md) + '</div></section>'; });
    if (S.settings.planning) h += '<div class="trip-tools"><p>' + (mt.version ? T('เวอร์ชัน ') + esc(mt.version) + ' · ' : '') + T('แก้ไขล่าสุดในเครื่องนี้ ') + (t.updatedAt ? new Date(t.updatedAt).toLocaleString(LANG === 'en' ? 'en-GB' : 'th-TH-u-ca-gregory') : '-') + '</p>' +
      '<button class="btn" data-act="export-md">' + icon('download') + T('<span>ส่งออก .md</span></button><button class="btn" data-act="export-json">') + icon('download') + T('<span>ส่งออก .json</span></button><button class="btn danger" data-act="delete-trip">') + icon('trash') + T('<span>ลบแผนนี้</span></button></div>');
    return h;
  }

  /* ---------------- day ---------------- */
  function splitTime(s) { s = String(s || ''); var m = s.match(/^(.*?\S)\s*([–-]\s*.+)$/); return m ? [m[1], m[2].replace(/\s+/g, '')] : [s, '']; }
  function mapUrl(it) {
    var m = (it.map || '').trim();
    if (m === '-') return '';
    if (/^https?:\/\//i.test(m)) return m;
    var q = m || it.zh || it.en;
    return q ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q) : '';
  }
  function dayView(t, di, st) {
    var d = t.days[di], cls = dayCls(di), last = d.date === t.meta.end;
    var isToday = st.status === 'ongoing' && st.dayIdx === di;
    var h = nowCardHtml(t, di) + '<section class="day-head ' + cls + T('"><div class="dbadge"><span>วันที่</span><b>') + (di + 1) + '</b></div><div><p class="dh-date">' + esc(fmtDate(d.date, true)) + (isToday ? T('<span class="today-chip">วันนี้</span>') : '') + '</p><h1>' + inl(L(d, 'theme') || 'Day ' + (di + 1)) + '</h1>' + (L(d, 'summary') ? '<p class="dh-sum">' + inl(L(d, 'summary')) + '</p>' : '') + '</div>' +
      (d.stay ? '<div class="stay">' + icon('hotel') + '<div><small>' + (last ? T('ปลายทางคืนนี้') : T('คืนนี้นอนที่')) + '</small><b>' + inl(d.stay) + '</b></div></div>' : '') + '</section>';
    if (d.route) h += '<section class="band ' + cls + '" data-n="' + (di + 1) + '"><div class="metro" data-metro="day:' + di + '"></div></section>';
    var openAll = d.items.length && d.items.every(function (it) { return S.open[it.id]; });
    h += '<div class="tl-tools"><span class="muted">' + cnt(d.items.length, 'item') + (S.settings.planning ? '' : T(' · แตะเพื่อดูวิธีเดินทางและรายละเอียด')) + '</span>' + (d.items.length ? '<button class="btn sm" data-act="expand-all" data-v="' + (openAll ? '0' : '1') + '">' + (openAll ? T('ย่อทั้งหมด') : T('ขยายทั้งหมด')) + '</button>' : '') + '</div>';
    var seenL = {}, usedL = [];
    d.items.forEach(function (it) { lineList(it.line).concat(lineList(it.line_alt)).forEach(function (l) { var k = l.code.toLowerCase(); if (!seenL[k]) { seenL[k] = 1; usedL.push(l); } }); });
    if (usedL.length) h += '<div class="llegend"><span class="muted">' + T('สายที่ใช้วันนี้') + '</span>' + usedL.map(function (l) { return chipHtml(l, false); }).join('') + '</div>';
    h += '<ol class="tl ' + cls + '"' + (isToday ? ' data-today="' + d.date + '"' : '') + '>' + d.items.map(function (it) { return itemView(it, cls); }).join('') + '</ol>';
    var must = d.must.map(function (x) { return '<li>' + inl(x) + '</li>'; }).join(''), cau = d.caution.map(function (x) { return '<li>' + inl(x) + '</li>'; }).join('');
    if (must || cau) h += '<div class="sec-h"></div><div class="two">' + (must ? '<section class="bar"><h3>' + icon('star') + T('ห้ามพลาดวันนี้</h3><div class="md"><ul>') + must + '</ul></div></section>' : '') + (cau ? '<section class="bar or"><h3>' + icon('alert') + T('ข้อควรระวัง</h3><div class="md"><ul>') + cau + '</ul></div></section>' : '') + '</div>';
    if ((d.extra || '').trim()) h += T('<details class="more"><summary><span>ข้อมูลเพิ่มเติม</span>') + icon('chev') + '</summary><div class="md">' + mdHtml(d.extra) + '</div></details>';
    h += '<nav class="daynav">' + (di > 0 ? '<a class="btn" href="#' + esc(t.id) + '--d' + di + '">' + icon('back') + '<span>Day ' + di + '</span></a>' : '<a class="btn" href="#' + esc(t.id) + '">' + icon('back') + T('<span>ภาพรวม</span></a>')) +
      (di < t.days.length - 1 ? '<a class="btn next" href="#' + esc(t.id) + '--d' + (di + 2) + '"><span>Day ' + (di + 2) + '</span><span class="flip">' + icon('back') + '</span></a>' : '<a class="btn next" href="#' + esc(t.id) + T('--pack"><span>เตรียมของ</span><span class="flip">') + icon('back') + '</span></a>') + '</nav>';
    return h;
  }
  /* ---- transit line chips / blocks ---- */
  function lineList(str) { return TP.parseLines(str); }
  function lineHex(l) { return l.hex || '#8B95A3'; }
  function rgbOf(hex) { var n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function rgba(hex, a) { var c = rgbOf(hex); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function relLum(hex) { var c = rgbOf(hex).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  // chip text colour: whichever of the two inks has the higher WCAG contrast on the line colour
  function inkFor(hex) { var l = relLum(hex), dark = relLum('#0E1116'), light = relLum('#FBFCFD'); return (l + 0.05) / (dark + 0.05) > (light + 0.05) / (l + 0.05) ? '#0E1116' : '#FBFCFD'; }
  function lineName(l) { return LANG === 'en' ? l.en : l.th; }
  function chipHtml(l, compact) {
    var hx = lineHex(l);
    return '<span class="lchip' + (compact ? ' sm' : '') + '" style="--lc:' + hx + ';--li:' + inkFor(hx) + '" title="' + esc(l.en + (l.zh ? ' · ' + l.zh : '')) + '"><b>' + esc(l.code) + '</b>' + (compact ? '' : '<span>' + esc(lineName(l)) + (l.zh ? ' <i lang="zh-Hant">' + esc(l.zh) + '</i>' : '') + '</span>') + '</span>';
  }
  function lineBlock(lines, inner) {
    var cols = lines.map(lineHex), n = cols.length;
    var stripe = n > 1 ? 'linear-gradient(to bottom,' + cols.map(function (c, i) { return c + ' ' + (i * 100 / n) + '% ' + ((i + 1) * 100 / n) + '%'; }).join(',') + ')' : cols[0];
    var tint = n > 1 ? 'linear-gradient(90deg,' + cols.map(function (c) { return rgba(c, 0.14); }).join(',') + ')' : rgba(cols[0], 0.14);
    return '<div class="lblk" style="--stripe:' + stripe + ';--tint:' + tint + '"><div class="lchips">' + lines.map(function (l) { return chipHtml(l, false); }).join('') + '</div>' + inner + '</div>';
  }
  function itemView(it, cls) {
    var tm = splitTime(it.time), url = mapUrl(it);
    var tp = L(it, 'transport'), ta = L(it, 'transport_alt'), cs = L(it, 'cost'), nt = L(it, 'notes');
    var lm = lineList(it.line), la = lineList(it.line_alt);
    var rows = [{ k: T('เดินทางหลัก'), v: tp, lines: lm }, { k: T('เดินทางรอง'), v: ta, lines: la }, { k: T('เวลา / ค่าใช้จ่าย'), v: cs, lines: [] }, { k: T('สถานที่น่าสนใจรอบๆ / หมายเหตุ'), v: nt, lines: [] }];
    Object.keys(it.extra || {}).forEach(function (k) { rows.push({ k: k, v: it.extra[k], lines: [], raw: true }); });
    rows = rows.filter(function (r) { return String(vis(r.v) || '').trim() || r.lines.length; });
    var hasDetail = rows.length || url, open = hasDetail && S.open[it.id];
    var line = vis(tp) || vis(nt) || vis(cs);
    var chips = lm.map(function (l) { return chipHtml(l, true); }).join('');
    var tags = chips + (it.highlight ? T('<span class="badge hl">สำคัญ</span>') : '') + statusBadge(it.status);
    var primary = LANG === 'en' && it.en ? it.en : it.title;
    var secondary = LANG === 'en' ? (it.en ? it.title : '') : it.en;
    var inner = '<span class="it-icon" title="' + esc(typeLabel(it.type)) + '">' + icon(it.type) + '</span><span class="it-text"><span class="it-t">' + inl(primary) + (it.zh ? '<span class="zh" lang="zh-Hant">' + esc(it.zh) + '</span>' : '') + '</span>' +
      (secondary ? '<span class="it-en">' + inl(secondary) + '</span>' : '') + (line ? '<span class="it-line">' + inl(line) + '</span>' : '') + '<span class="it-tags">' + tags + '</span></span>';
    var main = hasDetail
      ? '<button class="it-main" data-act="toggle" data-id="' + it.id + '" aria-expanded="' + !!open + '">' + inner + '<span class="chev">' + icon('chev') + '</span></button>'
      : '<div class="it-main static">' + inner + '<span></span></div>';
    var det = hasDetail ? '<div class="it-detail"><dl>' + rows.map(function (r) {
      var txt = String(vis(r.v) || '').trim() ? '<div class="lbody">' + inl(r.v) + '</div>' : '';
      return '<div><dt>' + (r.raw ? esc(r.k) : esc(T(r.k))) + '</dt><dd>' + (r.lines.length ? lineBlock(r.lines, txt) : inl(r.v)) + '</dd></div>';
    }).join('') + '</dl>' + (url ? '<a class="btn sm maplink" href="' + esc(url) + '" target="_blank" rel="noopener">' + icon('pin') + T('<span>เปิดใน Google Maps</span></a>') : '') + '</div>' : '';
    return '<li class="it' + (it.highlight ? ' hl' : '') + (open ? ' open' : '') + '" data-id="' + it.id + '" data-min="' + startMin(it.time) + '"><div class="it-time">' + esc(tm[0]) + (tm[1] ? '<small>' + esc(tm[1]) + '</small>' : '') + '</div><div class="it-node"></div><div class="it-body">' + main + det + '</div></li>';
  }

  /* ---------------- pack / todo / ref / plan views ---------------- */
  function countPack(t) { var a = 0, b = 0; t.pack.forEach(function (g) { g.items.forEach(function (x) { b++; if (x.done) a++; }); }); return [a, b]; }
  function packView(t) {
    var c = countPack(t), pct = c[1] ? Math.round(c[0] * 100 / c[1]) : 0;
    var h = T('<div class="ph"><h1>เตรียมของ</h1>') + (c[1] ? '<p class="prog" data-prog="pack">' + c[0] + '/' + c[1] + '</p>' : '') + '</div>' + (c[1] ? '<div class="pbar"><i data-pbar="pack" style="width:' + pct + '%"></i></div>' : '');
    if (!t.pack.length) h += T('<p class="muted">ยังไม่มีรายการ</p>');
    t.pack.forEach(function (g, gi) {
      var gd = g.items.filter(function (x) { return x.done; }).length;
      h += '<section class="card grp"><header>' + (g.title ? '<h2>' + inl(g.title) + '</h2>' : '<span></span>') + (g.items.length ? '<span class="muted" data-prog-g="' + gi + '">' + gd + '/' + g.items.length + '</span>' : '') + '</header>' +
        (g.note ? '<div class="md">' + mdHtml(g.note) + '</div>' : '') +
        (g.items.length ? '<ul class="checks">' + g.items.map(function (x, i) { return '<li><label class="ck' + (x.done ? ' done' : '') + '"><input type="checkbox" data-chk="pack.' + gi + '.items.' + i + '"' + (x.done ? ' checked' : '') + '><i class="cb" aria-hidden="true">' + CHECK_SVG + '</i><span>' + inl(x.text) + '</span></label></li>'; }).join('') + '</ul>' : '') + '</section>';
    });
    return h + T('<p class="note">การติ๊กเก็บในเครื่องนี้เท่านั้น</p>');
  }
  function lastDate(s) { var m = String(s || '').match(/\d{4}-\d{2}-\d{2}/g); return m ? m[m.length - 1] : ''; }
  function todoView(t, st) {
    var done = t.todo.filter(function (x) { return x.done; }).length, n = t.todo.length;
    var h = T('<div class="ph"><h1>To-do ก่อนเดินทาง</h1>') + (n ? '<p class="prog" data-prog="todo">' + done + '/' + n + '</p>' : '') + '</div>' + (n ? '<div class="pbar"><i data-pbar="todo" style="width:' + Math.round(done * 100 / n) + '%"></i></div>' : '');
    if (!n) return h + T('<p class="muted">ยังไม่มีรายการ</p>');
    h += '<section class="card"><ul class="checks">' + t.todo.map(function (x, i) {
      var ld = lastDate(x.due), over = !x.done && ld && ld < st.today;
      return '<li class="todo' + (over ? ' over' : '') + '"><label class="ck' + (x.done ? ' done' : '') + '"><input type="checkbox" data-chk="todo.' + i + '"' + (x.done ? ' checked' : '') + '><i class="cb" aria-hidden="true">' + CHECK_SVG + '</i><span>' + inl(x.text) + '</span></label>' + (x.due ? '<span class="due">' + icon('cal') + inl(x.due) + (over ? T(' · เลยกำหนด') : '') + '</span>' : '') + '</li>';
    }).join('') + '</ul></section>';
    return h + T('<p class="note">การติ๊กเก็บในเครื่องนี้เท่านั้น · วันที่เทียบตามเวลาของปลายทาง</p>');
  }
  function refBody(sec, si) {
    if (!window.marked) return { html: mdHtml(sec.md), table: false };
    var toks = window.marked.lexer(prepMd(sec.md)), out = '', ti = 0;
    toks.forEach(function (tk) {
      if (tk.type === 'table') {
        var idx = ti++;
        out += '<p class="tap-hint">' + icon('expand') + T('แตะแถวเพื่อเปิดเต็มจอ</p><div class="tw"><table><thead><tr>') + tk.header.map(function (c) { return '<th>' + window.marked.parseInline(c.text) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          tk.rows.map(function (r, ri) { return '<tr class="tap" tabindex="0" role="button" data-act="fs-row" data-sec="' + si + '" data-t="' + idx + '" data-r="' + ri + '">' + r.map(function (c) { return '<td' + (hasCJK(c.text) ? ' lang="zh-Hant" style="font-family:var(--zh)"' : '') + '>' + window.marked.parseInline(c.text) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
      } else { var one = [tk]; one.links = toks.links; out += window.marked.parser(one); }
    });
    return { html: linkify(out), table: ti > 0 };
  }
  function refView(t) {
    var h = T('<div class="ph"><h1>ข้อมูลอ้างอิง</h1></div>');
    if (!t.ref.length) h += T('<p class="muted">ยังไม่มีข้อมูล</p>');
    t.ref.forEach(function (s, si) {
      var b = refBody(s, si);
      h += '<section class="card ref-sec"><header>' + (s.title ? '<h2>' + inl(s.title) + '</h2>' : '<span></span>') + (!b.table ? '<button class="btn sm" data-act="fs-sec" data-sec="' + si + '">' + icon('expand') + T('<span>เต็มจอ</span></button>') : '') + '</header><div class="md">' + b.html + '</div></section>';
    });
    return h;
  }
  function planView(t) { return T('<div class="ph"><h1>วางแผน</h1><p class="muted">เห็นเฉพาะโหมดวางแผน</p></div><section class="card"><div class="md">') + (mdHtml(t.plan) || T('<p class="muted">ยังไม่มีข้อมูล</p>')) + '</div></section>'; }

  /* ---------------- edit forms ---------------- */
  function attr(o) { return Object.keys(o).filter(function (k) { return o[k] != null && o[k] !== false; }).map(function (k) { return o[k] === true ? k : k + '="' + esc(o[k]) + '"'; }).join(' '); }
  function fIn(label, path, val, o) { o = o || {}; return '<label class="' + (o.cls || '') + '"><span>' + label + '</span><input ' + attr({ type: o.type, 'data-b': path, 'data-k': o.k, value: val == null ? '' : val, placeholder: o.ph, list: o.list, inputmode: o.im }) + '></label>'; }
  function fTa(label, path, val, o) { o = o || {}; return '<label class="' + (o.cls || 'wf') + '"><span>' + label + '</span><textarea ' + attr({ 'data-b': path, 'data-k': o.k, rows: o.rows || 2, placeholder: o.ph }) + '>' + esc(val) + '</textarea></label>'; }
  function fSel(label, path, val, opts, o) { o = o || {}; return '<label class="' + (o.cls || '') + '"><span>' + label + '</span><select data-b="' + path + '">' + opts.map(function (p) { return '<option value="' + esc(p[0]) + '"' + (p[0] === val ? ' selected' : '') + '>' + esc(p[1]) + '</option>'; }).join('') + '</select></label>'; }
  function fChk(label, path, val) { return '<label class="chk"><input type="checkbox" data-b="' + path + '" data-k="bool"' + (val ? ' checked' : '') + '><span>' + label + '</span></label>'; }
  function rowTools(list, i, len) {
    return '<div class="rt"><button class="ibtn sm" data-act="mv" data-list="' + list + '" data-i="' + i + '" data-d="-1"' + (i === 0 ? ' disabled' : '') + T(' aria-label="ย้ายขึ้น">') + icon('up') + '</button><button class="ibtn sm" data-act="mv" data-list="' + list + '" data-i="' + i + '" data-d="1"' + (i === len - 1 ? ' disabled' : '') + T(' aria-label="ย้ายลง">') + icon('down') + '</button><button class="ibtn sm danger" data-act="del" data-list="' + list + '" data-i="' + i + T('" aria-label="ลบ">') + icon('trash') + '</button></div>';
  }
  function addBtn(list, kind, label) { return '<button class="btn add" data-act="add" data-list="' + list + '" data-new="' + kind + '">' + icon('plus') + '<span>' + label + '</span></button>'; }
  function edBox(list, i, len, title, inner) { return '<div class="ed" data-dl="' + list + '" data-i="' + i + T('"><div class="ed-bar"><span class="grip" data-grip title="ลากเพื่อย้าย">') + icon('grip') + '</span><b>' + title + '</b>' + rowTools(list, i, len) + '</div>' + inner + '</div>'; }
  
  function overviewEdit(t) {
    var m = t.meta, p = 'meta.';
    var h = T('<div class="ph"><h1>แก้ไขภาพรวม</h1></div><section class="card"><div class="ed-grid">') +
      fIn(T('ชื่อทริป'), p + 'title', m.title, { cls: 'w2' }) + fIn(T('เมืองหลัก'), p + 'subtitle', m.subtitle) + fIn(T('ประเทศ'), p + 'country', m.country) +
      fIn(T('ชื่อประเทศภาษาท้องถิ่น'), p + 'country_native', m.country_native) + fIn(T('วันเริ่ม'), p + 'start', m.start, { type: 'date' }) + fIn(T('วันสิ้นสุด'), p + 'end', m.end, { type: 'date' }) +
      fIn(T('เขตเวลา'), p + 'timezone', m.timezone, { list: 'tzlist', ph: 'Asia/Bangkok' }) + fIn(T('จำนวนคน'), p + 'travelers', m.travelers, { im: 'numeric' }) + fIn(T('เวอร์ชัน'), p + 'version', m.version) +
      fIn(T('รูปแบบการเดินทาง'), p + 'style', m.style, { cls: 'w2' }) +
      fIn('Title (EN)', p + 'title_en', m.title_en, { cls: 'w2' }) + fIn('Subtitle (EN)', p + 'subtitle_en', m.subtitle_en) + fIn('Travel style (EN)', p + 'style_en', m.style_en, { cls: 'w2' }) + '</div><datalist id="tzlist">' + tzOptions(m.start) + '</datalist></section>';
    h += T('<div class="sec-h"><h2>วันในทริป</h2></div>') + t.days.map(function (d, i) {
      return edBox('days', i, t.days.length, 'Day ' + (i + 1) + ' · ' + esc(d.date) + ' · ' + esc(d.theme), '<div class="ed-grid">' + fIn(T('วันที่'), 'days.' + i + '.date', d.date, { type: 'date' }) + fIn(T('ธีมของวัน'), 'days.' + i + '.theme', d.theme, { cls: 'w2' }) + '</div>');
    }).join('') + addBtn('days', 'day', T('เพิ่มวัน'));
    h += T('<div class="sec-h"><h2>เที่ยวบิน</h2></div>') + t.overview.flights.map(function (f, i) {
      var b = 'overview.flights.' + i + '.';
      return edBox('overview.flights', i, t.overview.flights.length, esc(f.flight || T('เที่ยวบิน')), '<div class="ed-grid">' + fIn(T('เที่ยวบิน'), b + 'flight', f.flight) + fIn(T('วันที่'), b + 'date', f.date, { type: 'date' }) + fIn(T('เส้นทาง'), b + 'route', f.route, { ph: 'DMK → TPE' }) + fSel(T('สถานะ'), b + 'status', f.status, statusOpts()) + fIn(T('ออก'), b + 'dep', f.dep) + fIn(T('ถึง'), b + 'arr', f.arr) + fIn(T('หมายเหตุ'), b + 'note', f.note, { cls: 'w2' }) + '</div>');
    }).join('') + addBtn('overview.flights', 'flight', T('เพิ่มเที่ยวบิน'));
    h += T('<div class="sec-h"><h2>ที่พัก</h2></div>') + t.overview.stays.map(function (s, i) {
      var b = 'overview.stays.' + i + '.';
      return edBox('overview.stays', i, t.overview.stays.length, esc(s.name || T('ที่พัก')), '<div class="ed-grid">' + fIn(T('ชื่อ'), b + 'name', s.name, { cls: 'w2' }) + fIn(T('เช็กอิน'), b + 'checkin', s.checkin, { type: 'date' }) + fIn(T('เช็กเอาต์'), b + 'checkout', s.checkout, { type: 'date' }) + fIn(T('ที่อยู่'), b + 'address', s.address, { cls: 'w2' }) + fSel(T('สถานะ'), b + 'status', s.status, statusOpts()) + fIn(T('หมายเหตุ'), b + 'note', s.note, { cls: 'wf' }) + '</div>');
    }).join('') + addBtn('overview.stays', 'stay', T('เพิ่มที่พัก'));
    h += T('<div class="sec-h"><h2>จำไว้ตลอดทริป</h2><span class="muted">markdown</span></div><section class="card"><div class="ed-grid">') + fTa(T('ข้อความ'), 'overview.remember', t.overview.remember, { rows: 6 }) + '</div></section>';
    h += T('<div class="sec-h"><h2>หัวข้ออื่นในภาพรวม</h2></div>') + t.overview.extra.map(function (s, i) {
      var b = 'overview.extra.' + i + '.';
      return edBox('overview.extra', i, t.overview.extra.length, esc(s.title || T('หัวข้อ')), '<div class="ed-grid">' + fIn(T('หัวข้อ'), b + 'title', s.title, { cls: 'wf' }) + fTa(T('เนื้อหา (markdown)'), b + 'md', s.md, { rows: 5 }) + '</div>');
    }).join('') + addBtn('overview.extra', 'sec', T('เพิ่มหัวข้อ'));
    return h;
  }
  function dayEdit(t, di) {
    var d = t.days[di], p = 'days.' + di + '.';
    var h = T('<div class="ph"><h1>แก้ไข Day ') + (di + 1) + '</h1></div><section class="card"><div class="ed-grid">' +
      fIn(T('วันที่'), p + 'date', d.date, { type: 'date' }) + fIn(T('ธีมของวัน'), p + 'theme', d.theme, { cls: 'w2' }) + fIn(T('คืนนี้นอนที่'), p + 'stay', d.stay) +
      fIn(T('เส้นทาง (คั่นด้วย →)'), p + 'route', d.route, { cls: 'w2', ph: 'Ximen → Jiufen → Raohe' }) + fIn(T('สรุปวัน'), p + 'summary', d.summary, { cls: 'w2' }) +
      fIn('Theme (EN)', p + 'theme_en', d.theme_en, { cls: 'w2' }) + fIn('Summary (EN)', p + 'summary_en', d.summary_en, { cls: 'w2' }) + '</div></section>';
    h += T('<div class="sec-h"><h2>รายการ</h2><span class="muted">') + cnt(d.items.length, 'item') + '</span></div>';
    h += d.items.map(function (it, i) {
      var b = p + 'items.' + i + '.';
      return edBox(p + 'items', i, d.items.length, esc((it.time ? it.time + ' · ' : '') + it.title), '<div class="ed-grid">' +
        fIn(T('เวลา'), b + 'time', it.time, { ph: T('09:00 หรือ 09:00–10:30') }) + fIn(T('ชื่อ (ไทย)'), b + 'title', it.title, { cls: 'w2' }) + fSel(T('ประเภท'), b + 'type', it.type, TP.TYPES.map(function (x) { return [x, typeLabel(x)]; })) +
        fIn('English', b + 'en', it.en) + fIn(T('中文 / ชื่อท้องถิ่น'), b + 'zh', it.zh) + fSel(T('สถานะ'), b + 'status', it.status, statusOpts()) + fChk(T('รายการสำคัญ'), b + 'highlight', it.highlight) +
        fTa(T('เดินทางหลัก'), b + 'transport', it.transport) + fIn(T('สายรถไฟ / MRT (เดินทางหลัก)'), b + 'line', it.line, { cls: 'w2', ph: T('BL, G, AIRPORT หรือ ชื่อ#RRGGBB') }) + fTa(T('เดินทางรอง'), b + 'transport_alt', it.transport_alt) + fIn(T('สายรถไฟ / MRT (เดินทางรอง)'), b + 'line_alt', it.line_alt, { cls: 'w2', ph: T('BL, G, AIRPORT หรือ ชื่อ#RRGGBB') }) + fIn(T('เวลา / ค่าใช้จ่าย'), b + 'cost', it.cost, { cls: 'wf' }) +
        fTa(T('สถานที่น่าสนใจรอบๆ / หมายเหตุ'), b + 'notes', it.notes, { rows: 3 }) + fIn(T('ลิงก์ Google Maps'), b + 'map', it.map, { cls: 'wf', ph: T('เว้นว่าง = ค้นจากชื่อจีน · ใส่ - = ไม่มีลิงก์') }) +
        '<details class="wf en-fields"><summary>English (EN)</summary><div class="ed-grid">' + fTa('Main transport', b + 'transport_en', it.transport_en) + fTa('Alternative transport', b + 'transport_alt_en', it.transport_alt_en) + fIn('Time / cost', b + 'cost_en', it.cost_en, { cls: 'wf' }) + fTa('Nearby / notes', b + 'notes_en', it.notes_en, { rows: 3 }) + '</div></details></div>');
    }).join('') + addBtn(p + 'items', 'item', T('เพิ่มรายการ'));
    h += T('<div class="sec-h"><h2>กล่องท้ายวัน</h2><span class="muted">หนึ่งบรรทัดต่อหนึ่งข้อ</span></div><div class="two"><section class="card"><div class="ed-grid">') + fTa(T('ห้ามพลาดวันนี้'), p + 'must', d.must.join('\n'), { k: 'lines', rows: 5 }) + '</div></section><section class="card"><div class="ed-grid">' + fTa(T('ข้อควรระวัง'), p + 'caution', d.caution.join('\n'), { k: 'lines', rows: 5 }) + '</div></section></div>';
    h += T('<div class="sec-h"><h2>ข้อมูลเพิ่มเติม</h2><span class="muted">markdown</span></div><section class="card"><div class="ed-grid">') + fTa(T('เนื้อหา'), p + 'extra', d.extra, { rows: 8 }) + '</div></section>';
    return h;
  }
  function packEdit(t) {
    return T('<div class="ph"><h1>แก้ไขเตรียมของ</h1></div>') + t.pack.map(function (g, gi) {
      var b = 'pack.' + gi;
      return edBox('pack', gi, t.pack.length, esc(g.title || T('หมวด')), '<div class="ed-grid">' + fIn(T('ชื่อหมวด'), b + '.title', g.title, { cls: 'wf' }) + fTa(T('หมายเหตุของหมวด (markdown)'), b + '.note', g.note, { rows: 3 }) + T('</div><div class="sec-h" style="margin:14px 0 8px"><h2 style="font-size:15px">รายการ</h2></div>') +
        g.items.map(function (x, i) { return '<div class="ed-row"><input data-b="' + b + '.items.' + i + '.text" value="' + esc(x.text) + T('" aria-label="รายการ">') + rowTools(b + '.items', i, g.items.length) + '</div>'; }).join('') + addBtn(b + '.items', 'check', T('เพิ่มรายการ')));
    }).join('') + addBtn('pack', 'group', T('เพิ่มหมวด'));
  }
  function todoEdit(t) {
    return T('<div class="ph"><h1>แก้ไข To-do</h1></div><section class="card"><p class="muted" style="margin-bottom:10px">กำหนด เช่น "ก่อน 2026-11-12" — ใส่วันที่แบบ YYYY-MM-DD เพื่อให้เว็บเตือนเมื่อเลยกำหนด</p>') +
      t.todo.map(function (x, i) { return '<div class="ed-row todo-e"><input data-b="todo.' + i + '.due" value="' + esc(x.due) + T('" placeholder="กำหนด" aria-label="กำหนด"><input data-b="todo.') + i + '.text" value="' + esc(x.text) + T('" placeholder="งาน" aria-label="งาน">') + rowTools('todo', i, t.todo.length) + '</div>'; }).join('') + addBtn('todo', 'todo', T('เพิ่มงาน')) + '</section>';
  }
  function refEdit(t) {
    return T('<div class="ph"><h1>แก้ไขข้อมูลอ้างอิง</h1></div>') + t.ref.map(function (s, i) {
      return edBox('ref', i, t.ref.length, esc(s.title || T('หัวข้อ')), '<div class="ed-grid">' + fIn(T('หัวข้อ'), 'ref.' + i + '.title', s.title, { cls: 'wf' }) + fTa(T('เนื้อหา (markdown)'), 'ref.' + i + '.md', s.md, { rows: 8 }) + '</div>');
    }).join('') + addBtn('ref', 'sec', T('เพิ่มหัวข้อ'));
  }
  function planEdit(t) { return T('<div class="ph"><h1>แก้ไขวางแผน</h1></div><section class="card"><div class="ed-grid">') + fTa(T('เนื้อหา (markdown)'), 'plan', t.plan, { rows: 18 }) + '</div></section>'; }

  var NEW = {
    item: function () { return { id: TP.uid(), time: '', title: T('รายการใหม่'), en: '', zh: '', type: 'other', status: '', highlight: false, transport: '', transport_alt: '', cost: '', notes: '', map: '', extra: {} }; },
    flight: function () { return { id: TP.uid(), flight: '', date: '', route: '', dep: '', arr: '', status: '', note: '' }; },
    stay: function () { return { id: TP.uid(), checkin: '', checkout: '', name: '', address: '', note: '', status: '' }; },
    sec: function () { return { id: TP.uid(), title: T('หัวข้อใหม่'), md: '' }; },
    day: function (t) { var last = t.days[t.days.length - 1]; return { id: TP.uid(), n: t.days.length + 1, date: last && TP.isDate(last.date) ? addDays(last.date, 1) : (t.meta.start || ''), theme: '', route: '', stay: last ? last.stay : '', summary: '', items: [], must: [], caution: [], extra: '' }; },
    group: function () { return { id: TP.uid(), title: T('หมวดใหม่'), items: [], note: '' }; },
    check: function () { return { id: TP.uid(), text: '', done: false }; },
    todo: function () { return { id: TP.uid(), due: '', text: '', done: false }; }
  };
  function getPath(o, p) { return p.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
  function setPath(o, p, v) { var ks = p.split('.'), last = ks.pop(), tg = ks.reduce(function (a, k) { return a[k]; }, o); tg[last] = v; }

  /* ---------------- after render ---------------- */
  var RO = window.ResizeObserver ? new ResizeObserver(function (es) { es.forEach(function (e) { var el = e.target; if (el._w !== Math.round(el.clientWidth)) drawMetro(el, false); }); }) : null;
  function afterRender() {
    var t = S.cur;
    $$('.metro').forEach(function (el) {
      var k = el.getAttribute('data-metro');
      if (!t) return;
      if (k === 'trip') { el._stops = tripStops(t); el._key = t.id + ':trip'; }
      else { var di = +k.split(':')[1]; el._stops = routeStops(t.days[di].route).map(function (s) { return { label: s, c: dayCls(di) }; }); el._key = t.id + ':' + di; }
      drawMetro(el, !S.drawn[el._key]);
      S.drawn[el._key] = 1;
      if (RO) RO.observe(el);
    });
    var tabs = $('.tabs-in'), a = $('.tab[aria-current]');
    if (tabs && a) tabs.scrollLeft = a.offsetLeft - tabs.clientWidth / 2 + a.clientWidth / 2;
    placeNow();
    if (S.focus) {
      var f = $('[data-b="' + S.focus + '.title"]') || $('[data-b="' + S.focus + '.text"]') || $('[data-b="' + S.focus + '.flight"]') || $('[data-b="' + S.focus + '.name"]') || $('[data-b="' + S.focus + '.theme"]') || $('[data-b="' + S.focus + '.due"]');
      if (f) { f.focus(); if (f.select) f.select(); f.scrollIntoView({ block: 'center' }); }
      S.focus = null;
    }
  }
  function placeNow() {
    $$('li.now').forEach(function (n) { n.remove(); });
    var tl = $('.tl[data-today]'); if (!tl || !S.cur) return;
    var n = nowIn(S.cur.meta.timezone);
    if (n.date !== tl.getAttribute('data-today')) return;
    var before = null, items = $$('li.it', tl);
    for (var i = 0; i < items.length; i++) { var m = +items[i].getAttribute('data-min'); if (m >= 0 && m > n.min) { before = items[i]; break; } }
    var el = D.createElement('li'); el.className = 'now';
    el.innerHTML = '<span class="now-t">' + n.hm + T('</span><span class="now-dot"></span><span class="now-l">ตอนนี้ (เวลาท้องถิ่น)</span>');
    tl.insertBefore(el, before);
  }

  /* ---------------- "now + next" card (Phase 4) ---------------- */
  var NC = { now: ['ตอนนี้', 'Now'], next: ['ถัดไป', 'Next'], done: ['วันนี้ครบทุกรายการแล้ว', 'That’s everything for today'], tom: ['พรุ่งนี้', 'Tomorrow'], starts: ['เริ่ม', 'starts'], map: ['แผนที่', 'Map'] }; /*noT*/
  function nc(k) { return NC[k][LANG === 'en' ? 1 : 0]; }
  function waitLabel(m) { var h = Math.floor(m / 60), r = m % 60, p = []; if (h) p.push(h + (LANG === 'en' ? ' h' : ' ชม.')); if (r || !h) p.push(r + (LANG === 'en' ? ' min' : ' นาที')); return (LANG === 'en' ? 'in ' : 'อีก ') + p.join(' '); } /*noT*/
  function itName(it) { return LANG === 'en' && it.en ? it.en : it.title; }
  // where today sits in the plan, by the trip's own clock; null outside trip days and after the last day's last item
  function nowNext(t) {
    var n = nowIn(t.meta.timezone), di = -1;
    t.days.forEach(function (d, i) { if (d.date === n.date) di = i; });
    if (di < 0) return null;
    var cur = null, next = null;
    t.days[di].items.forEach(function (it) { var m = startMin(it.time); if (m < 0) return; if (m <= n.min) { if (!next) cur = it; } else if (!next) next = it; });
    var r = { n: n, di: di, cur: cur, next: next, wait: next ? startMin(next.time) - n.min : 0 };
    if (!next) {
      var tm = t.days[di + 1]; if (!tm) return null;
      r.tomorrow = tm.items.filter(function (it) { return startMin(it.time) >= 0; })[0];
      if (!r.tomorrow) return null;
      r.tdi = di + 1;
    }
    return r;
  }
  // where = 'ov' (overview) or the day index of the tab being shown; empty placeholder keeps a slot for the 1-minute refresh
  function nowCardHtml(t, where) {
    var x = t && !S.edit ? nowNext(t) : null, slot = '<i hidden data-nowcard="' + where + '"></i>';
    if (!x || (where !== 'ov' && x.di !== where)) return slot;
    var h = '<section class="nowcard" data-nowcard="' + where + '"><p class="nc-now">' + icon('clock') + '<b>' + esc(x.n.hm) + '</b>' + (x.cur ? '<span>' + esc(nc('now')) + ': ' + inl(itName(x.cur)) + '</span>' : '') + '</p>';
    if (x.next) {
      var it = x.next, url = mapUrl(it), tp = L(it, 'transport'), cs = L(it, 'cost');
      var chips = lineList(it.line).map(function (l) { return chipHtml(l, true); }).join('');
      h += '<button class="nc-main" data-act="goto-item" data-d="' + x.di + '" data-id="' + it.id + '"><span class="nc-k">' + esc(nc('next')) + ' · <b>' + esc(waitLabel(x.wait)) + '</b></span>' +
        '<span class="nc-t"><span class="nc-time">' + esc(splitTime(it.time)[0]) + '</span>' + inl(itName(it)) + (it.zh ? '<span class="zh" lang="zh-Hant">' + esc(it.zh) + '</span>' : '') + '</span>' +
        ((chips || vis(tp)) ? '<span class="nc-line">' + chips + (vis(tp) ? '<span>' + inl(tp) + '</span>' : '') + '</span>' : '') +
        (vis(cs) ? '<span class="nc-cost">' + inl(cs) + '</span>' : '') + '</button>' +
        (url ? '<a class="btn sm nc-map" href="' + esc(url) + '" target="_blank" rel="noopener">' + icon('pin') + '<span>' + esc(nc('map')) + '</span></a>' : '');
    } else {
      var tt = x.tomorrow;
      h += '<p class="nc-done">' + esc(nc('done')) + '</p><button class="nc-main" data-act="goto-item" data-d="' + x.tdi + '" data-id="' + tt.id + '"><span class="nc-k">' + esc(nc('tom')) + ' (Day ' + (x.tdi + 1) + ') ' + esc(nc('starts')) + '</span>' +
        '<span class="nc-t"><span class="nc-time">' + esc(splitTime(tt.time)[0]) + '</span>' + inl(itName(tt)) + '</span></button>';
    }
    return h + '</section>';
  }
  function refreshNowCard() { $$('[data-nowcard]').forEach(function (el) { var w = el.getAttribute('data-nowcard'); el.outerHTML = nowCardHtml(S.cur, w === 'ov' ? 'ov' : +w); }); }
  // after a "goto-item" jump: open + centre the item (instead of jumping to the top)
  function scrollToItem() {
    if (!S.scrollItem) return false;
    var li = $('.it[data-id="' + S.scrollItem + '"]'); S.scrollItem = null;
    if (!li) return false;
    li.scrollIntoView({ block: 'center' }); return true;
  }

  /* ---------------- metro map ---------------- */
  function routeStops(r) { return String(r || '').split(/\s*(?:→|->)\s*/).map(function (s) { return stripE(s); }).filter(Boolean); }
  function tripStops(t) {
    var out = [];
    t.days.forEach(function (d, i) {
      var tagged = false;
      routeStops(d.route).forEach(function (s, k) {
        var last = out[out.length - 1];
        if (k === 0 && last && last.label.toLowerCase() === s.toLowerCase()) return;
        out.push({ label: s, c: dayCls(i), tag: tagged ? '' : 'D' + (i + 1) });
        tagged = true;
      });
    });
    return out;
  }
  function wrapLabel(s, maxPx) {
    var maxC = Math.max(4, Math.floor(maxPx / 7.4)), words = s.split(' '), lines = [''];
    words.forEach(function (w) {
      var cur = lines[lines.length - 1];
      if (!cur) lines[lines.length - 1] = w;
      else if ((cur + ' ' + w).length <= maxC) lines[lines.length - 1] = cur + ' ' + w;
      else lines.push(w);
    });
    lines = lines.map(function (l) { return l.length > maxC ? l.slice(0, maxC - 1) + '…' : l; });
    if (lines.length > 2) { lines = lines.slice(0, 2); lines[1] = lines[1].slice(0, Math.max(1, maxC - 1)) + '…'; }
    return lines;
  }
  function drawMetro(el, anim) {
    var stops = el._stops || []; el._w = Math.round(el.clientWidth);
    if (!stops.length) { el.innerHTML = ''; return; }
    var W = Math.max(280, el._w), pad = 44, rowH = 92, top = 30, minSp = 92;
    var per = Math.max(2, Math.floor((W - 2 * pad) / minSp) + 1);
    if (stops.length <= per) per = stops.length;
    var sp = per > 1 ? (W - 2 * pad) / (per - 1) : 0;
    var rows = Math.ceil(stops.length / per);
    var pts = stops.map(function (s, i) {
      var r = Math.floor(i / per), k = i % per;
      var x = per === 1 ? W / 2 : (r % 2 === 0 ? pad + k * sp : W - pad - k * sp);
      return { x: x, y: top + r * rowH, r: r, s: s };
    });
    var segs = '', nodes = '', texts = '', bul = Math.min(pad - 8, rowH / 2);
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], d;
      if (a.r === b.r) d = 'M' + a.x + ' ' + a.y + 'L' + b.x + ' ' + b.y;
      else { var bx = a.x + (a.r % 2 === 0 ? bul : -bul); d = 'M' + a.x + ' ' + a.y + 'C' + bx + ' ' + a.y + ' ' + bx + ' ' + b.y + ' ' + b.x + ' ' + b.y; }
      segs += '<path class="m-seg ' + b.s.c + '" d="' + d + '" style="animation-delay:' + (i * 70) + 'ms"/>';
    }
    pts.forEach(function (p, i) {
      var end = i === 0 || i === pts.length - 1;
      nodes += '<circle class="m-node ' + p.s.c + (end ? ' end' : '') + '" cx="' + p.x + '" cy="' + p.y + '" r="' + (end ? 8 : 7) + '" style="animation-delay:' + (i * 70) + 'ms"/>';
      var avail = Math.min(per > 1 ? sp - 8 : W - 20, 2 * Math.min(p.x, W - p.x) - 6);
      var ls = wrapLabel(p.s.label, avail);
      texts += '<text class="m-label" text-anchor="middle" x="' + p.x + '" y="' + (p.y + 26) + '" style="animation-delay:' + (i * 70) + 'ms">' + ls.map(function (l, k) { return '<tspan x="' + p.x + '" dy="' + (k ? 16 : 0) + '">' + esc(l) + '</tspan>'; }).join('') + '<title>' + esc(p.s.label) + '</title></text>';
      if (p.s.tag) texts += '<text class="m-tag ' + p.s.c + '" text-anchor="middle" x="' + p.x + '" y="' + (p.y - 15) + '" style="animation-delay:' + (i * 70) + 'ms">' + esc(p.s.tag) + '</text>';
    });
    var H = top + (rows - 1) * rowH + 52;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.innerHTML = T('<svg role="img" aria-label="เส้นทาง: ') + esc(stops.map(function (s) { return s.label; }).join(' → ')) + '" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '"' + (anim && !reduce ? ' class="anim"' : '') + '>' + segs + nodes + texts + '</svg>';
    if (anim && !reduce) $$('.m-seg', el).forEach(function (p) { try { p.style.setProperty('--l', Math.ceil(p.getTotalLength()) + 1); } catch (e) { } });
  }

  /* ---------------- modal / toast / fullscreen ---------------- */
  function modal(html, o) {
    o = o || {};
    return new Promise(function (res) {
      var back = D.createElement('div'); back.className = 'modal-back';
      back.innerHTML = '<div class="modal" role="dialog" aria-modal="true">' + html + '</div>';
      D.body.appendChild(back); D.body.classList.add('lock');
      var m = back.firstChild, prev = D.activeElement;
      function close(v) { back.remove(); if (!$('.modal-back') && !$('.fs')) D.body.classList.remove('lock'); D.removeEventListener('keydown', onKey); if (prev && prev.focus) try { prev.focus(); } catch (e) { } res(v); }
      function onKey(e) { if (e.key === 'Escape') close(null); }
      D.addEventListener('keydown', onKey);
      back.addEventListener('click', function (e) { if (e.target === back && !o.sticky) return close(null); var b = e.target.closest('[data-res]'); if (b) close(b.getAttribute('data-res')); });
      if (o.onOpen) o.onOpen(m, close);
      var f = $('[autofocus]', m) || $('button, input, a', m); if (f) f.focus();
    });
  }
  function toast(msg, o) {
    o = o || {};
    var el = D.createElement('div'); el.className = 'toast';
    el.innerHTML = '<span>' + esc(msg) + '</span>' + (o.undo ? T('<button class="btn sm">เลิกทำ</button>') : '');
    $('#toasts').appendChild(el);
    var tm = setTimeout(function () { el.remove(); }, o.undo ? 7000 : 2600);
    if (o.undo) $('button', el).onclick = function () { clearTimeout(tm); el.remove(); o.undo(); };
  }
  function openFs(html) {
    var el = D.createElement('div'); el.className = 'fs'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = T('<button class="ibtn fs-x" aria-label="ปิด">') + icon('x') + '</button><div class="fs-in">' + html + T('</div><p class="fs-hint">แตะที่ใดก็ได้เพื่อปิด</p>');
    D.body.appendChild(el); D.body.classList.add('lock');
    function close() { el.remove(); if (!$('.modal-back')) D.body.classList.remove('lock'); D.removeEventListener('keydown', k); }
    function k(e) { if (e.key === 'Escape') close(); }
    D.addEventListener('keydown', k); el.addEventListener('click', close); $('.fs-x', el).focus();
  }

  /* ---------------- files ---------------- */
  var dlPromise = (window.claude && typeof window.claude.use === 'function') ? window.claude.use('downloads').catch(function () { return null; }) : Promise.resolve(null);
  function blobDownload(name, text) { var a = D.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' })); a.download = name; D.body.appendChild(a); a.click(); a.remove(); }
  function saveFile(name, text) {
    if (IN_GAS) { showCopy(name, text, true); return Promise.resolve(); }   // the Apps Script iframe may block downloads silently, so always offer copy too
    return dlPromise.then(function (dl) {
      if (dl) return dl.save({ filename: name, data: text }).then(function () { toast(T('บันทึกไฟล์แล้ว')); }, function (e) { if (e && e.code === 'declined') return; showCopy(name, text); });
      if (!window.claude) {
        try { blobDownload(name, text); return; } catch (e) { }
      }
      showCopy(name, text);
    });
  }
  function showCopy(name, text, withDl) {
    var head = withDl ? T('</h2><p>กดดาวน์โหลด ถ้าไม่มีไฟล์ออกมา ให้คัดลอกข้อความด้านล่างไปบันทึกเป็นไฟล์แทน</p><textarea class="copybox" readonly>') : T('</h2><p>ดาวน์โหลดจากหน้านี้ไม่ได้ คัดลอกข้อความด้านล่างไปบันทึกเป็นไฟล์แทน</p><textarea class="copybox" readonly>');
    modal('<h2>' + esc(name) + head + esc(text) + T('</textarea><div class="mbtns"><button class="btn" data-res="x">ปิด</button>') + (withDl ? '<button class="btn" data-dl>' + icon('download') + '<span>' + T('ดาวน์โหลด') + '</span></button>' : '') + T('<button class="btn pri" data-copy>คัดลอก</button></div>'), {
      onOpen: function (m) {
        var ta = $('textarea', m), dlb = $('[data-dl]', m);
        if (dlb) dlb.onclick = function () { try { blobDownload(name, text); } catch (e) { toast(T('ดาวน์โหลดไม่ได้ ใช้ปุ่มคัดลอกแทน')); } };
        $('[data-copy]', m).onclick = function () {
          ta.focus(); ta.select();
          var ok = false; try { ok = D.execCommand('copy'); } catch (e) { }
          if (navigator.clipboard && !ok) navigator.clipboard.writeText(text).then(function () { toast(T('คัดลอกแล้ว')); }, function () { toast(T('เลือกข้อความแล้ว กดคัดลอกเอง')); });
          else toast(ok ? T('คัดลอกแล้ว') : T('เลือกข้อความแล้ว กดคัดลอกเอง'));
        };
      }
    });
  }
  function fileSlug(t) { return (t.id || 'trip').replace(/[^a-z0-9-]+/g, '-'); }
  function exportBundle(trips) { return JSON.stringify({ app: 'travel-plan', schema: 1, exportedAt: new Date().toISOString(), trips: trips }, null, 2); }

  /* ---------------- import ---------------- */
  function impSummary(r) {
    var t = r.trip, items = t.days.reduce(function (a, d) { return a + d.items.length; }, 0);
    var pi = countPack(t)[1];
    return '<div class="impsum"><h3>' + esc(t.meta.title || T('(ไม่มีชื่อ)')) + '</h3><p class="muted">' + esc(fmtRange(t.meta.start, t.meta.end)) + (t.meta.timezone ? ' · ' + esc(t.meta.timezone) : '') + '</p><ul>' +
      t.days.map(function (d, i) { return '<li>Day ' + (i + 1) + ' · ' + esc(fmtDate(d.date, false, false)) + ' · ' + cnt(d.items.length, 'item') + '</li>'; }).join('') +
      T('<li>รวม ') + items + T(' รายการ · เตรียมของ ') + pi + T(' ชิ้น · To-do ') + t.todo.length + T(' · ข้อมูลอ้างอิง ') + t.ref.length + T(' หัวข้อ</li></ul>') +
      (r.warnings.length ? T('<div class="warns"><b>ต้องตรวจ ') + r.warnings.length + T(' จุด</b><ul>') + r.warnings.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></div>' : T('<p class="ok">อ่านได้ครบ ไม่พบปัญหา</p>')) + '</div>';
  }
  function openImport() {
    var parsed = null, jsonTrips = null;
    return modal(T('<h2>นำเข้าแผน</h2><p>ไฟล์ .md ตาม template หรือไฟล์สำรอง .json จากเว็บนี้</p>') +
      '<label class="file">' + icon('upload') + T('<span>เลือกไฟล์</span><input type="file" accept=".md,.markdown,.txt,.json,text/markdown,text/plain,application/json" data-imp="file"></label>') +
      T('<details class="paste"><summary>วางหรือแก้ข้อความ markdown ก่อนบันทึก</summary><textarea data-imp="text" rows="9" placeholder="วางเนื้อหาไฟล์ .md ที่นี่"></textarea><button class="btn" data-imp="check">ตรวจข้อความ</button></details>') +
      T('<div data-imp="out" aria-live="polite"></div><div class="mbtns"><button class="btn" data-res="cancel">ยกเลิก</button><button class="btn pri" data-imp="save" disabled>บันทึกแผน</button></div>'), {
      sticky: true,
      onOpen: function (m, close) {
        var out = $('[data-imp="out"]', m), save = $('[data-imp="save"]', m), ta = $('[data-imp="text"]', m);
        function handle(text, name) {
          parsed = null; jsonTrips = null;
          if (/\.json$/i.test(name || '') || /^\s*\{/.test(text)) {
            try {
              var j = JSON.parse(text), arr = Array.isArray(j.trips) ? j.trips : (j.meta ? [j] : null);
              if (!arr) throw new Error('x');
              jsonTrips = arr.filter(function (x) { return x && x.meta && Array.isArray(x.days); });
              out.innerHTML = T('<div class="impsum"><h3>ไฟล์สำรอง ') + jsonTrips.length + T(' แผน</h3><ul>') + jsonTrips.map(function (x) { return '<li>' + esc(x.meta.title) + ' · ' + esc(fmtRange(x.meta.start, x.meta.end)) + '</li>'; }).join('') + '</ul></div>';
              save.disabled = !jsonTrips.length;
            } catch (e) { out.innerHTML = T('<p class="err">อ่านไฟล์ JSON ไม่ได้ ตรวจว่าเป็นไฟล์สำรองจากเว็บนี้</p>'); save.disabled = true; }
            return;
          }
          var r = TP.parse(text); parsed = r; out.innerHTML = impSummary(r);
          var ok = r.trip.meta.title && TP.isDate(r.trip.meta.start) && TP.isDate(r.trip.meta.end) && r.trip.days.length;
          if (!ok) out.innerHTML += T('<p class="err">บันทึกไม่ได้: ต้องมี title, start, end และอย่างน้อย 1 Day</p>');
          save.disabled = !ok;
        }
        $('[data-imp="file"]', m).addEventListener('change', function (e) {
          var f = e.target.files && e.target.files[0]; if (!f) return;
          var rd = new FileReader();
          rd.onload = function () { var tx = String(rd.result); if (!/\.json$/i.test(f.name)) { ta.value = tx; } handle(tx, f.name); };
          rd.onerror = function () { out.innerHTML = T('<p class="err">อ่านไฟล์ไม่ได้</p>'); };
          rd.readAsText(f);
        });
        $('[data-imp="check"]', m).addEventListener('click', function () { handle(ta.value, ''); });
        save.addEventListener('click', function () { if (parsed && ta.value.trim()) { var r = TP.parse(ta.value); if (r.trip.days.length) parsed = r; } close('save'); });
      }
    }).then(function (res) {
      if (res !== 'save') return;
      if (jsonTrips) return jsonTrips.reduce(function (p, x) { return p.then(function () { return addTrip(normalizeTrip(x)); }); }, Promise.resolve());
      if (parsed) return addTrip(parsed.trip);
    });
  }
  function addTrip(trip) {
    var dup = S.trips.filter(function (t) { return sameTrip(t, trip); })[0];
    var step = dup ? modal(T('<h2>มีแผนนี้อยู่แล้ว</h2><p>“') + esc(trip.meta.title) + '” ' + esc(fmtRange(trip.meta.start, trip.meta.end)) + T(' มีอยู่ในเครื่องนี้แล้ว</p><div class="mbtns col"><button class="btn pri" data-res="over">เขียนทับแผนเดิม</button><button class="btn" data-res="both">เก็บเป็นอีกแผน</button><button class="btn" data-res="cancel">ยกเลิก</button></div>')) : Promise.resolve('new');
    return step.then(function (c) {
      if (c === 'over') { replaceTrip(dup, trip, true); saveNow(); toast(T('เขียนทับแผนแล้ว')); go(trip.id); return; }
      if (c !== 'both' && c !== 'new') return;
      trip.id = makeId(trip.meta); trip.origin = 'import'; trip.localEdited = true; trip.updatedAt = Date.now();
      S.trips.push(trip); saveNow(); toast(T('นำเข้าแผนแล้ว')); go(trip.id);
    });
  }

  /* ---------------- settings ---------------- */
  function langSeg() { return '<div class="seg"><button data-set="lang" data-v="th" aria-pressed="' + (LANG === 'th') + '">ไทย</button><button data-set="lang" data-v="en" aria-pressed="' + (LANG === 'en') + '">English</button></div>'; } /*noT*/
  function settingsHtml() {
    var dark = S.settings.theme !== 'light', p = S.settings.planning, own = S.settings.owner;
    return T('<h2>ตั้งค่า</h2>') +
      T('<div class="set"><div><b>ธีม</b><p class="muted">เริ่มต้นเป็นธีมมืด</p></div><div class="seg"><button data-set="theme" data-v="dark" aria-pressed="') + dark + T('">มืด</button><button data-set="theme" data-v="light" aria-pressed="') + !dark + T('">สว่าง</button></div></div>') +
      T('<div class="set"><div><b>ภาษา / Language</b></div>') + langSeg() + '</div>' +
      (own && !HAS_SERVER ? T('<div class="set"><div><b>โหมดเจ้าของ</b><p class="muted">เปิดโหมดวางแผน การแก้ไข นำเข้า ส่งออก การแก้ไขอยู่ในเครื่องนี้เท่านั้น คนอื่นไม่เห็น</p></div><button class="btn sm" data-set="owner-off">ออกจากโหมดเจ้าของ</button></div>') : '') +
      (own && HAS_SERVER ? T('<div class="set"><div><b>โหมดเจ้าของ</b><p class="muted">เปิดโหมดวางแผนและการแก้ไข แก้แล้วกด “บันทึกขึ้น Drive” คนอื่นจึงจะเห็น</p></div><button class="btn sm" data-set="owner-off">ออกจากโหมดเจ้าของ</button></div>') : '') +
      (own && HAS_SERVER ? (editKey()
        ? T('<div class="set"><div><b>รหัสแก้ไข</b><p class="muted">ยืนยันแล้ว จำไว้ในเครื่องนี้</p></div><button class="btn sm" data-set="key-forget">ลืมรหัสในเครื่องนี้</button></div>')
        : T('<div class="set"><div><b>รหัสแก้ไข</b><p class="muted">ต้องใส่ก่อนบันทึกขึ้น Drive</p></div><button class="btn sm pri" data-set="key">ใส่รหัส</button></div>')) : '') +
      (own ? T('<div class="set"><div><b>โหมดวางแผน</b><p class="muted">แสดงสถานะข้อมูล หน้าวางแผน และเครื่องมือแก้ไข นำเข้า ส่งออก</p></div><button class="sw" role="switch" aria-checked="') + p + T('" aria-label="โหมดวางแผน" data-set="planning"><span></span></button></div>') : '') +
      (p && SEEDS.length ? T('<div class="set"><div><b>ใช้แผนที่มากับลิงก์</b><p class="muted">ล้างการแก้ไขในเครื่องนี้ของแผนที่มากับลิงก์ แล้วโหลดใหม่ (การติ๊กยังอยู่)</p></div><button class="btn danger sm" data-set="reset">รีเซ็ต</button></div>') : '') +
      '<p class="note">' + (!storageOK ? T('เบราว์เซอร์นี้ไม่ให้บันทึกข้อมูล การแก้ไขจะหายเมื่อปิดหน้า')
        : HAS_SERVER ? (own ? T('แผนหลักอยู่บน Drive ของเจ้าของ การแก้ไขที่ยังไม่บันทึกและการติ๊กเก็บในเครื่องนี้') : T('แผนโหลดจาก Drive ของเจ้าของ การติ๊กเก็บในเครื่องนี้เท่านั้น'))
        : own ? T('แผน การแก้ไข และการติ๊ก เก็บในเบราว์เซอร์ของเครื่องนี้เท่านั้น') : T('การติ๊กเก็บในเครื่องนี้เท่านั้น')) + '</p>' +
      '<p class="note ver" data-ver>' + T('แผนเที่ยว') + ' ' + APP_VERSION + '</p>' +
      T('<div class="mbtns"><button class="btn pri" data-res="ok">เสร็จ</button></div>');
  }
  function openSettings() {
    modal(settingsHtml(), {
      onOpen: function (m, close) {
        var verTaps = 0, verT = 0;
        m.addEventListener('click', function (e) {
          if (e.target.closest('[data-ver]')) {   // 7 quick taps on the version line unlock owner mode (a UI guard, not security)
            var now = Date.now(); verTaps = now - verT < 1500 ? verTaps + 1 : 1; verT = now;
            if (verTaps >= 7 && !S.settings.owner) { S.settings.owner = true; lsSet(K.set, S.settings); render(true); m.innerHTML = settingsHtml(); toast(T('เปิดโหมดเจ้าของแล้ว')); }
            return;
          }
          var b = e.target.closest('[data-set]'); if (!b) return;
          var k = b.getAttribute('data-set');
          if (k === 'theme') S.settings.theme = b.getAttribute('data-v');
          else if (k === 'lang') S.settings.lang = b.getAttribute('data-v');
          else if (k === 'planning') { S.settings.planning = !S.settings.planning; if (!S.settings.planning) S.edit = false; }
          else if (k === 'owner-off') { S.settings.owner = false; S.settings.planning = false; S.edit = false; lsSet(K.key, ''); toast(T('ออกจากโหมดเจ้าของแล้ว')); }
          else if (k === 'reset') { close('x'); resetSeed(); return; }
          else if (k === 'key') { close('x'); askKey(); return; }
          else if (k === 'key-forget') { lsSet(K.key, ''); toast(T('ลบรหัสออกจากเครื่องนี้แล้ว')); }
          lsSet(K.set, S.settings); render(true); m.innerHTML = settingsHtml();
          var again = $('[data-set="' + k + '"]', m); if (again) again.focus();
        });
      }
    });
  }
  function resetSeed() {
    modal(T('<h2>รีเซ็ตแผนจากลิงก์</h2><p>การแก้ไขในเครื่องนี้ของแผนที่มากับลิงก์จะหายไป ส่งออก .md หรือ .json เก็บไว้ก่อนถ้ายังต้องใช้</p><div class="mbtns"><button class="btn" data-res="no">ยกเลิก</button><button class="btn danger" data-res="yes">รีเซ็ต</button></div>')).then(function (c) {
      if (c !== 'yes') return;
      seedTrips().forEach(function (t) {
        var ex = S.trips.filter(function (x) { return sameTrip(x, t); })[0];
        if (ex) replaceTrip(ex, t, false); else { t.id = makeId(t.meta); t.origin = 'seed'; t.localEdited = false; t.updatedAt = Date.now(); S.trips.push(t); }
      });
      saveNow(); render(true); toast(T('รีเซ็ตแล้ว'));
    });
  }

  /* ---------------- events ---------------- */
  D.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b || b.disabled) return;
    var a = b.getAttribute('data-act'), t = S.cur;
    switch (a) {
      case 'toggle': {
        var id = b.getAttribute('data-id'), li = b.closest('.it');
        S.open[id] = !S.open[id]; li.classList.toggle('open', !!S.open[id]); b.setAttribute('aria-expanded', !!S.open[id]);
        syncExpandBtn(); return;
      }
      case 'expand-all': {
        var v = b.getAttribute('data-v') === '1';
        $$('.tl .it').forEach(function (li) { var id = li.getAttribute('data-id'); if (!$('.it-detail', li)) return; S.open[id] = v; li.classList.toggle('open', v); var bt = $('.it-main', li); if (bt) bt.setAttribute('aria-expanded', v); });
        syncExpandBtn(); return;
      }
      case 'lang': S.settings.lang = LANG === 'en' ? 'th' : 'en'; lsSet(K.set, S.settings); render(true); return;
      case 'theme': S.settings.theme = S.settings.theme === 'light' ? 'dark' : 'light'; lsSet(K.set, S.settings); render(true); return;
      case 'settings': openSettings(); return;
      case 'edit-toggle': S.edit = !S.edit; if (!S.edit) saveNow(); render(false); window.scrollTo(0, 0); return;
      case 'import': openImport(); return;
      case 'save-remote': saveRemote(false); return;
      case 'sync-hide': syncHide(true); refreshSyncBar(); return;
      case 'goto-item': { var gid = b.getAttribute('data-id'); S.open[gid] = true; S.scrollItem = gid; var gh = t.id + '--d' + (+b.getAttribute('data-d') + 1); if (location.hash === '#' + gh) { render(true); scrollToItem(); } else location.hash = gh; return; }
      case 'promote': promoteTrip(t); return;
      case 'reload-remote': S.remote.state = 'loading'; render(true); loadRemote(); return;
      case 'discard-local':
        modal(T('<h2>ทิ้งการแก้ไขในเครื่องนี้?</h2><p>การแก้ไขที่ยังไม่บันทึกขึ้น Drive จะหายไป แล้วโหลดแผนจาก Drive มาแทน</p><div class="mbtns"><button class="btn" data-res="no">ยกเลิก</button><button class="btn danger" data-res="yes">ทิ้งการแก้ไข</button></div>')).then(function (c) { if (c === 'yes') discardLocal(); });
        return;
      case 'template': saveFile('travel-plan-template.md', window.TP_TEMPLATE || ''); return;
      case 'export-all': saveFile('travel-plans-backup.json', exportBundle(S.trips)); return;
      case 'export-md': if (t) saveFile(fileSlug(t) + '.md', TP.toMarkdown(t)); return;
      case 'export-json': if (t) saveFile(fileSlug(t) + '.json', exportBundle([t])); return;
      case 'delete-trip':
        if (!t) return;
        modal(T('<h2>ลบแผนนี้?</h2><p>“') + esc(t.meta.title) + T('” จะถูกลบจากเครื่องนี้ ส่งออก .md เก็บไว้ก่อนถ้ายังต้องใช้</p><div class="mbtns"><button class="btn" data-res="no">ยกเลิก</button><button class="btn danger" data-res="yes">ลบแผน</button></div>')).then(function (c) {
          if (c !== 'yes') return;
          var snap = JSON.stringify(t), idx = S.trips.indexOf(t);
          S.trips.splice(idx, 1); saveNow(); go('home');
          toast(T('ลบแผนแล้ว'), { undo: function () { S.trips.splice(idx, 0, JSON.parse(snap)); saveNow(); render(true); } });
        });
        return;
      case 'cal': {
        var d = +b.getAttribute('data-d');
        if (!d) S.cal = nowIn().date.slice(0, 7);
        else { var p = S.cal.split('-').map(Number), mo = p[1] - 1 + d, y = p[0] + Math.floor(mo / 12); mo = ((mo % 12) + 12) % 12; S.cal = y + '-' + String(mo + 1).padStart(2, '0'); }
        render(true); return;
      }
      case 'fs-row': {
        var sec = t.ref[+b.getAttribute('data-sec')]; if (!sec || !window.marked) return;
        var tabs = window.marked.lexer(prepMd(sec.md)).filter(function (x) { return x.type === 'table'; });
        var tk = tabs[+b.getAttribute('data-t')]; if (!tk) return;
        var row = tk.rows[+b.getAttribute('data-r')];
        openFs(row.map(function (c, i) { var cjk = hasCJK(c.text); return '<div class="fs-cell' + (cjk ? ' cjk' : '') + '"' + (cjk ? ' lang="zh-Hant"' : '') + '><small>' + window.marked.parseInline(tk.header[i] ? tk.header[i].text : '') + '</small><div>' + (window.marked.parseInline(c.text) || '—') + '</div></div>'; }).join(''));
        return;
      }
      case 'fs-sec': { var s2 = t.ref[+b.getAttribute('data-sec')]; if (s2) openFs((s2.title ? '<p class="muted">' + inl(s2.title) + '</p>' : '') + '<div class="fs-sec"><div class="md">' + mdHtml(s2.md) + '</div></div>'); return; }
      case 'add': {
        var list = getPath(t, b.getAttribute('data-list')); list.push(NEW[b.getAttribute('data-new')](t));
        edited(); S.focus = b.getAttribute('data-list') + '.' + (list.length - 1); render(true); return;
      }
      case 'del': {
        var snap2 = JSON.stringify(t), l2 = getPath(t, b.getAttribute('data-list'));
        l2.splice(+b.getAttribute('data-i'), 1); edited(); render(true);
        toast(T('ลบแล้ว'), { undo: function () { restoreTrip(snap2); } });
        return;
      }
      case 'mv': {
        var l3 = getPath(t, b.getAttribute('data-list')), i = +b.getAttribute('data-i'), j = i + (+b.getAttribute('data-d'));
        if (j < 0 || j >= l3.length) return;
        var tmp = l3[i]; l3[i] = l3[j]; l3[j] = tmp; edited(); render(true);
        var nb = $('[data-act="mv"][data-list="' + b.getAttribute('data-list') + '"][data-i="' + j + '"][data-d="' + b.getAttribute('data-d') + '"]'); if (nb && !nb.disabled) nb.focus();
        return;
      }
    }
  });
  function syncExpandBtn() {
    var b = $('[data-act="expand-all"]'); if (!b) return;
    var lis = $$('.tl .it').filter(function (li) { return $('.it-detail', li); });
    var all = lis.length && lis.every(function (li) { return li.classList.contains('open'); });
    b.setAttribute('data-v', all ? '0' : '1'); b.textContent = all ? T('ย่อทั้งหมด') : T('ขยายทั้งหมด');
  }
  function restoreTrip(snap) { var t = JSON.parse(snap), idx = -1; S.trips.forEach(function (x, i) { if (x.id === t.id) idx = i; }); if (idx >= 0) S.trips[idx] = t; else S.trips.push(t); saveNow(); render(true); }
  D.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('tr[data-act]')) { e.preventDefault(); e.target.click(); }
  });
  function onBind(e) {
    var el = e.target;
    if (el.hasAttribute && el.hasAttribute('data-chk')) { if (e.type === 'change') toggleCheck(el); return; }
    var p = el.getAttribute && el.getAttribute('data-b'); if (!p || !S.cur) return;
    var k = el.getAttribute('data-k'), v;
    if (k === 'bool') v = el.checked;
    else if (k === 'lines') v = el.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    else v = el.value;
    setPath(S.cur, p, v); edited();
  }
  D.addEventListener('input', onBind);
  D.addEventListener('change', onBind);
  function toggleCheck(el) {
    var t = S.cur; if (!t) return;
    setPath(t, el.getAttribute('data-chk') + '.done', el.checked);
    saveSoon();
    var lab = el.closest('.ck'); if (lab) lab.classList.toggle('done', el.checked);
    if (S.tab === 'pack') {
      var c = countPack(t), pe = $('[data-prog="pack"]'), pb = $('[data-pbar="pack"]');
      if (pe) pe.textContent = c[0] + '/' + c[1]; if (pb) pb.style.width = (c[1] ? Math.round(c[0] * 100 / c[1]) : 0) + '%';
      t.pack.forEach(function (g, gi) { var ge = $('[data-prog-g="' + gi + '"]'); if (ge) ge.textContent = g.items.filter(function (x) { return x.done; }).length + '/' + g.items.length; });
    } else if (S.tab === 'todo') {
      var d = t.todo.filter(function (x) { return x.done; }).length, te = $('[data-prog="todo"]'), tb = $('[data-pbar="todo"]');
      if (te) te.textContent = d + '/' + t.todo.length; if (tb) tb.style.width = Math.round(d * 100 / t.todo.length) + '%';
      var li = el.closest('.todo'); if (li && el.checked) li.classList.remove('over');
    }
  }
  D.addEventListener('toggle', function (e) { if (e.target.classList && e.target.classList.contains('cal-det')) S.calOpen = e.target.open; }, true);

  /* drag to reorder (desktop) */
  var drag = null;
  D.addEventListener('mousedown', function (e) { var g = e.target.closest('[data-grip]'); if (!g) return; var box = g.closest('.ed'); if (box) box.setAttribute('draggable', 'true'); });
  D.addEventListener('dragstart', function (e) { var box = e.target.closest && e.target.closest('.ed[draggable="true"]'); if (!box) return; drag = { list: box.getAttribute('data-dl'), i: +box.getAttribute('data-i') }; e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', 'x'); } catch (er) { } });
  D.addEventListener('dragover', function (e) { if (!drag) return; var box = e.target.closest && e.target.closest('.ed'); if (!box || box.getAttribute('data-dl') !== drag.list) return; e.preventDefault(); $$('.ed.drag-over').forEach(function (x) { if (x !== box) x.classList.remove('drag-over'); }); box.classList.add('drag-over'); });
  D.addEventListener('drop', function (e) {
    if (!drag) return; var box = e.target.closest && e.target.closest('.ed'); if (!box || box.getAttribute('data-dl') !== drag.list) return;
    e.preventDefault(); var j = +box.getAttribute('data-i'), l = getPath(S.cur, drag.list);
    if (j !== drag.i) { var it = l.splice(drag.i, 1)[0]; l.splice(j, 0, it); edited(); }
    drag = null; render(true);
  });
  D.addEventListener('dragend', function () { drag = null; $$('.ed[draggable]').forEach(function (x) { x.removeAttribute('draggable'); x.classList.remove('drag-over'); }); });

  window.addEventListener('hashchange', function () { render(false); if (!scrollToItem()) window.scrollTo(0, 0); });
  window.addEventListener('pagehide', saveNow);
  setInterval(function () { if (S.cur && !S.edit) { placeNow(); refreshNowCard(); } }, 60000);
  D.addEventListener('visibilitychange', function () { if (D.visibilityState === 'visible' && S.cur && !S.edit) { placeNow(); refreshNowCard(); } });
  /* GAS: coming back to the tab after 5+ minutes picks up the owner's latest save (no polling, to stay inside quota) */
  D.addEventListener('visibilitychange', function () { if (HAS_SERVER && D.visibilityState === 'visible' && !S.edit && !S.remote.busy && Date.now() - S.remote.at > 300000) loadRemote(); });
  /* GAS: the page runs in an iframe, so copy our hash to the address bar to keep links shareable.
     Not before getLocation() has answered, or we would wipe the deep link the visitor opened. */
  var hashReady = !IN_GAS, lastMirror = null;
  function gasApi(k) { return IN_GAS && window.google && window.google.script ? window.google.script[k] : null; }
  function mirrorHash() {
    var h = gasApi('history'), cur = location.hash.slice(1);
    if (!hashReady || !h || !h.replace || cur === lastMirror) return;
    lastMirror = cur; try { h.replace(null, null, cur); } catch (e) { }
  }

  /* ---------------- boot ---------------- */
  var conflicts = initData();
  if (!location.hash || location.hash === '#' || location.hash === '#home') {
    var on = sortedTrips().filter(function (x) { return x.s.status === 'ongoing' && x.s.dayIdx >= 0; })[0];
    var st0 = HAS_SERVER ? serverTrip() : null;
    if (st0) { S.remote.first = false; history.replaceState(null, '', '#' + landing(st0)); }
    else if (on) history.replaceState(null, '', '#' + on.t.id + '--d' + (on.s.dayIdx + 1));
  }
  render(false);
  if (HAS_SERVER) {
    var gu = gasApi('url');
    var onLoc = function (loc) {
      var h = loc && loc.hash; hashReady = true;
      if (h && h !== location.hash.slice(1)) { S.remote.first = false; location.hash = h; } else mirrorHash();
    };
    if (gu && gu.getLocation) { try { gu.getLocation(onLoc); } catch (e) { onLoc(null); } } else onLoc(null);
    loadRemote();
  }
  conflicts.reduce(function (p, c) {
    return p.then(function () {
      return modal(T('<h2>แผนนี้มีเวอร์ชันใหม่จากลิงก์</h2><p>“') + esc(c[1].meta.title) + '” ' + (c[1].meta.version ? '(' + esc(c[1].meta.version) + ') ' : '') + T('มากับลิงก์นี้ แต่ในเครื่องนี้มีการแก้ไขไว้</p><div class="mbtns col"><button class="btn pri" data-res="new">ใช้เวอร์ชันใหม่</button><button class="btn" data-res="keep">เก็บของในเครื่อง</button></div>'), { sticky: true }).then(function (r) {
        if (r === 'new') { replaceTrip(c[0], c[1], false); saveNow(); render(true); }
      });
    });
  }, Promise.resolve());
})();
