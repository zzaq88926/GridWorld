# GridWorld 視覺化平台

這是一個可由使用者動態指定網格大小（$n=5$ 到 $9$）的 GridWorld 視覺化工具，其主要用於數學化地展示基於有限馬可夫決策過程（Markov Decision Processes）的 **迭代策略評估 (Iterative Policy Evaluation)** 與 **價值迭代 (Value Iteration)** 演算法。

## 架構基礎
此後端透過純 Python 從零開始實作矩陣運算，並以數學方式處理確定性狀態轉移（Deterministic transitions），完全不依賴於 Gym 等外部函式庫。本應用程式透過視覺化的方式呈現了理論上的強化學習邊界條件：
- **狀態空間 (State Space)**: 具有自定義座標的 $n \times n$ 矩陣。
- **貝爾曼期望方程式 (Bellman Expectation Equation)**: 透過在均勻隨機路徑上的逐次逼近，將部分的懲罰值進行擴散。
- **貝爾曼最佳方程式 (Bellman Optimality Equation)**: 透過快速的數學收斂，找出嚴格的最佳路徑映射。
- **狀態轉移模型 (Transition Dynamics)**: 明確定義了數值邊界，包含：到達目標獎勵 +1.0、移動懲罰 -0.01 以及碰撞邊界/障礙物懲罰 -1.0。

## 毛玻璃 (Glassmorphism) 美學設計
本介面屏棄了常見的學術範例樣式。採用了「深色模式與毛玻璃 (Dark Mode Glassmorphism)」佈局，能大幅降低長時間觀看帶來的視覺疲勞。透過精確的 CSS 濾鏡在廣闊的數學畫布上模擬出實體的深度感。價值地圖 (Value maps) 將極度負面的數值動態插值至深邃的海洋色調，同時將峰值正數渲染為明亮的玻璃白色。

## 本機端安裝說明

要使用 GridWorld 視覺化面板，請在任何終端機中執行以下指令：

```bash
# 複製遠端儲存庫
git clone https://github.com/zzaq88926/GridWorld.git
cd GridWorld

# 初始化 Python 虛擬環境
python -m venv venv

# 啟動虛擬環境 (Windows)
venv\Scripts\activate
# 啟動虛擬環境 (macOS/Linux)
source venv/bin/activate

# 安裝必要的 Flask 與 Numpy 依賴套件
pip install -r requirements.txt

# 啟動伺服器
python app.py
```
執行後，請在瀏覽器中直接導覽至 `http://127.0.0.1:5000`。

## Git 版本控制指令

以下是原先用來建立追蹤、避免上傳虛擬環境檔案（透過 `.gitignore`）以及將這個平台推送至遠端 GitHub 的終端機指令：

```bash
git init
git add .
git commit -m "Initialize final generative GridWorld platform architecture"
git branch -M main
git remote add origin https://github.com/zzaq88926/GridWorld.git
git push -u origin main
```
