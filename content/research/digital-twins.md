---
title: "Real-time digital twins of turbulent and reacting flows"
weight: 1
aliases: ["/research/applications/"]
image: "img/research/digital-twin-loop.png"
imageAlt: "A physical combustor and its digital replica, joined by two arrows in a loop"
imageCaption: "A physical system and its digital twin: measurements flow from the system to the model, and the corrected model informs decisions on the system."
blurb: "Physical models corrected on the fly by streaming sensor data, from thermoacoustics to wakes, wind farms and urban flows."
publications:
  - "novoa-digital-twin"
  - "novoa-rt-thermo"
  - "novoa-ctr"
  - "perez-cuadrado-nearwall"
  - "bombardi-urban"
---

A digital twin is only a twin if it stays synchronised with the physical system. A model left to run on its own drifts away within a few characteristic times — in a chaotic flow, almost immediately.

We close the loop. As measurements arrive from sensors, they are assimilated into the model, which is corrected and continues forecasting until the next batch. The loop has to be fast enough to keep up with the experiment, which constrains both the model and the estimator: the model must be cheap, and the update must be sequential rather than a full re-solve.

We demonstrated this on azimuthal thermoacoustic instabilities in an annular combustor, using experimental microphone data, inferring the state, the parameters and the model bias while the rig was running.

## Applications

Methods are developed against canonical systems where the truth is known — the Kuramoto–Sivashinsky equation, Kolmogorov flow, low-order thermoacoustic models — and then tested where it is not.

<figure class="figure">
  <img src="/img/research/flows-wake.png" alt="Vorticity of the turbulent wake behind a mesh, with a sparse grid of probes" loading="lazy">
  <figcaption>Vorticity in the turbulent wake behind a mesh, from large-eddy simulation, with the sparse probes that a digital twin assimilates.</figcaption>
</figure>

**Thermoacoustics.** Combustion instabilities in annular combustors, using experimental pressure data from rigs at ETH Zürich and NTNU.

**Wakes and wind farms.** Bluff-body and cylinder wakes as testbeds for flow reconstruction; wind farm wake estimation and time-resolved wake interaction as ongoing student projects.

**Near-wall turbulence.** Interpretable reduced-order models for real-time estimation close to the wall.

**Urban flows.** Inference of turbulence-model parameters for pollutant dispersion in cities, transferable between geometries.

Code and data are released with the papers.
