**User:**
作業內容

HW1-1: 網格地圖開發
目標：開發一個大小為 nxn 的網格地圖，允許用戶指定維度 'n'（範圍從 5 到9），使用 Flask 網頁應用程式。
功能要求：
用戶可以透過滑鼠點擊指定起始單元格（點擊後顯示為綠色）和結束單元格（點擊後顯示為紅色）。
用戶可以設定 n-2 個障礙物，透過滑鼠點擊將這些單元格變為灰色。
HW1-2: 策略顯示與價值評估
目標：顯示每個單元格的隨機生成行動（上下左右箭頭）作為策略。
功能要求：使用策略評估推導出每個狀態的價值 V(s)。
幫我依照以上需求產生給ANTIGRAVITY的最佳PROMPT

**Assistant:**
# Role & Context
你現在是一位資深全端工程師（精通 Python Flask, JavaScript, HTML/CSS）同時也是一位強化學習（Reinforcement Learning）專家。
請幫我開發一個包含「網格地圖互動」與「強化學習策略評估」的 Web 應用程式。這是一份作業，必須兼顧程式碼品質、視覺美感與演算法的正確性。

# Requirements Overview
本專案分為兩個主要部分（HW1-1 與 HW1-2），請使用 Python Flask 作為後端，前端使用 HTML/CSS/JS 實作。

## HW1-1: 網格地圖開發 (Grid Map Development)
1. **地圖生成**：在前端提供一個輸入框，允許用戶輸入維度 `n`（範圍限制在 5 到 9 之間）。點擊生成按鈕後，利用 Flask 渲染出一個 $n \times n$ 的網格地圖。
2. **互動點擊設定**：
   - 用戶第一次點擊網格：設定為「起始單元格」（Start State），背景變為綠色。
   - 用戶第二次點擊網格：設定為「結束單元格」（Terminal State），背景變為紅色。
   - 後續點擊網格：設定為「障礙物」（Obstacles），背景變為灰色。
3. **限制條件**：障礙物的數量最多只能有 `n-2` 個。前端需要有邏輯卡控，超過數量時跳出友善的提示。

## HW1-2: 策略顯示與價值評估 (Policy & Value Iteration)
1. **隨機策略生成 (Policy Matrix)**：
   - 在後端為每一個非障礙物、非終點的格子，隨機生成一個行動策略（上、下、左、右）。
   - 前端需視覺化這個策略矩陣，在對應的網格中畫出對應方向的「箭頭」（如：↑, ↓, ←, →）。
   - 障礙物格子請維持灰色且無箭頭。
2. **策略評估 (Policy Evaluation)**：
   - 在 Flask 後端實作「策略評估演算法 (Policy Evaluation)」來計算每個狀態的價值 $V(s)$。
   - 請預設合理的強化學習環境參數：例如 Discount factor (gamma) = 0.9，到達終點 Reward = +1（或自訂合理的終點獎勵），撞牆或撞障礙物則留在原地並給予 step penalty（例如 Reward = -0.04）。
   - 執行迭代直到 $V(s)$ 收斂。
3. **價值矩陣顯示 (Value Matrix)**：
   - 在前端顯示計算完成的 $V(s)$ 矩陣。每個網格內顯示該狀態的價值（取小數點後兩位）。
   - 畫面排版建議：將「Policy Matrix（箭頭）」與「Value Matrix（數字）」並排顯示或提供頁籤切換，方便對照。

## UI/UX 美化要求 (Design & Aesthetics)
- 請不要使用純 HTML 的陽春樣式。請引入 Bootstrap 或 Tailwind CSS 來優化版面。
- 網格需有適當的陰影、圓角、懸停效果 (Hover effects)。
- 色彩計畫要現代化（例如：柔和的綠色代表起點、具警示感但不刺眼的紅色代表終點、高質感的深灰色代表障礙物）。
- 介面需要直覺流暢，提供清晰的操作步驟提示（例如：「步驟 1：請點擊設定起點」、「步驟 2：請設定終點」...）。

