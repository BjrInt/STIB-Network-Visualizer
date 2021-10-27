import { useState } from 'react'

import './MainMap.css'

import NETWORK_DESCRIPTION from './network_description.json'
import useWindowResize from './useWindowResize'

const MainMap = () => {
  const {height, width} = useWindowResize()
  const [selectedPoint, setSelectedPoint] = useState({})
  const [selectedColor, setSelectedColor] = useState('transparent')
  const [focusedLine, setFocusedLine] = useState(null)

  const vH = height * 0.95 | 0
  const vW = width * 0.95 | 0
  const vbW = 1000
  const vbH = 850

  const networkDescription = []
  NETWORK_DESCRIPTION.forEach(line => {
    if(!networkDescription.find(x => line.lineId === x.lineId))
      networkDescription.push(line)
  })
  
  return (
  <div>
    <div className="legend" style={{color: selectedColor}}>
      {selectedPoint?.name?.fr}
    </div>

    <svg xmlns="http://www.w3.org/2000/svg" 
         height={vH} 
         width={vW} 
         viewBox={`0 0 ${vbW} ${vbH}`}>
      {
        networkDescription.map((line, iLine) => {
        const points = line.points.map(point => ({
          ...point, 
          x: point.lngN * vbW,
          y: point.latN * vbH,
        }))
        const color = `hsl(${(iLine * 13) % 360}, ${40 + (iLine * 2 % 40)}%, ${40 + (iLine * 2 % 25)}%)`


        return (
        <g key={line.lineId} id={`L${line.lineId}`} className={
          focusedLine === null || focusedLine === iLine ? '' : 'hide' 
        }>
          <polyline points={points.map(({x, y}) => (`${x} ${y}`)).join(', ') }
                    fill="none"
                    strokeWidth="6"
                    stroke={color}
                    onClick={() => setFocusedLine(iLine)} />
          {
            points.map(p => 
              <circle cx={p.x} 
                      cy={p.y} 
                      r={8} 
                      stroke="#333" 
                      strokeWidth="3" 
                      fill={color} 
                      onMouseOver={() => {
                        setSelectedPoint(p)
                        setSelectedColor(color)
                      }}
                      onClick={() => setFocusedLine(iLine)} />
            )
          }
        </g>
        )})
      }

      {
        focusedLine !== null &&
        <use xlinkHref={`#L${focusedLine}`}/>
      }
    </svg>
  </div>
  )
}

export default MainMap