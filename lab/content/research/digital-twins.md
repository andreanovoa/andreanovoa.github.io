---
title: "Real-time digital twins"
weight: 1
blurb: "Physical models corrected on the fly by streaming sensor data, so that a simulation and the system it mirrors stay synchronised."
publications:
  - "novoa-digital-twin"
  - "novoa-rt-thermo"
  - "novoa-ctr"
---

A digital twin is only a twin if it stays synchronised with the physical system. A model left to run on its own drifts away within a few characteristic times — in a chaotic flow, almost immediately.

We close the loop. As measurements arrive from sensors, they are assimilated into the model, which is corrected and continues forecasting until the next batch. The loop has to be fast enough to keep up with the experiment, which constrains both the model and the estimator: the surrogate must be cheap, and the update must be sequential rather than a full re-solve.

We demonstrated this on azimuthal thermoacoustic instabilities in an annular combustor, using experimental microphone data, inferring the state, the parameters and the model bias while the rig was running.

