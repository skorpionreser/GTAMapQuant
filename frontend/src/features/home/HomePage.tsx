import { Link } from 'react-router-dom'
import './HomePage.css'

const wikiSections = [
  {
    icon: '◈',
    title: 'Start here',
    text: 'A short route through the systems that matter during your first hours in San Andreas.',
  },
  {
    icon: '▣',
    title: 'Activities',
    text: 'Find jobs, events and places where the city has something to offer.',
  },
  {
    icon: '◌',
    title: 'Economy',
    text: 'Useful references for services, businesses and everyday city life.',
  },
  {
    icon: '⌁',
    title: 'District guide',
    text: 'A growing guide to the neighborhoods, routes and landmarks of the state.',
  },
]

export function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__copy">
          <span className="page-eyebrow page-eyebrow--accent">QUANT GTA V WIKI</span>
          <h1>Your guide to San Andreas.</h1>
          <p>
            Locations, game zones and practical city knowledge — collected in one
            clear reference.
          </p>
          <div className="home-hero__actions">
            <Link className="button button--primary" to="/map">
              Open the map <span aria-hidden="true">→</span>
            </Link>
            <a className="home-hero__text-link" href="#wiki-sections">
              Explore the wiki
            </a>
          </div>
        </div>

        <div className="home-hero__art" aria-hidden="true">
          <div className="home-hero__ring home-hero__ring--outer" />
          <div className="home-hero__ring home-hero__ring--inner" />
          <span>LS</span>
          <small>LOS SANTOS<br />BLAINE COUNTY</small>
        </div>
      </section>

      <section className="home-map-feature">
        <div className="home-map-feature__grid" aria-hidden="true" />
        <div className="home-map-feature__content">
          <span className="page-eyebrow">INTERACTIVE ATLAS</span>
          <h2>One map.<br />Every route.</h2>
          <p>
            Switch between all city locations and game zones without mixing their
            visual layers.
          </p>
          <Link className="button button--primary" to="/map">
            Explore map <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="home-map-feature__legend">
          <span><i /> Locations</span>
          <span><i /> Game zones</span>
        </div>
      </section>

      <section className="home-section" id="wiki-sections">
        <div className="home-section__heading">
          <div>
            <span className="page-eyebrow">WIKI SECTIONS</span>
            <h2>Build your own route.</h2>
          </div>
          <p>New articles and sections will appear here as the knowledge base grows.</p>
        </div>

        <div className="home-section__grid">
          {wikiSections.map((section) => (
            <article className="home-section__card" key={section.title}>
              <span className="home-section__icon" aria-hidden="true">{section.icon}</span>
              <h3>{section.title}</h3>
              <p>{section.text}</p>
              <span className="home-section__coming">IN DEVELOPMENT</span>
            </article>
          ))}
        </div>
      </section>

      <section className="home-note">
        <span className="home-note__mark" aria-hidden="true">Q</span>
        <div>
          <b>Navigate the state with confidence.</b>
          <p>The map is the fastest way to start — the wiki grows around it.</p>
        </div>
        <Link to="/map">Open map →</Link>
      </section>
    </main>
  )
}
