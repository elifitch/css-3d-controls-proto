import React from 'react'
import Frustum from './frustum';
import * as Rematrix from 'rematrix'

const NUM_SIDE = 45;
const RING_STROKE = 10;
const RING_RADIUS = 256 / 2;

class LightingControls extends React.Component {
  componentWillMount() {
    const ringProps = this.getRingProps(RING_RADIUS, NUM_SIDE);
    const rotCircle = null;
    const polarCircle = null;
    this.ringSides = {
      rotational: {
        outer: this.makeRing({ target: rotCircle, ringProps }),
        inner: this.makeRing({ target: rotCircle, ringProps, offset: (-RING_STROKE - 0.5), flip: true }),
      },
      polar: {
        outer: this.makeRing({ target: polarCircle, ringProps, offset: -0.5 }),
        inner: this.makeRing({ target: polarCircle, ringProps, offset: -RING_STROKE, flip: true }),
      }
    }
  }
  componentDidMount() {
    // const rotStyle = getComputedStyle(this.rotationContainer)['transform'];
    // const rotTransform = Rematrix.parse(rotStyle);
    // console.log(rotTransform);
    // const newRot = Rematrix.rotateZ(50);
    // const newRotTransform = [rotTransform, newRot].reduce(Rematrix.multiply);
    // console.log(newRotTransform);
    // const formattedNewRotTransform = `matrix3d(${newRotTransform.join(', ')})`;
    // this.rotationContainer.style.transform = formattedNewRotTransform;
  }
  getRingProps(radius, numSegments) {
    const angle = 360 / numSegments;
    let rot = -90;
    const range = (from, to) => {
      const res = [];
      for (let i = from; i < to; ++i) {
        res.push(i);
      }
      return res;
    };

    return range(0, numSegments).map((index) => {
      rot = rot + angle
      return {
        rotateY: rot,
        translateX: radius,
        translateY: 0,
        translateZ: radius + RING_STROKE,
      };
    });
  }
  makeRing({ target, ringProps, offset = 0, flip = false }) {
    return ringProps.map((segmentData, i) => {
      const flipRotation = flip ? 'rotateX(180deg)' : '';
      const transform = `rotateY(${segmentData.rotateY}deg) rotateZ(90deg) rotateX(90deg) translate3d(${segmentData.translateX}px, ${segmentData.translateY}px, ${segmentData.translateZ + offset}px) ${flipRotation}`;
      return <div className="side" key={i} style={{ transform }}/>
    });
  }
  onControlsMouseDown = (e) => {
    this.initialCoords = {
      x: e.clientX,
      y: e.clientY
    };
    this.widgetContainer.addEventListener('mousemove', this.thresholdBoundDrag);
    document.addEventListener('mouseup', this.cancelDragControls);
  }
  cancelDragControls = () => {
    this.widgetContainer.removeEventListener('mousemove', this.thresholdBoundDrag);
    this.widgetContainer.removeEventListener('mousemove', this.onHorizontalDrag);
    this.widgetContainer.removeEventListener('mousemove', this.onVerticalDrag);
    document.removeEventListener('mouseup', this.cancelDragControls);
  }
  thresholdBoundDrag = (e) => {
    const threshold = 5;
    const dx = this.initialCoords.x - e.clientX;
    const dy = this.initialCoords.y - e.clientY;
    if (dx > threshold || dx < -threshold) {
      this.widgetContainer.removeEventListener('mousemove', this.thresholdBoundDrag);
      this.widgetContainer.addEventListener('mousemove', this.onHorizontalDrag);
    }
    if (dy > threshold || dy < -threshold) {
      this.widgetContainer.removeEventListener('mousemove', this.thresholdBoundDrag);
      this.widgetContainer.addEventListener('mousemove', this.onVerticalDrag);
    }
  }
  onHorizontalDrag = (e) => {
    const rotStyle = getComputedStyle(this.rotationContainer)['transform'];
    const rotTransform = Rematrix.parse(rotStyle);
    const newRot = Rematrix.rotateZ(-e.movementX * 1);
    const newRotTransform = [rotTransform, newRot].reduce(Rematrix.multiply);
    const formattedNewRotTransform = `matrix3d(${newRotTransform.join(', ')})`;
    this.rotationContainer.style.transform = formattedNewRotTransform;
    this.props.onChange({
      rot: newRotTransform[0]
    })
  }
  onVerticalDrag = (e) => {
    const polarStyle = getComputedStyle(this.polarContainer)['transform'];
    const polarTransform = Rematrix.parse(polarStyle);
    const newPolar = Rematrix.rotateZ(-e.movementY * 1);
    const newRotTransform = [polarTransform, newPolar].reduce(Rematrix.multiply);
    if (newRotTransform[0] > 0) {
      const formattedNewPolarTransform = `matrix3d(${newRotTransform.join(', ')})`;
      this.polarContainer.style.transform = formattedNewPolarTransform;
      this.props.onChange({
        polar: newRotTransform[0]
      })
    }
  }
  render() {
    return (
      <div className="widget-wrapper">
        <div className="container"
          ref={div => this.widgetContainer = div}
          onMouseDown={this.onControlsMouseDown}
        >
          <div className="rot disc debug"
            ref={div => this.rotationContainer = div}
          >
            <div className="pole disc debug"
              ref={div => this.polarContainer = div}
            >
              <div className="pole-side-container side-container">
                { this.ringSides.polar.outer }
                { this.ringSides.polar.inner }
                <Frustum />
              </div>
            </div>
            <div className="rot-side-container side-container">
              { this.ringSides.rotational.outer }
              { this.ringSides.rotational.inner }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LightingControls;