## 程式碼架構與註解 (Code Quality)
- 遵循 MVC 或良好的前後端分離架構。Flask 負責 API 與演算法，JS 負責畫面渲染與互動。
- 程式碼必須包含詳細的中文註解，特別是在 Policy Evaluation 的貝爾曼方程式 (Bellman Equation) 實作段落，因為這佔了評分標準很大的比例。

## 部署指導 (Deployment to GitHub & Cloud)
- 因為本專案使用 Flask (包含後端)，無法直接部署在 GitHub Pages。
- 請幫我準備好 `requirements.txt` 和 `Procfile`，並提供一份詳細的 Step-by-Step 中文教學：
  1. 如何將程式碼推上 GitHub。
  2. 如何將 GitHub Repo 連結到免費的雲端平台（例如 Render 或 PythonAnywhere）進行一鍵自動部署。
  3. 確保最終能產生一個公開網址供他人測試使用。

# Output Format
請依序提供：
1. 目錄結構規劃。
2. 後端 Python/Flask 程式碼 (`app.py`, 強化學習演算法模組)。
3. 前端 HTML/CSS/JS 程式碼 (`templates/index.html`, `static/style.css`, `static/script.js`)。
4. 依賴清單 `requirements.txt`。
5. 完整的 GitHub 與 Render (或其他免費平台) 部署步驟教學。

---

**User:**
You are an expert Python software engineer and an artificial intelligence researcher specializing in Reinforcement Learning algorithms and Flask web development architecture. I am currently completing a rigorous academic assignment requiring the construction of a dynamic GridWorld visualization platform.

Core Objective: Write the complete Python backend infrastructure (consisting of app.py and a dedicated rl_environment.py module) utilizing the Flask microframework. The backend must mathematically handle a dynamic GridWorld environment formulated as a finite Markov Decision Process. 

在沒有使用 OpenAI Gym 的情況下，我們該如何在純 Python 中有效率地實作馬可夫決策過程 (MDP) 的狀態轉移與邊界碰撞條件？這個部分的邏輯如果沒寫好，會導致 Agent 跑出格子外。

**Assistant:**
我們在 `rl_environment.py` 中建立了一個自定義的 `GridWorldEnv` 類別，完全不依賴外部環境套件。

關於狀態轉移，我們定義了四個基底向量：`directions = [(-1, 0), (1, 0), (0, 1), (0, -1)]`（上、下、右、左）。
當給定當前座標 `(r, c)` 與動作時，我們會計算出擬態的新座標。接著透過內部函數 `_is_valid(r, c)` 檢查：如果沒有越界且**不在障礙物串列中**，這一步才是合法的。如果發生越界或撞到障礙物，狀態就會維持在原點，同時回傳撞擊懲罰 `-1.0`。這樣的判定方式在 $O(1)$ 的時間複雜度內就能完成，對於疊代百萬次的動態規劃來說非常高效。

同時，我們透過 Flask API（`/api/evaluate` 與 `/api/optimize`）將演算法與前端介面完美分離，達成您非同步獲取數值運算的要求。

---

**User:** 
在實作價值迭代 (Value Iteration) 時，也就是執行 Bellman Optimality Equation，我們如何確保演算法能正確收斂？而且最後提取出最佳策略 (Greedy Policy) 的細節是什麼？

**Assistant:**
價值迭代的核心在於「利用下一狀態的最大可能價值」來更新當前狀態的價值。
在實作上，我們設定了一個極小的收斂閾值 `theta = 1e-6`。每次進入迴圈時，我們建立一個變數 `delta = 0` 來追蹤整個矩陣中「單一格子價值變動的最大絕對值」。

我們遍歷整個網格（除了終點與障礙物），並計算上下左右四個動作的期望回報：`v = reward + gamma * V[nr, nc]`。找到這四個動作中最大的 `v` 賦予格子。
如果這個回圈結束時 `delta < theta`，代表價值收斂，演算法自動跳出。

