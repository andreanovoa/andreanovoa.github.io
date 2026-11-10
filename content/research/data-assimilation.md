---
title: "Bias-aware data assimilation"
weight: 2
image: "img/pubs/unknown-unknowns.gif"
imageAlt: "Animation of the forecast, bias-corrected forecast, analysis and observations at two assimilation steps"
imageCaption: "Sequential bias-aware assimilation: the forecast is corrected for model bias before it is combined with the observations (Nóvoa, Racca & Magri, *Comput. Methods Appl. Mech. Eng.*, 2023)."
blurb: "Ensemble Kalman filtering for nonlinear and chaotic systems — including estimating the model error the model does not know it has."
publications:
  - "novoa-unknown-unknowns"
  - "novoa-internoise"
---

Standard ensemble Kalman filters assume the model is unbiased: wrong only by random noise with zero mean. Real models are not. They are simplified, they miss physics, and they are wrong in structured, systematic ways.

If that bias is ignored, the filter fights it. Observations are repeatedly used to correct a discrepancy that keeps coming back, and the estimate degrades even as more data arrives.

We develop *bias-aware* filters that treat the model error as a quantity to be inferred alongside the state and the parameters. The regularized bias-aware ensemble Kalman filter (rBA-EnKF) estimates the bias with a reservoir computer trained online, and regularises it so that the split between "model" and "bias" stays identifiable.

