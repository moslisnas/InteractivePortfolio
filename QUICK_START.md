# 🎮 QUICK START GUIDE - The Career Path

## ▶️ Cómo Ejecutar el Proyecto

### 1. Verificar que el servidor está corriendo
```bash
# El servidor ya está en ejecución en:
# http://localhost:59834/ (o puerto alternativo)
```

### 2. Abrir el navegador
- Dirección: `http://localhost:YOUR_PORT/` (verifica la terminal)
- Verás la escena 3D cargando

---

## 🎮 Cómo Jugar / Explorar

### Controles Básicos
- **W** - Caminar hacia adelante
- **A** - Caminar a la izquierda
- **S** - Caminar hacia atrás
- **D** - Caminar a la derecha
- **Click izquierdo** en cubos azules - Ver información
- **Mouse rueda** - Zoom in/out

### Tu Recorrido

1. **Comienza en el origen** (punto amarillo con luz)
2. **Camina hacia el norte (Z+)** para explorar las zonas
3. **Observa los cubos azules** - Cada uno es un punto de información
4. **Haz click** en cualquier cubo para ver detalles
5. **Continúa explorando** las diferentes zonas

---

## 📍 Zona por Zona - Qué Encontrarás

### 🎓 Zona 1: Universidad (Z ≈ 12)
- **Cubos azules claro** - Tu formación académica
- Punto 1: Grado Ingeniería Informática
- Punto 2: Proyecto Fin de Grado (Geotales)
- Decoración: Árboles rodeando el área

### 🌍 Zona 2: Idiomas (Z ≈ 22)
- **Cubos naranjas** - Tus idiomas
- Punto 1: Español (nativo)
- Punto 2: English (B1)

### 🏢 Zona 3: T-Systems (Z ≈ 32-42)
- **Tres grupos de edificios** - Tres etapas de evolución
- Izquierda (rojo): Programmer
- Centro (amarillo): Senior Full-Stack
- Derecha (verde): Technical Lead
- Esta es la zona más visualmente compleja

### ⚛️ Zona 4: Front-End Focus (Z ≈ 48)
- **Cubos azul intenso elevado** - Tu especialización actual
- Información sobre Angular, React, TypeScript
- Rodeado de rascacielos modernos

### 💻 Zona 5: GitHub Projects (Z ≈ 58)
- **Tres cubos púrpuras** - Tus proyectos
- Proyecto 1: Geotales (izquierda)
- Proyecto 2: Render Engine (centro)
- Proyecto 3: Frontend Projects (derecha)

### 🔗 Zona 6: Futuro / Contacto (Z ≈ 68)
- **Cubo naranja intenso** - Tu visión futura
- Información de contacto y siguientes pasos

---

## 🎨 Identificar Zonas por Color

```
Amarillo  → Spawn / Energía inicial
Azul      → Educación (Universidad)
Naranja   → Comunicación (Idiomas)
Rojo      → Primeros pasos (T-Systems Stage 1)
Amarillo  → Crecimiento (T-Systems Stage 2)
Verde     → Liderazgo (T-Systems Stage 3)
Azul Oscuro → Especialización (Front-End)
Púrpura   → Proyectos creativos (GitHub)
Naranja Intenso → Futuro
```

---

## 🔑 Puntos Clave a Explorar

### Orden Recomendado
1. ✅ Spawn (bienvenida)
2. ✅ Universidad (raíces académicas)
3. ✅ Idiomas (comunicación)
4. ✅ T-Systems Programmer (primeros trabajos)
5. ✅ T-Systems Full-Stack (evolución)
6. ✅ T-Systems Technical Lead (liderazgo)
7. ✅ Front-End Focus (especialización)
8. ✅ GitHub Projects (demostraciones)
9. ✅ Futuro (visión)

---

## 📚 Más Información

Para comprensión más detallada del mapa:
- **[CAREER_PATH_MAP.md](CAREER_PATH_MAP.md)** - Descripción completa del escenario
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Detalles técnicos
- **[CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md)** - Cómo personalizar

---

## ⚙️ Configuración / Personalizacion

### Cambiar Información de una Zona
Editar: `src/app/shared/data/portfolio.constant.ts`

```typescript
// Buscar el punto que quieres cambiar
{
  id: 'university-main',
  title: 'Tu Nuevo Título',
  description: 'Tu nueva descripción',
  // ... resto de propiedades
}
```

### Agregar Nuevo Punto Interactivo
```typescript
{
  id: 'nuevo-punto',
  title: 'Nuevo Proyecto',
  description: 'Descripción...',
  date: '2024',
  skills: ['Tech1', 'Tech2'],
  position: { x: 5, y: 0, z: 60 },
  color: { r: 0.5, g: 0.5, b: 1 },
  zone: 'github'
}
```

Guardar el archivo y el servidor se recargará automáticamente.

---

## 🐛 Troubleshooting

### La escena no carga
- Verifica que el servidor está corriendo (`ng serve`)
- Abre la consola del navegador (F12) para ver errores
- Intenta recargar (F5)

### Los modelos 3D no aparecen
- Verifica que los assets están en `public/assets/`
- Los paths deben ser exactos
- Espera a que carguen (algunos modelos son pesados)

### Movimiento lento o lag
- Podría ser un problema de performance
- Intenta desactivar otros programas
- Reduce zoom si es necesario

### Puntos interactivos no responden
- Asegúrate de hacer click directamente en el cubo azul
- El cursor debe cambiar cuando haces hover
- Verifica la consola para errores de JavaScript

---

## 💡 Tips y Trucos

1. **Acércate a los cubos** para verlos mejor
2. **Usa zoom** para ajustar la vista (mouse rueda)
3. **Explora lentamente** para disfrutar la experiencia
4. **Lee toda la información** - hay narrativa interesante
5. **Vuelve a zonas** - Always descubrirás algo nuevo
6. **Comparte el link** - Otros pueden verlo también

---

## 🎬 Próximas Mejoras Planeadas

- [ ] Animaciones suave entre zonas
- [ ] Efectos de partículas
- [ ] Sonido ambiental
- [ ] Timeline visual de carrera
- [ ] Sistema de logros
- [ ] NPCs con diálogos
- [ ] Minimapa

---

## 📧 Si Tienes Preguntas

1. Lee primero la documentación adjunta
2. Revisa los comentarios en el código
3. Comprueba la consola del navegador (F12)
4. Verifica los archivos de configuración

---

## ✨ ¡Disfruta explorando tu trayectoria profesional!

**The Career Path** es una forma innovadora de contar tu historia técnica.  
Cada zona, cada proyecto, cada habilidad está aquí para que descubras tu evolución.

🚀 ¡Que comience la aventura!

