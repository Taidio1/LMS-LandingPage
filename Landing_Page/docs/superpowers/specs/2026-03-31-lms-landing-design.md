# LMS Landing Page — Specyfikacja Projektu

**Data:** 2026-03-31  
**Framework:** Astro  
**Motyw:** Tylko Light Mode  
**Styl:** Corporate Clean (Opcja A)  
**Docelowi odbiorcy:** B2B (głównie) + B2C

---

## 1. Design System

### 1.1 Paleta Kolorów

```css
:root {
  /* Backgrounds */
  --bg-primary:         #FAFAFB;   /* główne tło strony */
  --bg-surface:         #FFFFFF;   /* karty, navbar, modale */
  --bg-accent-light:    #EFF6FF;   /* sekcje z subtelnym akcentem B2B */

  /* Brand */
  --brand-accent:       #2563EB;
  --brand-accent-hover: #1D4ED8;

  /* Text */
  --text-primary:       #0F172A;
  --text-secondary:     #64748B;

  /* Borders */
  --border-subtle:      #E2E8F0;

  /* Shadows */
  --shadow-soft:        0 10px 30px -5px rgba(15, 23, 42, 0.04);
  --shadow-hover:       0 20px 40px -10px rgba(15, 23, 42, 0.08);

  /* Transitions */
  --transition-smooth:  all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 1.2 Typografia

- **Font:** `Inter` (Google Fonts, weights: 400, 500, 600, 700, 800)

| Użycie             | Rozmiar | Weight | Letter-spacing |
|--------------------|---------|--------|----------------|
| Hero heading       | 72px    | 800    | -0.03em        |
| H2 (sekcje)        | 48px    | 700    | -0.02em        |
| H3 (karty)         | 24px    | 600    | -0.01em        |
| Body               | 16px    | 400    | 0 / line-height 1.7 |
| Label/badge        | 14px    | 500    | 0.08em (uppercase) |

### 1.3 Spacing & Layout

- **Max-width kontenera:** `1200px`, wycentrowany, `padding: 0 24px`
- **Padding sekcji:** `96px 0` (desktop), `64px 0` (mobile)
- **Border-radius kart:** `16px`
- **Border kart:** `1px solid var(--border-subtle)`

### 1.4 Animacje i Interakcje

| Efekt                  | Opis                                                                 |
|------------------------|----------------------------------------------------------------------|
| **Scroll Reveal**      | `opacity: 0 → 1` + `translateY(30px → 0)`, duration `0.6s`, `cubic-bezier(0.4,0,0.2,1)`, trigger: Intersection Observer |
| **Hover — przyciski**  | `translateY(-2px)` + shadow grow, `transition: 0.3s`                |
| **Hover — karty**      | `translateY(-4px)` + `var(--shadow-hover)`, `transition: 0.3s`      |
| **Animowane liczniki** | Odliczanie od 0 do wartości docelowej przy wejściu sekcji w viewport (Intersection Observer + requestAnimationFrame) |
| **Sticky Scroll**      | Sekcja Features: lewa kolumna scrolluje, prawa `position: sticky; top: 10%` |
| **Mockup transition**  | Płynna zmiana treści mockupa (`opacity transition`) przy scrollowaniu przez bloki Features |
| **Pricing toggle**     | Przełącznik miesięczny/roczny z animacją slide |
| **FAQ Accordion**      | `max-height` transition + rotacja ikony `+/−` |

---

## 2. Struktura Strony

### Sekcja 1 — Navbar

- **Zachowanie:** sticky, `background: #FFFFFF`, `border-bottom: 1px solid var(--border-subtle)`; po scrollowaniu `backdrop-filter: blur(12px)` + lekkie shadow
- **Lewa strona:** `[Logo]` (placeholder SVG) + nazwa `[Nazwa Platformy]`
- **Środek:** linki nawigacyjne — Funkcje | Cennik | Dla firm | Blog
- **Prawa strona:**
  - "Zaloguj się" — ghost button (border `#E2E8F0`, text `#0F172A`)
  - "Rozpocznij za darmo" — primary button (`background: #2563EB`, `color: #FFFFFF`)
