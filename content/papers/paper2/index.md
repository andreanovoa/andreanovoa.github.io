---
title: "Inferring unknown unknowns"
subtitle: " Regularized bias-aware ensemble Kalman filter"  
date: 2023-06-11
tags: ["machine learning", "data assimilation", "unknown unknowns", "model bias"]  
author: ["Andrea Nóvoa", "Alberto Racca", "Luca Magri"]  
summary: "This paper develops novel methods to infer unknown unknowns in complex dynamical systems using data assimilation techniques."  
# summary: "We propose an innovative approach for detecting and quantifying unknown unknown errors in computational models, enhancing prediction reliability and robustness."  
cover:
    image: "inferring_unknowns_cover.gif"  
    alt: "Inferring unknown unknowns concept illustration"
    relative: true  
# editPost:
#     URL: "https://github.com/MagriLab/rBA-EnKF"  
#     Text: "Legacy repository"  

---



##### Abstract

Because of physical assumptions and numerical approximations, low-order models are affected by uncertainties in the state and parameters, and by model biases. Model biases, also known as model errors or systematic errors, are difficult to infer because they are <em>unknown unknowns</em>, i.e., we do not necessarily know their functional form a priori. With biased models, data assimilation methods may be ill-posed because either 
- they are "bias-unaware" because the estimators are assumed unbiased, 
- they rely on an a priori parametric model for the bias, or 
- they can infer model biases that are not unique for the same model and data. 

First, we design a data assimilation framework to perform combined state, parameter, and bias estimation. Second, we propose a mathematical solution with a sequential method, i.e., the regularized bias-aware ensemble Kalman Filter (r-EnKF), which requires a model of the bias and its gradient (i.e., the Jacobian). Third, we propose an echo state network as the model bias estimator. We derive the Jacobian of the network, and design a robust training strategy with data augmentation to accurately infer the bias in different scenarios. Fourth, we apply the r-EnKF to nonlinearly coupled oscillators (with and without time-delay) affected by different forms of bias. The r-EnKF infers in real-time parameters and states, and a unique bias. The applications that we showcase are relevant to acoustics, thermoacoustics, and vibrations; however, the r-EnKF opens new opportunities for combined state, parameter and bias estimation for real-time and on-the-fly prediction in nonlinear systems.

---
##### Figure 1: Conceptual illustration of unknown unknowns inference

![](inferring_unknowns_cover.gif)


---

##### Citation

Nóvoa, Andrea, Racca, and Magri. 2023. "Inferring unknown unknowns." *Computer Methods in Applied Mechanics and Engineering.* https://doi.org/10.1016/j.cma.2023.116502.


```BibTeX 
@article{novoa_inferring_2023,
  title={Inferring unknown unknowns: Regularized bias-aware ensemble Kalman filter},
  author={N{\'o}voa, Andrea and Racca, Alberto and Magri, Luca},
  journal={Computer Methods in Applied Mechanics and Engineering},
  volume={418},
  pages={116502},
  year={2023},
  publisher={Elsevier}
}
```



---
##### Download and related material

+ [Published paper](https://doi.org/10.1016/j.cma.2023.116502)  and [Erratum](https://github.com/andreanovoa/real-time-bias-aware-DA/blob/main/docs/2023_CMAME_Erratum.pdf)
+ [Arxiv preprint](https://arxiv.org/abs/2306.04315)
+ [Legacy code and data repository](https://github.com/MagriLab/rBA-EnKF)


---