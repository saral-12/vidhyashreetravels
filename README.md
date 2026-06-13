# Vidhyashree Travels Landing Page & Git Sync Tool

A high-performance, glassmorphic travel website landing page inspired by premium layout designs. Includes a background watcher script that automatically commits and pushes your code changes directly to GitHub as you save files.

## Website Features
- **Dynamic Slider/Carousel**: Beautiful transitions between travel cards.
- **Synced Video-like Backgrounds**: Page background crossfades to match the selected destination.
- **Glassmorphic Navigation & Modals**: Elegant design details including blur, shadow, and gold highlights.
- **Fully Interactive Panels**: Built-in, sliding content panels for About Us, Packages, and Contact details.
- **Local Storage Booking Integration**: Customers can submit inquiry requests which are stored securely in local storage.

---

## File Structure
- `index.html`: Main layout and content.
- `styles.css`: Styles, animations, glassmorphism tokens, and responsive mobile styling.
- `script.js`: Interactive carousel, search triggers, navigation panel shifts, and local storage inquiry system.
- `assets/`: Destination card and background images.
- `watch.js`: Background script watching for code changes to push to GitHub automatically.
- `setup-git.bat`: Configuration wizard to link your GitHub repository and launch the watcher.

---

## Getting Started

### 1. Initial Setup
To link this project to your GitHub repository and configure Git on your computer, simply double-click the `setup-git.bat` file in your project folder, or run it in your terminal:
```bash
./setup-git.bat
```
The wizard will:
1. Initialize a Git repository locally (if not already done).
2. Configure your Git user details (if not already set up globally).
3. Ask for your GitHub repository link and link it.
4. Make the initial commit.
5. Push the code to GitHub (you might see a GitHub sign-in popup).
6. Automatically start the file watcher (`watch.js`).

### 2. Auto-Sync to GitHub
Whenever you edit files (`index.html`, `styles.css`, `script.js`) and save them, the watcher will notice the change and run:
- `git add .`
- `git commit -m "Auto-sync: updated [files]"`
- `git push origin main`

To run the watcher manually at any time, run:
```bash
node watch.js
```

---

## Viewing the Website Locally
You can double-click `index.html` to open the website directly in any web browser, or use a local dev server (like VS Code's Live Server extension) for live-reloading.
