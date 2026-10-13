---
title: "Numerical integration"
description: "Numerical integration with Riemann sums, Newton–Cotes rules and Gauss–Legendre quadrature."
summary: "AERO40003 Numerical Methods · Class 3"
date: 2026-10-12
url: "teaching/cnm1/class3"
hideAuthor: true
hideMeta: true
disableAnchoredHeadings: true
hideHeader: true
backLink: "../"
backLabel: "← Back to course"
build:
  list: never
---

<p class="module-context">AERO40003 Computing and Numerical Methods 1 · Class 3</p>

<p>Compare numerical integration rules and see how the choice of nodes and weights affects an approximation.</p>

<div class="module-demos" aria-label="Numerical integration demos">
  <details class="module-demo">
    <summary><svg class="module-demo-icon" viewBox="0 0 96 72" aria-hidden="true"><rect x="14" y="30" width="17" height="34" fill="#767676" opacity=".3"/><rect x="31" y="20" width="17" height="44" fill="#767676" opacity=".3"/><rect x="48" y="24" width="17" height="40" fill="#767676" opacity=".3"/><rect x="65" y="38" width="17" height="26" fill="#767676" opacity=".3"/><line x1="8" y1="64" x2="88" y2="64" stroke="#767676" stroke-width="2"/><path d="M10 40 Q34 8 56 26 T88 40" stroke="#0072B2" stroke-width="3.5" fill="none"/><circle cx="22" cy="30" r="4.5" fill="#D55E00"/><circle cx="40" cy="20" r="4.5" fill="#D55E00"/><circle cx="56" cy="24" r="4.5" fill="#D55E00"/><circle cx="73" cy="38" r="4.5" fill="#D55E00"/></svg><span>Integration rules: Riemann sums, Newton–Cotes and Gauss–Legendre</span></summary>
    <iframe class="module-demo-frame" src="rules.html" title="Integration rules demo" loading="lazy"></iframe>
  </details>
  <details class="module-demo">
    <summary><svg class="module-demo-icon" viewBox="0 0 96 72" aria-hidden="true"><path d="M10 10 L86 40" stroke="#767676" stroke-width="3" stroke-dasharray="6 5" fill="none"/><path d="M10 14 L86 56" stroke="#009E73" stroke-width="3" fill="none"/><path d="M10 16 L60 66" stroke="#0072B2" stroke-width="3" fill="none"/><path d="M10 18 Q24 30 32 66" stroke="#D55E00" stroke-width="3" fill="none"/></svg><span>Convergence: error against the number of strips</span></summary>
    <iframe class="module-demo-frame" src="convergence.html" title="Numerical integration convergence demo" loading="lazy"></iframe>
  </details>
</div>

<script src="../module-demos.js"></script>
