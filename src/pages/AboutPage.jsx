import "./AboutPage.css";

function AboutPage() {
  return (
    <div className="about-container">
      <h2 className="about-title">About This App</h2>
      <p>
        This is a todo list app for creating, sorting, filtering, and completing
        tasks. Todos are saved to a server so they persist across sessions.
      </p>
      <h3>Features</h3>
      <ul>
        <li>Create and complete todos</li>
        <li>Sort todos by creation date or title</li>
        <li>Search todos by title</li>
        <li>Filter todos by status via the URL</li>
        <li>Protected pages that require login</li>
      </ul>
      <h3>Built With</h3>
      <div className="about-badge-cloud">
        <span className="about-badge about-badge-lg about-badge-react">
          <svg className="about-badge-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="2.2" fill="#000" />
            <g fill="none" stroke="#000" strokeWidth="1.4">
              <ellipse cx="12" cy="12" rx="10" ry="4.2" />
              <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
              <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
            </g>
          </svg>
          <span className="about-badge-label">React</span>
        </span>
        <span className="about-badge about-badge-lg about-badge-vite">
          <svg className="about-badge-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polygon points="6,2 18,2 13,13 20,13 8,22 10,12 4,12" fill="#fff" />
          </svg>
          <span className="about-badge-label">Vite</span>
        </span>
        <span className="about-badge about-badge-lg about-badge-js">
          <span className="about-badge-icon">JS</span>
          <span className="about-badge-label">JavaScript</span>
        </span>
        <span className="about-badge about-badge-md about-badge-router">
          <svg className="about-badge-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="2" fill="#fff" />
            <g fill="none" stroke="#fff" strokeWidth="1.4">
              <ellipse cx="12" cy="12" rx="9" ry="3.8" />
              <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
              <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
            </g>
          </svg>
          <span className="about-badge-label">React Router</span>
        </span>
        <span className="about-badge about-badge-md about-badge-css">
          <svg className="about-badge-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3,2 L18,2 L21,5 L21,16 L12,22 L3,16 Z" fill="none" stroke="#fff" strokeWidth="1.4" />
            <text x="12" y="15" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff">3</text>
          </svg>
          <span className="about-badge-label">CSS</span>
        </span>
        <span className="about-badge about-badge-sm about-badge-vercel">
          <svg className="about-badge-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polygon points="12,5 20,19 4,19" fill="#fff" />
          </svg>
          <span className="about-badge-label">Vercel</span>
        </span>
      </div>
    </div>
  );
}

export default AboutPage;
