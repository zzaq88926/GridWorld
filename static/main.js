document.addEventListener('DOMContentLoaded', () => {
    // Structural DOM Bindings
    const gridContainer = document.getElementById('grid-container');
    const inputGridSize = document.getElementById('grid-size');
    const btnResize = document.getElementById('btn-resize');
    const toolBtns = document.querySelectorAll('.tool-btn');
    const btnClear = document.getElementById('btn-clear');
    const btnEvaluate = document.getElementById('btn-evaluate');
    const btnOptimize = document.getElementById('btn-optimize');
    const statusText = document.getElementById('status-text');

    // Matrix Geometry Variables
    let gridSize = 5;
    let currentTool = 'start'; // Can be 'start', 'goal', or 'obstacle'
    let isDrawing = false;

    // Internal JS State tracking Grid topology
    let startState = [0, 0];
    let goalState = [4, 4];
    let obstacleStates = new Set(); // Stored as "row,col" strings

    // Initialize layout on load
    initGrid();

    // Resize Matrix Event Handlers
    btnResize.addEventListener('click', () => {
        let newSize = parseInt(inputGridSize.value);
        if (isNaN(newSize) || newSize < 5) newSize = 5;
        if (newSize > 9) newSize = 9;

        inputGridSize.value = newSize;
        gridSize = newSize;

        // Reset mathematical variables cleanly upon geometry shift
        startState = [0, 0];
        goalState = [newSize - 1, newSize - 1];
        obstacleStates.clear();

        initGrid();
    });

    // Tool Activation
    toolBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            toolBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentTool = e.target.dataset.tool;
        });
    });

    // Geometry Wipe
    btnClear.addEventListener('click', () => {
        obstacleStates.clear();
        initGrid();
        updateStatus("環境網格已清除。");
    });

    // --- Master Event Delegation for Frictionless Painting ---
    gridContainer.addEventListener('mousedown', (e) => {
        const cell = e.target.closest('.grid-cell');
        if (!cell) return;
        isDrawing = true;
        applyTool(cell);
    });

    gridContainer.addEventListener('mouseover', (e) => {
        if (!isDrawing) return;
        const cell = e.target.closest('.grid-cell');
        if (!cell) return;

        // Only continuously "paint" density for obstacles to prevent glitching goals
        if (currentTool === 'obstacle') {
            applyTool(cell);
        }
    });

    document.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    // --- Communication with Flask Backend via Promises ---
    async function syncEnvironment() {
        const obsArray = Array.from(obstacleStates).map(str => {
            const parts = str.split(',');
            return [parseInt(parts[0]), parseInt(parts[1])];
        });

        const payload = {
            n: gridSize,
            start: startState,
            goal: goalState,
            obstacles: obsArray
        };

        try {
            // Asynchronous Fetch mimicking local component updates
            const res = await fetch('/api/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.status === 'success') {
                return true;
            } else {
                updateStatus(`API 異常: ${data.error}`);
                return false;
            }
        } catch (err) {
            updateStatus(`網路延遲/錯誤: ${err.message}`);
            return false;
        }
    }

    btnEvaluate.addEventListener('click', async () => {
        updateStatus("正在初始化馬可夫架構並評估隨機策略...");
        if (await syncEnvironment()) {
            try {
                const res = await fetch('/api/evaluate');
                const data = await res.json();
                renderHeatmap(data.values);
                updateStatus("貝爾曼期望方程式求解完成。已生成熱力圖。");
            } catch (err) {
                updateStatus(`評估失敗: ${err.message}`);
            }
        }
    });

    btnOptimize.addEventListener('click', async () => {
        updateStatus("開始在拓樸空間中進行價值迭代 (Value Iteration)...");
        if (await syncEnvironment()) {
            try {
                const res = await fetch('/api/optimize');
                const data = await res.json();
                renderHeatmap(data.values, data.policy); // Overlay the optimized policy
                updateStatus("已達到貝爾曼最佳化。最終最佳策略與價值已映射。");
            } catch (err) {
                updateStatus(`最佳化失敗: ${err.message}`);
            }
        }
    });

    // --- Pure JavaScript Construction ---
    function initGrid() {
        // Inject explicit dimensional CSS property into global inline dict
        gridContainer.style.setProperty('--grid-size', gridSize);
        gridContainer.innerHTML = ''; // Wipe DOM rapidly via String injection

        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.r = r;
                cell.dataset.c = c;

                // Set default classes based on JSON tracker arrays
                if (r === startState[0] && c === startState[1]) {
                    cell.classList.add('start-node');
                    cell.innerHTML = 'S';
                } else if (r === goalState[0] && c === goalState[1]) {
                    cell.classList.add('goal-node');
                    cell.innerHTML = 'G';
                } else if (obstacleStates.has(`${r},${c}`)) {
                    cell.classList.add('obstacle-node');
                }

                gridContainer.appendChild(cell);
            }
        }
    }

    // Direct DOM manipulation sequence bypassing Virtual DOM
    function applyTool(cell) {
        const r = parseInt(cell.dataset.r);
        const c = parseInt(cell.dataset.c);
        const coord = `${r},${c}`;

        if (currentTool === 'start') {
            const prevStart = document.querySelector('.start-node');
            if (prevStart) {
                prevStart.classList.remove('start-node');
                if (prevStart.innerHTML === 'S') prevStart.innerHTML = '';
            }
            obstacleStates.delete(coord);
            startState = [r, c];
            cell.classList.remove('goal-node', 'obstacle-node');
            cell.classList.add('start-node');
            cell.innerHTML = 'S';

            // Fail safes for state overlap
            if (r === goalState[0] && c === goalState[1]) goalState = [-1, -1];

        } else if (currentTool === 'goal') {
            const prevGoal = document.querySelector('.goal-node');
            if (prevGoal) {
                prevGoal.classList.remove('goal-node');
                if (prevGoal.innerHTML === 'G') prevGoal.innerHTML = '';
            }
            obstacleStates.delete(coord);
            goalState = [r, c];
            cell.classList.remove('start-node', 'obstacle-node');
            cell.classList.add('goal-node');
            cell.innerHTML = 'G';

            if (r === startState[0] && c === startState[1]) startState = [-1, -1];

        } else if (currentTool === 'obstacle') {
            // Deny overwriting exact core nodes during swipe
            if ((r === startState[0] && c === startState[1]) || (r === goalState[0] && c === goalState[1])) {
                return;
            }
            if (obstacleStates.has(coord)) {
                obstacleStates.delete(coord);
                cell.classList.remove('obstacle-node');
            } else {
                obstacleStates.add(coord);
                cell.classList.add('obstacle-node');
                cell.innerHTML = ''; // Wipe internal text just in case
            }
        }
    }

    // --- Dynamic Cognitive Color Computation (HSL Space) ---
    function renderHeatmap(valuesMatrix, policyMatrix = null) {
        let vMin = Infinity;
        let vMax = -Infinity;

        // Scan for mathematical limits
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (obstacleStates.has(`${r},${c}`)) continue;
                if (valuesMatrix[r][c] < vMin) vMin = valuesMatrix[r][c];
                if (valuesMatrix[r][c] > vMax) vMax = valuesMatrix[r][c];
            }
        }

        // Failsafe to prevent zero-division error mathematically
        if (vMax === vMin) vMax = vMin + 0.001;

        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = document.querySelector(`.grid-cell[data-r="${r}"][data-c="${c}"]`);
                if (!cell) continue;

                if (obstacleStates.has(`${r},${c}`)) {
                    cell.style.backgroundColor = ''; // Obstacles hold their CSS native color
                    continue;
                }

                const val = valuesMatrix[r][c];
                // Strict 0.0 -> 1.0 normalization sequence
                const normalized = (val - vMin) / (vMax - vMin);

                // Color mapping logic: Constant Oceanic Blue (Hue 210), Saturation 80%
                // Negative (Low) vals = Deep Black/Blue (Lightness 15%)
                // Positive (High) vals = Bright Glass White (Lightness 90%)
                const lightness = 15 + (normalized * 75);

                // Prevent over-writing structural high-contrast Start/Goal indicators
                if (!cell.classList.contains('start-node') && !cell.classList.contains('goal-node')) {
                    cell.style.backgroundColor = `hsl(210, 80%, ${lightness}%)`;
                    // Dynamically switch mathematical typography to Dark for contrast on bright panels
                    cell.style.color = lightness > 60 ? '#000000' : '#ffffff';
                }

                // Append Mathematical overlays
                let contentHTML = '';

                if (policyMatrix && policyMatrix[r][c]) {
                    contentHTML = `<div class="policy-arrow">${policyMatrix[r][c]}</div>`;
                } else {
                    if (r === startState[0] && c === startState[1]) contentHTML = 'S';
                    else if (r === goalState[0] && c === goalState[1]) contentHTML = 'G';
                }

                // Directly mutate DOM with both vector data and scalar state limits
                cell.innerHTML = contentHTML + `<div class="value-text">${val.toFixed(2)}</div>`;
            }
        }
    }

    function updateStatus(msg) {
        statusText.textContent = `狀態: ${msg}`;
    }
});
