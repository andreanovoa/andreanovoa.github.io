---
title: "Pocha"
description: "Marcador para el juego de la pocha con la baraja española. Scoreboard for the Spanish card game pocha."
showToc: false
disableAnchoredHeadings: true
hideAuthor: true
pwa: true
hideHeader: true
---

<link rel="stylesheet" href="/pocha/app.css">

<header class="pocha-banner" aria-label="Pocha">
<div class="suit-hand" aria-hidden="true">
<span class="suit-card"><svg viewBox="0 0 64 64"><title>Oros</title><circle cx="32" cy="32" r="28" fill="#a07018"/><circle cx="32" cy="32" r="25" fill="#e3b23c"/><circle cx="32" cy="32" r="17" fill="none" stroke="#a07018" stroke-width="2.5"/><g stroke="#a07018" stroke-width="2.5" stroke-linecap="round"><path d="M40 32H47M37.7 37.7L42.6 42.6M32 40V47M26.3 37.7L21.4 42.6M24 32H17M26.3 26.3L21.4 21.4M32 24V17M37.7 26.3L42.6 21.4"/></g><circle cx="32" cy="32" r="6" fill="#f6d678" stroke="#a07018" stroke-width="2"/></svg></span>
<span class="suit-card"><svg viewBox="0 0 64 64"><title>Copas</title><g stroke="#7a0f1f" stroke-width="2" stroke-linejoin="round"><path d="M14 12H50C50 30 42 38 32 38C22 38 14 30 14 12Z" fill="#c8102e"/><rect x="29" y="38" width="6" height="12" fill="#c8102e"/><ellipse cx="32" cy="44" rx="5.5" ry="3" fill="#e3b23c"/><path d="M17 58C19 51 25 49 32 49C39 49 45 51 47 58Z" fill="#c8102e"/><ellipse cx="32" cy="12" rx="18" ry="4" fill="#e8435a"/></g><path d="M16.5 21C26 24.5 38 24.5 47.5 21" fill="none" stroke="#e3b23c" stroke-width="3" stroke-linecap="round"/></svg></span>
<span class="suit-card"><svg viewBox="0 0 64 64"><title>Espadas</title><g stroke="#1f3f73" stroke-width="2" stroke-linejoin="round"><path d="M32 3L37.5 11L36 44H28L26.5 11Z" fill="#4a7fc1"/><rect x="29" y="48" width="6" height="9" fill="#1f3f73"/><rect x="17" y="43.5" width="30" height="5.5" rx="2.75" fill="#e3b23c"/><circle cx="32" cy="59.5" r="3.5" fill="#e3b23c"/></g><path d="M32 12V41" stroke="#a9c6ec" stroke-width="2" stroke-linecap="round"/></svg></span>
<span class="suit-card"><svg viewBox="0 0 64 64"><title>Bastos</title><g stroke="#24561c" stroke-width="2" stroke-linejoin="round"><circle cx="21.5" cy="20" r="3.5" fill="#6fb355"/><circle cx="43" cy="31" r="3.5" fill="#6fb355"/><circle cx="24" cy="42" r="3" fill="#6fb355"/><path d="M26 61C25 46 22 26 21 13C20.5 6.5 26.5 3 32 3C37.5 3 43.5 6.5 43 13C42 26 39 46 38 61Z" fill="#4f9a3b"/></g><path d="M29 12C29.5 24 30 38 30.5 52M35.5 16C35.2 26 34.8 36 34.5 46" fill="none" stroke="#2f6b25" stroke-width="1.6" stroke-linecap="round"/><path d="M26 61H38" stroke="#e3b23c" stroke-width="3" stroke-linecap="round"/></svg></span>
</div>
<div class="banner-text">
<h1>Pocha</h1>
<p>Marcador · Scoreboard</p>
</div>
</header>

<div class="pocha" id="pocha-app">
  <noscript>Esta página necesita JavaScript para llevar el marcador. · This page needs JavaScript to keep the score.</noscript>
</div>

<script src="/pocha/i18n.js"></script>
<script src="/pocha/firebase-config.js"></script>
<script src="/pocha/cloud.js"></script>
<script src="/pocha/app.js" defer></script>
