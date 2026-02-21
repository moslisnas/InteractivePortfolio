# 🎮 The Career Path - Interactive 3D Portfolio

An immersive, interactive 3D portfolio experience built with **Angular**, **Babylon.js**, and **Kenney Assets**. Follow the protagonist's professional journey through a game-like environment exploring education, career evolution, specialization, and future vision.

## 🎯 About This Project

This isn't just a traditional portfolio website. It's a **narrative-driven adventure** where visitors explore your professional story through an interactive 3D environment similar to Pokémon-style movement mechanics. Each zone represents a significant chapter in your career.

### narrative: "The Career Path"
A progressive journey through 7 main zones documenting:
- 🎓 **Universidad** - Academic foundation
- 🌍 **Idiomas** - Language & communication skills  
- 🏢 **T-Systems** - Professional evolution (3 stages)
- ⚛️ **Front-End Focus** - Current specialization
- 💻 **GitHub** - Showcase of projects
- 🔗 **Future** - Vision and contact

---

## ✨ Features

### 📍 Interactive Map Structure
- **7 Distinct Zones** with unique visual themes
- **12 Interactive Points** with detailed information
- **30+ Decorations** creating immersive environments
- **Progressive Narrative** following career chronology
- **Color-Coded Zones** for easy identification

### 🎨 Visual Design
- Distinctive colors for each zone (blue, orange, red, green, purple, etc.)
- Strategic decoration placement using Kenney assets
- Elevated platforms showing importance/evolution
- Professional lighting and camera positioning

### 🎮 Player Experience
- WASD movement controls (Pokémon-style)
- Click-to-interact with information points
- Dynamic camera for spatial exploration
- Responsive design for different screen sizes

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd interactive-portfolio

# Install dependencies
npm install

# Start development server
npm start
```

The application will automatically open at `http://localhost:4200/` (or an available port).

### Build for Production

```bash
npm run build
```

---

## 📖 Documentation

### Main Guides
- **[CAREER_PATH_MAP.md](CAREER_PATH_MAP.md)** - Detailed map structure and zone breakdown
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical changes and statistics
- **[CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md)** - How to extend and improve the project

### Key Sections in Guides
- Zone-by-zone descriptions with narratives
- Interactive point locations and information
- Decoration placement and visual hierarchy
- Color system and design rationale
- Code examples for future development

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── portfolio-data.service.ts
│   │   ├── interaction.service.ts
│   │   └── asset-loader.service.ts
│   ├── scenes/
│   │   └── babylon-scene/
│   │       ├── babylon-scene.component.ts
│   │       ├── scene-builder.ts (builds 3D scene)
│   │       ├── mesh-factory.ts (creates interactive meshes)
│   │       └── player-controller.ts (handles movement)
│   ├── shared/
│   │   ├── data/
│   │   │   └── portfolio.constant.ts (all data: 12 points + 30+ decorations)
│   │   └── models/
│   │       ├── interactive-point.model.ts
│   │       └── decoration-element.model.ts
│   └── ui/
│       └── info-panel/
│           └── info-panel.component.ts (displays selected point info)

public/assets/
├── data/
│   └── portfolio.json (backup data)
└── kenney-kits/
    ├── city-kit-commercial (buildings)
    ├── nature-kit (trees)
    └── [other assets]
