import { InteractivePoint } from '../models/interactive-point.model';
import { DecorationElement } from '../models/decoration-element.model';

/**
 * THE CAREER PATH - Interactive Narrative Map
 * A Progressive Journey Through Professional Evolution
 */

export const PORTFOLIO_DATA_POINTS: InteractivePoint[] = [
  // ============================================
  // SPAWN POINT
  // ============================================
  {
    id: 'player',
    title: 'Your Journey Begins',
    description: 'Welcome to The Career Path. This is your story of professional evolution. Follow the path ahead to explore your journey through technology.',
    date: 'Present',
    skills: ['Leadership', 'Innovation', 'Architecture'],
    position: { x: 0, y: 1, z: 0 },
    color: { r: 1, g: 1, b: 0 },
    zone: 'spawn',
    isCharacterPoint: true
  },

  // ============================================
  // ZONE 1: UNIVERSIDAD (FOUNDATION)
  // ============================================
  {
    id: 'university-main',
    title: '🎓 Universidad de Granada',
    description: 'Grado en Ingeniería Informática. Aquí comenzó todo. Especialización en Ingeniería del Software. Esta es la base que sentó los principios fundamentales de mi carrera profesional.',
    date: '2013 - 2018',
    skills: ['Algorithms', 'Data Structures', 'System Design', 'Software Engineering'],
    link: '#',
    position: { x: 0, y: 0, z: 12 },
    color: { r: 0.3, g: 0.7, b: 1 },
    zone: 'universidad',
    category: 'main'
  },
  {
    id: 'university-geotales',
    title: '📱 Proyecto Fin de Grado: Geotales',
    description: 'Aplicación interactiva para exploración geográfica. Ya me gustaban las aventuras interactivas. Una app multiplataforma que combinaba mapas, realidad aumentada y gamificación.',
    date: '2018',
    skills: ['Mobile Development', 'AR', 'Gamification', 'Real-time Data'],
    link: 'https://github.com',
    position: { x: 3, y: 0, z: 12 },
    color: { r: 0.3, g: 0.7, b: 1 },
    zone: 'universidad',
    category: 'subfocus'
  },

  // ============================================
  // ZONE 2: IDIOMAS (LANGUAGES)
  // ============================================
  {
    id: 'languages-spanish',
    title: '🇪🇸 Español',
    description: 'Lengua nativa. Comunicación profesional y técnica completa. Experiencia en documentación, presentaciones y liderazgo en entornos hispanohablantes.',
    date: 'Native',
    skills: ['Communication', 'Technical Writing', 'Leadership'],
    position: { x: -3, y: 0, z: 22 },
    color: { r: 1, g: 0.6, b: 0 },
    zone: 'languages',
    category: 'language'
  },
  {
    id: 'languages-english',
    title: '🇬🇧 English',
    description: 'Nivel B1 certificado. Experiencia profesional en entornos técnicos internacionales. Comunicación efectiva en proyectos multinacionales.',
    date: 'B1 Certified',
    skills: ['International Communication', 'Technical Documentation', 'Agile Teams'],
    position: { x: 3, y: 0, z: 22 },
    color: { r: 1, g: 0.6, b: 0 },
    zone: 'languages',
    category: 'language'
  },

  // ============================================
  // ZONE 3: T-SYSTEMS JOURNEY (EVOLUTION)
  // Evolution through three professional stages
  // ============================================

  // STAGE 1: PROGRAMMER
  {
    id: 'tsystems-programmer',
    title: '👨‍💻 Programmer',
    description: 'Mis primeros pasos en T-Systems. Desarrollo web, automatización de procesos, trabajo en Scrum. Aquí aprendí los fundamentos de la profesión y discovered mi passion por el desarrollo.',
    date: '2018 - 2020',
    skills: ['PHP', 'C#', 'JavaScript', 'SharePoint', 'MySQL', 'Scrum'],
    link: '#',
    position: { x: -12, y: 0, z: 32 },
    color: { r: 1, g: 0.3, b: 0.3 },
    zone: 'tsystems',
    category: 'stage-1'
  },

  // STAGE 2: SENIOR FULL-STACK (SmartCities)
  {
    id: 'tsystems-fullstack',
    title: '🚀 Senior Full-Stack Developer (SmartCities)',
    description: 'Evolución hacia proyectos más complejos. Desarrollo Full-Stack con fuerte foco Front-End. Proyectos de ciudades inteligentes, escalabilidad, arquitectura moderna. Aquí comienza la transición clara hacia Front-End.',
    date: '2020 - 2023',
    skills: ['React', 'Next.js', 'TypeScript', 'Elasticsearch', 'Docker', 'Accessibility', 'UX'],
    link: '#',
    position: { x: 0, y: 0, z: 38 },
    color: { r: 1, g: 1, b: 0 },
    zone: 'tsystems',
    category: 'stage-2'
  },

  // STAGE 3: TECHNICAL LEAD / ANALYST
  {
    id: 'tsystems-lead',
    title: '🎯 Technical Lead & Analyst',
    description: 'Liderazgo técnico y gestión de equipos de más de 25 personas. Decisiones arquitectónicas, CI/CD pipelines, control de versiones, optimización de procesos. Evolución técnica combinada con liderazgo de equipos.',
    date: '2023 - 2024',
    skills: ['Java', 'GitFlow', 'Jenkins', 'PL/SQL', 'WebLogic', 'Architecture', 'Team Leadership'],
    link: '#',
    position: { x: 12, y: 0, z: 32 },
    color: { r: 0.3, g: 1, b: 0.3 },
    zone: 'tsystems',
    category: 'stage-3'
  },

  // ============================================
  // ZONE 4: FRONT-END FOCUS (SPECIALIZATION)
  // ============================================
  {
    id: 'frontend-main',
    title: '⚛️ Front-End Architecture Specialist',
    description: 'Mi foco actual: Arquitectura Front-End moderna. Especialización en Angular, React, TypeScript. Estado, arquitectura escalable, performance y accesibilidad. Clean Code y Testing. Esta es mi identidad profesional.',
    date: '2024 - Present',
    skills: ['Angular', 'React', 'TypeScript', 'State Management', 'Performance', 'Accessibility', 'Testing', 'Clean Code'],
    link: '#',
    position: { x: 0, y: 0.5, z: 48 },
    color: { r: 0.1, g: 0.6, b: 1 },
    zone: 'frontend',
    category: 'core'
  },

  // ============================================
  // ZONE 5: GITHUB / PROJECTS
  // ============================================
  {
    id: 'github-geotales',
    title: '📍 Geotales - Interactive Maps & AR',
    description: 'Proyecto académico y personal. Exploración geográfica interactiva con realidad aumentada. Gamificación y datos en tiempo real. Pasión por crear experiencias interactivas.',
    date: '2018',
    skills: ['Mobile Development', 'AR', 'Maps API', 'Real-time Updates'],
    link: 'https://github.com',
    position: { x: -4, y: 0.2, z: 58 },
    color: { r: 0.8, g: 0.2, b: 0.8 },
    zone: 'github',
    category: 'project'
  },
  {
    id: 'github-renderengine',
    title: '🎮 Render Engine - OpenGL',
    description: 'Motor de renderizado 3D desde cero. Implementación de gráficos con OpenGL. Optimización de rendering y gestión de meshes. Profundo conocimiento de gráficos por computadora.',
    date: '2019-2020',
    skills: ['C++', 'OpenGL', 'Graphics Programming', '3D Math', 'Performance'],
    link: 'https://github.com',
    position: { x: 0, y: 0.2, z: 58 },
    color: { r: 0.8, g: 0.2, b: 0.8 },
    zone: 'github',
    category: 'project'
  },
  {
    id: 'github-frontend-projects',
    title: '💻 Modern Front-End Ecosystem',
    description: 'Colección de proyectos front-end modernos. Angular, React, Next.js, TypeScript. Desde componentes reutilizables hasta arquitecturas completas. Exploración de best practices y patrones.',
    date: '2021 - Present',
    skills: ['Angular', 'React', 'Next.js', 'TypeScript', 'Testing', 'State Management'],
    link: 'https://github.com',
    position: { x: 4, y: 0.2, z: 58 },
    color: { r: 0.8, g: 0.2, b: 0.8 },
    zone: 'github',
    category: 'project'
  },

  // ============================================
  // ZONE 6: FUTURE / CONTACT
  // ============================================
  {
    id: 'future-contact',
    title: '🔗 Let\'s Connect',
    description: 'Actualmente enfocado en desarrollo Front-End avanzado, con especial interés en Angular, Next.js y arquitecturas escalables. Buscando colaboraciones en proyectos innovadores y desafiantes.',
    date: 'Present & Beyond',
    skills: ['Full-Stack Vision', 'Innovation', 'Collaboration', 'Continuous Learning'],
    link: 'https://linkedin.com',
    position: { x: 0, y: 0, z: 68 },
    color: { r: 1, g: 0.5, b: 0 },
    zone: 'future',
    category: 'contact'
  }
];


