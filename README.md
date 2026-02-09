# GazeAnalyzer - Sistema de Eye-Tracking para E-Commerce

Sistema de análisis de comportamiento visual aplicado a una tienda de tecnología online, utilizando WebGazer.js para seguimiento ocular y Heatmap.js para visualización de datos.

---

## 1. Descripción del Proyecto

GazeAnalyzer es una herramienta de investigación de usabilidad que permite:

- Capturar coordenadas de mirada en tiempo real mediante webcam
- Generar mapas de calor interactivos
- Analizar patrones de atención visual en interfaces e-commerce
- Exportar datos para análisis posterior

---

## 2. Justificación del Diseño

### Página Web: TechStore (Tienda de Tecnología)

Se ha elegido una landing page de e-commerce porque:

1. **Alta complejidad visual**: Múltiples elementos compitiendo por atención
2. **Objetivos claros de conversión**: CTAs definidos (comprar, agregar al carrito)
3. **Patrones de UX establecidos**: Permite comparar resultados con estándares de la industria
4. **Relevancia comercial**: Los hallazgos son directamente aplicables a optimización de ventas

### Estructura de la Página

| Sección | Propósito | Elementos Clave |
|---------|-----------|-----------------|
| **Top Bar** | Información de envío y links secundarios | Envío gratis, Ayuda, Tiendas |
| **Header** | Navegación principal e identidad | Logo, Buscador, Cuenta, Carrito |
| **Categorías Nav** | Acceso rápido a secciones | Celulares, Laptops, Gaming, Ofertas |
| **Hero Banner** | Producto destacado + CTA principal | iPhone 15, "Comprar Ahora" |
| **Categorías Grid** | Navegación visual por categoría | 6 iconos de categorías |
| **Productos** | Catálogo de productos destacados | 4 productos con precios |
| **Promo Banner** | Urgencia de compra | Flash Sale con countdown |
| **Newsletter** | Captura de leads | Formulario de suscripción |
| **Footer** | Información institucional | Links, redes sociales, pagos |

### Objetivo Principal

Dirigir la atención hacia el CTA "Comprar Ahora" en el hero banner y los botones "Agregar al Carrito" en los productos.

---

## 3. Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura semántica |
| CSS3 | Diseño visual y animaciones |
| JavaScript ES6+ | Lógica de aplicación |
| WebGazer.js | Seguimiento ocular vía webcam |
| Heatmap.js | Visualización de mapas de calor |
| TensorFlow.js | Modelo de predicción (interno de WebGazer) |

---

## 4. Instalación y Ejecución

### Requisitos

- Navegador moderno (Chrome recomendado)
- Webcam funcional
- Servidor HTTP local (necesario para permisos de cámara)

### Pasos

```bash
# 1. Navegar al directorio
cd "C:\Users\mateo\OneDrive\Desktop\Proyecto danny"

# 2. Iniciar servidor local
# Opción Python:
python -m http.server 8080

# Opción Node.js:
npx serve -l 8080

# 3. Abrir en navegador
http://localhost:8080
```

---

## 5. Guía de Uso

### Paso 1: Calibración

1. Click en **"Calibrar"** en la barra superior
2. Aparecerán 9 puntos rojos en pantalla
3. Mire fijamente cada punto mientras hace **5 clics**
4. Los puntos se vuelven verdes al completarse
5. La calibración termina automáticamente

**Tips para mejor precisión:**
- Buena iluminación frontal
- Cabeza estable
- Evitar gafas con reflejos
- Cámara a nivel de los ojos

### Paso 2: Grabación

1. Click en **"Grabar"** para iniciar captura
2. El cursor naranja muestra la posición estimada de la mirada
3. Realice la tarea asignada (mostrada abajo izquierda)
4. Grabe durante **30-60 segundos**
5. Click en **"Detener"** para finalizar

### Paso 3: Visualización

1. Click en **"Heatmap"** para generar mapa de calor
2. Los colores indican intensidad de atención:
   - 🔵 Azul: Mínima atención
   - 🟢 Verde: Baja
   - 🟡 Amarillo: Moderada
   - 🟠 Naranja: Alta
   - 🔴 Rojo: Máxima

