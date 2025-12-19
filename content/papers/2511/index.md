---
title: "Data-assimilated model-informed reinforcement learning (DA-MIRL)"
# subtitle: " Regularized bias-aware ensemble Kalman filter"  
date: 2025-10-20
tags: ["data assimilation", "reinforcement learning", "experimental data", "chaos"]  
author: ["Defne Ozan", "Andrea Nóvoa", "George Rigas", "Luca Magri"]  
summary: "This paper introduces DA-MIRL, a novel framework that integrates sequential DA with off-policy RL to estimate and control high-dimensional, spatio-temporal chaos using only partial and noisy observations.."  
# summary: "We propose an innovative approach for detecting and quantifying unknown unknown errors in computational models, enhancing prediction reliability and robustness."  
cover:
    image: "cover.png"  
    alt: "DA-MIRL diagram"
    relative: true  
related_links:
  - name: "Published paper"
    url: "https://royalsocietypublishing.org/rspa/article/481/2327/20250476/363241/Data-assimilated-model-informed-reinforcement"
    icon: "book-open" # Feather Icon
    target: "_blank"
  - name: "Arxiv preprint"
    url: "https://arxiv.org/abs/2506.01755"
    icon: "file-text" # Feather Icon Substitute
    target: "_blank"
  - name: "Codes"
    url: "https://github.com/MagriLab/DA-RL"
    icon: "github" # Feather Icon
    target: "_blank"
  - name: "BibTeX"
    url: "javascript:void(0);"
    icon: "copy"
    id: "bibtex-button" # <--- MUST BE EXACTLY THIS


---

<div id="bibtex-source" style="display:none;">
@article{10.1098/rspa.2025.0476,
    author = {Ozan, Defne E. and Nóvoa, Andrea and Rigas, George and Magri, Luca},
    title = {Data-assimilated model-informed reinforcement learning},
    journal = {Proceedings of the Royal Society A: Mathematical, Physical and Engineering Sciences},
    volume = {481},
    number = {2327},
    pages = {20250476},
    year = {2025},
    month = {12},
    issn = {1364-5021},
    doi = {10.1098/rspa.2025.0476},
    url = {https://doi.org/10.1098/rspa.2025.0476},
    eprint = {https://royalsocietypublishing.org/rspa/article-pdf/doi/10.1098/rspa.2025.0476/4404441/rspa.2025.0476.pdf},
}
</div>



#### Abstract


The control of spatio-temporal chaos is challenging because of high dimensionality and unpredictability. Model-free reinforcement learning (RL) discovers optimal control policies by interacting with the system, typically requiring observations of the full physical state. In practice, sensors often provide only partial and noisy measurements (observations) of the system. 

The objective of this paper is to develop a framework that enables the control of chaotic systems with partial and noisy observability. The proposed method, **data-assimilated model-informed RL (DA-MIRL)**, integrates: 
1. **Low-order models** to approximate high-dimensional dynamics.
2. **Sequential data assimilation (DA)** to correct model predictions in real-time.
3. **Off-policy actor-critic RL** to learn adaptive control strategies from corrected estimates.


We test DA-MIRL on the spatio-temporally chaotic solutions of the Kuramoto–Sivashinsky (KS) equation. We estimate the full state of the environment with two low-order models: 
- Physics-based model: a coarse-grained model of the KS 
- Data-driven model: the control-aware echo state network (ESN), which is proposed in this paper. 

We show that DA-MIRL successfully estimates and suppresses the chaotic dynamics of the environment in real time from partial observations and approximate models. This work opens opportunities for the control of partially observable chaotic systems.


----


#### Schematic of the proposed DA-MIRL. 
<!-- <div style="background:#ffffff;padding:0.5rem;border-radius:4px;"> -->
<img src="drawing-DA-MIRL.png" width=800px alt="Detailed schematic of the DA-MIRL" style="display: block; margin: 0 auto 1em; background:var(--gray);padding:2rem"/>
<figcaption style="text-align:center;">
The DA-MIRL aims to control a partially observed <span style="color: #b8b6b4ff;font-weight:bold;text-shadow: -1px 1px 1px var(--content)">environment</span> by integrating three components: <span style="color: #ffccaaff;font-weight:bold;text-shadow: -1px 1px 1px var(--content)">model environment</span>, <span style="color: #afc6e9ff;font-weight:bold;text-shadow: -1px 1px 1px var(--content)">state estimation</span>,  and <span style="color: #c6e9afff;font-weight:bold;text-shadow: -1px 1px 1px var(--content)">agent</span>. The numerical model $\mathbf{F}$ approximates the environment by forecasting an ensemble of states $\mathbf{s}_j$ (stacked boxes). If there are no observations, the model runs autonomously, otherwise, the model prediction is updated by the state estimator. The state estimator perturbs the observations $\mathbf{o}$ and assimilates them with the forecast ensemble $\mathbf{s}_j^f$ via the EnKF, which results in the analysis ensemble $\mathbf{s}_j^a$⁠. The model $\mathbf{F}$ is re-initialized with $\mathbf{s}_j^a$. The actor-critic agent interacts with both the environment and its model to apply and determine the optimal action at any time $t_k$⁠. The critic, which is active only during training, approximates the $Q$-value function from the state-action pair. The actor (i.e. the policy $\boldsymbol{\pi}$⁠) determines the action $\mathbf{a}$ from the expected value of the full state of the environment. We do not have access to the environment’s full state, hence, we feed the expected value given by the model, i.e. the ensemble mean $\bar{s}$⁠. </br></br></figcaption>


----

#### Control episode of the DA-MIRL with the control-aware ESN. 
<!-- <div style="background:#ffffff;padding:0.5rem;border-radius:4px;"> -->
<img src="results.png" width=1000px alt="Detailed schematic of the DA-MIRL" style="display: block; margin: 0 auto 1em;background:var(--gray);padding:1rem;border-radius:4px;"/>
<!-- </div> -->
<figcaption style="text-align:center;">
Spatio-temporal evolution of the environment ${\mathbf{u}}^{true}$ (i.e., the truth), the  model ensemble mean prediction $\hat{\mathbf{u}}$, and the reconstruction error. The triangles and circles indicate the location of the actuators and sensors, respectively⁠. The observations and actuations begin at time step $k=500$.</figcaption>

---

#### Citation


<div class="styled-quote">
D. E. Ozan, A. Nóvoa, G. Rigas, L. Magri; Data-assimilated model-informed reinforcement learning. Proc. A 1 December 2025; 481 (2327): 20250476. doi: 10.1098/rspa.2025.0476
</div>


---