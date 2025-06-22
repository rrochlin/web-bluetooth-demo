import { Canvas, extend, type ThreeElements, useFrame } from '@react-three/fiber';
import type { ProcessedData } from '@/types';
import * as THREE from 'three';
import { useRef, useState } from 'react';


interface ThreeDVisualizerProps {
    latestProcessedData: ProcessedData | null;
}

function ArrowIndicator({ velocity, acceleration }: { velocity: { x: number, y: number, z: number }, acceleration: { x: number, y: number, z: number } }) {
    const meshRef = useRef<THREE.Mesh>(null!)
    useFrame(() => {meshRef.current.rotation.set(velocity.x, velocity.y, velocity.z)})
    //useFrame(() => {meshRef.current.rotation.set(acceleration.x, acceleration.y, acceleration.z)})
    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[0.1, 1, 0.1]} />
            <meshStandardMaterial color="red" />
        </mesh>
    )

}
function Box(props: ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    useFrame((state, delta) => (meshRef.current.rotation.x += delta))
    return (
      <mesh
        {...props}
        ref={meshRef}
        scale={active ? 1.5 : 1}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : '#2f74c0'} />
      </mesh>
    )
}

export function ThreeDVisualizer({ latestProcessedData }: ThreeDVisualizerProps) {

  return (
    <div>
      <div style={{ width: '600px', height: '400px', border: '1px solid gray' }}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {latestProcessedData && (
            <ArrowIndicator
              velocity={{ x: latestProcessedData.velX, y: latestProcessedData.velY, z: latestProcessedData.velZ }}
              acceleration={{ x: latestProcessedData.accelX, y: latestProcessedData.accelY, z: latestProcessedData.accelZ }}
            />
          )}
        </Canvas>
        
      </div>
    </div>
  );
}  