### Paso 4: Exportación

Click en **"Exportar"** para descargar JSON con todos los datos.

---

## 6. Análisis del Mapa de Calor

### Zonas de Análisis

```
┌────────────────────────────────────────────────────┐
│ TOP BAR: Envío gratis, links                       │ ← Baja atención esperada
├────────────────────────────────────────────────────┤
│ HEADER: Logo | [🔍 Buscar...] | 👤 ❤️ 🛒           │ ← Media-Alta (carrito)
├────────────────────────────────────────────────────┤
│ NAV: Celulares | Laptops | Audio | Gaming | 🔥     │ ← Variable
├────────────────────────────────────────────────────┤
│                                                    │
│  HERO BANNER                                       │
│  ┌──────────────────────┐     ┌────────┐          │
│  │ NUEVO LANZAMIENTO    │     │  📱   │          │
│  │ iPhone 15 Pro Max    │     │        │          │
│  │ $1,199               │     └────────┘          │
│  │ [COMPRAR AHORA] [Ver]│                         │ ← MÁXIMA atención esperada
│  └──────────────────────┘                         │
│                                                    │
├────────────────────────────────────────────────────┤
│ CATEGORÍAS: 📱 💻 🎧 ⌚ 📷 🎮                      │ ← Media
├────────────────────────────────────────────────────┤
│ PRODUCTOS DESTACADOS                               │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                   │
│ │ 🎧  │ │ ⌚  │ │ 💻  │ │ 🎮  │                   │
│ │$348 │ │$299 │ │$1099│ │$449 │                   │ ← Alta (especialmente precios)
│ │[Add]│ │[Add]│ │[Add]│ │[Add]│                   │
│ └─────┘ └─────┘ └─────┘ └─────┘                   │
├────────────────────────────────────────────────────┤
│ ⚡ FLASH SALE - Hasta 40% OFF [Ver Ofertas]       │ ← Alta (urgencia)
├────────────────────────────────────────────────────┤
│ 📧 Newsletter [email] [Suscribirse]               │ ← Baja
├────────────────────────────────────────────────────┤
│ FOOTER: Links | Contacto | Redes                   │ ← Muy baja
└────────────────────────────────────────────────────┘
```

### Preguntas de Análisis

**1. ¿Qué zonas reciben mayor atención?**

Zonas esperadas con alta concentración:
- CTA "Comprar Ahora" en hero
- Precios de productos
- Imágenes de productos
- Badge "Más Popular" en pricing

**2. ¿Existen elementos ignorados?**

Elementos típicamente ignorados en e-commerce:
- Top bar con información de envío
- Links de footer
- Textos descriptivos largos
- Categorías menos relevantes

**3. ¿La atención coincide con la jerarquía visual?**

Jerarquía esperada (patrón F + escaneo de productos):
1. Logo (orientación inicial)
2. Hero banner (producto destacado)
3. Precio y CTA principal
4. Scroll hacia productos
5. Comparación de precios
6. CTAs secundarios

---

## 7. Principios de Usabilidad (Nielsen)

### Visibilidad del Estado del Sistema

**Implementación en TechStore:**
- ✅ Badge del carrito con número de items
- ✅ Estados de botones (hover, activo)
- ✅ Timer en Flash Sale (urgencia)
- ✅ Indicadores de descuento

**Evaluación con Eye-Tracking:**
- Verificar si el badge del carrito recibe atención
- Analizar si los usuarios notan el countdown

### Coincidencia Sistema-Mundo Real

**Implementación:**
- ✅ Iconos universales (🛒 carrito, ❤️ favoritos)
- ✅ Terminología estándar e-commerce
- ✅ Precios con formato familiar ($XXX)

**Evaluación:**
- Los iconos deben ser reconocidos rápidamente (pocas fijaciones)

### Reconocimiento antes que Recuerdo

**Implementación:**
- ✅ Navegación por categorías visible
- ✅ Buscador prominente
- ✅ Imágenes de productos claras

**Evaluación:**
- Tiempo hasta encontrar el buscador
- Patrón de escaneo en navegación

