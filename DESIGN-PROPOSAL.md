# Bienvenido a mi cabeza

Propuesta implementada para ezequielvalverde.com. Dirección visual: tipografía editorial, negro, blanco y el celeste original #9fc6ff. La experiencia aparece inmediatamente; el sonido es opcional.

## Referencia de Higgsfield

[Ver concepto generado](https://d8j0ntlcm91z4.cloudfront.net/user_3Hh6IbQHhViPjymMuo1IROavLXK/hf_20260924_191518_0ad9e9ce-a884-412b-b4a7-692f15625726.png).

La referencia orienta la atmósfera. La versión interactiva centra el título y presenta el cerebro después del texto, respetando la secuencia solicitada. El cerebro se dibuja con curvas y partículas en tiempo real; no se incrusta un video ni una imagen estática.

## Recorrido

| Scroll | Experiencia |
| --- | --- |
| 0–9% | Título de dos líneas: Bienvenido / a mi cabeza. Letras reales muestreadas para la transición. |
| 4–20% | Las letras se dispersan en partículas celestes. |
| 18–34% | Las mismas partículas convergen en el contorno y surcos del cerebro. |
| 34–43% | Pausa para reconocer la silueta, con “Todo empieza con una conexión”. |
| 43–62% | La cámara atraviesa el plano del cerebro y entra en la red interior. |
| 56–70% | Aparecen gradualmente las conexiones y los proyectos. |
| 70–100% | Exploración libre: AI Projects, E-commerce, Software Development, Doll-Ars y Experiments. |

Todo el recorrido es reversible con el scroll. Los nodos principales muestran nombre, categoría y acción. Se conservan las categorías, subproyectos, páginas y navegación de portal existentes. El regreso desde un proyecto lleva directamente al mapa.

## Acceso y navegación

- Botón para saltar la introducción y llegar a los proyectos.
- Lista de categorías accesible desde el inicio, con enlaces HTML utilizables por teclado.
- Español e inglés en las nuevas interfaces.
- Encuadre móvil, etiquetas compactas y menor cantidad de partículas.
- Preferencia de movimiento reducido: sin disolución, viaje de cámara, deriva ni destellos automáticos; conserva cambios de estado y acceso directo.
- Música mediante activación voluntaria, sin pantalla de entrada que tape el portfolio.

## Próxima mejora editorial propuesta

Agregar capturas reales, el problema resuelto y el resultado de cada proyecto. Completar las páginas de presentación y contacto, que actualmente contienen textos provisionales. Estos datos deben ser reales y no se inventaron durante el rediseño.

## Implementación

Next.js, React Three Fiber, Three.js, GSAP ScrollTrigger y Lenis. La forma del cerebro vive en lib/brain-geometry.ts; el recorrido de cámara en lib/camera-path.ts. Los datos de proyectos permanecen en lib/graph-data.ts.

No se publicó ni se subieron cambios al repositorio remoto.
