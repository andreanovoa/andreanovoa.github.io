---
title: "Dynamical systems & nonlinear time-series analysis"
weight: 6
blurb: "Characterizing a system before modelling it: delay embeddings, Lyapunov exponents and regime classification, from the equations or from data alone."
publications:
  - "magri-chapter"
---

Before a system can be forecast, reduced or assimilated, it is worth knowing what kind of system it is. A record that looks irregular may be chaotic, quasiperiodic, or a limit cycle sampled too coarsely, and each case sets a different ceiling on what any model can predict.

We characterize dynamical systems from a single long trajectory: **delay embedding** to reconstruct the attractor, with an optimal lag and a false-nearest-neighbours dimension; **Lyapunov exponents**, for the leading rate, the full Benettin spectrum and the Kaplan–Yorke dimension; and **regime classification** into fixed point, limit cycle, frequency locking, quasiperiodicity or chaos, swept across a parameter to recover the bifurcation structure.

Two things make this a working tool rather than a diagnostic afterthought. The leading exponent fixes the Lyapunov time, which is the unit every real-time forecast in the group is measured in — a digital twin earns its name only if it stays synchronised for a useful number of them. And the same pipeline runs on a measured record with no governing equations at all, which is the situation in front of an experiment.

The canonical systems this is built against are the ones the rest of the group's work also uses: Lorenz 63 and 96, the Van der Pol oscillator, the Rijke tube and annular thermoacoustic low-order models, and the Kuramoto–Sivashinsky equation in one and two dimensions.

## Software

Both packages are open source and archived with a citable DOI.

- [**dynamodels**](https://github.com/andreanovoa/dynamodels) — the models. A `Model` couples a governing equation to a pre-allocated state history and a pluggable integrator, so every system above presents the same interface. [Documentation](https://andreanovoa.github.io/dynamodels/)
- [**ntsa**](https://github.com/andreanovoa/ntsa) — the analysis. Embeddings, Lyapunov exponents, regime classification and bifurcation sweeps for any model that follows the `dynamodels` protocol, or for a measured series on its own. [Documentation](https://andreanovoa.github.io/ntsa/)