- **Mobile:** hamburger icon → drawer z pełną nawigacją i przyciskami CTA

---

### Sekcja 2 — Hero

- **Układ desktop:** 2 kolumny, 60% tekst / 40% mockup
- **Tło:** `#FAFAFB` + subtelny radial gradient `#EFF6FF` za mockupem (bez ostrych krawędzi)

**Lewa kolumna (tekst):**
- Badge/pill: `✦ Platforma edukacyjna dla firm i nie tylko` — mały, `background: #EFF6FF`, `color: #2563EB`, border-radius pełny
- Nagłówek (H1): `Ucz szybciej.\nRośnij pewniej.` — placeholder, 72px, weight 800
- Podtytuł: 1–2 zdania opisujące wartość platformy — `color: var(--text-secondary)`, 18px
- CTA:
  - Primary: "Wypróbuj za darmo" (`background: #2563EB`)
  - Secondary: "Zobacz demo →" (link/ghost, `color: #2563EB`)
- Małe zaufanie pod CTA: ikony awatarów + tekst "Dołącz do X firm, które już uczą z [Nazwa]"

**Prawa kolumna (mockup):**
- Okno dashboardu LMS (placeholder screenshot lub SVG illustration)
- Stylizacja: `border-radius: 16px`, `box-shadow: var(--shadow-hover)`, `transform: rotate(-1.5deg)`
- Dekoracyjne elementy: 2–3 małe floating karty wokół mockupa (np. "✓ Kurs ukończony", "📈 +24% wydajność") z animacją `float` (CSS keyframes)

**Mobile:** stos pionowy, mockup poniżej tekstu, zmniejszony

---

### Sekcja 3 — Social Proof Bar

- **Tło:** `#FFFFFF`, `border-top: 1px solid var(--border-subtle)`, `border-bottom: 1px solid var(--border-subtle)`
- **Padding:** `32px 0`
- **Układ desktop:** flex, space-between
  - Lewa: label "Zaufały nam:" + 4–5 logotypów firm (placeholder szare SVG, `opacity: 0.4`, hover `opacity: 0.7`)
  - Prawa: 3 liczniki animowane
    - `12 000+` Użytkowników
    - `500+` Kursów
    - `98%` Wskaźnik ukończeń
  - Liczniki: duże cyfry `32px weight 700 color: #0F172A` + mały label pod spodem `color: #64748B`

---

### Sekcja 4 — Features / How it Works (Sticky Scroll)

- **Tło:** `#FAFAFB`
- **Układ desktop:** 2 kolumny, `gap: 80px`
  - Lewa kolumna: 4 bloki tekstowe, scrollują normalnie
  - Prawa kolumna: `position: sticky; top: 10vh` — mockup aplikacji, który zmienia zawartość

**4 bloki funkcji (lewa kolumna):**

| # | Ikona | Tytuł | Opis |
|---|-------|-------|------|
| 1 | 🎨 | Tworzenie kursów bez kodu | Drag & drop builder, wideo, quizy, materiały PDF — wszystko w jednym miejscu |
| 2 | 📊 | Śledzenie postępów w czasie rzeczywistym | Dashboard analityczny: ukończenia, wyniki, aktywność kursantów |
| 3 | 🏆 | Certyfikaty i odznaki | Automatyczne wystawianie certyfikatów po ukończeniu kursu |
| 4 | 🔗 | Integracje z Twoimi narzędziami | SSO, Slack, Zapier, API — łączy się z tym, czego już używasz |

**Prawa kolumna (sticky mockup):**
- Ramka przeglądarki/tabletu z ekranem dashboardu
- Zawartość ekranu zmienia się (`opacity: 0 → 1`) gdy odpowiedni blok po lewej jest aktywny (Intersection Observer)
- Każdy blok ma swój widok: builder, analytics, certyfikat, integracje

---

### Sekcja 5 — For Business / For Learners

- **Tło:** `#FFFFFF`
- **Nagłówek sekcji:** "Rozwiązanie dla każdego" (wycentrowany)
- **Układ:** 2 duże karty side-by-side, `gap: 32px`

