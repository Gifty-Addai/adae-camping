// CampingScene.tsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

const CampingScene: React.FC = () => {
  return (
    <Canvas style={{ height: '500px' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 0]} />
      {/* Example 3D object, such as a tent or campfire */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[2, 4, 4]} />
        <meshStandardMaterial  />
      </mesh>
      <Stars />
      <OrbitControls />
    </Canvas>
  );
};

export default CampingScene;
