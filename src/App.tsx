import React, { useEffect, useRef, useState } from 'react'
import { Engine, FreeCamera, HemisphericLight, MeshBuilder, Scene, Vector3, } from '@babylonjs/core'
import DummyComp from './DummyComp';
import RequestDemo from './RequestDemo';

import './App.css';

function SceneComponent(props: any) {
  const reactCanvas = useRef(null);
  const { antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest } = props;
  useEffect(() => {
    if (reactCanvas.current) {
      const engine = new Engine(reactCanvas.current, antialias, engineOptions, adaptToDeviceRatio);
      const scene = new Scene(engine, sceneOptions);
      if (scene.isReady()) {
        props.onSceneReady(scene);
      } else {
        scene.onReadyObservable.addOnce(scene => props.onSceneReady(scene));
      }
      engine.runRenderLoop(() => {
        if (typeof onRender === 'function') {
          onRender(scene);
        }
        scene.render();
      });
      const resize = () => {
        scene.getEngine().resize();
      };
      if (window) {
        window.addEventListener('resize', resize);
      }
      return () => {
        scene.getEngine().dispose();
        if (window) {
          window.removeEventListener('resize', resize);
        }
      }
    }
  }, [reactCanvas]);
  return (
    <canvas ref={reactCanvas} {...rest} />
  );
}

function App() {
  // const [box, setBox] = useState<null | string>(null);
  let box: any;
  const onSceneReady = (scene: any) => {
    const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    const canvas = scene.getEngine().getRenderingCanvas();
    camera.attachControl(canvas, true);
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    box = MeshBuilder.CreateBox('box', { size: 2 }, scene);
    box.position.y = 1;
    // setBox(_box);
    MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);
  }
  const onRender = (scene: any) => {
    if (!!box) {
      const deltaTimeInMillis = scene.getEngine().getDeltaTime();
      const rpm = 10;
      box.rotation.y += ((rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000));
    }
  }
  return (
    <div className="App">
      <SceneComponent
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
      />
    </div>
  );
}

export default RequestDemo;
