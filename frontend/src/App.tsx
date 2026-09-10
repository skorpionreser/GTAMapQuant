import { GtaMap } from './components/GtaMap/GtaMap'
import './App.css'

function App() {
  return (
    <main className="app">
      <header className="app__header">
        <h1>GTA V Map</h1>
        <p>Интерактивная карта Лос-Сантоса</p>
      </header>

      <section className="app__map">
        <GtaMap />
      </section>
    </main>
  )
}

export default App