**Karta lewa — "Dla firm":**
- Tło: `#EFF6FF` (subtelnie wyróżniona — priorytet B2B)
- Border: `1px solid #BFDBFE`
- Nagłówek: "Dla firm i organizacji"
- Lista 5–6 benefitów z ikonką `✓` w kolorze `#2563EB`:
  - Zarządzanie zespołami i uprawnieniami
  - Raportowanie i compliance
  - White-label i własna domena
  - Onboarding nowych pracowników
  - Integracja z HR i SSO
  - Dedykowany opiekun konta
- CTA: "Porozmawiaj z nami" (primary button)

**Karta prawa — "Dla kursantów":**
- Tło: `#FFFFFF`
- Nagłówek: "Dla uczących się"
- Lista 5–6 benefitów:
  - Nauka w swoim tempie
  - Dostęp z każdego urządzenia
  - Certyfikaty uznawane przez pracodawców
  - Interaktywne quizy i zadania
  - Śledzenie własnych postępów
  - Społeczność i forum
- CTA: "Zacznij naukę" (ghost button)

---

### Sekcja 6 — Testimonials

- **Tło:** `#FAFAFB`
- **Nagłówek:** "Co mówią nasi użytkownicy"
- **Układ desktop:** 3 karty w gridzie (`grid-template-columns: repeat(3, 1fr)`)
- **Mobile:** karuzela (swipe touch events, dots pagination) — implementacja vanilla JS, bez zewnętrznych bibliotek

**Struktura karty:**
- Dekoracyjny cudzysłów: `"` — 64px, `color: #2563EB`, `opacity: 0.15`
- Treść opinii: 2–4 zdania, 16px
- Separator
- Avatar: placeholder circle (48px) + inicjały
- Imię + stanowisko + firma: `color: #64748B`

**Hover:** `translateY(-4px)` + `var(--shadow-hover)`

---

### Sekcja 7 — Pricing

- **Tło:** `#FFFFFF`
- **Nagłówek:** "Przejrzyste ceny"
- **Toggle:** Miesięcznie / Rocznie (rocznie = -20%, badge "Oszczędź 20%")
- **Układ:** 3 karty w gridzie

| Plan | Wyróżnienie | Cena | CTA |
|------|-------------|------|-----|
| Basic | brak | [X] zł/mc | "Zacznij za darmo" |
| Pro | `border: 2px solid #2563EB`, badge "Najpopularniejszy", `transform: scale(1.03)` | [Y] zł/mc | "Wybierz Pro" |
| Enterprise | brak | "Skontaktuj się" | "Zapytaj o ofertę" |

**Każdy plan zawiera:**
- Nazwę i krótki opis
- Cenę (dużą, weight 700) + "/miesiąc"
- Listę featuresów: `✓` (included) / `—` (not included)
- CTA button

---

### Sekcja 8 — FAQ

- **Tło:** `#FAFAFB`
- **Nagłówek:** "Najczęstsze pytania"
- **Układ:** pojedyncza kolumna, max-width `720px`, wycentrowana
- **Domyślnie:** pierwsze pytanie otwarte

**Accordion — animacja:**
- `max-height: 0 → 500px` transition (`overflow: hidden`) — uwaga: CSS transitions nie działają z wartością `auto`
- Ikona: `+` rotuje do `×` przy otwarciu (`transform: rotate(45deg)`, duration `0.3s`)
- Border między pytaniami: `1px solid var(--border-subtle)`

**Przykładowe pytania (placeholder):**
1. Jak długo trwa darmowy okres próbny?
2. Czy mogę importować kursy z innych platform?
3. Jakie integracje są dostępne?
4. Czy platforma działa w języku polskim?
5. Jak wygląda wsparcie techniczne?
6. Czy mogę używać własnej domeny?

---

### Sekcja 9 — Final CTA

