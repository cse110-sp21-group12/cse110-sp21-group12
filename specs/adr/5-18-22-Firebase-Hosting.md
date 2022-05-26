# Firebase Hosting Decision

* Status: [Proposed & Accepted] <!-- optional -->
* Deciders: [whole team] <!-- optional -->
* Date of Last Update: [2021-04-29] <!-- optional -->

## Context and Problem Statement
This ADR was made after the fact, this issue was decided in the 4/29 meeting 

To improve user accessability we wanted to move from the project's IndexedDB local server to a database online. Firebase was chosen because some members on our team were familiar with it. Our team was debating how to implement it.

## Considered Options
* a dedicated backend server (likely using `node.js` due to team familiarity), and create a REST API for our front end to call
* a serverless option, our frontend would include files from firebase that defines the CRUD functions for our javscript to call.

## Decision Outcome
Our team was was confused on the difference between the 2 options, since both seem to result in the same functionality. We also asked our TA mentor on what the pros and cons of each option are and they said either option is ok for the project we were doing. We ended up going with the serverless option because it seemed easier to implement, we already had team members familiar with it, and it seemed to produce the same end result as the first option. Writing a server seemed more risky, and would take time away from doing other improvements.
