# CS4099_SHProject

DOER  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1. Description](#1-description)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[2. Objectives](#2-objectives)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[3. Ethics](#3-ethics)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[4. Resources](#4-resources)

---

## DOER (ver 1.0)

0.1 Prototype: [Software Architecture Viewpoints – Analysis and Visualisation](https://blogs.cs.st-andrews.ac.uk/studentprojects/2019/02/28/software-architecture-viewpoints-analysis-and-visualisation/)  

### 1. Description

1.1 __Title: Software architecture viewpoint visualisation tool__

1.2 __Project aim__: To design & implement a SA visualisation tool that  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Helps user to design SA diagram using different models from different architectural viewpoints.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Helps user to reveal conceptual or realistic connections between different diagram components under different viewpoints.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Is user-friendly on its core functions and with extended tools that support different extra software engineering functions.  

1.3 __Background & context__:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A software’s architecture can be volatile under different views and the architectural structure can be very subjective for different people/stakeholders involved in software development process, thus an architect needs to present the SA diagram using reasonable models and components.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Static diagrams (from whiteboard or general purpose diagram designer) are transient & lack of software engineering/architectural support, while professional models (from modelling tools & analysis tools) may be difficult to use & lead to large workload. Existing SA design tools (e.g. [Structurizr](https://structurizr.com/), [Confluence](https://www.atlassian.com/software/confluence?=undefined&aceid=&adposition=1t1&adgroup=58868899115&campaign=1508257343&creative=347551625034&device=c&keyword=software%20developed&matchtype=b&network=g&placement=&ds_kids=p35772571902&ds_e=GOOGLE&ds_eid=700000001542923&ds_e1=GOOGLE&gclid=CjwKCAjwq4fsBRBnEiwANTahcBVATBZHS40NfBZ0PM1lvl0NbvKmNXO747Oa0oqeu7LeA98ZHfI-YBoCUH0QAvD_BwE&gclsrc=aw.ds)) are rarely supported with the ‘viewpoint’ feature or able to reveal the relationship between different viewpoints.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;My aim is to design a SA diagram designer that supports designation using customised models & viewpoint switching, also the tool should not only be user-friendly on its core designing functions for better user experience, but also provide some extensions that satisfy different purposes from various contexts.

1.4 __Project intention__:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The final software artefact of this project is a web application that supports the functions mentioned above, it could consist of a strong front-end that supports different visualisation techniques plus a light-weighted back-end that focus on data processing & storage.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The core designing tool could provide interface for extension plugins/microservices in order to adapt to different software engineering context.

### 2. Objectives

2.1 __Primary objectives__: `SA = { Elements, Forms, Rationale/Constraints }`  
* (Core-1) Design & implement a SA diagram designer that can construct a SA diagram from single viewpoint. The tool should provide enough elements & forms for user to build customised SA components & rationale, it should also support predefined components, rationale & model based on existing SA knowledge.  
* (Core-2) Design & implement a SA diagram combination tool that can establish connections between SA diagrams specified in Core-1. The tool should build a connection between components/rationale in different diagrams in accordance with component/rationale definition and manual connection from the user.
* (CoreFeature-1) Add a hierarchical feature to components/rationale so that each single SA diagram specified in Core-1 can be a hierarchical diagram under a single viewpoint.
* (CoreFeature-2) Based on the connection specified in Core-2, the tool could also figure out the constraints in the rationale & provide a solution on constraints.

2.2 __Secondary objectives__: improve user experience & software quality
* (CoreFeature-3) Add IO function so that a Core-1/Core-2 product can be imported or exported as binary file for reuse.
* (CoreFeature-4) Support Core-1/Core-2 product with some visualisation techniques (e.g. 3-d display, interactive UI actions)
* (Extension-1) Provide a stable storage/export path (database/cloud storage) based on CoreFeature-3
* (Extension-2) Design & implement extension for further engineering behaviours (Agile development, existing SE tools connection)

2.3 __Tertiary objectives__: support complex user behaviours
* (Extension-3) Design & implement extension for further coding behaviours (Version Control Systems connection, coding tool connection).
* (Extension-4) Provide API so that user can design customised extension.

### 3. Ethics
Research with human subjects: this project does not have any potential adverse consequences for human welfare and wellbeing. However this project may involve some user evaluation near the middle of development process for further extensions.  
Potential physical/psychological harm/discomfort/stress: there is no foreseeable risks to any of researchers and participants.  
Conflicts of interest: there is no conflicts of interest.  
Funding: this project is not funded externally.  
Research with animals: this project does not involve any living animals.

### 4. Resources
This project is about to design a software artefact, thus there is no extra software/hardware required. However the final back-end may be hosted on the nginx server on school host.