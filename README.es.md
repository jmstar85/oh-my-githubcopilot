<h1 align="center">oh-my-githubcopilot</h1>

<p align="center">
  <a href="README.md">English</a> | <a href="README.ko.md">한국어</a> | <a href="README.zh.md">中文</a> | <a href="README.ja.md">日本語</a> | Español
</p>

<p align="center">
  <strong>Orquestación multiagente para GitHub Copilot. Más capacidad, mejor productividad.</strong>
</p>

<p align="center">
  <a href="https://github.com/jmstar85/oh-my-githubcopilot"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/IDE-VS%20Code-007ACC?logo=visualstudiocode" alt="VS Code">
  <img src="https://img.shields.io/badge/CLI-Copilot%20CLI-181717?logo=github" alt="Copilot CLI">
</p>

<p align="center">
  <a href="#inicio-rápido">Comenzar</a> •
  <a href="#agentes">Agentes</a> •
  <a href="#habilidades">Habilidades</a> •
  <a href="#servidor-mcp">Servidor MCP</a> •
  <a href="#arquitectura">Arquitectura</a>
</p>

---

<h1 align="center">Now, you can enjoy OMG's amazing features integrating OMC + ECC!</h1>

<p align="center">
  <img src="https://img.shields.io/badge/GitHub%20Copilot-Orchestrated-blue?style=for-the-badge&logo=github" alt="GitHub Copilot Orchestrated" />
</p>

<p align="center">
  <a href="https://youtu.be/3Zyf4a7LAH8">
    <img src="https://img.youtube.com/vi/3Zyf4a7LAH8/maxresdefault.jpg" alt="Ver la demo de OMG en YouTube" width="720" />
  </a>
</p>

<p align="center">
  <a href="https://youtu.be/3Zyf4a7LAH8">▶ Ver la demo de OMG en YouTube</a>
</p>

---

## ¿Qué es OMG?

