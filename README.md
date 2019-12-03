# CS4099_SHProject

DOER  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1. Description](#1-description)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[2. Objectives](#2-objectives)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3. Ethics](#3-ethics)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[4. Resources](#4-resources)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5. Links](#5-links)  
Technology Stacks  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1. Client-side implementation](#1-client-side-implmentation)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[2. Server-side implementation](#2-server-side-implementation)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3. Architecture data representation: JSON](#3-architecture-data representation-json)  

---

## DOER (ver 1.2)

0.1 Prototype: [Software Architecture Viewpoints – Analysis and Visualisation](https://blogs.cs.st-andrews.ac.uk/studentprojects/2019/02/28/software-architecture-viewpoints-analysis-and-visualisation/)  

### 1. Description

1.1 __Project title: Software architecture viewpoint design & visualisation tool__

1.2 __Description:__  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In software engineering, the process of transforming textual architecture documentations into some diagrammatic or visualisation representations is inevitable for architects and project managers, this could lead to numerous amount of components, connectors and view models documentations which emphasise distinct focal points regarding different stakeholders and contexts involved in the development (i.e. different architecture viewpoints). In industrial environment, the static architecture diagram (whiteboard handrafts or generic diagram design tools) may be transient and lack of visualisation or software engineering support, while professional modelling and analysing tools may be difficult to utilise and thus lead to a large amount of workload. On the other hand, existing software architecture design and visualisation tools (e.g. [Structurizr](http://structurizr.com), [Confluence](https://www.atlassian.com/software/confluence)) can satisfy most of the above requirements, but are rarely supported with the features of multiple viewpoints switching and connections revealing.  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This project aims to provide a composite software architecture viewpoint design and visualisation tool with customised elements designers:  
- For a single architecture view, it will help user design a single architecture diagram/visualisation product with customised components and connectors.  
- For multiple architecture views, it will help user reveal the conceptual and/or realistic connections between different components under different viewpoints.  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In addition, this tool will provide a user-friendly interface and support simple operations (e.g. drag-drop and text input) on core functions with some extension tools used for different software engineering behaviours. The final software artefact of this project could be a web application that has a strong front-end that focus on data representation and visualisation, and a light-weight back-end that focus on data storage.


### 2. Objectives

2.0 Objective list __ver 1.2__

2.1 __Primary objectives__: `SA = { Elements, Forms, Rationale/Constraints }`  
- [ ] 1. Implement an architecture component design tool that provides predefined components for user to build customised architecture components. (progress: single-level architecture component)
- [ ] 2. Support hierarchical features on architecture components. (progress: hierarchical architecture component)
- [ ] 3. Provide visualisation on architecture components.
- [ ] 4. Implement an architecture connector design tool that provides interactions among architectural components. (revealing the relationship by component definitions and supporting manually connection) (progress: hierarchical architecture component with intra-components connector)
- [ ] 5. Support hierarchical features on connectors. (progress: a single architecture view - hierarchical architecture component with inter-components connector)
- [ ] 6. Provide visualisation on connectors.
- [ ] 7. Implement a design tool that is able to edit and connect multiple views. (progress: composite views with view-view connections)
- [ ] 8. Support intra-components and inter-components connection. (progress: customised model: composite views with hierarchical view connections)
- [ ] 9. Based on connections, the tool is able to reveal constraints between different components and views. (progress: core function)
- [ ] 10. Conduct a user evaluation on core design tool, evaluate the design functions and the visualisation design.

2.2 __Secondary objectives__: improve user experience & software quality  
- [ ] 1. Improve user experience based on the first evaluation
Add IO function: the product diagram / visualisation can be imported or exported for reuse.
- [ ] 2. Implement extension tool(s) that provide further software engineering behaviours. (e.g. Agile developments, existing software engineering tools connection)
- [ ] 3. Conduct the second user evaluation on the overall tool, evaluate the quality and robustness of the system.

2.3 __Tertiary objectives__: support further user behaviours
- [ ] 1. Improve software quality furthermore based on the second evaluation.
- [ ] 2. Support collaborations on the tool, enable version control or multi-user editing on a single architecture.
- [ ] 3. Provide API for users to design customised extension tools.

### 3. Ethics
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Based on the objective 2.1.10 and 2.2.3, two separate user evaluations need to be conducted. These user evaluations does not need any personal information from users, but only collect their advice to further optimise the software. The artifact evaluation form is signed and submitted through MMS together.

### 4. Resources
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This project does not require any special hardware, software and licenses. All designs and implementations requirements can be fulfilled by current lab machines.

### 5. Document links

5.1 [Final report](https://docs.google.com/document/d/10sQ_gjIIORgNqmJ4ZFjDqs-XWodzEVgzkOk5H3DjjvM/edit?usp=sharing)

5.2 [Design sheet](https://docs.google.com/spreadsheets/d/17t339HamR7QzjQzV_GF6dRHW-bJkCdzY8Lhw6yHwgZk/edit?usp=sharing)

---

## Technology Stacks

### 1. Client-side implementation

1.1 Frontend framework: Vuetify (Vue.js)

1.2 Workbench graphics: JointJS (jQuery, Backbone.js)

### 2. Server-side implementation

2.1 Backend framework: Node.js

2.2 RESTful HTTP communication: Axios

### 3. Architecture data representation: JSON