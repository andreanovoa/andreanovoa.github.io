---
title: "AERO40003 Computing and Numerical Methods 1: Numerical Methods"
date: 2026-10-12
summary: "Interactive demos for the numerical-methods part of AERO40003 (first year, Aeronautics, Imperial College London): computer arithmetic, root finding, numerical integration, and interpolation."
url: "teaching/cnm1"
cover:
    image: "cnm1.png"
    alt: "Cobweb diagrams of fixed-point iteration: monotonic convergence, oscillatory convergence and divergence"
    relative: true
hideAuthor: true
disableAnchoredHeadings: true
---

First-year module, Department of Aeronautics, Imperial College London. Four classes on
the numerical methods engineers use when an equation has no closed-form solution. Each
class has interactive demos: step through every iteration, change the inputs, and
compare the methods. The lecture slides and notes are on Blackboard.

<div class="projects-grid">

<div class="project">
  <div class="project-body">
    <h2 class="project-name">1. How computers count</h2>
    <p class="project-desc">Binary representation, integer and floating-point storage, rounding and chopping, overflow and underflow, and how errors propagate through a calculation.</p>
    <ul class="project-links">
      <li>Demos coming soon</li>
    </ul>
  </div>
</div>

<div class="project">
  <div class="project-body">
    <h2 class="project-name">2. Solving unsolvable equations</h2>
    <p class="project-desc">Root finding: bisection, Newton–Raphson, the secant method and fixed-point iteration, with their convergence and failure modes.</p>
    <img class="project-figure" src="class2.gif" alt="Fixed-point iteration drawn as cobweb diagrams for x = sin x and x = cos x" loading="lazy">
    <ul class="project-links">
      <li><a href="class2/" target="_blank" rel="noopener noreferrer">Interactive demos</a></li>
    </ul>
    <details class="project-demo">
      <summary>Open the demos here: bisection, Newton, secant, cobweb diagrams and a comparison of all four</summary>
      <iframe class="project-embed" src="class2/" loading="lazy" title="Root-finding demos"></iframe>
    </details>
  </div>
</div>

<div class="project">
  <div class="project-body">
    <h2 class="project-name">3. Integrating unintegrable functions</h2>
    <p class="project-desc">Numerical integration: Riemann sums, the trapezium rule, Simpson's rule, Newton–Cotes formulae and Gauss–Legendre quadrature.</p>
    <ul class="project-links">
      <li>Demos coming soon</li>
    </ul>
  </div>
</div>

<div class="project">
  <div class="project-body">
    <h2 class="project-name">4. Curve fitting and interpolation</h2>
    <p class="project-desc">Polynomial interpolation in the monomial, Newton and Lagrange forms, why they give the same polynomial, and cubic splines.</p>
    <ul class="project-links">
      <li>Demos coming soon</li>
    </ul>
  </div>
</div>

</div>
