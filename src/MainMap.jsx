import { useState } from 'react'

import './MainMap.css'
import Cog from './cog.svg'

import NETWORK_DESCRIPTION from './network_description.json'
import useWindowResize from './useWindowResize'

const MainMap = () => {
  const {height, width} = useWindowResize()
  const [selectedPoint, setSelectedPoint] = useState({})
  const [selectedColor, setSelectedColor] = useState('transparent')
  const [focusedLine, setFocusedLine] = useState({})
  const [selectedLanguage, setSelectedLanguage] = useState('fr')
  const [zoomRatio, setZoomRatio] = useState(1)

  const [displayFilters, setDisplayFilters] = useState({
    METRO: true,
    TRAM: true,
    BUS: false,
  })
  const [mousePos, setMousePos] = useState({x: null, y:null})

  const vH = height * zoomRatio * 0.95 | 0
  const vW = width * zoomRatio * 0.95 | 0
  const vbW = 1000
  const vbH = 850

  const networkDescription = []
  NETWORK_DESCRIPTION.forEach((line, i) => {
    if(!networkDescription.find(x => line.lineId === x.lineId))
      networkDescription.push({
        ...line,
        color: `hsl(${(i * 13) % 360}, ${40 + (i * 2 % 40)}%, ${40 + (i * 2 % 25)}%)`
      })
  })
  
  return (
  <main>
    {
      (mousePos.x && mousePos.y) && 
      <aside className="legend" style={{
        color: selectedColor,
        top: mousePos.y + 15,
        left: mousePos.x + 15,
      }}>
        <div className="txt">
          {selectedPoint?.name[selectedLanguage]}
        </div>
      </aside>
    }

    { focusedLine.lineId !== undefined && 
    <aside className="focusedline">
      <div style={{color: focusedLine.color}}>
        {focusedLine.type} <div style={{
          backgroundColor: focusedLine.color,
          padding: 8,
          fontSize: '120%',
          color: '#222',
          display: 'inline-block',
          borderRadius: 5
        }}>{focusedLine.lineId}</div>
        <div style={{fontSize: '60%', padding: 10}}>
          {focusedLine.points[0].name[selectedLanguage]} - {focusedLine.points[focusedLine.points.length - 1].name[selectedLanguage]}
        </div>
      </div>
    </aside>
    }

    <section className="options">
      <header>
        <img alt="" src={Cog} height="25" width="25" /> Settings
      </header>

      <fieldset>
        {
          Object.entries(displayFilters).map(([name, value]) => (
          <div className="checkgroup" key={name}>
            <label htmlFor={`filter-${name}`}>{name}</label>
            <input id={`filter-${name}`} type="checkbox" checked={value} onChange={() => {
              setDisplayFilters({
                ...displayFilters,
                [name]: !value
              })
            }} />
          </div>
          ))
        }
      </fieldset>
      
      <fieldset>
        <label htmlFor="option-lang">
          Stops name
        </label>

        <select onChange={e => setSelectedLanguage(e.target.value)} id="option-lang">
          <option value="fr">French</option>
          <option value="nl">Dutch</option>
        </select>
      </fieldset>

      <fieldset>
        <input type="range" 
               id="" 
               onChange={e => setZoomRatio(e.target.value)} 
               min="1" 
               max="3" 
               step="0.25" 
               value={zoomRatio} />
      </fieldset>
    </section>

    <svg xmlns="http://www.w3.org/2000/svg" 
         height={vH} 
         width={vW}
         viewBox={`0 0 ${vbW} ${vbH}`}>
      {
        networkDescription.map((line, iLine) => {
        if(!displayFilters[line.type])
          return null
        
        const points = line.points.map(point => ({
          ...point, 
          x: point.lngN * vbW,
          y: point.latN * vbH,
        }))

        return (
        <g key={line.lineId} id={`L${line.lineId}`} className={
          focusedLine.lineId === line.lineId ? '' : 'hide' 
        }>
          <polyline points={points.map(({x, y}) => (`${x} ${y}`)).join(', ') }
                    fill="none"
                    strokeWidth="6"
                    stroke={line.color}
                    onClick={() => setFocusedLine(line)} />
          {
            points.map(p => 
              <circle cx={p.x} 
                      cy={p.y} 
                      r={8} 
                      stroke="#222"
                      strokeWidth="3"
                      fill={line.color} 
                      key={p.id}
                      onMouseEnter={(e) => {
                          setSelectedPoint(p)
                          setSelectedColor(line.color)
                          setMousePos({x: e.clientX + window.scrollX, y: e.clientY + window.scrollY})
                      }}
                      onMouseLeave={() => {
                        setMousePos({x: null, y: null})
                      }}
                      onClick={() => setFocusedLine(line)} />
            )
          }
        </g>
        )})
      }
    </svg>
  </main>
  )
}

export default MainMap