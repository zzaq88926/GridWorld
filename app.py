from flask import Flask, request, jsonify, render_template
from rl_environment import GridWorldEnv

app = Flask(__name__)
env = None

@app.route('/')
def index():
    """Serves the main GridWorld visualization interface."""
    return render_template('index.html')

@app.route('/api/init', methods=['POST'])
def init_env():
    """
    Accepts grid configurations (n, start, goal, obstacles) via JSON payload 
    and initializes the global Python environment session object.
    """
    global env
    data = request.json
    
    n = data.get('n', 5)
    start = data.get('start', [0, 0])
    goal = data.get('goal', [4, 4])
    obstacles = data.get('obstacles', [])
    
    # Instantiate the Reinforcement Learning Environment
    env = GridWorldEnv(n, start, goal, obstacles)
    
    return jsonify({
        "status": "success",
        "message": f"Environment initialized with {n}x{n} grid."
    })

@app.route('/api/evaluate', methods=['GET'])
def evaluate():
    """
    Triggers the policy evaluation loop. Returns a JSON array containing the continuous 
    scalar values representing the uniform random policy evaluation across all spatial coordinates.
    """
    global env
    if env is None:
        return jsonify({"error": "Environment not initialized. Call /api/init first."}), 400
        
    values = env.evaluate_random_policy()
    return jsonify({"values": values})

@app.route('/api/optimize', methods=['GET'])
def optimize():
    """
    Triggers the value iteration loop. Returns a JSON object containing the mathematically 
    optimized state values and an array of discrete directional string identifiers corresponding 
    to the optimal greedy policy.
    """
    global env
    if env is None:
        return jsonify({"error": "Environment not initialized. Call /api/init first."}), 400
        
    values, policy = env.run_value_iteration()
    return jsonify({
        "values": values,
        "policy": policy
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
