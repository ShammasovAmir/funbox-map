import React, { useEffect } from 'react'
import styled from 'styled-components'

const MapContainer = styled.div`
  height: 100vh;
  width: 60%;
`

const Map = () => {
  useEffect(() => {
    renderMap()
  }, [])

  const renderMap = () => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_MAP_KEY
      }&callback=initMap`
    )
    window.initMap = initMap
  }

  const loadScript = (url) => {
    const index = window.document.getElementsByTagName('script')[0]
    const script = window.document.createElement('script')
    script.src = url
    script.async = true
    script.defer = true

    index.parentNode.insertBefore(script, index)
  }

  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 50.073658, lng: 14.41854 },
      zoom: 8,
    })

    // Access to map methods
    window.map = map
  }

  return <MapContainer id="map" />
}

export default Map
