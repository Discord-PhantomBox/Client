'use client';

import { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { loadAsset, getGltfUrl, AssetResponse, getAssetName, getAssetTitle, getAssetDescription, getModifiedGltfUrl, loadGLTFWithAbsolutePaths } from '../lib/assetLoader';

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
  const [assetTitle, setAssetTitle] = useState<string | null>(null);
  const [assetDescription, setAssetDescription] = useState<string | null>(null);
  const [gltfUrl, setGltfUrl] = useState<string | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // 에셋 로딩
  useEffect(() => {
    const loadAssetData = async () => {
      try {
        setIsLoading(true);
        const response = await loadAsset();
        setAssetResponse(response);
        
        // 에셋 정보 추출
        const name = getAssetName(response);
        const title = getAssetTitle(response);
        const description = getAssetDescription(response);
        
        setAssetName(name);
        setAssetTitle(title);
        setAssetDescription(description);
        
        // 새로운 GLTF 로딩 함수 사용
        const modifiedUrl = await loadGLTFWithAbsolutePaths(assetId);
        setGltfUrl(modifiedUrl);
        
        console.log('Loaded asset:', { assetId, name, title, description, gltfUrl: modifiedUrl });
      } catch (error) {
        console.error('Failed to load asset:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssetData();
  }, [assetId]);

  // GLTF 로딩
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
    console.log('Asset clicked:', { 
      assetId,
      name: assetName, 
      title: assetTitle, 
      description: assetDescription 
    });
    if (onInteraction) {
      onInteraction();
    }
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
    if (assetTitle) {
      console.log('Hovering over asset:', assetTitle);
      if (assetDescription) {
        console.log('Description:', assetDescription);
      }
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
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    );
  }

  // 모의 데이터인 경우 기본 박스로 표시
  if (!gltfUrl || gltfUrl === 'mock') {
    return (
      <group
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <mesh position={position} ref={meshRef}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8b0000" />
        </mesh>
        
        {/* 상호작용 영역 표시 */}
        {isHovered && (
          <mesh position={position}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial 
              color="#ff0000" 
              transparent 
              opacity={0.4} 
              wireframe 
            />
          </mesh>
        )}
      </group>
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
            color="#8b0000" 
            transparent 
            opacity={0.4} 
            wireframe 
          />
        </mesh>
      )}
      
      {/* 에셋 정보를 콘솔에 표시 */}
      {assetTitle && isHovered && (
        <mesh position={[0, 0, 0]} visible={false}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="transparent" />
        </mesh>
      )}
    </group>
  );
} 