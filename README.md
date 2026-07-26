<div align="center">

# THAI ช่วยคิด

**เครื่องคำนวณและสมุดบันทึกสิทธิ์ "ไทยช่วยไทย 60/40"**
A client-side React PWA that helps Thai citizens calculate and track their
ไทยช่วยไทย 60/40 co-payment spending. Data never leaves your device.

</div>

## ✨ Features

- **ตั้งค่าสิทธิ์ (Smart onboarding)** — enter your current สิทธิ์คงเหลือเดือนนี้ and
  สิทธิ์คงเหลือวันนี้, and opt in to logging. The daily limit is capped at **฿200**
  in line with the program.
- **คำนวณการใช้จ่าย (Core calculator)** — enter a price on the on-screen NumPad
  and see the **รัฐช่วยจ่าย 60% / คุณจ่ายเอง 40%** split live, with a clear warning
  when a purchase exceeds your remaining subsidy (excess charged 100% to you).
- **ประวัติการใช้สิทธิ์ (Transaction log)** — remaining daily/monthly balances
  update automatically from logged purchases; add back-dated entries you forgot.
- **คำนวณความคุ้มค่า (Strategic tools)** —
  *ใช้สิทธิ์ให้คุ้มที่สุด* (minimum price to max out today's subsidy) and
  *มีเงินเท่านี้ ซื้อได้เท่าไหร่* (how much you can afford with cash + subsidy).

## 🔒 Privacy

100% client-side. All state and logs are persisted in the browser via
`localStorage`. There is **no backend and no database** — nothing is ever sent to
a server.

## 🎨 Design

Mobile-first and built for clarity. On desktop it renders as a centered 480px
card. Thai-only interface, zero dropdowns (big
segmented controls + NumPad), **Prompt** + **Kanit** typography, and a compact
Thai-tricolor logo mark.

## 🧱 Tech stack

| | |
|---|---|
| Framework | React 18 + Vite |
| State | Zustand (`persist` → localStorage) |
| Styling | Plain CSS with brand tokens |
| PWA | vite-plugin-pwa (installable, offline) |
| Deploy | GitHub Pages (`gh-pages`) |

## 🚀 Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # preview the production build
npm run deploy    # build + publish to GitHub Pages
```

## 🧮 The 60/40 rule

The government subsidizes **60%** of an item's price and the user pays **40%**.
The government share can never exceed the **remaining daily** or **remaining
monthly** subsidy cap; any amount beyond what the subsidy covers is charged
100% to the user. All domain logic (plus the two strategic calculators) lives in
[`src/lib/calc.js`](src/lib/calc.js) and is covered by unit checks.

## 📄 License

Apache-2.0 — see [`LICENSE`](LICENSE).