export const PORTFOLIO_DATA_DECORATIONS: DecorationElement[] = [
  // ============================================
  // MARKET / PATHWAY - Linking all zones
  // ============================================
  // Path markers along the main route (Z axis progression)
  
  // Ground Markers - Using building bases as pathway markers
  // Zone boundaries at Z = 10, 20, 30, 40, 50, 60, 70, 80

  // ============================================
  // ZONE 1: UNIVERSIDAD DECORATIONS
  // ============================================
  // Books/knowledge representation
  {
    id: "uni-tree-1",
    position: { x: -6, y: 0, z: 8 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "uni-tree-2",
    position: { x: 6, y: 0, z: 8 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "uni-tree-3",
    position: { x: -6, y: 0, z: 16 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "uni-tree-4",
    position: { x: 6, y: 0, z: 16 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },

  // ============================================
  // ZONE 2: IDIOMAS DECORATIONS
  // Language markers with visuals
  // Flags represented by furniture/posts
  // ============================================
  {
    id: "idiomas-tree-left",
    position: { x: -8, y: 0, z: 20 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "idiomas-tree-right",
    position: { x: 8, y: 0, z: 20 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "idiomas-tree-center-1",
    position: { x: -3, y: 0, z: 26 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "idiomas-tree-center-2",
    position: { x: 3, y: 0, z: 26 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },

  // ============================================
  // ZONE 3: T-SYSTEMS EVOLUTION DECORATIONS
  // Three circles/platforms representing the stages
  // ============================================

  // STAGE 1 AREA - Programmer (LEFT)
  {
    id: "tsystems-stage1-tree-1",
    position: { x: -18, y: 0, z: 28 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "tsystems-stage1-tree-2",
    position: { x: -18, y: 0, z: 36 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "tsystems-stage1-building-1",
    position: { x: -12, y: 0, z: 28 },
    mesh: "/assets/kenney_city-kit-commercial_2.1/Models/GLB format/building_a.glb"
  },
  {
    id: "tsystems-stage1-building-2",
    position: { x: -12, y: 0, z: 36 },
    mesh: "/assets/kenney_city-kit-commercial_2.1/Models/GLB format/building_b.glb"
  },
  
  // STAGE 2 AREA - Full-Stack (CENTER/ELEVATED)
  {
    id: "tsystems-stage2-building-1",
    position: { x: -3, y: 0.3, z: 35 },
    mesh: "/assets/kenney_city-kit-commercial_2.1/Models/GLB format/building-skyscraper-a.glb"
  },
  {
    id: "tsystems-stage2-building-2",
    position: { x: 3, y: 0.3, z: 35 },
    mesh: "/assets/kenney_city-kit-commercial_2.1/Models/GLB format/building-skyscraper-b.glb"
  },
  {
    id: "tsystems-stage2-building-3",
    position: { x: 0, y: 0.3, z: 42 },
    mesh: "/assets/kenney_city-kit-commercial_2.1/Models/GLB format/building-skyscraper-c.glb"
  },

  // STAGE 3 AREA - Technical Lead (RIGHT)
  {
    id: "tsystems-stage3-tree-1",
    position: { x: 18, y: 0, z: 28 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "tsystems-stage3-tree-2",
    position: { x: 18, y: 0, z: 36 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "tsystems-stage3-building-1",
    position: { x: 12, y: 0, z: 28 },
    mesh: "/assets/kenney_city-kit-commercial_2.1/Models/GLB format/building-skyscraper-d.glb"
  },
  {
    id: "tsystems-stage3-building-2",
    position: { x: 12, y: 0, z: 36 },
    mesh: "/assets/kenney_city-kit-commercial_2.1/Models/GLB format/building-skyscraper-e.glb"
  },

  // Connecting elements between stages
  {
    id: "tsystems-connector-tree-1",
    position: { x: -5, y: 0, z: 25 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "tsystems-connector-tree-2",
    position: { x: 5, y: 0, z: 25 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },

  // ============================================
  // ZONE 4: FRONT-END FOCUS DECORATIONS
  // Modern tech stack representation
  // ============================================
  {
    id: "frontend-tree-left",
    position: { x: -8, y: 0, z: 44 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "frontend-tree-right",
    position: { x: 8, y: 0, z: 44 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "frontend-building-1",
    position: { x: -6, y: 0.2, z: 50 },
    mesh: "/assets/kenney_city-kit-commercial_2.1/Models/GLB format/building_c.glb"
  },
  {
    id: "frontend-building-2",
    position: { x: 6, y: 0.2, z: 50 },
    mesh: "/assets/kenney_city-kit-commercial_2.1/Models/GLB format/building_d.glb"
  },
  {
    id: "frontend-highlight-building",
    position: { x: 0, y: 0.5, z: 54 },
    mesh: "/assets/kenney_city-kit-commercial_2.1/Models/GLB format/building-skyscraper-a.glb"
  },

  // ============================================
  // ZONE 5: GITHUB / PROJECTS DECORATIONS
  // Workshop/laboratory feel
  // ============================================
  {
    id: "github-tree-1",
    position: { x: -10, y: 0, z: 54 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "github-tree-2",
    position: { x: 10, y: 0, z: 54 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "github-building-1",
    position: { x: -4, y: 0.1, z: 52 },
    mesh: "/assets/kenney_city-kit-commercial_2.1/Models/GLB format/building_e.glb"
  },
  {
    id: "github-building-2",
    position: { x: 0, y: 0.1, z: 52 },
    mesh: "/assets/kenney_city-kit-commercial_2.1/Models/GLB format/building_f.glb"
  },
  {
    id: "github-building-3",
    position: { x: 4, y: 0.1, z: 52 },
    mesh: "/assets/kenney_city-kit-commercial_2.1/Models/GLB format/building_g.glb"
  },
  {
    id: "github-building-showcase",
    position: { x: 0, y: 0.3, z: 60 },
    mesh: "/assets/kenney_city-kit-commercial_2.1/Models/GLB format/building-skyscraper-c.glb"
  },

  // ============================================
  // ZONE 6: FUTURE / CONTACT DECORATIONS
  // ============================================
  {
    id: "future-tree-left",
    position: { x: -8, y: 0, z: 62 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "future-tree-right",
    position: { x: 8, y: 0, z: 62 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "future-tree-center",
    position: { x: 0, y: 0, z: 70 },
    mesh: "/assets/kenney_nature-kit/Models/GLTF format/tree_oak.glb"
  },
  {
    id: "future-building-final",
    position: { x: 0, y: 0.4, z: 68 },
    mesh: "/assets/kenney_city-kit-commercial_2.1/Models/GLB format/building-skyscraper-d.glb"
  }
];
