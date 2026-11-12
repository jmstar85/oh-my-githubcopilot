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

Si OMC potencia Claude Code mediante agentes especializados y automatización de flujos, OMG hace lo mismo dentro del agent mode de Copilot en VS Code. Con la integración de ECC (v1.1.0) y el port adaptado de skills de OMC, OMG ahora incorpora revisores especializados por lenguaje, TDD, escaneo de seguridad, checkpoints `ultragoal`, ayuda de investigación, guía de releases, QA visual y más. En lugar de depender de un único asistente para todo, OMG coordina **28 agentes especializados** y **37 habilidades reutilizables** a través de un servidor MCP para estructurar planificación, implementación, revisión y verificación.

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
     Descarga `oh-my-githubcopilot-1.5.0.vsix` desde la [última versión publicada](https://github.com/jmstar85/oh-my-githubcopilot/releases/latest) y luego ejecuta:
     ```bash
    code --install-extension ./oh-my-githubcopilot-1.5.0.vsix
     ```
     > Reemplaza la ruta por la ubicación donde hayas guardado el archivo.
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

OMG ahora incluye 37 habilidades, incluidas adaptaciones para VS Code/Copilot inspiradas en OMC: `ultragoal`, `visual-verdict`, `release`, `deepinit`, `skillify`, `writer-memory`, `configure-notifications`, `wiki`, `autoresearch`, `hud`, `external-context`, `sciomc` y `ask`.

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

OMG incluye un servidor MCP en TypeScript para gestionar estado persistente del workflow. Está registrado mediante `.vscode/mcp.json` y expone seis herramientas:

| Herramienta | Propósito |
|------|---------|
| `omg_read` | Lee el estado del workflow según `scope`: `state`, `prd`, `phase`, `ultragoal`, `checkpoint` o `all` (resumen compacto) |
| `omg_write` | Escribe estado, crea PRD e historias, avanza las fases de autopilot y registra hitos de ultragoal (`scope` + `op`: `set`, `clear`, `advance`) |
| `omg_verify` | Marca una historia del PRD como aprobada o completa un ultragoal — fail-closed: se rechaza salvo que la evidencia no esté vacía y todos los ítems hayan pasado |
| `omg_check_completion` | Puerta de completitud: workflows activos, historias sin verificar, ultragoal activo |
| `omg_checkpoint` | Guarda un checkpoint de sesión y devuelve el texto de traspaso para la siguiente sesión (se restaura con `omg_read scope:"checkpoint"`) |
| `omg_memory` | Conocimiento a nivel de proyecto: `get`, `search`, `set`, `delete` |

> **¿Vienes de 1.4.x?** Las 27 herramientas de las versiones anteriores se consolidaron en estas seis en v1.5.0 ([correspondencia](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/design/v1.5-context-diet.md#42-target-surface-6-tools)). Para conservar los nombres antiguos como adaptadores obsoletos hasta la 2.0, define `OMG_LEGACY_TOOLS=1` en el `env` del servidor en `.vscode/mcp.json`.
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

### Huella de contexto (v1.5.0)

Tokens que OMG añade a **cada** solicitud de Copilot antes de que empiece tu tarea (tokenizador o200k; herramientas MCP medidas a partir de un `tools/list` real). Para reproducirlo: `cd evals && npm install && npm run baseline`.

| Contexto siempre inyectado | v1.4.4 | v1.5.0 | Cambio |
|-------------------------|-------:|-------:|:------:|
| `copilot-instructions.md` | 3,594 | 549 | −85% |
| Definiciones de herramientas MCP | 2,585 (27 herramientas) | 863 (6 herramientas) | −67% |
| Descripciones de skills (37) | 1,308 | 1,331 | +2% |
| Descripciones de agentes (28) | 1,213 | 1,213 | — |
| Archivos de prompt (3) | 38 | 38 | — |
| **Total** | **8,738** | **3,994** | **−54%** |

> Cota inferior: no se cuentan el texto envoltorio que el host añade alrededor de las listas de herramientas ni lo que inyecten los hooks cuando se disparan. Los cuerpos de agentes y skills se cargan bajo demanda. Cada frase de la tabla de palabras clave eliminada se sigue comprobando contra la descripción de la skill correspondiente (`npm run activation`: 80 frases, 0 faltantes).

### Instantánea del proyecto (v1.3.0)

| Métrica | Valor |
|---------|-------|
| Código total | 25.964 líneas |
| Período de desarrollo | 12 días (6–17 de abril de 2026) |
| Total de commits | 33 |
| Agentes | 28 (20 núcleo + 8 revisores de lenguaje) |
| Skills | 37 |
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
│   ├── skills/                    # 37 rutinas de habilidades
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
| Skills | 10+ skills de workflow | 37 skills con disparadores por palabra clave |
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

### v1.5.0 (2026-11-11) — Dieta de contexto

**OMG ahora consume menos de la mitad de contexto por solicitud.** Los tokens siempre inyectados bajan de 8,738 a 3,994 (−54%) sin ningún cambio en los workflows que invocas. Consulta la tabla de huella de contexto en la sección Benchmark.

- **`copilot-instructions.md`: 3,594 → 549 tokens.** Los catálogos de agentes, skills, palabras clave y herramientas duplicaban lo que Copilot ya expone a partir del frontmatter y de los esquemas de herramientas; solo quedan las obligaciones siempre activas (evidencia antes de dar algo por completado, pasada de revisión independiente, trailers de commit, límites de los hooks, degradación elegante).
- **Herramientas MCP: 27 → 6** (`omg_read`, `omg_write`, `omg_verify`, `omg_check_completion`, `omg_checkpoint`, `omg_memory`), 2,585 → 863 tokens. Los formatos en disco bajo `.omg/` no cambian — el estado de 1.4.x se lee sin migración.
- **Verificación fail-closed**: una historia del PRD solo puede marcarse como aprobada, y un ultragoal como completado, mediante `omg_verify` con evidencia no vacía en la que todos los ítems hayan pasado.
- **Frases de activación preservadas**: la tabla de palabras clave desaparece, pero cada frase que listaba sigue activando su skill desde la descripción de la skill (80 frases comprobadas; 7 restauradas — `prd loop`, `story loop`, `stakeholder interview`, `check secrets`, `audit deps`, `cancel omg`, `cancelomc`).
- **Regla de presupuesto de sesión**: al 50% de la ventana de contexto, el agente termina la edición en curso, hace commit del trabajo verificado, crea un checkpoint y hace el traspaso con un prompt autocontenido; `omg_checkpoint` devuelve el texto de traspaso.
- **Regla de informe de cierre**: cada informe de trabajo termina con el número de tareas pendientes y un resumen de las completadas.
- **Correcciones**: `OMG: Update Convention Files` ahora recompila el servidor MCP (antes solo lo hacía Initialize). La extensión ya no falla al activarse en las versiones actuales de VS Code: el id de su provider MCP no estaba declarado en `package.json`, por lo que el registro lanzaba una excepción y la barra de estado y la detección de sesiones externas nunca se iniciaban. Ahora el provider cede ante el servidor definido en `.vscode/mcp.json`. Hooks de PowerShell: la guarda de force-push no detectaba `--force` / `-f` al final de la entrada de la herramienta, y ambos hooks fallaban en Windows PowerShell 5.1 — corregido; ahora se comportan igual que los hooks de bash.
- **Medible**: `evals/` añade una línea base de huella (`npm run baseline`), una comprobación estática de activación (`npm run activation`) y sondas opcionales en vivo con la CLI.
- **Docs**: [ADR-0001](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/adr/0001-replatform.md) (la dirección de v2), un [borrador de modelo de amenazas](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/security/threat-model.md) y el [diseño de v1.5](https://github.com/jmstar85/oh-my-githubcopilot/blob/main/docs/design/v1.5-context-diet.md).

**Actualización desde 1.4.x**

1. Instala el VSIX 1.5.0, ejecuta `OMG: Update Convention Files` y luego recarga la ventana. Instalaciones manuales: copia `.github/` y `mcp-server/`, y luego ejecuta `cd mcp-server && npm install && npm run build`.
2. Si tus propios prompts o agentes llaman a los nombres de herramientas antiguos, pásalos a las seis herramientas nuevas, o define `OMG_LEGACY_TOOLS=1` en el `env` del servidor (`.vscode/mcp.json`) para conservar los nombres de 1.4 como adaptadores obsoletos.

**Obsoleto — se eliminará en 2.0**

- Los nombres de herramientas MCP de 1.4 (disponibles solo con `OMG_LEGACY_TOOLS=1`).
- `/resume-claude`, `/push-omc` y las herramientas del puente OMC (en 1.5 también requieren `OMG_LEGACY_TOOLS=1`).
- `omg_select_model` (los agentes declaran `model:` en el frontmatter).

- **Verificación**: build del servidor MCP y 51 tests (50 pasan; el test de symlinks requiere el privilegio de symlink en Windows), 41 tests unitarios de la extensión de VS Code, huella de 3,994 tokens, activación 80/80.
- VSIX: `oh-my-githubcopilot-1.5.0.vsix`, adjunto al GitHub Release (ya no se incluye en el repositorio).

### v1.4.4 (2026-05-16) — Port adaptado de skills OMC + Ultragoal MCP

**Porta workflows de alto valor de OMC a OMG con comportamiento nativo para VS Code/Copilot.** OMG pasa a 37 skills e incorpora durable goal tracking con MCP.

- Herramientas MCP de `ultragoal`: `omg_ultragoal_create`, `omg_ultragoal_status`, `omg_ultragoal_checkpoint`, `omg_ultragoal_complete`.
- 13 skills adaptadas: `visual-verdict`, `release`, `deepinit`, `skillify`, `writer-memory`, `configure-notifications`, `ultragoal`, `wiki`, `autoresearch`, `hud`, `external-context`, `sciomc`, `ask`.
- Actualiza Copilot instructions, keyword triggers, hook gates y umbrales de skills (`CORE=24`, `EXTENDED=37`).
- Verificación: MCP 23 tests, VS Code extension 29 tests, VSIX <20MB.
- VSIX: `oh-my-githubcopilot-1.4.4.vsix`.

### v1.4.3 (2026-05-11) — Puente bidireccional: OMG → OMC Push

**Cierra el puente de v1.4.0 en un viaje de ida y vuelta OMG ↔ OMC completo.** v1.4.0 envió solo la importación `omc → omg`; v1.4.3 añade la dirección inversa `omg → omc` para que el trabajo realizado en GitHub Copilot pueda continuar en Claude Code.

- **Nuevo módulo `mcp-server/src/bridge/omg-exporter.ts`**: composición (no copia ciega) — `prd.json` y `project-memory.json` son copias de archivo; `active_modes[]` del checkpoint OMG se **descompone** en archivos `.omc/state/{mode}-state.json` por modo (operación inversa de la composición del omc-importer de v1.4.0); `.omc/state/session-checkpoint.json` se compone con provenance traducida.
- **Nuevo helper compartido `mcp-server/src/bridge/conflict-utils.ts`**: `shouldSkipForConflict()` usa el campo `timestamp` embebido como primitiva de conflicto principal para `session-checkpoint.json` (mtime como fallback en otros archivos — resuelve la fragilidad de git-checkout que muta mtime); `rotateBackup()` mantiene las últimas N=3 instantáneas `.previous.{ISO}.json` con timestamp, aplicado simétricamente en los lados de import y export.
- **Nueva herramienta MCP `omg_export_external_session({target: "omc", force?})`** con contrato de atomicidad: `.omg/state/last-export-token.json` es el ÚLTIMO efecto secundario — los fallos de escritura parcial no dejan token, por lo que las operaciones siguientes tratan correctamente la transacción como no confirmada.
- **Seguridad ida-y-vuelta vía guardia de bucle con doble escritura**: el importer lee `.omg/state/last-export-token.json` o el `source_origin === "bridged-from-omg"` del checkpoint destino — la guardia sobrevive si se borra cualquiera de los dos lados. Sin TTL temporal; el token se invalida solo cuando el `source_origin` del destino vuelve a `"native"` o cambia el `source_session_id`.
- **Schema de provenance extendido** (compatible con versiones anteriores): el nuevo campo `source_origin` (`"native" | "bridged-from-omc" | "bridged-from-claude-code" | "bridged-from-omg"`) es la señal de provenance autoritativa; el legado `source_tool: "copilot"` se mantiene. El nuevo campo `workspace_root` impulsa una guardia de identidad de proyecto que aborta antes de cualquier mutación cuando el path del workspace en el checkpoint origen no coincide con el workspace actual.
- **Skill `/push-omc` (6 pasos)**: detect → compare → confirm → export → summarize → continue. Palabras clave de disparo: `/push-omc`, `"push omc"`, `"omc 푸시"`, `"omc로 보내기"`, `"sync to omc"`, `"export to omc"`. Espejo en `vscode-omg/resources/templates/skills/push-omc/SKILL.md`.
- **Comando VS Code `omg.pushExternal`** ("OMG: Push to External Session (OMC)"): solo iniciado por el usuario — sin notificación de push en activación (el push permanece como acción deliberada del usuario).
- **`omg_compare_checkpoints` reporta ambas direcciones**: ahora retorna `omg_newer_than_external` junto a `newer_than_omg`, de modo que `/push-omc` y `/resume-claude` comparten la misma superficie de comparación.
- **Pruebas crecen de 8 → 18+** distribuidas en 6 zonas (Unit, Provenance, Round-trip guard, Composition, Conflict-path, Project-identity).
- **Diferido a v1.5.x**: dirección `omg → claude-code`. Requeriría sintetizar cadenas UUID de `tool_use`/`tool_result` válidas y compatibles con el contrato de resume-by-id de Claude Code; tracking: TBD.
- VSIX: `oh-my-githubcopilot-1.4.3.vsix`.

### v1.4.2 (2026-05-10) — Arreglo de respaldo Opus 4.7 → 4.6

**Enrutamiento de Opus 4.7 ahora es seguro frente al límite de cost-tier al añadir `Claude Opus 4.6 (copilot)` como respaldo en línea.**

- Los 7 agentes de razonamiento profundo (`analyst`, `architect`, `code-reviewer`, `critic`, `omg-coordinator`, `planner`, `security-reviewer`) ahora usan un arreglo YAML en `model:`: `["Claude Opus 4.7 (copilot)", "Claude Opus 4.6 (copilot)"]`.
- Motivo: VS Code Copilot bloquea las llamadas de subagentes que exceden el techo de cost-tier del modelo de chat activo. Con una base 7.5x (p. ej. `GPT-5.5`), pedir solo `Opus 4.7` (15x) fallaba en lugar de degradar.
- Nuevo comportamiento: si el techo de la sesión lo permite, se usa Opus 4.7; de lo contrario, el agente cae transparentemente a Opus 4.6 en vez de fallar.
- Sin cambios para GPT-5.5 (15 agentes) ni Sonnet 4.6 (6 agentes).
- VSIX: `oh-my-githubcopilot-1.4.2.vsix`.

### v1.4.1 (2026-05-09) — Enrutamiento de modelos por rol de agente

**Se remapearon los 28 agentes a preferencias de modelo Copilot adecuadas para cada tarea**

- Se actualizó el frontmatter `model:` para usar nombres de modelo calificados como `GPT-5.5 (copilot)` y `Claude Sonnet 4.6 (copilot)`.
- Los agentes de razonamiento y aprobación de alto riesgo se mantienen en Claude Opus 4.7; depuración, verificación, investigación, pruebas, diseño y revisiones especializadas usan GPT-5.5; ejecución, exploración, documentación, QA interactivo, git y simplificación usan Claude Sonnet 4.6.
- `omg_select_model` ahora usa el mismo conjunto de modelos permitidos y overrides por rol, eliminando recomendaciones obsoletas como `gpt-4.1`, `gpt-4.1-mini` y modelos Claude con formato de punto.
- Smoke test de modelos: `GPT-5.5 (copilot)` se invocó correctamente; `Claude Opus 4.7 (copilot)` fue reconocido por Copilot pero bloqueado por el límite de cost-tier del entorno actual, no por una cadena de modelo obsoleta.

| Agente | Modelo |
|---|---|
| `analyst` | `Claude Opus 4.7 (copilot)` |
| `architect` | `Claude Opus 4.7 (copilot)` |
| `code-reviewer` | `Claude Opus 4.7 (copilot)` |
| `critic` | `Claude Opus 4.7 (copilot)` |
| `omg-coordinator` | `Claude Opus 4.7 (copilot)` |
| `planner` | `Claude Opus 4.7 (copilot)` |
| `security-reviewer` | `Claude Opus 4.7 (copilot)` |
| `csharp-reviewer` | `GPT-5.5 (copilot)` |
| `database-reviewer` | `GPT-5.5 (copilot)` |
| `debugger` | `GPT-5.5 (copilot)` |
| `designer` | `GPT-5.5 (copilot)` |
| `document-specialist` | `GPT-5.5 (copilot)` |
| `go-reviewer` | `GPT-5.5 (copilot)` |
| `java-reviewer` | `GPT-5.5 (copilot)` |
| `python-reviewer` | `GPT-5.5 (copilot)` |
| `rust-reviewer` | `GPT-5.5 (copilot)` |
| `scientist` | `GPT-5.5 (copilot)` |
| `swift-reviewer` | `GPT-5.5 (copilot)` |
| `test-engineer` | `GPT-5.5 (copilot)` |
| `tracer` | `GPT-5.5 (copilot)` |
| `typescript-reviewer` | `GPT-5.5 (copilot)` |
| `verifier` | `GPT-5.5 (copilot)` |
| `code-simplifier` | `Claude Sonnet 4.6 (copilot)` |
| `executor` | `Claude Sonnet 4.6 (copilot)` |
| `explore` | `Claude Sonnet 4.6 (copilot)` |
| `git-master` | `Claude Sonnet 4.6 (copilot)` |
| `qa-tester` | `Claude Sonnet 4.6 (copilot)` |
| `writer` | `Claude Sonnet 4.6 (copilot)` |

Opus 4.6 se conserva solo como alternativa fallback explícita en el router de modelos, no como modelo predeterminado de ningún agente.

### v1.4.0 (2026-05-03) — Puente de sesión Claude Code / OMC

**Puente unidireccional: reanuda sesiones interrumpidas de Claude Code u OMC en GitHub Copilot**

- **Importador JSONL de Claude Code**: Analiza los logs de sesión en `~/.claude/projects/` para extraer archivos modificados, último prompt del usuario y última respuesta del asistente. Soporte de detección de bloques Write/Edit/MultiEdit tool_use.
- **Importador OMC**: Mapea el directorio de estado `.omc/` (PRD, estado de workflow, checkpoint, memoria de proyecto) a equivalentes `.omg/` con resolución de conflictos basada en mtime.
- **3 nuevas herramientas MCP**: `omg_detect_external_session` (detección de solo lectura), `omg_import_external_session` (importación con respaldo), `omg_compare_checkpoints` (comparación de timestamps).
- **Auto-detección en VS Code**: Al activarse, detecta sesiones externas y muestra notificación ("Reanudar / Ignorar / Siempre ignorar"). Se omite si el checkpoint OMG tiene menos de 30 min.
- **Skill `/resume-claude`**: Flujo de 6 pasos — detectar → comparar → confirmar → importar → resumir → continuar. Palabras clave: "resume claude", "retomar claude", "continuar trabajo".
- **Seguridad**: Archivos de checkpoint importados con `chmod 0600`. Checkpoints existentes respaldados como `.previous.json` antes de importar.
- **Extensión del esquema de checkpoint**: 4 nuevos campos opcionales — `source_tool`, `source_session_id`, `imported_at`, `imported_summary` (retrocompatible).

### v1.3.1 (2026-04-23) — Soporte Copilot CLI

**Compatibilidad dual para el modo agente de VS Code y Copilot CLI independiente** (Issue #4)

- **Normalización de frontmatter de agentes**: Campo `model:` cambiado de array a string en los 28 agentes. Equivalentes CLI (`read`, `edit`, `shell`, `create`, `delete`) añadidos a listas `tools:`.
- **Entrada dual de hooks**: Los hooks pre/post tool-use ahora aceptan variables de entorno VS Code y JSON stdin CLI. Normalización de nombres de herramientas mapea nombres CLI a equivalentes VS Code.
- **Registro `hooks.json`**: Nuevo archivo wrapper CLI para descubrimiento de `preToolUse` / `postToolUse`.
- **Script adopt `--target-env`**: Nueva flag `--target-env vscode|cli|both` (predeterminado: `both`). Modo CLI genera `.copilot/mcp-config.json` y omite `.vscode/mcp.json`. `--global-mcp` instala en `~/.copilot/`.
- **Fallback CLI de skills**: 5 skills interactivos (`deep-interview`, `omg-autopilot`, `ralplan`, `plan`, `self-improve`) actualizados con fallback CLI — opciones numeradas markdown cuando `vscode_askQuestions` no está disponible.
- **Documentación**: Badge CLI, "Opción C: Copilot CLI" inicio rápido, uso de `--target-env` añadidos a todos los READMEs.

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