---
title: "Reduced-order models, scientific ML & control"
weight: 3
aliases: ["/research/control/"]
image: "img/pubs/da-cae-esn.gif"
imageAlt: "Animation of a convolutional autoencoder and echo state network with an ensemble Kalman filter in the latent space"
imageCaption: "A convolutional autoencoder compresses the flow; an echo state network forecasts in the latent space, where an ensemble Kalman filter assimilates sparse data (Özalp, Nóvoa & Magri, *Comput. Methods Appl. Mech. Eng.*, 2026)."
blurb: "Forecast-stable, interpretable reduced-order models, and control of systems that are only partially observed."
publications:
  - "ozalp-cae-esn"
  - "eze-lamp"
  - "zighed-rom"
  - "novoa-online-esn"
  - "ozan-damirl"
  - "ozan-mbrl"
---

Real-time assimilation needs a model that runs far faster than the system it represents. Data-driven reduced-order models are the natural candidate: compress the state onto a low-dimensional latent space, then learn the dynamics there.

Two properties matter more for deployment than raw accuracy.

**Numerical stability.** A latent model of a chaotic system can blow up or fall onto a spurious attractor. We formulate echo state networks as state-space models so that a filter can correct the latent state directly, which stabilises the forecast.

**Interpretability.** If a model reconstructs a flow, we want to know what it used. In LAMP, the learned attention matrix doubles as an optimal sensor-placement map — the model tells you where to measure.

We also work on parameterised ROMs that adapt to regimes they were not trained on, retraining only the part that actually degrades.

## Control of partially observed systems

Once a state can be estimated from partial observations, it can be acted upon. Model-free reinforcement learning learns a control policy by interacting with a system, and typically assumes it can observe the full state. In a laboratory or a plant, sensors give a handful of noisy, partial measurements instead.

<figure class="figure">
  <img src="/img/research/control-loop.png" alt="Vorticity of the wake behind a cylinder with two jets, four probes in the wake, and a loop from the probes through an ensemble estimate and a policy back to the jets" loading="lazy">
  <figcaption>Closing the loop on the wake of a cylinder at Re = 100: four probes feed an ensemble estimate of the flow, and the policy π drives the jets on the cylinder.</figcaption>
</figure>

Our approach is to put an estimator between the two. A low-order model, corrected in real time by data assimilation, supplies the full-state estimate that the agent needs; the agent acts on the ensemble mean rather than on a state nobody can measure.

This makes the control problem tractable with the observability that real systems actually have, and it separates concerns cleanly: the estimator handles the physics and the noise, the agent handles the policy.