```

---

## 🎮 Controls

| Action | Control |
|--------|---------|
| Forward | `W` |
| Backward | `S` |
| Left | `A` |
| Right | `D` |
| Interact | Click on blue cubes |
| Zoom | Mouse wheel |
| Rotate Camera | Mouse right-click drag |

---

## 🔧 Technologies Used

- **Framework**: Angular 21+ (Standalone Components)
- **3D Engine**: Babylon.js
- **State Management**: RxJS (Observables)
- **Assets**: Kenney Game Assets (CC0 Licensed)
- **Styling**: SCSS

### Key Dependencies
- `@babylonjs/core` - 3D rendering
- `@babylonjs/loaders` - glTF/GLB model loading
- Angular built-in utilities

---

## 📊 Map Statistics

| Metric | Count |
|--------|-------|
| Interactive Points | 12 |
| Decoration Elements | 30+ |
| Main Zones | 7 |
| Skills Documented | 80+ |
| Professional Experiences | 12 |
| Terrain Size | 200x100 units |
| Vertical Range (Z) | 0-70 units |
| Lateral Range (X) | -20 to +20 units |

---

## 🎨 Zone Breakdown

### 1. Spawn Point (Z ≈ 0)
Starting location - introduction to the experience

### 2. Universidad (Z ≈ 12)
Academic foundation - degree and graduation project

### 3. Idiomas (Z ≈ 22)
Language skills - Spanish (native) & English (B1)

### 4. T-Systems Evolution (Z ≈ 32-42)
Three-stage professional evolution:
- **Programmer** (Left) - 2018-2020
- **Senior Full-Stack** (Center) - 2020-2023
- **Technical Lead** (Right) - 2023-2024

### 5. Front-End Focus (Z ≈ 48)
Current specialization - Angular, React, TypeScript

### 6. GitHub Projects (Z ≈ 58)
Project showcase - Geotales, Render Engine, Frontend Ecosystem

### 7. Future/Contact (Z ≈ 68)
Final zone - vision and connection options

---

## 🎯 Data Structure

### Interactive Point Format
```typescript
{
  id: string;                          // Unique identifier
  title: string;                       // Display title
  description: string;                 // Narrative description
  date: string;                        // Time period
  skills: string[];                    // Technical skills
  link?: string;                       // External link
  position: { x, y, z };              // 3D position
  color?: { r, g, b };                // Display color (0-1)
  zone: string;                        // Zone identifier
  category?: string;                   // Sub-category
  isCharacterPoint?: boolean;          // Is player character
}
```

### Decoration Format
```typescript
{
  id: string;                          // Unique identifier
  position: { x, y, z };              // 3D position
  mesh: string;                        // Asset path (GLB/GLTF)
}
```

---

## 🔄 Workflow

1. **Player Spawns** - Starts at origin point
2. **Explore Zones** - Walks through different career stages
3. **Discover Points** - Encounters interactive information cubes
4. **Interact** - Clicks to reveal details
5. **Learn** - Views skills, descriptions, dates
8. **Continue** - Proceeds to next zone

---

## 🚀 Future Enhancements

See [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md) for detailed suggestions:

- [ ] Zone transition animations
- [ ] Improved information panel
- [ ] Timeline visualization
- [ ] Achievement system
- [ ] Ambient audio per zone
- [ ] Visual effects (particles, lights)
- [ ] NPC characters (using Kenney mini-characters)
- [ ] Minimap interface
- [ ] Performance optimization (LOD, culling)

---

## 📝 Configuration

### Adding New Points

Edit `src/app/shared/data/portfolio.constant.ts`:

```typescript
{
  id: 'unique-id',
  title: 'Your Title',
  description: 'Your description',
  date: '2024',
  skills: ['Skill1', 'Skill2'],
  position: { x: 0, y: 0, z: 50 },
  color: { r: 1, g: 0.5, b: 0 },
  zone: 'zone-name'
}
```

### Changing Zone Colors

Colors are defined in the same constant file. Modify RGB values (0-1 range) for each zone.

---

## 🌐 Browser Support

- Chrome/Edge (v90+)
- Firefox (v88+)
- Safari (v14+)
- Mobile browsers (touch supported)

---

## 📄 License

This project uses:
- **Kenney Assets**: [kenney.nl](https://kenney.nl) - CC0 Licensed
- **Babylon.js**: Apache 2.0 License
- **Angular**: MIT License

---

## 👨‍💻 Credits

Created as an interactive professional portfolio utilizing:
- Babylon.js 3D engine
- Angular framework
- Kenney game assets library
- Custom narrative design

---

## 📞 Support

For questions or issues:
1. Check [CAREER_PATH_MAP.md](CAREER_PATH_MAP.md) for map details
2. Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical info
3. See [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md) for development help

---

**The Career Path** - Your professional journey, interactively told. 🚀

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
