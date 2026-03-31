# Ascent LMS — Redesign Spec (Bold Gradient SaaS)

**Data:** 2026-03-31  
**Framework:** Astro  
**Styl:** Bold Gradient SaaS (Opcja B)  
**Motyw:** Light Mode z gradientami fiolet→indygo→niebieski  
**Cel:** Wyeliminowanie "template feel" — strona ma być premium + dynamiczna

---

## 1. Identyfikacja Wizualna — Ascent

### Nazwa
**Ascent** — nawiązuje do wznoszenia się, wzrostu, osiągania celów.

### Logo
- Symbol: geometryczna strzałka w górę zbudowana z dwóch nakładających się rombów/chevronów
- Wordmark: "Ascent" — Inter 700, letter-spacing -0.02em
- Wariant jasny: symbol w gradiencie (#7C3AED → #2563EB) + tekst #0F172A
- Wariant na ciemnym tle: symbol biały + tekst biały
- Wymiary: 32×32px symbol + wordmark

### Tagline
*"Ucz szybciej. Rośnij pewniej."* — zachowany

---

## 2. Design System

### 2.1 Paleta Kolorów

```css
:root {
  /* Gradient brand */
  --gradient-start:     #7C3AED;   /* fiolet */
  --gradient-mid:       #4F46E5;   /* indygo */
  --gradient-end:       #2563EB;   /* niebieski */
  --gradient-brand:     linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #2563EB 100%);
  --gradient-brand-text: linear-gradient(135deg, #7C3AED, #2563EB);

  /* Backgrounds */
  --bg-primary:         #F8FAFF;   /* cieplejszy off-white z nutą niebieskiego */
  --bg-surface:         #FFFFFF;
  --bg-tinted:          #F0F4FF;   /* tło sekcji testimoniali */

  /* Brand solid (fallback / buttons) */
  --brand-accent:       #4F46E5;
  --brand-accent-hover: #4338CA;

  /* Text */
  --text-primary:       #0F172A;
  --text-secondary:     #64748B;

  /* Borders */
  --border-subtle:      #E2E8F0;
  --border-brand:       rgba(99,102,241,0.3);

  /* Shadows */
  --shadow-soft:        0 10px 30px -5px rgba(79,70,229,0.08);
  --shadow-hover:       0 20px 40px -10px rgba(79,70,229,0.15);
  --shadow-glow:        0 0 40px rgba(124,58,237,0.2);

  /* Transitions */
  --transition:         all 0.3s cubic-bezier(0.4,0,0.2,1);
  --radius:             16px;
  --radius-btn:         10px;
  --max-w:              1200px;
}
```

### 2.2 Typografia

- **Font:** Inter (zachowany), weights: 400, 500, 600, 700, 800, 900
- **Hero H1:** `clamp(52px, 7vw, 84px)`, weight 900, letter-spacing -0.04em
- **Gradient text:** kluczowe słowa w H1 dostają `background: var(--gradient-brand-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent`
- **Section titles:** `clamp(36px, 5vw, 56px)`, weight 800, letter-spacing -0.03em
- **H3 karty:** 20–22px, weight 700
- **Body:** 16px, line-height 1.7
- **Micro-labels:** 12–13px, weight 600, letter-spacing 0.06em, uppercase

### 2.3 Gradient Text Helper
Klasa `.gradient-text` w global.css:
```css
.gradient-text {
  background: var(--gradient-brand-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 2.4 Gradient Button
Klasa `.btn-gradient`:
```css
.btn-gradient {
  background: var(--gradient-brand);
  color: #fff;
  border-radius: var(--radius-btn);
  padding: 14px 28px;
  font-weight: 600;
  font-size: 15px;
  transition: var(--transition);
  box-shadow: 0 4px 20px rgba(79,70,229,0.35);
}
.btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(79,70,229,0.45);
}
```

### 2.5 Animacje
Zachowane z poprzedniej wersji:
- Scroll Reveal: `opacity 0→1 + translateY(30→0)`, 0.6s, cubic-bezier
- Float badges: CSS `@keyframes float`
- Counter animation: Intersection Observer + rAF
- Sticky scroll (Features): zachowany

---

## 3. Layouty Sekcji

### Navbar

**Zmiany względem obecnej wersji:**
- Logo: zastąpić placeholder SVG geometrycznym symbolem Ascent (chevron/diament) + wordmark "Ascent" z gradient text
- Tło startu: `rgba(248,250,255,0)` — przeźroczyste, pojawia się przy scrollu
- Po scrollu: `rgba(248,250,255,0.9)` + `backdrop-filter: blur(16px)` + subtelny border-bottom
- Aktywny/hover link: gradient underline (2px) zamiast background fill
- CTA "Rozpocznij za darmo": `.btn-gradient` zamiast solid blue

---

### Hero

**Tło:**
- Duże rozmyte blobs (position: absolute, pointer-events: none):
  - Blob lewy-górny: `background: radial-gradient(circle, rgba(124,58,237,0.15), transparent 60%)`, 600×600px
  - Blob prawy-dolny: `background: radial-gradient(circle, rgba(37,99,235,0.12), transparent 60%)`, 500×500px
- Tło bazowe: `var(--bg-primary)`

**Lewa kolumna:**
- Badge: gradient border + gradient tekst zamiast plain blue
- H1: "Ucz szybciej." normalny + `<br>` + `<span class="gradient-text">Rośnij pewniej.</span>`
- Podtytuł: bez zmian
- CTA Primary: `.btn-gradient` — "Wypróbuj za darmo"
- CTA Secondary: ghost z gradient border-bottom on hover
- Trust: zachowane (avatary + "1 200+ firm")

**Prawa kolumna (mockup) — GRUNTOWNA POPRAWA:**
Zamiast anonimowych szarych bloków, mockup zawiera:
- Sidebar z ikonami (nie puste prostokąty)
- Header z tekstem "Panel główny" i datą
- Stat karty z: "847 Kursantów", "23 Kursy", "94% Ukończeń"  
- Progress rows z nazwami kursów: "Onboarding 2024" (72%), "Excel dla HR" (45%), "Compliance Q1" (89%)
- Kolory stat kart: gradient fills zamiast plain pastel

**Floating badges:**
- Badge 1: ✓ "Kurs ukończony!" — zielony, lepszy cień
- Badge 2: 📈 "+24% wydajność" — niebieski, lepszy cień
- Oba z `border-radius: 12px` (nie pill) dla bardziej "UI" wyglądu

---

### SocialProofBar

**Zmiany:**
- Cyfry liczników: `.gradient-text` zamiast plain `#0F172A`
- Logo placeholders: zamiast anonimowych prostokątów — stylizowane "logo karty" z inicjałami firm i subtelnymi kolorami tła
- Linia oddzielająca między logos a stats: `border-left: 1px solid var(--border-subtle)`

