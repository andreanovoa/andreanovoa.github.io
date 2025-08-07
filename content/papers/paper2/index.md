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


---
##### Download

+ [Published paper](https://doi.org/10.1016/j.cma.2023.116502)  
+ [Preprint](https://arxiv.org/abs/2306.04315)


---

##### Abstract

This paper addresses the challenge of inferring unknown unknowns—unmodelled errors and biases—in computational simulations through advanced data assimilation methods. The approach improves the accuracy of model predictions by estimating and correcting for hidden systematic errors. The methodology is demonstrated on relevant nonlinear dynamical systems relevant to engineering applications.

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


##### Related material

+ [Legacy code and data repository](https://github.com/MagriLab/rBA-EnKF)
+ [Erratum](https://github.com/andreanovoa/real-time-bias-aware-DA/blob/main/docs/2023_CMAME_Erratum.pdf)
