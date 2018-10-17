import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  componentDidMount() {
    //console.log(window);
    var mathbox = window.mathbox
    var mathboxElement = window.mathboxElement
    this.root.appendChild(mathboxElement)

    var three = mathbox.three;
    three.renderer.setClearColor(new window.THREE.Color(0x000000), 1.0);

    var graphData, view;

    var a = 1,
      b = 0.5;
    var xMin = 0,
      xMax = 3,
      yMin = 0,
      yMax = 3,
      zMin = 0,
      zMax = 3;
    var uMin = 0,
      uMax = 3,
      vMin = 0,
      vMax = 3;

    // start of updateGraph function ==============================================================
    var updateGraphFunc = function() {
      view.set('range', [[xMin, xMax], [yMin, yMax], [zMin, zMax]]);
      domain.set('range', [[uMin, uMax], [vMin, vMax]]);

      // start of color options =============================================
      if (graphColorStyle == 'Solid Blue') {
        // just a solid blue color
        domainColors.set('expr', function(emit, u, v, i, j, t) {
          emit(0.5, 0.5, 1.0, 1.0);
        });
      } else if (graphColorStyle == 'Red U, Green V') {
        // increased u/v -> increased red/green
        domainColors.set('expr', function(emit, u, v, i, j, t) {
          var percentU = (u - uMin) / (uMax - uMin);
          var percentV = (v - vMin) / (vMax - vMin);
          emit(percentU, percentV, 0.0, 1.0);
        });
      } else if (graphColorStyle == 'Rainbow Amplitude') {
        //
        domainColors.set('expr', function(emit, u, v, i, j, t) {
          var percent = 1 - Math.abs(Math.sin(5 * u + t) * Math.sin(5 * v + t));
          var color = new window.THREE.Color(0xffffff);
          color.setHSL(percent, 1, 0.5);
          emit(color.r, color.g, color.b, 1.0);
        });
      } else if (graphColorStyle == 'Rainbow Along V') {
        //
        domainColors.set('expr', function(emit, u, v, i, j, t) {
          var percent = (v - vMin) / (vMax - vMin);
          var color = new window.THREE.Color(0xfffff);
          color.setHSL(percent, 1, 0.5);
          emit(color.r, color.g, color.b, 1.0);
        });
      }
      // end of color options =============================================
    };
    // end of updateGraph function ==============================================================

    var updateGraph = function() {
      updateGraphFunc();
    };

    // setting proxy:true allows interactive controls to override base position
    var camera = mathbox.camera({ proxy: true, position: [0, 2, 4] });

    // save as variable to adjust later
    view = mathbox.cartesian({
      range: [[xMin, xMax], [yMin, yMax], [zMin, zMax]],
      scale: [2, 1, 2]
    });

    // axes
    var xAxis = view.axis({ axis: 1, width: 8, detail: 40, color: 'white' });
    var xScale = view.scale({ axis: 1, divide: 10, nice: true, zero: true });
    var xTicks = view.ticks({ width: 5, size: 15, color: 'white', zBias: 2 });
    var xFormat = view.format({
      digits: 2,
      font: 'Arial',
      style: 'normal',
      source: xScale
    });
    var xTicksLabel = view.label({
      color: 'white',
      zIndex: 0,
      offset: [0, -20],
      points: xScale,
      text: xFormat
    });

    var yAxis = view.axis({ axis: 3, width: 8, detail: 40, color: 'white' });
    var yScale = view.scale({ axis: 3, divide: 5, nice: true, zero: false });
    var yTicks = view.ticks({ width: 5, size: 15, color: 'white', zBias: 2 });
    var yFormat = view.format({
      digits: 2,
      font: 'Arial',
      style: 'normal',
      source: yScale
    });
    var yTicksLabel = view.label({
      color: 'white',
      zIndex: 0,
      offset: [0, -20],
      points: yScale,
      text: yFormat
    });

    var zAxis = view.axis({ axis: 2, width: 8, detail: 40, color: 'white' });
    var zScale = view.scale({ axis: 2, divide: 5, nice: true, zero: false });
    var zTicks = view.ticks({ width: 5, size: 15, color: 'white', zBias: 2 });
    var zFormat = view.format({
      digits: 2,
      font: 'Arial',
      style: 'normal',
      source: zScale
    });
    var zTicksLabel = view.label({
      color: 'white',
      zIndex: 0,
      offset: [20, 0],
      points: zScale,
      text: zFormat
    });

    view.grid({ axes: [1, 3], width: 2, divideX: 20, divideY: 20, opacity: 0 });

    // need separate range for surface domain values. can't use values from view.

    var domain = mathbox.cartesian({
      range: [[uMin, uMax], [vMin, vMax]]
    });

    var resolution = 64;
    graphData = domain.area({
      width: resolution,
      height: resolution,
      // expr: set later
      axes: [1, 2], // u,vfalse
      channels: 3, // 3D space,
      expr: function(emit, u, v, i, j, t) {
        emit(u, 1.5 * Math.abs(Math.sin(5 * u + t) * Math.sin(5 * v + t)), v);
      }
    });

    var domainColors = domain.area({
      width: resolution,
      height: resolution,
      // expr: set later
      channels: 4 // RGBA
    });

    var surfaceViewFill = view.surface({
      points: graphData,
      fill: true,
      shaded: false,
      lineX: false,
      lineY: false,
      color: 'white',
      colors: domainColors
    });

    var graphColorStyle = 'Rainbow Amplitude';

    updateGraph();
  }
  render() {
    return <div ref={ref => (this.root = ref)} />;
  }

  // render() {
  //   return (
  //     <div className="App">
  //       <header className="App-header">
  //         <img src={logo} className="App-logo" alt="logo" />
  //         <h1 className="App-title">Welcome to React</h1>
  //       </header>
  //       <p className="App-intro">
  //         To get started, edit <code>src/App.js</code> and save to reload.
  //       </p>
  //     </div>
  //   );
  // }
}
//window = window.self;
export default App;
