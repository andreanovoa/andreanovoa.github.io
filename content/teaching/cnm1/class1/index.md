---
title: "How computers count"
description: "Binary representation, floating-point arithmetic, rounding and error propagation."
summary: "AERO40003 Numerical Methods · Class 1"
date: 2026-10-12
url: "teaching/cnm1/class1"
hideAuthor: true
hideMeta: true
disableAnchoredHeadings: true
hideHeader: true
backLink: "../"
backLabel: "← Back to course"
build:
  list: never
---

<p class="module-context">AERO40003 Computing and Numerical Methods 1 · Class 1</p>

<p>Interactive demos for how computers store numbers: write a number in any base, convert to binary step by step, take a floating-point number apart bit by bit, and see how rounding errors arise and propagate.</p>

<div class="module-demos" aria-label="Computer arithmetic demos">
  <details class="module-demo">
    <summary><svg class="module-demo-icon" viewBox="0 0 96 72" aria-hidden="true"><rect x="10" y="12" width="11.5" height="16" rx="2" fill="none" stroke="#0072B2" stroke-width="2.2"/><rect x="23" y="12" width="11.5" height="16" rx="2" fill="#0072B2" opacity=".35" stroke="#0072B2" stroke-width="2.2"/><rect x="36" y="12" width="11.5" height="16" rx="2" fill="#0072B2" opacity=".35" stroke="#0072B2" stroke-width="2.2"/><rect x="49" y="12" width="11.5" height="16" rx="2" fill="none" stroke="#0072B2" stroke-width="2.2"/><rect x="62" y="12" width="11.5" height="16" rx="2" fill="#0072B2" opacity=".35" stroke="#0072B2" stroke-width="2.2"/><rect x="75" y="12" width="11.5" height="16" rx="2" fill="none" stroke="#0072B2" stroke-width="2.2"/><rect x="10" y="34" width="37.5" height="14" rx="2" fill="#009E73" opacity=".3" stroke="#009E73" stroke-width="2.2"/><rect x="49" y="34" width="37.5" height="14" rx="2" fill="#009E73" opacity=".3" stroke="#009E73" stroke-width="2.2"/><rect x="10" y="54" width="76.5" height="12" rx="2" fill="#CC79A7" opacity=".3" stroke="#CC79A7" stroke-width="2.2"/></svg><span>What is a base? A number in any base</span></summary>
    <iframe class="module-demo-frame" src="bases.html" title="Number bases demo" loading="lazy"></iframe>
  </details>
  <details class="module-demo">
    <summary><svg class="module-demo-icon" viewBox="0 0 96 72" aria-hidden="true"><rect x="10" y="22" width="14" height="22" rx="2" fill="none" stroke="#0072B2" stroke-width="2.5"/><rect x="27" y="22" width="14" height="22" rx="2" fill="#0072B2" opacity=".35" stroke="#0072B2" stroke-width="2.5"/><rect x="44" y="22" width="14" height="22" rx="2" fill="#0072B2" opacity=".35" stroke="#0072B2" stroke-width="2.5"/><rect x="61" y="22" width="14" height="22" rx="2" fill="none" stroke="#0072B2" stroke-width="2.5"/><path d="M14 56H86" stroke="#767676" stroke-width="2"/><path d="M80 14V48" stroke="#D55E00" stroke-width="3"/><circle cx="80" cy="14" r="4" fill="#D55E00"/></svg><span>Decimal to binary, and integer storage</span></summary>
    <iframe class="module-demo-frame" src="converter.html" title="Decimal to binary converter demo" loading="lazy"></iframe>
  </details>
  <details class="module-demo">
    <summary><svg class="module-demo-icon" viewBox="0 0 96 72" aria-hidden="true"><rect x="8" y="24" width="8" height="22" fill="#D55E00"/><rect x="18" y="24" width="24" height="22" fill="#009E73"/><rect x="44" y="24" width="44" height="22" fill="#0072B2"/><path d="M8 58H88" stroke="#767676" stroke-width="2"/><path d="M16 54V62M28 54V62M52 54V62M88 54V62" stroke="#767676" stroke-width="2"/></svg><span>Floating-point explorer: IEEE 754 single and double</span></summary>
    <iframe class="module-demo-frame" src="float.html" title="Floating-point explorer demo" loading="lazy"></iframe>
  </details>
  <details class="module-demo">
    <summary><svg class="module-demo-icon" viewBox="0 0 96 72" aria-hidden="true"><path d="M8 40H88" stroke="#767676" stroke-width="2"/><path d="M18 32V48M48 32V48M78 32V48" stroke="#767676" stroke-width="2"/><circle cx="57" cy="40" r="5" fill="#009E73"/><path d="M57 26L48 26" stroke="#D55E00" stroke-width="3"/><circle cx="48" cy="26" r="4" fill="#D55E00"/><rect x="20" y="54" width="40" height="6" fill="#0072B2" opacity=".6"/><rect x="34" y="62" width="44" height="6" fill="#D55E00" opacity=".6"/></svg><span>Rounding, chopping and error propagation</span></summary>
    <iframe class="module-demo-frame" src="rounding.html" title="Rounding, chopping and error propagation demo" loading="lazy"></iframe>
  </details>
</div>

<script src="../module-demos.js"></script>
