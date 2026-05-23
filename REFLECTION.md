# Coupled — Reflection & Dev Log 📝

## 1. What was easy?
* **Component Design & Vanilla CSS**: Implementing the mobile-first design system was a highly fluid process. Using Vanilla CSS custom properties allowed for maximum control over colors, gradients, and theme-switching (Rose 🌹, Midnight 🌙, Aurora 🌌, Forest 🌿). This resulted in a premium, glassmorphic look that feels modern and cohesive.
* **React Context API for App State**: Managing global state and persisting it to `localStorage` via a reducer pattern made data handling clean and robust. The states for the daily question answers, memory timeline, active challenge packs, and quiz results are all centralized.
* **Fast Development Cycle**: Vite's ultra-fast bundling and instant Hot Module Replacement (HMR) made iterating on styling and animations incredibly efficient.

## 2. What was challenging?
* **Simulated Two-Partner Synchronization**: To simulate a real-time multiplayer experience without a dedicated backend, the application utilizes a single-device "Switch Partner" feature. The challenge was structuring the database schema in `localStorage` such that Partner A's answer remains hidden from Partner B until they both submit their answers. Correctly implementing the conditional rendering for the waiting states and the synchronized reveal required careful layout and state management.
* **Custom SVG Radar Chart**: Designing the compatibility radar chart manually using standard SVG coordinates (instead of pulling in heavy charting libraries like Recharts or Chart.js) required calculating axis coordinates and drawing polygons dynamically. However, this constraint resulted in a lightweight, high-performance, and perfectly styled component matching the app's neon aesthetic.
* **Polishing Complex Animations**: Designing smooth 3D card flips for the synced answer reveal and timing the confetti celebration required precise coordinate manipulation and transition delays in CSS and Framer Motion.

## 3. What was learned?
* **CSS Animation Performance**: Creating custom keyframe animations for the orbiting hearts waiting state and falling confetti showed how much can be achieved without bulky third-party animation libraries.
* **Simulated Multi-user Architecture**: Structuring state in a way that maps naturally to database schemas makes the application extremely easy to migrate to a real-time database (e.g., Firebase, Supabase, or WebSockets) in the future.
* **Mobile-first PWA Aesthetics**: Gained deeper insights into designing web layouts that replicate the exact feel, margins, and navigation patterns of native iOS/Android applications.
