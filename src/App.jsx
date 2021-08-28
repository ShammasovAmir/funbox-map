import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import GlobalStyle from './styles/GlobalStyle'
import _ from 'lodash'

import Map from './components/Map'
import MarkersList from './components/MarkersList'

const Container = styled.div`
  display: flex;
  width: 100vw;
`

class App extends React.PureComponent {
  state = {
    inputValue: '',
    markers: [],
    currentPolyline: {},
  }

  setInputValue = (e) => this.setState({ inputValue: e.target.value })

  createMarker = (e) => {
    e.preventDefault()
    // Check for empty or spaces
    if (/^ *$/.test(this.state.inputValue))
      alert('Название точки не может быть пустым')
    else {
      const mapCenter = window.map.getCenter()
      const marker = new window.google.maps.Marker({
        position: {
          lat: mapCenter.lat(),
          lng: mapCenter.lng(),
        },
        map: window.map,
        name: this.state.inputValue,
        draggable: true,
      })

      marker.addListener('drag', () => this.createPolyline()) // Update polyline if marker is moving
      this.createInfoBaloon(marker)
      this.setState(
        { inputValue: '', markers: [...this.state.markers, marker] },
        () => this.createPolyline()
      )
    }
  }

  deleteMarker = (markerToRemove) => {
    //remove marker from map
    markerToRemove.setMap(null)
    //remove marker from state
    const newList = this.state.markers.filter(
      (marker) => marker !== markerToRemove
    )
    //update polyline with the new set of points
    this.setState({ markers: newList }, () => this.createPolyline())
  }

  createInfoBaloon = (marker) => {
    const infoBaloon = new window.google.maps.InfoWindow({
      content: marker.name,
    })

    marker.addListener('click', () => infoBaloon.open(window.map, marker))
  }

  createPolyline = () => {
    if (this.state.markers.length === 1) return
    this.deleteCurrentPolyline()

    let polyline = new window.google.maps.Polyline({
      path: this.getPolylineCoordinates(),
      geodesic: false, // should polyline curve along with Earths curvature
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    })

    polyline.setMap(window.map)
    this.setState({ currentPolyline: polyline })
  }

  deleteCurrentPolyline = () => {
    if (!_.isEmpty(this.state.currentPolyline))
      this.state.currentPolyline.setMap(null)
  }

  getPolylineCoordinates = () => {
    const polylineCoordinates = []

    this.state.markers.map((marker) => {
      let polylinePoint = {
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng(),
      }
      polylineCoordinates.push(polylinePoint)
    })

    return polylineCoordinates
  }

  updateMarkerListOrder = (list) =>
    this.setState({ markers: list }, () => this.createPolyline())

  render() {
    return [
      <Container key={1}>
        <MarkersList
          createMarker={this.createMarker}
          deleteMarker={this.deleteMarker}
          setInputValue={this.setInputValue}
          inputValue={this.state.inputValue}
          markers={this.state.markers}
          updateMarkerListOrder={this.updateMarkerListOrder}
        />
        <Map />
      </Container>,
      <GlobalStyle key={2} />,
    ]
  }
}

export default App
