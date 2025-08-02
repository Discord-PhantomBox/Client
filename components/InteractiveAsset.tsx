'use client';

import { useRef, useState, useEffect } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { loadAsset, getGltfUrl, AssetResponse, getAssetName } from '../lib/assetLoader';

interface InteractiveAssetProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  assetId: string;
  onInteraction?: () => void;
}

export default function InteractiveAsset({
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  assetId,
  onInteraction
}: InteractiveAssetProps) {
  const [assetResponse, setAssetResponse] = useState<AssetResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [assetName, setAssetName] = useState<string | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // 에셋 로딩
  useEffect(() => {
    const loadAssetData = async () => {
      try {
        setIsLoading(true);
        const response = await loadAsset(assetId);
        setAssetResponse(response);
        
        // 에셋 이름 추출
        const name = getAssetName(response);
        setAssetName(name);
        
        console.log('Loaded asset:', name);
      } catch (error) {
        console.error('Failed to load asset:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssetData();
  }, [assetId]);

  // GLTF 로딩
  const gltfUrl = assetResponse ? getGltfUrl(assetResponse) : null;
  const { scene } = useGLTF(gltfUrl || '/building_hallway/scene.gltf');

  useEffect(() => {
    if (scene) {
      scene.position.set(...position);
      scene.rotation.set(...rotation);
      scene.scale.set(...scale);
    }
  }, [scene, position, rotation, scale]);

  // 상호작용 처리
  const handleClick = () => {
    console.log('Asset clicked:', assetName);
    if (onInteraction) {
      onInteraction();
    }
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
    if (assetName) {
      console.log('Hovering over asset:', assetName);
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    document.body.style.cursor = 'crosshair';
  };

  if (isLoading) {
    return (
      <mesh position={position} ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
    );
  }

  return (
    <group
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <primitive object={scene} />
      
      {/* 상호작용 영역 표시 (개발용) */}
      {isHovered && (
        <mesh position={position}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial 
            color="#ff0000" 
            transparent 
            opacity={0.3} 
            wireframe 
          />
        </mesh>
      )}
      
      {/* 에셋 이름을 콘솔에 표시 */}
      {assetName && isHovered && (
        <mesh position={[0, 0, 0]} visible={false}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="transparent" />
        </mesh>
      )}
    </group>
  );
} 