---
title: "Projects"
description: "Open-source Python packages for dynamical systems, nonlinear time-series analysis, reduced-order modelling and real-time data assimilation."
date: 2026-09-20
disableAnchoredHeadings: true
hideAuthor: true
---

Five Python packages, each with its own documentation and executed tutorial
notebooks. echostatenetwork and qlroms also have live demos, embedded below: open
one to try the method without leaving this page.

<div class="projects-grid">

<div class="project">
  <div class="project-body">
    <h2 class="project-name">echostatenetwork</h2>
    <p class="project-desc">Echo state networks in pure numpy: ridge-regression training with chaotic recycle validation, parametric inputs, Bayesian hyperparameter search, closed-loop prediction, and Jacobians for data assimilation. A parallel layout runs one reservoir per patch of a spatially extended system. It is the reservoir core behind qlroms and romda.</p>
    <img class="project-figure" src="echostatenetwork.png" alt="An echo state network unrolled in time: (a) open loop, driven by the data at each step; (b) closed loop, fed back its own prediction" loading="lazy">
    <ul class="project-links">
      <li><a href="https://andreanovoa.github.io/EchoStateNetwork/" target="_blank" rel="noopener noreferrer">Documentation</a></li>
      <li><a href="https://github.com/andreanovoa/EchoStateNetwork" target="_blank" rel="noopener noreferrer">GitHub</a></li>
      <li><a href="https://andreanovoa.github.io/EchoStateNetwork/demo/esn/" target="_blank" rel="noopener noreferrer">Live demo</a></li>
    </ul>
    <details class="project-demo">
      <summary>Live demo: choose the data, the architecture and the hyperparameter search, and get the code that builds the network</summary>
      <iframe class="project-embed" src="https://andreanovoa.github.io/EchoStateNetwork/demo/esn/" loading="lazy" title="echostatenetwork live demo"></iframe>
    </details>
  </div>
</div>

<div class="project">
  <div class="project-body">
    <h2 class="project-name">dynamodels</h2>
    <p class="project-desc">Dynamical-system models behind one interface. A <code>Model</code> couples a governing equation to a pre-allocated state history and a pluggable time integrator: three low-order oscillators, two spatially extended PDEs, and the Lorenz systems.</p>
    <img class="project-figure" src="dynamodels.svg" alt="The Model class, containing a HistoryTracker, an Integrator and an observation operator" loading="lazy">
    <ul class="project-links">
      <li><a href="https://andreanovoa.github.io/dynamodels/" target="_blank" rel="noopener noreferrer">Documentation</a></li>
      <li><a href="https://github.com/andreanovoa/dynamodels" target="_blank" rel="noopener noreferrer">GitHub</a></li>
    </ul>
  </div>
</div>

<div class="project">
  <div class="project-body">
    <h2 class="project-name">ntsa</h2>
    <p class="project-desc">Nonlinear time-series analysis of a dynamical system from a single long trajectory: delay embedding, Lyapunov exponents, and classification of the dynamical regime. The same pipeline runs from measured data alone, with no model equations.</p>
    <img class="project-figure" src="ntsa.png" alt="Eight diagnostic panels for a chaotic Lorenz 63 record, in two rows: time series, power spectrum, delay portrait, return map, Poincare section, recurrence plot, MDS embedding and Lyapunov exponent" loading="lazy">
    <ul class="project-links">
      <li><a href="https://andreanovoa.github.io/ntsa/" target="_blank" rel="noopener noreferrer">Documentation</a></li>
      <li><a href="https://github.com/andreanovoa/ntsa" target="_blank" rel="noopener noreferrer">GitHub</a></li>
    </ul>
  </div>
</div>

<div class="project">
  <div class="project-body">
    <h2 class="project-name">romda</h2>
    <p class="project-desc">Real-time reduced-order modelling and bias-aware data assimilation: ensemble Kalman filters including the regularized bias-aware EnKF, physical and data-driven forecast models, bias estimators, and POD and SPOD decompositions.</p>
    <img class="project-figure" src="romda.gif" alt="Animation of bias-aware data assimilation: biased and unbiased forecasts and analyses converging on the truth as observations arrive" loading="lazy">
    <ul class="project-links">
      <li><a href="https://andreanovoa.github.io/real-time-bias-aware-DA/" target="_blank" rel="noopener noreferrer">Documentation</a></li>
      <li><a href="https://github.com/andreanovoa/real-time-bias-aware-DA" target="_blank" rel="noopener noreferrer">GitHub</a></li>
    </ul>
  </div>
</div>

<div class="project">
  <div class="project-body">
    <h2 class="project-name">qlroms</h2>
    <p class="project-desc">Quantized-local reduced-order models. The state space is partitioned into charts by k-means, each chart gets its own local POD basis, and an exact shared atlas stitches them into one global coordinate system, with the local dynamics advanced by an intrusive Galerkin projection.</p>
    <img class="project-figure" src="qlroms.png" alt="Four-step schematic: data collection, phase-space quantization into charts, local reduced-order model construction, and prediction" loading="lazy">
    <ul class="project-links">
      <li><a href="https://andreanovoa.github.io/qlroms/" target="_blank" rel="noopener noreferrer">Documentation</a></li>
      <li><a href="https://andreanovoa.github.io/qlroms/demo/ks1d/" target="_blank" rel="noopener noreferrer">Live demo</a></li>
    </ul>
    <details class="project-demo">
      <summary>Live demo: move K and r, and watch the charts and the forecast change</summary>
      <iframe class="project-embed" src="https://andreanovoa.github.io/qlroms/demo/ks1d/" loading="lazy" title="qlroms live demo"></iframe>
    </details>
    <details class="project-demo">
      <summary>Interactive tutorial</summary>
      <iframe class="project-embed" src="https://andreanovoa.github.io/qlroms/tutorials/" loading="lazy" title="qlroms tutorials"></iframe>
    </details>
  </div>
</div>

</div>