而在收斂後，我們會再遍歷一次尋找每個格子的 `argmax(a)`，並將最大的動作標記為對應的 Unicode 箭頭符號（↑、↓、→、←），這就是最終提取出來的貪婪動作（Greedy Policy）。

---

**User:** 
我希望這個介面在滑鼠操作上能非常直覺，要符合 HTML 結構，像是「拖曳滑鼠連續繪圖」。但在 Vanilla JS 實作上，如果頻繁操控 81 個格子的 DOM 節點，有什麼關鍵能避免效能損耗或畫面延遲？

**Assistant:**
為了解決這點，我們在 `main.js` 中採用了 **「事件委派 (Event Delegation)」** 模式。
我們**沒有**在所有 grid-cell 上分別綁定監聽器，而是在它們的父級容器 `grid-container` 上單一綁定了 `mousedown`、`mouseover` 與 `mouseup` 三個事件。

當使用者按下滑鼠 `mousedown`，我們設定一個全域變數 `isDrawing = true` 並觸發第一筆繪圖。隨著滑鼠移動觸發 `mouseover`，如果此時 `isDrawing` 為 true 且當前工具是「障礙物」，程式就直接竄改該格子的 DOM class (`cell.classList.add('obstacle-node')`)。

透過直接操作實體 DOM 並結合 CSS 的硬體加速渲染，完全繞過了常見框架（如 React）常見的 Virtual DOM 差異比對損耗 (diffing overhead)，確保了繪製障礙物的絲滑流暢度。

---

**User:** 
關於視覺化熱力圖， DP 值包含了包含懲罰的負數（例如靠近邊緣或障礙物），以及靠近終點的正數。我們該如何數學化地將這些數值轉換為指定的「海洋藍到亮白色」的 HSL 色碼熱力圖？並且要兼顧字體的對比度？

**Assistant:**
要將任意區間的連續數值映射到顏色上，我們必須先做**正規化處理 (Normalization)**。
在 `renderHeatmap` 函式中，程式先掃描整個矩陣找出當下價值的最小值 `vMin` 與最大值 `vMax`。
接著利用公式 `(val - vMin) / (vMax - vMin)`，將所有的數值嚴格壓縮到 `0.0 ~ 1.0` 的區間。

在您指定的 HSL（色相、飽和度、亮度）模型中，海洋藍的色相為固定值 `Hue = 210`，飽和度設為 `80%`。
我們將剛才得到的 `0~1` 數值，線性映射到「亮度 (Lightness)」上，範圍設定在從暗處的 `15%`(深藍黑) 延展到 `90%`(冰冷亮白)。 這完美符合了毛玻璃（Glassmorphism）暗黑風格的對比呈現。

此外，我們加入了一行重要的自動對比度邏輯：
`cell.style.color = lightness > 60 ? '#000000' : '#ffffff';`
當格子數值變高（變亮）時，文字會自動變成黑色，而在深色懲罰區域則保持白色字體，確保所有的浮點數都能清晰可見。

---

**User:**
既然我無法直接將這些 Flask 伺服器部署至 GitHub Pages，這份專案如果在實務上要轉移到正式環境（Production），伺服器的部署架構該如何修改？

**Assistant:**
這是非常關鍵的實務考量。
如果您只用 `python app.py` 啟動，Flask 內建的伺服器其實只設計在開發時使用（Development Server），它只能單一執行緒處理，對於同時多個並行運算效能極差。

這也是為何我們在更新 `requirements.txt` 時，必須加上 `gunicorn==21.2.0`。
Gunicorn (Green Unicorn) 是一個 Python WSGI HTTP Server，它是專為並發能力高、效能強的量產環境設計的。因此在例如 Render.com 等雲端部署時，我們將啟動指令定義為 `gunicorn app:app` 即可取代原本的指令，這樣就能確保專案上線後，能夠穩定的回應多位使用者同時間執行的 DP 動態規劃運算請求。
