import { useEffect, useState } from "react"

export default function useWindowResize(){
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })


  useEffect(() => {
    const resize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", resize)

    resize()
    return () => window.removeEventListener("resize", resize)
  }, []) 

  return windowSize
}