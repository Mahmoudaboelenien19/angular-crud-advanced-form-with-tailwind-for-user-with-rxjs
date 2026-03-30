# Angular Advanced CRUD Application with RxJS

This project is an advanced, fully reactive CRUD (Create, Read, Update, Delete) application built with Angular 18, RxJS, and Tailwind CSS. It demonstrates robust state management and side-effect handling using reactive programming concepts without relying on external state management libraries (like NgRx). A mock REST API is provided by JSON Server.

## 🚀 Features

- **Full CRUD Operations:** Create, read, update, and delete user records.
- **Advanced Reactive State Management:** Utilizes RxJS (`BehaviorSubject`, `Subject`, `merge`, `scan`, `switchMap`, etc.) to cleanly manage application state, pagination, and search queries within the central `UsersService`.
- **Pagination & Search:** Integrates server-side pagination and real-time search filtering driven by reactive streams.
- **Standalone Components:** Built utilizing Angular's modern standalone component architecture.
- **Modern UI/UX:** Styled using Tailwind CSS and Angular Material for a responsive, clean design.
- **Mock Backend API:** Uses `json-server` for a realistic RESTful API experience directly out of the box.

## 🛠️ Tech Stack
- **Framework:** [Angular 18](https://angular.dev/)
- **State Management & Reactivity:** [RxJS](https://rxjs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Angular Material](https://material.angular.io/)
- **Mock Backend:** [JSON Server](https://github.com/typicode/json-server)

## 📂 Project Structure Overview

- `src/app/components/`: Contains standalone UI components.
  - `add-new-user/`: Modal component for adding/editing users.
  - `search-form/`: Search input component for dynamically filtering user records.
  - `user-card/`: Component that displays individual user details.
  - `users-list/`: Main smart container component handling the user grid and pagination controls.
  - `shared/`: Reusable, cross-cutting UI components.
- `src/app/services/users/users.service.ts`: The core reactive service handling HTTP requests, local state caching, effect management, and observable data streams.
- `src/app/models/`: TypeScript interfaces outlining the domain data structure.
- `src/app/services/globalObservablesHandler/`: A utility service handling repetitive loading and error state tracking for observable requests.

## ⚙️ Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [Angular CLI](https://angular.dev/tools/cli)

### Installation

1. **Clone the repository** (if not already local):
   ```bash
   git clone <repository-url>
   cd angular-crud-user-with-rxjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Application

To run this application properly, you need to spin up both the mock API server and the Angular development server simultaneously.

1. **Start the JSON Server (Mock API):**
   Open a terminal window in the project root and run:
   ```bash
   npm run json-server
   ```
   *This starts watching the local `data.json` file and spins up a REST API on `http://localhost:3000`.*

2. **Start the Angular App:**
   Open a second terminal window in the project root and run:
   ```bash
   npm start
   ```
   *This serves the Angular client application on `http://localhost:4200`.*

3. **View the Application:**
   Open your browser and navigate to `http://localhost:4200`.

## 🧠 RxJS Highlights in this Architecture
This project's architecture intentionally avoids traditional nested `subscribe()` blocks in UI components. Instead, it relies on the `async` pipe in templates. The internal `UsersService` implements a reactive pipeline pattern combining:
- **`merge()`**: To combine multiple user action streams (`add$`, `edit$`, `delete$`, `state$`) into a single unified event channel.
- **`scan()`**: To maintain the accumulated application state (the cached list of users) locally based on incoming state change effects, somewhat mimicking Redux.
- **`switchMap()` / `concatMap()`**: To handle concurrent request scenarios, mapping discrete loading configurations and executing side-effects dynamically.
