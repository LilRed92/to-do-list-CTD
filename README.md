# To Do List 📝

To Do List is a clean, lightweight React-based web application designed to help users track and organize their daily tasks. Built with React 19 and Vite, this minimalist application offers an efficient, components-focused interface for quick task reference, list management, and optimized development workflow.

---

## 🛠️ Built With

[![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML) [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS) [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)

[![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/) [![Dotenv](https://img.shields.io/badge/Dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)](https://github.com/motdotla/dotenv) [![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/) [![Husky](https://img.shields.io/badge/Husky-black?style=for-the-badge&logo=git&logoColor=white)](https://typicode.github.io/husky/) [![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

## 🔗 Live Demo
*Link to deployed application on Vercel will go here.*

## ✨ Features

- **User Authentication**: Login and logout with CSRF-token-based session auth, with protected routes for authenticated users only.
- **Full Todo Management**: Create, edit, complete, and delete todos, with non-optimistic delete handling to avoid accidental data loss.
- **Search, Sort & Filter**: Search todos by title, filter by status (All/Active/Completed), and sort by creation date or title.
- **Theme Toggle**: Switch between Light Mode and Dark Mode, with the preference saved across sessions.
- **Responsive Design**: Mobile-friendly layout with a stacking header/nav and touch-friendly controls down to small screens.
- **Accessible by Design**: Visible focus states and minimum 44px touch targets on interactive elements.
- **Client-Side Validation**: Field-level validation on login and todo forms to prevent empty or overly long submissions.
- **Continuous Integration**: Automated linting and build checks on every push and pull request via GitHub Actions.
- **AI-Assisted Dev Workflow**: Automated commit message and PR description generation powered by Gemini.

## 💻 Technologies Used

**Frontend:**
- React 19 (Built with Vite)
- CSS Modules for scoped, conflict-free styling
- HTML5 / CSS3 for fundamental app styling
- ES6 JavaScript syntax

**Tooling & Dev Ecosystem:**
- ESLint for styling validation and code quality checking
- Husky for Git hooks management
- Dotenv for loading local environment variables used by dev-tooling scripts (commit message and PR description generation)

## 📸 Screenshots

_(Replace these placeholder links with actual paths to your screenshots/gifs once uploaded to your repository)_

|                                        Desktop View                                          |                                        Mobile View                                            |
| :------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: |
| <img width="800" alt="Desktop View" src="https://via.placeholder.com/800x450?text=Desktop+View" /> | <img width="300" alt="Mobile View" src="https://via.placeholder.com/300x600?text=Mobile+View" /> |

## 🚀 Getting Started

Follow these steps to get the development environment running on your machine:

### Prerequisites
- Node.js (`^20.19.0` or `>=22.12.0`, per the Vite/ESLint version requirements in `package.json`)
- npm or yarn

### Clone the repository
```bash
git clone https://github.com/LilRed92/to-do-list-CTD.git
cd to-do-list-CTD
```

### Install Dependencies
Install the client application dependencies directly from the root directory:
```bash
npm install
```

### 📜 Available Scripts

- `npm run dev`: Launch the local development environment using Vite on `http://localhost:5173`.
- `npm run build`: Build the application for production into the `dist` folder.
- `npm run preview`: Locally preview the production build generated in the `dist` folder.
- `npm run lint`: Run ESLint to analyze the code for potential issues.

## 🎨 Design Decisions

- **CSS Modules:** Chose CSS Modules (Option A) to keep styling scoped to individual components, preventing any global namespace collisions while allowing for familiar vanilla CSS syntax.
- **Theming:** Implemented a `ThemeContext` to provide a global Light/Dark mode toggle. Colors were carefully selected using CSS Custom Properties (variables) in `index.css` to map semantic colors (like `--bg-color` and `--text-color`) based on the active theme, falling back on Carbon Black (`#232323`) and Silver (`#CCCCCC`).
- **Typography:** Adopted Google's `Lato` font for a sleek, modern, and highly readable interface.

## 🔌 API Reference

Todos are fully persisted through a REST API, proxied via `vercel.json` to the production backend. The client authenticates with a CSRF token (sent as `X-CSRF-TOKEN`) and calls:

| Method   | Endpoint          | Description                     |
| -------- | ----------------- | -------------------------------- |
| `GET`    | `/api/tasks`       | Fetch todos (supports sort/filter query params). |
| `POST`   | `/api/tasks`       | Create a new todo.               |
| `PATCH`  | `/api/tasks/:id`   | Update or complete a todo.        |
| `DELETE` | `/api/tasks/:id`   | Delete a todo.                    |

Each task uses the following schema:

| Data Property | Type      | Description                                            |
| -------------- | --------- | ------------------------------------------------------- |
| `id`           | `Number`  | Unique task identifier.                                  |
| `title`        | `String`  | Description of the task to complete (Max 100 chars).     |
| `isCompleted`  | `Boolean` | Status of the task.                                      |

## 🌍 Deployment

This app is configured to be deployed on Vercel. A `vercel.json` file is included in the root directory to automatically proxy `/api/*` requests to the production backend API, substituting the role of the Vite server proxy used during local development.

## 🔮 Future Improvements

- Add drag and drop functionality for reordering todos.
- Implement Progressive Web App (PWA) features for offline use.
- Add robust unit testing for critical components using Vitest or Jest.

## 📄 License Information

This project is licensed under the MIT License - see the LICENSE file for details.

## 📫 Contact Information

- GitHub: [LilRed92](https://github.com/LilRed92)

## 🤖 AI Usage

This project used AI to auto create git commit messages, populate this README.md, and auto create PR summaries. (Specifically Gemini)