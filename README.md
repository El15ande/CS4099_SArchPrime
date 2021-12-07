# SArchPrime

2019/0, CS4099 (BSc): Software Architecture Viewpoint - Analysis & Visualisation.

Origin: [FinalSubmission branch](https://github.com/El15ande/CS4099_SArchPrime/tree/FinalSubmission).

## Setup

- Load [Vue CLI](https://cli.vuejs.org/) UI: `vue ui`
- Project set-up: `npm install`
- Compile & hot-reload (for development): `npm run serve`
- Compile & minify (for production): `npm run build`

- `Error: digital envelop routines::unsupported` solution
    - Windows: `set NODE_OPTIONS=--openssl-legacy-provider`
    - UNIX: `export NODE_OPTIONS=--openssl-legacy-provider`

---

## Technology Stack

- [vue@next](https://v3.vuejs.org/)
    - [vue-router](https://router.vuejs.org/)
    - [element-plus](https://element-plus.org/)
    - [@element-plus/icons](https://element-plus.org/en-US/component/icon.html)
- [jointjs](https://www.jointjs.com/)

---

## Development Route

- [ ] Framework
    - [x] UI: (Vue 3 framework, vue-router), Element-UI.
    - [x] Layout: sidebar, (header, main-board).
    - [ ] JointJS integration.
    - [x] SAPStore: light-weight flux-architecture state management.
    - [x] SAPServer: light-weight node.js server for online mode.
- [ ] Dashboard
    - [ ] Two-way ADF input: SAPServer (node.js online), file input (offline).
- [ ] Assistance

### Functional Requirements

### Non-Functional Requirements