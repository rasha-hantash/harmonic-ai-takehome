# Welcome to the Harmonic Fullstack Jam! :D

Please familiarize yourself with the [read up](https://www.notion.so/harmonicai/Technical-Screening-Preparation-Full-Stack-f398a6d4ad0a439fbcfca5474625ac32?pvs=4) before continuing.

In this repo, you'll find 2 deployable services:
1. Backend - dockerized deployable that will spin up a Python backend with FastAPI, Postgres SQL DB and some seeded data.
2. Frontend - locally deployable app via Vite with TypeScript/React

Please refer to the individual READMEs in the respective repos to get started!

Enjoy :D

Loom Video: https://www.loom.com/share/85e49cc27d194881ae6226a3bd52f42e?sid=1a048a8b-ef5f-4fe5-8f2d-0d5235a8f011

**Write up**

## Approaches Implemented

## 1. Loading Bar Implementation

To provide visual feedback during the process of adding multiple companies to the liked list, I implemented a loading bar.

### Assumptions and Tradeoffs:

- **Assumption:** Users appreciate visual confirmation that their action is being processed, especially for bulk operations.
- **Tradeoff:** Additional complexity in the UI and potential for increased cognitive load.
- **Benefit:** Clear indication of progress, reducing user uncertainty.

## 2. A single endpoint to handle both selecting individual and selecting all

### Assumptions and Tradeoffs:

- **Assumption:** Both adding an individual company and selecting all companies have the same logic
- **Tradeoff:** If, as it turns out, users expect different outcome from selecting individual versus multiple companies then we would have to reward the logic
- **Benefit:** Ability to ship fast by writing as little code as possible

## Next Steps

**Web Analytics Integration:** Implement web analytics using PostHog for insights into user behavior and feature usage of ***adding to liked***. This data can inform future feature development, such as allowing the user to create multiple lists and choose which lists the user wants to a company to. I would recommend adding this before the release of this feature. 

**Mom Test:** Talk to users about the adding to liked feature. Ask them ‘Mom Test’-like questions in order to parse out and see if they’d find a recommendation system helpful.

### Optimistic UI Design

Implementing an optimistic UI approach where the "Liked" status is immediately set to true upon user interaction. This decision could be made to enhance the perceived responsiveness of the application and provide instant feedback to the user. Ref: https://simonhearne.com/2021/optimistic-ui-patterns

### Assumptions and Tradeoffs:

- **Assumption:** The majority of "like" actions will succeed on the backend.
- **Tradeoff:** There's a risk of temporary inconsistency between the frontend state and the actual backend state.
- **Benefit:** Improved user experience through instant feedback.
