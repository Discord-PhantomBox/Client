'use client';
import { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { getAssetInfo, AssetInfo } from '../lib/assetInfo';

interface LocalAssetProps {
  assetId: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  onInteraction?: () => void;
  playerPosition?: THREE.Vector3;
  onShowModal?: (assetInfo: AssetInfo) => void;
}

export default function LocalAsset({
  assetId,
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  onInteraction,
  playerPosition,
  onShowModal
}: LocalAssetProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isNearby, setIsNearby] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const assetInfo = getAssetInfo(assetId);

  // 로컬 assets 폴더에서 GLTF 로드
  const { scene } = useGLTF(`/assets/${assetId}/scene.gltf`);

  // 플레이어와의 거리 감지
  useEffect(() => {
    if (!playerPosition) return;

    const checkDistance = () => {
      const assetPosition = new THREE.Vector3(...position);
      const distance = playerPosition.distanceTo(assetPosition);
      const wasNearby = isNearby;
      
      // Y축 범위 체크 (-1000~1000)
      const yDistance = Math.abs(playerPosition.y - assetPosition.y);
      const horizontalDistance = Math.sqrt(
        Math.pow(playerPosition.x - assetPosition.x, 2) + 
        Math.pow(playerPosition.z - assetPosition.z, 2)
      );
      
      // 수평 거리 25단위 이내이고 Y축 범위 내에 있으면 상호작용 가능
      const isInRange = horizontalDistance < 25 && yDistance < 1000;
      setIsNearby(isInRange);
      
      console.log(`Asset ${assetId}: horizontal=${horizontalDistance.toFixed(2)}, yDistance=${yDistance.toFixed(2)}, inRange=${isInRange}`);
      
      // 가까이 왔을 때 자동으로 모달 표시
      if (!wasNearby && isInRange && assetInfo && onShowModal) {
        console.log(`Showing modal for ${assetId}`);
        onShowModal(assetInfo);
      }
    };

    checkDistance();
    const interval = setInterval(checkDistance, 100);
    return () => clearInterval(interval);
  }, [playerPosition, position, assetInfo, onShowModal, isNearby, assetId]);

  const handleClick = () => {
    console.log('Local asset clicked:', assetId);
    if (onInteraction) {
      onInteraction();
    }
    
    // 에셋이 수집되지 않았고 가까이 있으면 바로 수집
    if (isNearby && assetInfo && onShowModal) {
      onShowModal(assetInfo);
    }
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    if (isNearby) {
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    document.body.style.cursor = 'crosshair';
  };

  return (
    <group 
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <primitive object={scene} />
      
      {/* 큰 히트박스 추가 */}
      <mesh position={[0, 0, 0]} visible={false}>
        <sphereGeometry args={[10, 8, 8]} />
        <meshStandardMaterial color="transparent" transparent opacity={0} />
      </mesh>
      
      {/* 반딧불이 빛 효과 */}
      <pointLight
        position={[0, 2, 0]}
        intensity={0.8}
        distance={8}
        color="#ffff88"
        castShadow
      />
      
      {/* 추가적인 주변 조명 */}
      <pointLight
        position={[0, 1, 0]}
        intensity={0.3}
        distance={12}
        color="#ffaa44"
      />
      
      {/* 상호작용 가능 표시 */}
      {isNearby && (
        <mesh position={[0, 3, 0]}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial color="#00ff00" transparent opacity={0.6} />
        </mesh>
      )}
      
      {isHovered && isNearby && (
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#8b0000" transparent opacity={0.4} wireframe />
        </mesh>
      )}
    </group>
  );
} 