---

### Features

**Zmiana layoutu: Sticky Scroll → 2×2 Grid Cards**

Każda z 4 kart (układ: 2 kolumny × 2 rzędy):
- Padding: 36px
- Border: `1px solid var(--border-subtle)`
- Border-radius: var(--radius)
- Gradient ikona: tło ikony to gradient (nie plain `#EFF6FF`)
- Na hover: gradient border pojawia się (`border-color: transparent` → gradient via `border-image`)
- Dół karty: mini mockup-preview — kolorowy blok 120px wysokości z subtelnymi elementami UI

Sticky scroll layout zastępujemy całkowicie layoutem 2×2. Usuwamy kod Intersection Observer dla Features — nie jest potrzebny w nowym layoucie.

---

### ForBusiness / ForLearners

**Zmiany:**
- Karta Business: `border: 2px solid transparent; background-image: linear-gradient(white,white), var(--gradient-brand); background-clip: padding-box, border-box` — gradient border
- Karta Learners: prosta biała z `var(--shadow-soft)` na hover
- Ikony: lepsze SVG, większe (36px w 60px kontenerze)
- CTA Business: `.btn-gradient`
- CTA Learners: outline z gradient text on hover

---

### Testimonials

**Zmiany:**
- Tło sekcji: `var(--bg-tinted)` (#F0F4FF) — wyróżnienie od sąsiednich sekcji
- Każda karta: `border-left: 4px solid #7C3AED` (gradient nie działa na border w CSS bez tricku — używamy solid fiolet jako kolor akcentu)
- ⭐⭐⭐⭐⭐ gwiazdki (5 gwiazdek) nad treścią opinii — kolor: `#F59E0B`
- Cudzysłów: gradient text zamiast `opacity: 0.15`
- Avatar: kolorowe tła zachowane

---

### Pricing

**Zmiany:**
- Plan Pro (featured): gradient tło `var(--gradient-brand)` — biały tekst, biała lista ficzerów
- Badge "Najpopularniejszy": biały tekst na gradient tle (nie odwrotnie)
- Plan Basic i Enterprise: białe karty, `border: 1px solid var(--border-subtle)`
- Hover na kartach Basic/Enterprise: `border-color: var(--border-brand)`
- Toggle miesięczny/roczny: po włączeniu rocznie — kolor toggle zmienia się na gradient
- CTA Pro: biały przycisk (`background: #fff`, `color: #4F46E5`, `font-weight: 700`) — kontrastuje z gradient tłem karty

---

### FAQ

**Zmiany:**
- Ikona toggle: chevron SVG zamiast `+` — obraca się 180° przy otwarciu
- Otwarte pytanie: tekst pytania dostaje `.gradient-text`
- Tło: `var(--bg-surface)` dla odróżnienia od sąsiednich sekcji
- Bardziej widoczny separator między pytaniami

---

### FinalCTA

**Zmiany:**
- Tło: `var(--gradient-brand)` (135deg) zamiast solid `#2563EB`
- Efekt "noise/mesh" overlay: SVG turbulence filter, opacity 0.04 — subtelna tekstura
- Glow za przyciskiem: `box-shadow: var(--shadow-glow)`
- Przycisk: biały z gradient tekstem (nie plain `color: #2563EB`)
- Podtytuł: `rgba(255,255,255,0.9)` — bez zmian
- Nuta: "Bez karty kredytowej · 14 dni za darmo · Anuluj kiedy chcesz" — zachowana

---

### Footer

**Bez większych zmian strukturalnych** — zachować ciemne tło `#0F172A`.
Logo Ascent w wariancie jasnym (białe).

---

## 4. Wymagania Techniczne

| Wymaganie | Szczegół |
|-----------|----------|
| Framework | Astro |
| CSS | Vanilla CSS z CSS variables — bez Tailwind |
| Animacje JS | Vanilla JS — Intersection Observer |
| Fonty | Google Fonts — Inter (400–900) |
| Responsywność | Breakpointy: 640px, 768px, 1024px |
| Dostępność | Semantyczny HTML5, aria-label, focus styles |
| Gradient text | `-webkit-background-clip: text` z fallback color |

---

## 5. Kolejność Implementacji

1. `global.css` — zaktualizować zmienne, dodać `.gradient-text`, `.btn-gradient`
2. `Navbar.astro` — logo Ascent, frosted glass, gradient CTA
3. `Hero.astro` — gradient blobs, gradient text H1, nowy mockup dashboard
4. `SocialProofBar.astro` — gradient cyfry, lepsze logo placeholders
5. `Features.astro` — nowy 2×2 grid layout
6. `ForBusinessLearners.astro` — gradient border karta Business
7. `Testimonials.astro` — gwiazdki, gradient border-left, tło sekcji
8. `Pricing.astro` — gradient karta Pro
9. `FAQ.astro` — chevron ikona, gradient text na otwartym
10. `FinalCTA.astro` — gradient tło, glow przycisk
11. `Button.astro` — dodać wariant gradient
12. `Footer.astro` — logo Ascent jasny wariant
