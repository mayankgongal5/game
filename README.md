# 🐍 Modern Snake Game

A modern, responsive implementation of the classic Snake game built with Next.js, TypeScript, and Tailwind CSS. Enjoy smooth gameplay, power-ups, and a clean, intuitive interface that works on both desktop and mobile devices.

![Snake Game Screenshot](/public/game-screenshot.png)

## 🎮 Features

- 🎯 Classic Snake gameplay with smooth controls
- 📱 Fully responsive design that works on all screen sizes
- 🎨 Dark/Light mode support
- ⚡ Power-ups to enhance gameplay:
  - 🐢 Slow Motion: Slow down time to make precise moves
  - 💰 Double Points: Earn double points for a limited time
  - 🔄 Shrink Snake: Make your snake shorter to navigate tight spaces
- 🎵 Immersive sound effects and background music
- 📊 Score tracking with high score persistence
- ⏯️ Pause/Resume functionality

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/snake-game.git
   cd snake-game
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play the game.

## 🕹️ How to Play

### Controls
- **Desktop**: Use arrow keys (↑, ↓, ←, →) to control the snake
- **Mobile**: Swipe in the direction you want the snake to move
- **Pause/Resume**: Press `P` or `Space` to pause/resume the game

### Game Rules
1. Guide the snake to eat the food (🍎) to grow longer
2. Avoid hitting the walls or the snake's own body
3. Collect power-ups for special abilities
4. Try to achieve the highest score possible!

## 🛠️ Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## 📂 Project Structure

```
/app
  /components
    GameBoard.tsx      # Main game board component
    GameControls.tsx   # Game control buttons
    GameOver.tsx       # Game over screen
    MobileControls.tsx # Mobile touch controls
    ResizableGameArea.tsx # Responsive game container
    Scoreboard.tsx     # Score and game stats
  /utils
    sounds.ts          # Sound effects manager
  page.tsx             # Main game page
  globals.css          # Global styles
```

## 🎨 Styling

The game uses Tailwind CSS for styling with a modern, clean design. The UI is fully responsive and adapts to different screen sizes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎵 Background Music

- **Track**: MONTAGEM XONADA
- **Artists**: MXZI, Dj Samir, DJ Javi26
- **Credits**: @DJJavi26 @MXZIOFC

## 🙏 Acknowledgments

- Inspired by the classic Snake game
- Built with ❤️ using Next.js and TypeScript
- Special thanks to all contributors and the open-source community
- Background music provided by MXZI, Dj Samir, and DJ Javi26
