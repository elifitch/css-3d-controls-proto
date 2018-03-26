import React from 'react'
import MapboxGl from 'mapbox-gl';
import LightingControls from './lighting-controls';
import './mapbox-gl-styles.css';

class Map extends React.Component {
  constructor() {
    super();
    this.state = {
      accessToken: process.env.REACT_APP_MAPBOX_GL_ACCESS_TOKEN,
      map: null,
      polarLighing: 30,
      rotationLighting: 0
    };
  }
  componentDidMount() {
    MapboxGl.accessToken = this.state.accessToken;
    const map = new MapboxGl.Map({
      container: 'map-container', // container id
      style: 'mapbox://styles/elifitch/cjf4asuv90w6e2rqv887nuyli?fresh=true', //hosted style id
      // center: mapCenter, // starting position
      // zoom: localStorage.getItem(MAP_ZOOM) || 2.6, // starting zoom,
      // pitch: localStorage.getItem(MAP_PITCH) || 50
    });
    this.setState({ map });
  }
  onLightingUpdate = ({polar, rot}) => {
    const normalize = val => (val + 1) / 2;
    if (rot) {
      this.setState({ rotationLighting: normalize(rot) * 360 })
    }
    if (polar) {
      this.setState({ polarLighing: polar })
    }
    this.updateMapLighting();
  }
  updateMapLighting() {
    if (this.state.map) {
      console.log(this.state.rotationLighting)
      this.state.map.setLight({
        anchor: 'map',
        color: '#ffffff',
        intensity: 0.4,
        position: [
          1.15,
          this.state.rotationLighting,
          this.state.polarLighing,
        ]
      })
    }
  }
  render() {
    // this.updateMapLighting();
    return (
      <div>
        <div
          id="map-container"
          style={{ position: 'absolute' }}
        />
        <LightingControls
          onChange={this.onLightingUpdate}
        />
      </div>      
    )
  }
}

export default Map;