**oh-my-githubcopilot (OMG)** lleva a **GitHub Copilot** el enfoque de orquestación multiagente que [oh-my-claudecode (OMC)](https://github.com/yeachan-heo/oh-my-claudecode) desarrolló para Claude Code, ahora potenciado con las mejores funcionalidades de **[Everything Claude Code (ECC)](https://github.com/affaan-m/everything-claude-code)**.

Si OMC potencia Claude Code mediante agentes especializados y automatización de flujos, OMG hace lo mismo dentro del agent mode de Copilot en VS Code. Con la integración de ECC (v1.1.0), OMG ahora incorpora los patrones probados de ECC: 8 agentes revisores especializados por lenguaje, aplicación de TDD, escaneo de seguridad rápido, estándares de codificación canónicos y más. En lugar de depender de un único asistente para todo, OMG coordina **28 agentes especializados** y **22 habilidades reutilizables** a través de un servidor MCP para estructurar planificación, implementación, revisión y verificación.

> **No es un fork ni una copia de OMC o ECC.** Es una implementación independiente construida desde cero para aprovechar las capacidades de personalización de agentes en GitHub Copilot (`.agent.md`, `.prompt.md`, `SKILL.md`, herramientas MCP), inspirada por la arquitectura multiagente de OMC e integrando selectivamente los patrones probados de ECC.

---

## ¿Por qué OMG?

- **Funciona en VS Code y Copilot CLI** — Sin procesos externos adicionales. VS Code agent mode o el CLI independiente `copilot`
- **Agentes especializados**, con separación clara entre perfiles de análisis y ejecución
- **Automatización de flujos**, desde `omg-autopilot` hasta `ralph` y `ultrawork`
- **Barandillas de seguridad**, gracias a hooks pre/post tool-use
- **Estado persistente con MCP**, incluyendo workflow state, PRD y memoria del proyecto
- **Activación por lenguaje natural**, por ejemplo: "omg-autopilot build me a REST API"
- **Verificación primero**, separando autoría y revisión con evidencia obligatoria

---

## Inicio rápido

### Requisitos previos

- VS Code con GitHub Copilot Chat habilitado
- Soporte de agent mode o agent customization disponible en tu entorno de Copilot
- Node.js y npm instalados para compilar localmente el servidor MCP
- Abrir el proyecto como workspace confiable para que MCP, prompts y archivos de personalización carguen correctamente

### Opción A: VS Code Extension (Recomendado)

1. Instalar la extensión (cualquiera de estos métodos):
   - **Método 1 — VSIX (CLI)**
     ```bash
     code --install-extension ./vscode-omg/oh-my-githubcopilot-1.2.3.vsix
     ```
     > Si descargaste el VSIX en otra ubicación, reemplaza la ruta por tu ruta local.
   - **Método 2 — Pestaña Extensions de VS Code (UI)**
     En VS Code, abre **Extensions** (`⇧⌘X` / `Ctrl+Shift+X`), busca **`oh-my-githubcopilot`** e instala.

2. Abre tu proyecto en VS Code.

3. **⚡ Ejecutar `OMG: Initialize Workspace` (OBLIGATORIO)**
   ```
   Cmd+Shift+P (macOS) / Ctrl+Shift+P (Windows/Linux) → "OMG: Initialize Workspace"
   ```

> [!IMPORTANT]
> **Instalar la extensión sola NO es suficiente.** Después de la instalación, debes ejecutar `OMG: Initialize Workspace` desde la Paleta de Comandos. Este comando genera todos los archivos de convención bajo `.github/` (agentes, habilidades, hooks, prompts, copilot-instructions.md) y compila el servidor MCP en tu workspace. Sin este paso, Copilot no tendrá acceso a ningún agente ni habilidad de OMG.

4. Cuando aparezca el aviso, haz clic en **"Recargar ventana (Reload Window)"** para activar todos los agentes y habilidades
5. Empieza a usar OMG en Copilot Chat (agent mode)

### Opción B: Clonar manualmente

### 1. Clonar

```bash
git clone https://github.com/jmstar85/oh-my-githubcopilot.git
cd oh-my-githubcopilot
```

### 2. Compilar el servidor MCP

```bash
cd mcp-server
npm install
npm run build
cd ..
```

### 3. Abrir en VS Code

Abre el proyecto en VS Code con GitHub Copilot Chat habilitado. La configuración del servidor MCP, los agentes, las habilidades y los hooks se detecta automáticamente desde el workspace.

### 4. Empezar a construir

En Copilot Chat, dentro de agent mode, escribe:

```
omg-autopilot: build a REST API for managing tasks
```

Desde ese momento, OMG se encarga de planificar, implementar, revisar y verificar.

### Opción C: Copilot CLI

OMG funciona con el [Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli) independiente (binario `copilot`). El CLI lee los mismos archivos de convención `.github/` (agentes, habilidades, hooks, prompts).

1. Instala el binario de Copilot CLI.
2. Clona OMG y compila el servidor MCP:
   ```bash
   git clone https://github.com/jmstar85/oh-my-githubcopilot.git
   cd oh-my-githubcopilot
   cd mcp-server && npm install && npm run build && cd ..
   ```
3. Crea un `.copilot/mcp-config.json` local del proyecto (o usa `--global-mcp` para instalar globalmente en `~/.copilot/`):
   ```bash
   scripts/omg-adopt.sh --target . --mode template --target-env cli
   ```
4. Ejecuta `copilot` desde el directorio del proyecto:
   ```bash
   copilot
   ```
5. Usa `/status` o `@omg-coordinator` para verificar que OMG está cargado.

### ¿No sabes por dónde empezar?

Si tus requisitos aún son difusos o quieres aclararlos primero:

```
deep-interview "I want to build a task management app"
```

OMG utiliza preguntas socráticas para detectar supuestos ocultos y aclarar el problema antes de escribir código.

### Usar OMG en otros proyectos de VS Code

OMG funciona a nivel de workspace, así que se recomienda aplicarlo por proyecto.

Este repositorio incluye un script de adopción:

**macOS / Linux (Bash):**
```bash
scripts/omg-adopt.sh --target <ruta-del-proyecto> --mode <template|submodule|subtree> [--target-env vscode|cli|both]
```

**Windows (PowerShell):**
```powershell
scripts/omg-adopt.ps1 -Target <ruta-del-proyecto> -Mode <template|submodule|subtree> [-TargetEnv vscode|cli|both]
```

El flag `--target-env` (por defecto: `both`) controla qué entorno se configura:
- `vscode` — Solo VS Code (`.vscode/mcp.json`)
- `cli` — Solo Copilot CLI (`.copilot/mcp-config.json` + `hooks.json`)
- `both` — Ambos entornos (por defecto)

Después de aplicar, abre el proyecto destino como workspace confiable y valida en Copilot Chat (agent mode):

```text
/status
```

---

## Agentes

OMG incluye **28 agentes especializados**, cada uno con un rol concreto y un nivel de acceso definido. Están declarados en `.github/agents/`.

| Agente | Rol | Acceso |
|-------|------|--------|
| **@omg-coordinator** | Orquestador principal de omg-autopilot, ralph y workflows de equipo | Full |
| **@executor** | Implementación de código, features y corrección de bugs | Full |
| **@debugger** | Análisis de causa raíz, stack traces y guía de build en 7 lenguajes | Full |
| **@architect** | Análisis de arquitectura, diseño de sistema y revisión estructural | Read-only |
| **@planner** | Planificación estratégica con flujo de entrevista | Plans only |
| **@analyst** | Análisis de requisitos, detección de huecos y riesgos de alcance | Read-only |
| **@verifier** | Verificación basada en evidencia y revisión de cobertura | Test runner |
| **@code-reviewer** | Revisión de código con severidad y estándares de codificación canónicos | Read-only |
| **@security-reviewer** | Revisión OWASP, detección de secretos (sk-/ghp_/AKIA), auth/authz | Read-only |
| **@critic** | Revisión dura de planes y código antes del cierre | Read-only |
| **@test-engineer** | Estrategia de testing, TDD, detección de frameworks, flaky tests | Full |
| **@designer** | Diseño UI/UX e implementación frontend | Full |
| **@writer** | README, documentación API y generación de CODEMAP | Full |
| **@tracer** | Trazado causal y validación de hipótesis con evidencia | Full |
| **@scientist** | Análisis de datos, estadística y visualización | Read-only |
| **@qa-tester** | Pruebas CLI con terminal de VS Code, Playwright POM y E2E | Full |
| **@git-master** | Commits atómicos, rebase y gestión del historial | Git only |
| **@code-simplifier** | Simplificación de código, métricas de complejidad y eliminación de redundancia | Full |
| **@explore** | Búsqueda en el codebase, localización de archivos y mapeo | Read-only |
| **@document-specialist** | Investigación de documentación externa y APIs | Read-only |


### Agentes revisores de lenguaje — Tier 2 (8)

Invoca con `@mention` para revisión de código por lenguaje:

| Agente | Lenguaje | Reglas clave |
|-------|----------|----------|
| **@typescript-reviewer** | TypeScript | Modo strict, no-any, type safety |
| **@python-reviewer** | Python | PEP 8, type hints, patrones idiomáticos |
| **@rust-reviewer** | Rust | Ownership, borrow checker, unsafe justificado |
| **@go-reviewer** | Go | Go idiomático, goroutine safety, manejo de errores |
| **@java-reviewer** | Java | SOLID, patrones Spring, null safety |
| **@csharp-reviewer** | C# | Análisis nullable, async/await, idiomas C# |
| **@swift-reviewer** | Swift | Concurrencia Swift, seguridad de memoria, SwiftUI |
| **@database-reviewer** | SQL/ORM | Rendimiento de consultas, parametrización, diseño de esquema |

---

## Habilidades

Las habilidades son rutinas reutilizables que se activan con slash commands o palabras clave en lenguaje natural. Se definen en `.github/skills/`.

### Habilidades de workflow

| Habilidad | Qué hace | Palabras clave |
|-------|-------------|-----------------|
| `/omg-autopilot` | Ejecución autónoma desde la idea hasta el código funcionando | `omg-autopilot`, `build me`, `create me` |
| `/ralph` | Bucle persistente guiado por PRD hasta validación completa | `ralph`, `don't stop`, `finish this` |
| `/ultrawork` | Motor de ejecución paralela de alto rendimiento | `ulw`, `ultrawork`, `parallel` |
| `/team` | Coordinación por etapas de varios agentes sobre una lista compartida | `team`, `multi-agent`, `swarm` |
| `/plan` | Planificación estructurada con entrevista opcional | `plan this`, `let's plan` |
| `/ralplan` | Planificación por consenso entre Planner/Architect/Critic | `ralplan`, `consensus plan` |
| `/ccg` | Análisis combinado con perspectivas Claude + Codex + Gemini | `ccg`, `tri-model`, `cross-validate` |

### Habilidades de análisis y calidad

| Habilidad | Qué hace | Palabras clave |
|-------|-------------|-----------------|
| `/deep-interview` | Aclaración socrática de requisitos | `deep interview`, `ask me everything` |
| `/deep-dive` | Análisis en dos etapas: trace → deep-interview | `deep dive`, `investigate deeply` |
| `/trace` | Análisis causal con hipótesis en competencia | `trace this`, `root cause analysis` |
| `/verify` | Verifica que el cambio realmente funciona | `verify this`, `prove it works` |
| `/review` | Revisión de código con severidad y validación de especificación | `review this`, `code review` |
| `/ultraqa` | Ciclo de test, verificación y corrección hasta quedar en verde | `ultraqa`, `fix all tests` |
| `/ai-slop-cleaner` | Limpieza de exceso y code smells generados por IA | `deslop`, `anti-slop`, `cleanup slop` |
| `/self-improve` | Mejora autónoma iterativa basada en selección tipo torneo | `self-improve`, `evolve code` |

### Habilidades utilitarias

| Habilidad | Qué hace | Palabras clave |
|-------|-------------|-----------------|
| `/remember` | Guarda información en la memoria del proyecto | `remember this`, `store this` |
| `/cancel` | Cancela modos de ejecución activos | `cancel`, `stop`, `abort` |
| `/status` | Muestra el estado actual y los agentes activos | `status`, `what's running` |

---

## Servidor MCP

OMG incluye un servidor MCP en TypeScript para gestionar estado persistente del workflow. Está registrado mediante `.vscode/mcp.json` y expone los siguientes grupos de herramientas:

| Grupo | Herramientas | Propósito |
|-----------|-------|---------|
| **State** | `omg_read_state`, `omg_write_state`, `omg_clear_state`, `omg_list_active` | CRUD de estado de workflow y listado de modos activos |
| **PRD** | `omg_create_prd`, `omg_read_prd`, `omg_update_story`, `omg_verify_story` | Creación de PRD, seguimiento de historias y verificación |
| **Workflow** | `omg_check_completion`, `omg_next_phase`, `omg_get_phase_info` | Transiciones de fase, verificación de completitud, consulta de estado |
| **Memory** | `omg_read_memory`, `omg_write_memory`, `omg_delete_memory` | Persistencia de conocimiento a nivel de proyecto |
| **Model Router** | `omg_select_model` | Recomendación de modelo según complejidad |

El estado se guarda en `.omg/` dentro del workspace.

```text
.omg/
├── state/              # estado por modo
├── plans/              # planes de ejecución
├── prd.json            # Documento de Requisitos del Producto
└── project-memory.json # memoria del proyecto
```

---

## Tool Guardrails

OMG incorpora hooks en `.github/hooks/` para actuar como red de seguridad.

**Protecciones pre-tool-use:**
- Bloquea cambios en `node_modules/`
- Impide editar `.env` directamente
- Evita borrar `package.json`, `tsconfig.json` y `.gitignore`
- Bloquea `git push --force` y operaciones destructivas de git

**Seguimiento post-tool-use:**
- Registra uso de herramientas cuando `OMG_DEBUG=1`
- Rastrea archivos modificados para awareness de fases en omg-autopilot
- Sigue resultados de tests para detección de ultraqa

---

## Benchmark

> Todos los números provienen del historial git real, la suite de tests y los resultados de `npm audit`. Sin datos sintéticos.

### Instantánea del proyecto (v1.3.0)

| Métrica | Valor |
|---------|-------|
| Código total | 25.964 líneas |
| Período de desarrollo | 12 días (6–17 de abril de 2026) |
| Total de commits | 33 |
| Agentes | 28 (20 núcleo + 8 revisores de lenguaje) |
| Skills | 22 |
| Herramientas MCP | 19 |

### Métricas de calidad

| Métrica | v1.0 (inicial) | v1.3.0 (tras pipeline OMG) |
|---------|:-:|:-:|
| Tasa de tests pasados | N/A | **46 / 46 (100%)** |
| Errores TypeScript | Sin verificar | **0** |
| CVEs conocidas | 7 (2 producción + 5 dev) | **0** |
| Guardas pre-hook | 0 | **6** |
| Funciones de seguimiento post-hook | 0 | **8** |

### Integración ECC — Impacto en un único commit (`9468c02`)

| Métrica | Valor |
|---------|-------|
| Archivos modificados | 60 |
| Líneas añadidas | 5.844 |
| Nuevos agentes | 8 agentes revisores de lenguaje |
| Nuevas skills | 4 (`/tdd`, `/security-scan`, `/coding-standards`, `/skill-stocktake`) |
| Defectos detectados antes del merge | Shell injection en hooks + 7 CVEs |

### Planificación por consenso RALPLAN

| Decisiones revisadas | Aprobadas | Rechazadas por `@critic` | Tasa de rechazo |
|:-:|:-:|:-:|:-:|
| 9 | 7 | **2** | **22%** |

> El 22% de las decisiones de diseño se corrigieron en la fase de planificación, antes de escribir ningún código.

### Resultados del escaneo de seguridad

| Categoría | Encontrado | Corregido |
|-----------|:-:|:-:|
| Secretos hardcodeados | 0 | — |
| CVEs de producción | 2 moderadas | ✅ |
| CVEs de desarrollo | 5 moderadas | ✅ |
| Shell injection (hook `FILE_PATH`) | 1 | ✅ |
| `.env` ausente de `.gitignore` | 1 | ✅ |
| **Total de vulnerabilidades tras corrección** | | **0** |

### Guardas de seguridad pre-tool-use

| Guarda | Operación bloqueada |
|--------|--------------------|
| Protección de escritura en `node_modules` | Editar/crear dentro de `node_modules/` |
| Protección de secretos `.env` | Modificación directa de `.env` |
| Bloqueo de eliminación de configs críticos | Eliminar `package.json`, `tsconfig.json`, `.gitignore` |
| Prevención de force push | `git push --force` |
| Prevención de hard reset | `git reset --hard`, `git clean -fd` |
| Sanitización de rutas | `../` y metacaracteres en `FILE_PATH` |

---

## Arquitectura

```text
oh-my-githubcopilot/
├── .github/
│   ├── copilot-instructions.md    # instrucciones raíz de orquestación
│   ├── agents/                    # 20 definiciones de agentes especializados
│   ├── skills/                    # 18 rutinas de habilidades
│   ├── hooks/                     # protecciones pre/post tool-use
│   └── prompts/                   # plantillas quick-fix, quick-plan y quick-review
├── mcp-server/                    # servidor MCP en TypeScript
│   └── src/
│       ├── index.ts               # entrada del servidor
│       ├── state-tools.ts         # gestión de estado
│       ├── prd-tools.ts           # PRD y seguimiento de historias
│       ├── workflow-tools.ts      # fases y verificación de finalización
│       ├── memory-tools.ts        # memoria del proyecto
│       └── model-router.ts        # routing de modelos por complejidad
├── .vscode/mcp.json               # registro MCP para VS Code
└── .omg/                          # directorio de estado en runtime
```

### Cómo funciona

1. **Instructions** (`.github/copilot-instructions.md`) definen reglas de orquestación y delegación.
2. **Agents** (`.github/agents/*.agent.md`) describen roles, permisos y preferencias de herramientas.
3. **Skills** (`.github/skills/*/SKILL.md`) se cargan bajo demanda por palabras clave o slash commands.
4. **MCP Server** conserva estado, PRD y memoria del proyecto.
5. **Hooks** bloquean operaciones peligrosas y dejan rastro de ejecución útil para el workflow.

---

## Protocolo de commits

OMG usa trailers estructurados en git para conservar el contexto de decisión.

```text
fix(auth): prevent silent session drops during long-running ops

Auth service returns inconsistent status codes on token expiry,
so the interceptor catches all 4xx and triggers inline refresh.

Constraint: Auth service does not support token introspection
Rejected: Extend token TTL to 24h | security policy violation
Confidence: high
Scope-risk: narrow
```

Trailers disponibles: `Constraint`, `Rejected`, `Directive`, `Confidence`, `Scope-risk`, `Not-tested`

---

## Comparación con OMC

| Característica | OMC (oh-my-claudecode) | OMG (oh-my-githubcopilot) |
|---------|----------------------|--------------------------|
| Plataforma objetivo | Claude Code CLI | GitHub Copilot (VS Code) |
| Instalación | paquete npm / marketplace de plugins | clonar repositorio + compilar MCP server |
| Número de agentes | 19+ | 28 agentes (20 core + 8 revisores de lenguaje) |
| Skills | 10+ skills de workflow | 22 skills con disparadores por palabra clave |
| Gestión de estado | directorio `.omc/` | `.omg/` gestionado por MCP |
| Multi-modelo | Codex/Gemini vía tmux CLI | análisis consultivo mediante `ccg` |
| Configuración | `~/.claude/settings.json` | `.github/` + `.vscode/mcp.json` |
| Seguridad | hooks a nivel plugin | hooks shell pre/post |
| Visibilidad | HUD integrado | entorno nativo de VS Code |

---

## Requisitos

- [VS Code](https://code.visualstudio.com/) con la extensión [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- GitHub Copilot Chat con agent mode habilitado
- Node.js 18+ para el servidor MCP

---

## What's New

### v1.3.0 (2026-04-23) — Soporte Windows, Licencia MIT e Inicialización No Destructiva

**Tres mejoras solicitadas por la comunidad (Issues #5, #6, #7)**

- **Soporte Windows PowerShell** (Fixes #5): Añadidos equivalentes `.ps1` para todos los scripts shell — `pre-tool-use.ps1`, `post-tool-use.ps1`, `omg-adopt.ps1`. Hooks incluidos en plantillas de extensión. READMEs actualizados con ejemplos PowerShell.
- **copilot-instructions.md no destructivo** (Fixes #6): `initWorkspace` ahora añade instrucciones OMG al archivo existente en lugar de sobrescribirlo. Detección basada en marcadores para actualizaciones en reinicialización.
- **Clarificación de licencia MIT** (Fixes #7): Añadido archivo `LICENSE` raíz para detección por API de GitHub. Eliminadas contradicciones "All rights reserved" de todos los READMEs.

### v1.2.0 (2026-04-17) — Actualización del modelo de agentes a Claude Opus 4.7

**Todas las referencias de modelo de agentes actualizadas de Claude Opus 4.6 a 4.7**

- `model: [claude-opus-4-6]` → `model: [claude-opus-4-7]`: actualización de los 8 agentes con enrutamiento Opus.
- Aplicado a agentes activos (`.github/agents/`) y plantillas de extensión (`vscode-omg/resources/templates/agents/`).
- Agentes afectados: @architect, @code-reviewer, @planner, @security-reviewer, @analyst, @omg-coordinator, @code-simplifier, @critic.
- Verificado: MCP server build+tests (**18/18**), vscode-omg build+tests (**28/28**), TypeScript type check — todo OK.

### v1.1.9 (2026-04-16) — Migración de rutas de estado `.omc` → `.omg`

**Alineación de rutas de estado en código fuente + plantillas**

- Se renombraron las referencias restantes de `.omc/` a `.omg/` en skills, agents y plantillas MCP/extension.
- Se actualizó el nombre de variable de hooks `OMC_STATE_DIR` → `OMG_STATE_DIR`.
- Verificación posterior a la migración: build + tests del MCP server (**18/18 OK**).
- Se mantuvieron solo las menciones intencionales de `.omc/` en tablas comparativas con OMC.

### v1.1.8 (2026-04-13) — Preservación de contexto y mejora de memoria

**Gran mejora de confiabilidad para flujos largos**

- Mejoras Tier-2 en memoria MCP:
  - Nuevo `omg_search_memory` (búsqueda en key/value/category/tags)
  - Soporte de `tags` en `omg_write_memory`
  - Compatibilidad retroactiva con entradas de memoria existentes
- Nuevo protocolo Tier-3 de presión de contexto:
  - `omg_checkpoint`, `omg_restore_checkpoint`, `omg_context_status`
  - Advisory automático de checkpoint basado en bytes acumulados de Tool I/O
  - Umbral configurable con `OMG_CONTEXT_THRESHOLD` (por defecto 400KB)
- Endurecimiento de seguridad y ciclo de hooks:
  - Se corrige bucle de advisory reseteando contador tras checkpoint
  - Mejor detección de force push (`--force`, `-f`) permitiendo `--force-with-lease`
  - Cobertura ampliada para comandos git destructivos
- Reglas de recuperación de sesión agregadas en `copilot-instructions.md`

### v1.1.7 (2026-04-12) — Sistema de Hooks Interactivos

**Paridad con OMC: decisiones de usuario en mitad del workflow mediante `vscode_askQuestions`**

Cinco habilidades core ahora lanzan prompts de selección múltiple estructurados en los puntos de decisión, emulando los hooks de interrupción a nivel de gateway de OMC — de forma nativa dentro de VS Code Copilot.

#### Habilidades con Hooks

| Habilidad | Puntos de Hook |
|-----------|----------------|
| `/deep-interview` | Cada ronda de entrevista (con ambigüedad %) · Aprobación de spec · Selección de ruta de ejecución |
| `/plan` | Preguntas de entrevista · Gate de preparación · Selección de trade-offs · Rechazo de crítico · Aprobación de plan |
| `/ralplan` | Selección de opciones · Preocupaciones de arquitecto · Rechazo de crítico · Aprobación final |
| `/self-improve` | Repo objetivo · Confirmación de confianza · Entrevista de objetivo · Reglas de harness (solo setup — el loop corre autónomo) |
| `/omg-autopilot` | Redirección de entrada vaga · Confirmación de spec · Recuperación de QA atascado · Rechazo de validación |

#### Cómo Funciona

- En cada gate de decisión la habilidad llama a `vscode_askQuestions` con 3–5 opciones etiquetadas, un `recommended` por defecto y `allowFreeformInput: true`
- El usuario selecciona una opción (o escribe respuesta libre) — el workflow continúa según la respuesta
- Todas las llamadas de hook usan un `header` único para trazabilidad (p.ej. `"interview-round-3"`, `"ralplan-approval"`)
- Protocolo global de hooks documentado en `copilot-instructions.md → Interactive Hook System`

---

### v1.1.0 (2026-04-10) — Integración ECC

**Actualización mayor: integración de las mejores funcionalidades de ECC (Everything Claude Code) en OMG**

#### Nuevos agentes — Tier de revisores de lenguaje (8)

Cada agente incluye entre 13 y 21 reglas de estilo integradas:

- **@typescript-reviewer** — modo strict, no-any, exhaustividad en unions
- **@python-reviewer** — PEP 8, type hints, patrones idiomáticos
- **@rust-reviewer** — ownership, borrow checker, unsafe justificado
- **@go-reviewer** — Go idiomático, goroutine safety, manejo explícito de errores
- **@java-reviewer** — SOLID, patrones Spring, null safety
- **@csharp-reviewer** — análisis nullable, async/await, idiomas C#
- **@swift-reviewer** — concurrencia Swift, seguridad de memoria, SwiftUI
- **@database-reviewer** — rendimiento de consultas, parametrización, diseño de esquema

#### Nuevas habilidades (4)

- **`/tdd`** — TDD completo: ciclo Red-Green-Refactor, referencia de frameworks (Jest/pytest/Cargo/Go test)
- **`/security-scan`** — Escaneo rápido de seguridad: patrones de secretos (sk-/ghp_/AKIA), auditoría CVE, validación de entrada, auth
- **`/coding-standards`** — Estándares de codificación canónicos multi-lenguaje (nombres, funciones, errores, anti-patrones, SOLID)
- **`/skill-stocktake`** — Auditoría de inventario de habilidades: frontmatter, sincronización de plantillas, stubs, cobertura

#### Agentes core mejorados (7)

| Agente | Qué se añadió |
|-------|----------------|
| **@debugger** | Guía de resolución de build en 7 lenguajes (Node/TS, Python, Rust, Go, Java, C#, Swift) |
| **@security-reviewer** | Patrones regex de detección de secretos, reglas JWT/sesión/cripto, anotaciones OWASP |
| **@qa-tester** | Patrón Playwright Page Object Model, tabla de clasificación E2E |
| **@writer** | Plantilla de generación CODEMAP + flujo de actualización automática |
| **@code-reviewer** | Tabla de estándares de codificación D9 integrada |
| **@test-engineer** | Tabla de detección de frameworks, protocolo de gaps de cobertura, causas de flaky tests |
| **@code-simplifier** | Tabla de métricas de complejidad, patrones de simplificación, excepciones de estabilidad |

#### Habilidad mejorada (1)

- **`/remember`** — Añadido quality gate: filtro de 3 preguntas (¿accionable? ¿durable? ¿único?) antes de guardar

#### Infraestructura

- **Umbrales escalonados de agentes/habilidades**: warn <20/18, info <28/22, silent ≥28/22 (compatible hacia atrás)
- **Agrupación categorizada en árbol**: >20 agentes → "Core Agents" + "Language Reviewers" automáticamente
- **Hook post-tool-use** (`OMG_LINT_ON_EDIT=1`): typecheck/ESLint opcional al editar + sanitización de FILE_PATH
- **Parches de seguridad**: CVE de hono/node-server corregidos, vitest actualizado a 4.1.4, `.env*` añadido a `.gitignore`

---

### v1.0.5 (2026-04-10)

**Bug fix: colisión del nombre de habilidad con el Autopilot integrado de VS Code**

- **Renombrado**: habilidad `/autopilot` renombrada a `/omg-autopilot` para evitar colisión con el modo de permisos "Autopilot (Preview)" de VS Code
- **Corrección de frontmatter YAML**: eliminado el campo `allowed-tools` no soportado de todos los SKILL.md; `hint` renombrado a `argument-hint` según la especificación de VS Code
- **Causa raíz**: el nombre `autopilot` activaba el cambio interno de modo de permisos de VS Code en lugar de cargar las instrucciones del skill de OMG
- **Alcance**: directorios de skills, código del servidor MCP, definiciones de agentes, referencias cruzadas, tests y toda la documentación

---

## Licencia

MIT

---

## Copyright

Copyright (c) 2026 jmstar85. Distribuido bajo la [Licencia MIT](LICENSE).

---

<div align="center">

**Inspirado por:** [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) por Yeachan Heo

**El poder de la orquestación multi-agente, ahora para GitHub Copilot.**

</div>