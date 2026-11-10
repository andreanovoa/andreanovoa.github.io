---
title: "Control of partially observed systems"
weight: 4
image: "img/research/control-loop.png"
imageAlt: "Vorticity of the wake behind a cylinder with two jets, four probes in the wake, and a loop from the probes through an ensemble estimate and a policy back to the jets"
imageCaption: "Closing the loop on the wake of a cylinder at Re = 100: four probes feed an ensemble estimate of the flow, and the policy π drives the jets on the cylinder."
blurb: "Once a state can be estimated from partial observations, it can be acted upon — assimilation and reinforcement learning, combined."
publications:
  - "ozan-damirl"
  - "ozan-mbrl"
---

Model-free reinforcement learning learns a control policy by interacting with a system, and typically assumes it can observe the full state. In a laboratory or a plant, sensors give a handful of noisy, partial measurements instead.

Our approach is to put an estimator between the two. A low-order model, corrected in real time by data assimilation, supplies the full-state estimate that the agent needs; the agent acts on the ensemble mean rather than on a state nobody can measure.

This makes the control problem tractable with the observability that real systems actually have, and it separates concerns cleanly: the estimator handles the physics and the noise, the agent handles the policy.