### Diseño Estético y Minimalista

**Implementación:**
- ✅ Paleta de colores limitada
- ✅ Jerarquía tipográfica clara
- ✅ Espaciado adecuado

**Evaluación:**
- Detectar elementos que distraen del objetivo principal

---

## 8. Propuestas de Mejora

### Mejora 1: Optimizar el CTA Principal

**Si el heatmap muestra baja atención en "Comprar Ahora":**

```css
/* Añadir micro-interacción */
.btn-primary {
    position: relative;
    overflow: hidden;
}

.btn-primary::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255,255,255,0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.btn-primary:hover::after {
    width: 300px;
    height: 300px;
}

/* Añadir indicador visual */
.btn-primary::before {
    content: '→';
    margin-right: 8px;
    animation: arrow-bounce 1s infinite;
}

@keyframes arrow-bounce {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(5px); }
}
```

**Resultado esperado:** +30% de atención en CTA

### Mejora 2: Destacar Precios con Descuento

**Si los usuarios no notan los descuentos:**

```css
/* Añadir animación al badge de descuento */
.discount-badge {
    animation: flash-discount 2s infinite;
}

@keyframes flash-discount {
    0%, 100% { background: var(--danger); }
    50% { background: #ff4757; transform: scale(1.1); }
}

/* Hacer el precio antiguo más visible */
.old-price {
    position: relative;
}

.old-price::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 2px;
    background: var(--danger);
    animation: strike 0.5s ease-out;
}
```

### Mejora 3: Indicador de Scroll

**Si el contenido below-the-fold no recibe atención:**

```html
<div class="scroll-indicator">
    <span>↓</span>
    <p>Más productos</p>
</div>
```

```css
.scroll-indicator {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: var(--primary);
    animation: bounce 2s infinite;
    cursor: pointer;
}

.scroll-indicator span {
    font-size: 2rem;
    display: block;
}
```

---

## 9. Estructura del Proyecto

```
Proyecto danny/
├── index.html          # Página principal (tienda e-commerce)
├── css/
│   └── styles.css      # Estilos del proyecto
├── js/
│   └── app.js          # Lógica de eye-tracking
├── assets/             # Recursos adicionales
└── README.md           # Documentación
```

---

## 10. Formato de Exportación (JSON)

```json
{
    "metadata": {
        "fecha": "2024-01-15T10:30:00.000Z",
        "puntosTotales": 1500,
        "duracion": "01:30",
        "tarea": "Busca el botón 'Comprar Ahora' en el banner principal",
        "resolucion": {
            "ancho": 1920,
            "alto": 1080
        }
    },
    "puntosDeMirada": [
        {
            "x": 650,
            "y": 380,
            "timestamp": 1705312200000,
            "viewport": { "x": 650, "y": 380 }
        }
    ],
    "analisis": {
        "distribucionPorZona": {
            "header": { "puntos": 200, "porcentaje": "13.3%" },
            "heroBanner": { "puntos": 500, "porcentaje": "33.3%" },
            "products": { "puntos": 450, "porcentaje": "30.0%" }
        },
        "centroideAtencion": { "x": 720, "y": 450 },
        "totalFijaciones": 1500
    }
}
```

---

## 11. Checklist de Entrega

- [ ] Código fuente funcional (HTML, CSS, JS)
- [ ] WebGazer.js integrado correctamente
- [ ] Heatmap.js implementado
- [ ] Sistema de calibración funcional
- [ ] Captura de pantalla: Calibración
- [ ] Captura de pantalla: Tracking activo
- [ ] Captura de pantalla: Mapa de calor
- [ ] README con documentación
- [ ] Análisis de resultados
- [ ] Mínimo 2 propuestas de mejora

---

## 12. Referencias

- [WebGazer.js](https://webgazer.cs.brown.edu/)
- [Heatmap.js](https://www.patrick-wied.at/static/heatmapjs/)
- [Nielsen Norman Group - E-Commerce UX](https://www.nngroup.com/articles/ecommerce-ux/)
- [Baymard Institute - E-Commerce Research](https://baymard.com/)