- **Tło:** `#2563EB` (jedyna sekcja z pełnym kolorem akcentowym)
- **Padding:** `120px 24px`
- **Tło dekoracyjne:** subtelny SVG pattern (kropki lub fale), `opacity: 0.08`, `color: #FFFFFF`
- **Nagłówek:** biały, weight 800, ~56px — placeholder: "Gotowy, żeby zacząć?"
- **Podtytuł:** biały, `opacity: 0.85`, 18px
- **CTA button:** `background: #FFFFFF`, `color: #2563EB`, `font-weight: 700` — "Rozpocznij za darmo"
- **Hover przycisku:** `background: #F8FAFC`, `translateY(-2px)`

---

### Sekcja 10 — Footer

- **Tło:** `#0F172A`
- **Tekst domyślny:** `#94A3B8`
- **Linki hover:** `#FFFFFF`, transition `0.2s`

**Układ — 4 kolumny:**
| Kolumna | Zawartość |
|---------|-----------|
| 1 | `[Logo]` + krótki opis platformy (2 zdania) + ikony social: LinkedIn, Twitter/X, YouTube |
| 2 | **Produkt** — Funkcje, Cennik, Integracje, Changelog |
| 3 | **Firma** — O nas, Blog, Kariera, Kontakt |
| 4 | **Zasoby** — Dokumentacja, API, Status, Pomoc |

**Dolny pasek:**
- `border-top: 1px solid rgba(255,255,255,0.08)`
- Lewa: `© 2026 [Nazwa Platformy]. Wszelkie prawa zastrzeżone.`
- Prawa: "Polityka prywatności" | "Regulamin" | "Cookies"

---

## 3. Struktura Plików (Astro)

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.astro
│   │   └── Footer.astro
│   ├── sections/
│   │   ├── Hero.astro
│   │   ├── SocialProofBar.astro
│   │   ├── Features.astro
│   │   ├── ForBusinessLearners.astro
│   │   ├── Testimonials.astro
│   │   ├── Pricing.astro
│   │   ├── FAQ.astro
│   │   └── FinalCTA.astro
│   └── ui/
│       ├── Button.astro
│       ├── Card.astro
│       └── Badge.astro
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   └── index.astro
└── styles/
    └── global.css     ← zmienne CSS, reset, base styles
```

---

## 4. Wymagania Techniczne

| Wymaganie | Szczegół |
|-----------|----------|
| Framework | Astro (latest stable) |
| CSS | Vanilla CSS z CSS variables — bez Tailwind, bez żadnych frameworków CSS |
| Animacje JS | Vanilla JS — Intersection Observer dla scroll reveal i liczników |
| Sticky Scroll | CSS `position: sticky` + Intersection Observer dla zmiany mockupa |
| Fonty | Google Fonts — Inter (400, 500, 600, 700, 800), ładowane przez `<link>` w `<head>` |
| Responsywność | Mobile-first, breakpointy: `640px`, `768px`, `1024px`, `1280px` |
| Dostępność | Semantyczny HTML5, `alt` na obrazach, `aria-label` na przyciskach, focus styles |
| Placeholder content | Wszystkie texty, obrazy i loga jako `[placeholder]` — agent wypełnia sensownymi przykładami |

---

## 5. Notatki dla Agenta Implementującego

- Użyj placeholderów `[Nazwa Platformy]`, `[Logo]`, `[X] zł`, `[Y] zł` wszędzie tam gdzie brakuje realnych danych
- Mockupy dashboardu LMS: wygeneruj jako stylizowane placeholdery HTML/CSS (ramka przeglądarki z kolorowymi blokami) — nie wymagaj zewnętrznych obrazów
- Floating karty w Hero (np. "✓ Kurs ukończony") implementuj jako absolutnie pozycjonowane `<div>` z animacją CSS `@keyframes float`
- Liczniki animowane: prosta implementacja JS — Intersection Observer + requestAnimationFrame z ease-out
- Social media ikony: użyj prostych SVG inline (brak zewnętrznych bibliotek)
- Logotypy firm: placeholder szare prostokąty SVG z napisem "Logo firmy"
- Zdjęcia/avatary: placeholder circle z inicjałami (CSS generated)
- Cały kod w jednym repozytorium, uruchamialny przez `npm run dev`
