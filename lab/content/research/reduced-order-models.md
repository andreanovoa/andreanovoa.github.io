---
title: "Reduced-order models & scientific ML"
weight: 3
blurb: "Autoencoders, reservoir computers and transformers, built to be forecast-stable and interpretable rather than merely accurate."
publications:
  - "ozalp-cae-esn"
  - "eze-lamp"
  - "zighed-rom"
  - "novoa-online-esn"
---

Real-time assimilation needs a surrogate that runs far faster than the system it represents. Data-driven reduced-order models are the natural candidate: compress the state onto a low-dimensional latent space, then learn the dynamics there.

Two properties matter more for deployment than raw accuracy.

**Numerical stability.** A latent model of a chaotic system can blow up or fall onto a spurious attractor. We formulate echo state networks as state-space models so that a filter can correct the latent state directly, which stabilises the forecast.

**Interpretability.** If a model reconstructs a flow, we want to know what it used. In LAMP, the learned attention matrix doubles as an optimal sensor-placement map — the model tells you where to measure.

We also work on parameterised ROMs that adapt to regimes they were not trained on, retraining only the part that actually degrades.

