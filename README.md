# FitBot: Adaptive AI Fitness Companion 🏋️‍♂️🤖

A mobile-first AI fitness chatbot built with **React Native (Expo)**, **Node.js**, and **SQLite**. 
The AI dynamically adapts its personality, tone, and advice based on the user's psychological profile and real-time lifestyle data.

## 🚀 Key Features

* **📊 Visual Dashboard:** Real-time tracking of Steps and Sleep with visual progress bars.
* **🧠 Adaptive Personalities:** Switches between "Supportive", "Creative", and "Strict" modes instantly.
* **💾 Local History:** Uses **SQLite** to persist chat history and context.
* **🛡️ Medical Guardrails:** Automatically detects and blocks medical queries (e.g., "fracture", "pain").

## 🛠 Tech Stack

* **Frontend:** React Native (Expo Router)
* **Backend:** Node.js + Express
* **Database:** SQLite3 (Local storage)
* **AI Engine:** Groq (Llama-3-70b) - *chosen for ultra-low latency*

## 🧠 Prompt Engineering Strategy

The core intelligence relies on a structured **System Prompt** injected into every API call. The prompt is constructed dynamically in `server.js`:

1.  **Personality Injection:**
    * *Type A (Seeker):* Instructions to be "empathetic, supportive, and use emojis."
    * *Type C (Finisher):* Instructions to be "strict, concise, and efficiency-focused."
2.  **Context Layer:**
    * User stats (Steps/Sleep) are inserted directly into the prompt.
    * *Logic:* If `sleep < 6h`, the prompt instructs the AI to prioritize "Recovery" over "Workouts".
3.  **Safety Layer:**
    * The prompt explicitly forbids answering questions related to specific medical keywords.

## 💿 Installation & Running

1.  **Clone the Repository**
    ```bash
    git clone <your-repo-link>
    cd fitness-ai-companion
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    # Create .env with GROQ_API_KEY=...
    node server.js
    ```

3.  **Setup Frontend**
    ```bash
    cd ..
    npm install
    npx expo start
    ```
    # 📺 Demo Video
**[Click Here to Watch the App Demo]()**




https://github.com/user-attachments/assets/f107cb4c-63a9-42fa-8844-c55a84ba7e66




---

# FitBot: Adaptive AI Fitness Companion 🏋️‍♂️🤖
(Rest of readme...)
