# GridWorld Visualization Platform

A dynamic, user-specifiable ($n=5$ to $9$ grid dimensions) GridWorld visualization tool engineered to mathematically demonstrate **Iterative Policy Evaluation** and **Value Iteration** algorithms acting upon finite Markov Decision Processes.

## Ethical & Architectural Foundations
This backend mathematically coordinates deterministic transitions and implements matrix operations from scratch in pure Python without external reliance on Gym. The application visually translates theoretical reinforcement learning bounds:
- **State Space**: $n \times n$ matrix with customizable coordinates.
- **Bellman Expectation Equation**: Diffuses fractional penalty values via successive approximation across uniform random paths.
- **Bellman Optimality Equation**: Rapid mathematical convergence for rigorous deterministic trajectory mapping.
- **Transition Dynamics**: Explicit bounding with +1.0 Goal Reward, -0.01 Traversal Penalty, and -1.0 Geometric Collision limits.

## Glassmorphism Aesthetic Architecture
The interface fundamentally rejects generic academic paradigms. It operates across a "Dark Mode Glassmorphism" layout that drastically reduces ocular fatigue. Precise CSS filters simulate physical depth over an expansive mathematical canvas. Value maps dynamically interpolate deep negative scalar limits into dark oceanic palettes while rendering peak positive bounds in luminous glassy white.

## Local Installation Instructions

To interact with the GridWorld Dashboard, execute the following commands in any standard terminal:

```bash
# Clone the origin repository
git clone https://github.com/zzaq88926/GridWorld.git
cd GridWorld

# Initialize Python Virtual Environment
python -m venv venv

# Activate Environment (Windows)
venv\Scripts\activate
# Activate Environment (macOS/Linux)
source venv/bin/activate

# Install Required Flask & Numpy Dependencies
pip install -r requirements.txt

# Run Server Instance
python app.py
```
After executing, navigate explicitly to `http://127.0.0.1:5000` in your web browser.

## Git Version Control Commands

The following terminal commands were executed to establish tracking, avoid massive virtual deployment payloads via `.gitignore`, and commit this generative platform directly to the remote origin:

```bash
git init
git add .
git commit -m "Initialize final generative GridWorld platform architecture"
git branch -M main
git remote add origin https://github.com/zzaq88926/GridWorld.git
git push -u origin main
```
