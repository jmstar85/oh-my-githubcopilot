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
  <a href="#inicio-rápido">Comenzar</a> •
  <a href="#agentes">Agentes</a> •
  <a href="#habilidades">Habilidades</a> •
  <a href="#servidor-mcp">Servidor MCP</a> •
  <a href="#arquitectura">Arquitectura</a>
</p>

---

<h1 align="center">Now, you can also use this amazing features such as OMC for GitHub Copilot!</h1>

<p align="center">
  <img src="https://img.shields.io/badge/GitHub%20Copilot-Orchestrated-blue?style=for-the-badge&logo=github" alt="GitHub Copilot Orchestrated" />
</p>

---

## ¿Qué es OMG?

**oh-my-githubcopilot (OMG)** lleva a **GitHub Copilot** el enfoque de orquestación multiagente que [oh-my-claudecode (OMC)](https://github.com/yeachan-heo/oh-my-claudecode) desarrolló para Claude Code.

Si OMC potencia Claude Code mediante agentes especializados y automatización de flujos, OMG hace lo mismo dentro del agent mode de Copilot en VS Code. En lugar de depender de un único asistente para todo, OMG coordina **20 agentes especializados** y **18 habilidades reutilizables** a través de un servidor MCP para estructurar planificación, implementación, revisión y verificación.

> **No es un fork ni una copia de OMC.** Es una implementación independiente construida desde cero para aprovechar las capacidades de personalización de agentes en GitHub Copilot (`.agent.md`, `.prompt.md`, `SKILL.md`, herramientas MCP), inspirada por la arquitectura multiagente de OMC.

---

## ¿Por qué OMG?

- **Funciona dentro de VS Code**, sin CLIs adicionales ni procesos externos
- **Agentes especializados**, con separación clara entre perfiles de análisis y ejecución
- **Automatización de flujos**, desde `autopilot` hasta `ralph` y `ultrawork`
- **Barandillas de seguridad**, gracias a hooks pre/post tool-use
- **Estado persistente con MCP**, incluyendo workflow state, PRD y memoria del proyecto
- **Activación por lenguaje natural**, por ejemplo: "autopilot build me a REST API"
- **Verificación primero**, separando autoría y revisión con evidencia obligatoria

---

## Inicio rápido

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
autopilot: build a REST API for managing tasks
```

Desde ese momento, OMG se encarga de planificar, implementar, revisar y verificar.

### ¿No sabes por dónde empezar?

Si tus requisitos aún son difusos o quieres aclararlos primero:

```
deep-interview "I want to build a task management app"
```

OMG utiliza preguntas socráticas para detectar supuestos ocultos y aclarar el problema antes de escribir código.

---

## Agentes

OMG incluye **20 agentes especializados**, cada uno con un rol concreto y un nivel de acceso definido. Están declarados en `.github/agents/`.

| Agente | Rol | Acceso |
|-------|------|--------|
| **@omg-coordinator** | Orquestador principal de autopilot, ralph y workflows de equipo | Full |
| **@executor** | Implementación de código, features y corrección de bugs | Full |
| **@debugger** | Análisis de causa raíz, stack traces y errores de build | Full |
| **@architect** | Análisis de arquitectura, diseño de sistema y revisión estructural | Read-only |
| **@planner** | Planificación estratégica con flujo de entrevista | Plans only |
| **@analyst** | Análisis de requisitos, detección de huecos y riesgos de alcance | Read-only |
| **@verifier** | Verificación basada en evidencia y revisión de cobertura | Test runner |
| **@code-reviewer** | Revisión de código con severidad y detección de defectos lógicos | Read-only |
| **@security-reviewer** | Revisión OWASP, secretos, auth/authz y dependencias | Read-only |
| **@critic** | Revisión dura de planes y código antes del cierre | Read-only |
| **@test-engineer** | Estrategia de testing, TDD y endurecimiento de flaky tests | Full |
| **@designer** | Diseño UI/UX e implementación frontend | Full |
| **@writer** | README, documentación API y documentación técnica | Full |
| **@tracer** | Trazado causal y validación de hipótesis con evidencia | Full |
| **@scientist** | Análisis de datos, estadística y visualización | Read-only |
| **@qa-tester** | Pruebas CLI con tmux, integración y E2E | Full |
| **@git-master** | Commits atómicos, rebase y gestión del historial | Git only |
| **@code-simplifier** | Simplificación de código y reducción de complejidad | Full |
| **@explore** | Búsqueda en el codebase, localización de archivos y mapeo | Read-only |
| **@document-specialist** | Investigación de documentación externa y APIs | Read-only |

---

## Habilidades

Las habilidades son rutinas reutilizables que se activan con slash commands o palabras clave en lenguaje natural. Se definen en `.github/skills/`.

### Habilidades de workflow

| Habilidad | Qué hace | Palabras clave |
|-------|-------------|-----------------|
| `/autopilot` | Ejecución autónoma desde la idea hasta el código funcionando | `autopilot`, `build me`, `create me` |
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
| **State** | `omg_read_state`, `omg_write_state` | Estado de autopilot, ralph, ultrawork y otros modos |
| **PRD** | `omg_read_prd`, `omg_update_story`, `omg_verify_story` | Gestión de PRD con seguimiento de historias |
| **Workflow** | `omg_check_completion`, `omg_next_phase` | Transiciones de fase y verificación de finalización |
| **Memory** | `omg_read_memory`, `omg_write_memory` | Persistencia de conocimiento del proyecto |
| **Model Router** | `omg_select_model` | Recomendación de modelo según complejidad |

El estado se guarda en `.omc/` dentro del workspace.

```text
.omc/
├── state/              # estado por modo
├── plans/              # planes de ejecución
├── sessions/           # seguimiento de sesiones
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
- Rastrea archivos modificados para awareness de fases en autopilot
- Sigue resultados de tests para detección de ultraqa

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
└── .omc/                          # directorio de estado en runtime
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
| Número de agentes | 19+ | 20 agentes especializados |
| Skills | 10+ skills de workflow | 18 skills con disparadores por palabra clave |
| Gestión de estado | directorio `.omc/` | `.omc/` gestionado por MCP |
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

## Licencia

MIT

---

<div align="center">

**Inspired by:** [oh-my-claudecode](https://github.com/yeachan-heo/oh-my-claudecode) by Yeachan Heo

**Orquestación multiagente para GitHub Copilot.**

</div>