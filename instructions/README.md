# 📘 Instructions Overview – StreamerTools AutoUploader

Bienvenido al entorno de instrucciones del proyecto **StreamerTools AutoUploader**.  
Este directorio contiene toda la arquitectura documental que guía a Codex en la construcción del proyecto.

El objetivo principal de este entorno es garantizar que **cada módulo generado por Codex cumpla con:**

✔ Reglas de arquitectura  
✔ Estándares de calidad  
✔ Definition of Done (DoD)  
✔ Pruebas verificables  
✔ Compatibilidad futura  
✔ Modularidad y claridad en el código  

---

# 🧭 ¿Qué contiene este directorio?

```
instructions/
  master.md          ← Documento maestro (reglas globales)
  manifest.json      ← Manifest que Codex usa como configuración base
  tasks/
    *.md             ← Una tarea por archivo (con DoD + Tests)
```

---

# 📐 Cómo debe trabajar Codex en este proyecto

## 1️⃣ Antes de generar código
Codex debe cargar:

- instructions/manifest.json
- instructions/master.md
- La tarea específica ubicada en instructions/tasks/<taskname>.md

Estas actúan como **system-level guidelines**.

## 2️⃣ Ejecutar tareas
El usuario o agente solicitará:

"Codex, implementa la tarea X"

Codex debe:

1. Leer el archivo instructions/tasks/X.md  
2. Identificar: descripción, DoD, pruebas  
3. Implementar la solución dentro de la estructura prevista  
4. Crear/modificar el test script correspondiente en /dev/  
5. Reportar los archivos modificados  
6. Esperar validación

---

# 🧪 Reglas obligatorias de pruebas

Cada tarea debe incluir un script en /dev/ que:

- Pruebe únicamente la funcionalidad requerida  
- Sea ejecutable vía: npm run dev:test-<task>  
- Muestre mensajes claros  
- No dependa de infraestructura externa (salvo config.json)

---

# 🧱 Estructura del proyecto obligatoria

```
src/
  services/
  types/
  index.ts
config/
data/
dev/
```

Codex debe respetarla estrictamente.

---

# 🧠 Estilo de código requerido

- TypeScript preferido  
- async/await obligatorio  
- No default exports  
- Errores siempre con mensajes claros  
- Código modular y mantenible

---

# 🚨 En caso de error o ambigüedad

Codex debe detenerse y pedir aclaración:

"Necesito aclaración sobre X antes de proceder."

---

# 🚀 Flujo funcional general

1. Detectar fin del directo  
2. Log a Discord  
3. Obtener datos de Twitch  
4. Log a Discord  
5. Llamada a OpenAI  
6. Detectar archivo OBS  
7. Log a Discord  
8. Subida a YouTube  
9. Crear .md  
10. Actualizar CSV  
11. Log final con enlace  
12. Manejo de errores con log claro

---

# 🏁 Objetivo final

El proyecto se considera completo cuando:

- Todas las tareas están implementadas  
- Todas las pruebas pasan  
- El pipeline funciona de inicio a fin  
- Operación automática en Windows confirmada  
- Logs completos en Discord  
