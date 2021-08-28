import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const ListContainer = styled.div`
  width: 40%;
  margin: 24px;
  @media (max-width: 1020px) {
    margin: 12px;
  }
`

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #aaa;
  border-radius: 3px;
  outline: none;
  font-size: 16px;
  padding: 0 5px;
  transition: 0.2s;
  :focus {
    border: 1px solid #8eb0ca;
    box-shadow: 0 0 5px #8eb0ca;
  }

  @media (max-height: 670px) {
    height: 20px;
  }
`

const MarkerList = styled.ul`
  height: 80vh;
  overflow: auto;
  margin-top: 30px;

  @media (max-height: 670px) {
    margin-top: 15px;
  }

  padding-right: 15px;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }
`

const Marker = styled.li`
  line-height: 42px;
  width: 98%;
  border: 1px solid #aaa;
  border-radius: 3px;
  font-size: 18px;
  margin-top: 5px;
  padding: 0 5px;

  @media (max-height: 670px) {
    height: 35px;
    line-height: 37px;
  }
`

const DeleteBtn = styled.button`
  float: right;
  border: none;
  border-radius: 3px;
  padding: 7px 15px;
  margin: 5px 5px;
  background-color: #ff4444;
  color: white;
  :hover {
    transition: 0.2s;
    background-color: #cc0000;
  }

  @media (max-height: 670px) {
    margin: 2px 2px;
  }
`

class MarkersList extends React.PureComponent {
  state = {
    draggedItem: {},
    draggedOverItem: {},
  }

  onDragStart = (e, index) => {
    this.setState({ draggedItem: this.props.markers[index] })

    // Without this, drag-and-drop won't work on Firefox
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.parentNode)
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20)
  }

  onDragOver = (index) => {
    this.setState({ draggedOverItem: this.props.markers[index] }, () => {
      // if the item is dragged over itself, ignore
      if (this.state.draggedItem === this.state.draggedOverItem) return
      // filter out the currently dragged item
      let items = this.props.markers.filter(
        (item) => item !== this.state.draggedItem
      )
      // add the dragged item after the dragged over item
      items.splice(index, 0, this.state.draggedItem)

      this.props.updateMarkerListOrder(items)
    })
  }

  render() {
    return (
      <ListContainer>
        <form onSubmit={(e) => this.props.createMarker(e)}>
          <Input
            type="text"
            autoFocus
            placeholder="Введите название точки..."
            value={this.props.inputValue}
            onChange={(e) => this.props.setInputValue(e)}
            className="marker-input"
          />
        </form>

        <MarkerList>
          {this.props.markers.map((marker, index) => (
            <Marker onDragOver={() => this.onDragOver(index)} key={index}>
              <div draggable onDragStart={(e) => this.onDragStart(e, index)}>
                {marker.name}
                <DeleteBtn onClick={() => this.props.deleteMarker(marker)}>
                  ✖
                </DeleteBtn>
              </div>
            </Marker>
          ))}
        </MarkerList>
      </ListContainer>
    )
  }
}

export default MarkersList
