import numpy as np

class GridWorldEnv:
    def __init__(self, n, start, goal, obstacles):
        """
        Initializes the GridWorld Environment.
        :param n: Grid size (n x n)
        :param start: List/Tuple (r, c)
        :param goal: List/Tuple (r, c)
        :param obstacles: List of Lists/Tuples [(r, c), ...]
        """
        self.n = max(5, min(n, 9))
        self.start = tuple(start)
        self.goal = tuple(goal)
        self.obstacles = set(tuple(obs) for obs in obstacles)
        
        self.gamma = 0.9
        self.step_penalty = -0.01
        self.goal_reward = 1.0
        self.collision_penalty = -1.0
        
        # Actions: 0: North, 1: South, 2: East, 3: West
        self.directions = [(-1, 0), (1, 0), (0, 1), (0, -1)]
        self.action_labels = ['↑', '↓', '→', '←']
        
    def _is_valid(self, r, c):
        return 0 <= r < self.n and 0 <= c < self.n
        
    def get_transition(self, r, c, action):
        """
        Returns the (next_state, reward, is_terminal) tuple for a given state and action.
        Implements deterministic transition dynamics with boundary/obstacle collisions.
        """
        if (r, c) == self.goal:
            return (r, c), 0.0, True
            
        dr, dc = self.directions[action]
        nr, nc = r + dr, c + dc
        
        # Collision with boundary or user-defined obstacle
        if not self._is_valid(nr, nc) or (nr, nc) in self.obstacles:
            return (r, c), self.collision_penalty, False
            
        # Transition to goal state
        if (nr, nc) == self.goal:
            return (nr, nc), self.goal_reward, True
            
        # Standard transition
        return (nr, nc), self.step_penalty, False

    def evaluate_random_policy(self):
        """
        Calculates and returns the converged state values for a uniform random policy 
        utilizing the Bellman Expectation Equation.
        """
        V = np.zeros((self.n, self.n))
        theta = 1e-6
        
        while True:
            delta = 0
            new_V = np.copy(V)
            
            for r in range(self.n):
                for c in range(self.n):
                    # Absorbing goal state and obstacles remain 0
                    if (r, c) == self.goal or (r, c) in self.obstacles:
                        continue
                        
                    v = 0
                    for a in range(4):
                        (nr, nc), reward, is_terminal = self.get_transition(r, c, a)
                        v += 0.25 * (reward + self.gamma * V[nr, nc])
                        
                    new_V[r, c] = v
                    delta = max(delta, abs(v - V[r, c]))
                    
            V = new_V
            if delta < theta:
                break
                
        return V.tolist()

    def run_value_iteration(self):
        """
        Iteratively calculates and returns the mathematically optimal value function 
        and the derived optimal greedy policy utilizing the Bellman Optimality Equation.
        """
        V = np.zeros((self.n, self.n))
        theta = 1e-6
        
        # Value Iteration Loop
        while True:
            delta = 0
            new_V = np.copy(V)
            
            for r in range(self.n):
                for c in range(self.n):
                    if (r, c) == self.goal or (r, c) in self.obstacles:
                        continue
                    
                    max_v = float('-inf')
                    for a in range(4):
                        (nr, nc), reward, is_terminal = self.get_transition(r, c, a)
                        v = reward + self.gamma * V[nr, nc]
                        if v > max_v:
                            max_v = v
                            
                    new_V[r, c] = max_v
                    delta = max(delta, abs(max_v - V[r, c]))
                    
            V = new_V
            if delta < theta:
                break
                
        # Derive optimal policy
        policy = [['' for _ in range(self.n)] for _ in range(self.n)]
        
        for r in range(self.n):
            for c in range(self.n):
                if (r, c) == self.goal:
                    policy[r][c] = '★'
                    continue
                if (r, c) in self.obstacles:
                    policy[r][c] = '■'
                    continue
                    
                max_v = float('-inf')
                best_a = 0
                for a in range(4):
                    (nr, nc), reward, is_terminal = self.get_transition(r, c, a)
                    v = reward + self.gamma * V[nr, nc]
                    if v > max_v:
                        max_v = v
                        best_a = a
                policy[r][c] = self.action_labels[best_a]
                
        return V.tolist(), policy
