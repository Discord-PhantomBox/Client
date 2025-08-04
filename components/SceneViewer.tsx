'use client';
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../lib/store';
import { getSceneByEmotion } from '../lib/emotionMapper';
import LocalAsset from './LocalAsset';
import InteractionModal from './InteractionModal';
import CompletionModal from './CompletionModal';
import { AssetInfo, getAssetInfo } from '../lib/assetInfo';

// 맵 크기 파악을 위한 컴포넌트
function MapBounds({ onBoundsCalculated }: { onBoundsCalculated: (bounds: THREE.Box3) => void }) {
  const { scene } = useThree();
  
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      onBoundsCalculated(box);
    }
  }, [scene, onBoundsCalculated]);

  return null;
}

// 감정에 따른 씬 로딩 컴포넌트
function EmotionScene() {
  // 기본 building_hallway 맵만 로딩
  const { scene } = useGLTF('/building_hallway/scene.gltf');
  
  useEffect(() => {
    if (scene) {
      console.log('Map loaded successfully');
      scene.rotation.y = Math.PI / 2;
    }
  }, [scene]);
  
  return scene ? <primitive object={scene} /> : null;
}

function Player({ position, velocity }: { position: THREE.Vector3; velocity: THREE.Vector3 }) {
  return (
    <mesh position={position} visible={false}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function FollowCamera({ 
  playerPosition, 
  mousePosition,
  cameraSettings
}: { 
  playerPosition: THREE.Vector3;
  mousePosition: { x: number; y: number };
  cameraSettings: { height: number; distance: number };
}) {
  const { camera } = useThree();
  
  useEffect(() => {
    // 카메라 높이를 플레이어와 같은 높이로 설정
    const cameraHeight = playerPosition.y; // 플레이어와 같은 높이
    const cameraDistance = cameraSettings.distance;
    
    // 마우스 회전에 따른 카메라 위치 계산 (수평 + 수직)
    const horizontalAngle = mousePosition.x;
    const verticalAngle = mousePosition.y; // 수직 회전 활성화
    
    const cosH = Math.cos(horizontalAngle);
    const sinH = Math.sin(horizontalAngle);
    const cosV = Math.cos(verticalAngle);
    const sinV = Math.sin(verticalAngle);
    
    // 카메라 위치 계산 - 플레이어 뒤쪽에서
    camera.position.set(
      playerPosition.x - cameraDistance * sinH * cosV,
      cameraHeight + cameraDistance * sinV, // 수직 회전에 따른 높이 변화
      playerPosition.z - cameraDistance * cosH * cosV
    );
    
    // 플레이어를 바라보도록 설정
    camera.lookAt(
      playerPosition.x,
      playerPosition.y,
      playerPosition.z
    );
  }, [camera, playerPosition, mousePosition, cameraSettings]);

  return null;
}

function EmotionBasedLighting() {
  const userExperience = useAppStore((state) => state.userExperience);
  
  // 감정 분석 결과가 있으면 해당 씬 설정 적용
  const sceneConfig = userExperience?.analyzedEmotion ? 
    getSceneByEmotion(userExperience.analyzedEmotion as any, userExperience.intensity) : null;

  return (
    <>
      {/* 기본 조명 - 더 어둡게 */}
      <ambientLight intensity={0.05} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.1} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* 감정 기반 동적 조명 */}
      {sceneConfig && (
        <>
          {/* 감정 색상 기반 포인트 라이트 - 더 어둡게 */}
          <pointLight
            position={[0, 5, 0]}
            intensity={sceneConfig.particles / 50}
            color={sceneConfig.color}
            distance={15}
          />
          
          {/* 추가 분위기 조명 - 더 어둡게 */}
          <pointLight
            position={[10, 3, 10]}
            intensity={0.2}
            color={sceneConfig.color}
            distance={12}
          />
          
          <pointLight
            position={[-10, 3, -10]}
            intensity={0.1}
            color={sceneConfig.color}
            distance={12}
          />
          
          {/* 깜빡이는 조명 효과 */}
          <pointLight
            position={[0, 8, 0]}
            intensity={0.05}
            color="#ff0000"
            distance={8}
          />
        </>
      )}
      
      {/* 기본 폐병원 조명 (감정 분석이 없는 경우) - 더 무섭게 */}
      {!sceneConfig && (
        <>
          <pointLight position={[0, 5, 0]} intensity={0.3} color="#8b0000" distance={15} />
          <pointLight position={[10, 3, 10]} intensity={0.2} color="#4a4a4a" distance={12} />
          <pointLight position={[-10, 3, -10]} intensity={0.1} color="#2a2a2a" distance={12} />
          <pointLight position={[0, 8, 0]} intensity={0.05} color="#ff0000" distance={8} />
        </>
      )}
    </>
  );
}

function EmotionParticles() {
  const userExperience = useAppStore((state) => state.userExperience);
  const sceneConfig = userExperience?.analyzedEmotion ? 
    getSceneByEmotion(userExperience.analyzedEmotion as any, userExperience.intensity) : null;
  
  const particlesRef = useRef<THREE.Points>(null);
  
  useEffect(() => {
    if (!particlesRef.current) return;
    
    const geometry = new THREE.BufferGeometry();
    const particleCount = sceneConfig?.particles || 50;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = Math.random() * 50;
      positions[i + 2] = (Math.random() - 0.5) * 100;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    if (particlesRef.current.geometry) {
      particlesRef.current.geometry.dispose();
    }
    particlesRef.current.geometry = geometry;
  }, [sceneConfig]);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
      particlesRef.current.rotation.x += 0.0005;
    }
  });
  
  if (!sceneConfig) return null;
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.5}
        color={sceneConfig.color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// 플레이어 이동 로직을 처리하는 컴포넌트
function PlayerMovement({ 
  playerPosition, 
  setPlayerPosition, 
  velocity, 
  setVelocity, 
  keys, 
  mousePosition,
  getPlayerStartPosition 
}: {
  playerPosition: THREE.Vector3;
  setPlayerPosition: (position: THREE.Vector3) => void;
  velocity: THREE.Vector3;
  setVelocity: (velocity: THREE.Vector3) => void;
  keys: Set<string>;
  mousePosition: { x: number; y: number };
  getPlayerStartPosition: () => THREE.Vector3;
}) {
  useFrame(() => {
    const speed = 2.0; // 0.5에서 2.0으로 증가
    const jumpSpeed = 1.5; // 0.8에서 1.5로 증가
    const gravity = -0.02;
    
    const newVelocity = velocity.clone();
    const newPosition = playerPosition.clone();
    
    // 중력 적용
    newVelocity.y += gravity;
    
    // 키보드 입력 처리
    const moveVector = new THREE.Vector3();
    
    if (keys.has('KeyW')) moveVector.z += 1; // 앞으로 (음수)
    if (keys.has('KeyS')) moveVector.z -= 1; // 뒤로 (양수)
    if (keys.has('KeyA')) moveVector.x += 1; // 왼쪽
    if (keys.has('KeyD')) moveVector.x -= 1; // 오른쪽
    
    // 카메라 방향에 따른 이동
    if (moveVector.length() > 0) {
      moveVector.normalize();
      moveVector.multiplyScalar(speed);
      
      // 마우스 회전에 따른 이동 방향 조정
      const angle = mousePosition.x;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      const adjustedMoveVector = new THREE.Vector3(
        moveVector.x * cos + moveVector.z * sin,  // 부호 변경
        0,
        -moveVector.x * sin + moveVector.z * cos  // 부호 변경
      );
      
      newPosition.add(adjustedMoveVector);
    }
    
    // 점프
    if (keys.has('Space') && newPosition.y <= getPlayerStartPosition().y + 0.1) {
      newVelocity.y = jumpSpeed;
    }
    
    // 위치 업데이트
    newPosition.add(newVelocity);
    
    // 감정별 씬에 맞는 충돌 감지
    const minY = getPlayerStartPosition().y;
    const maxY = minY + 40; // 기본 높이 제한
    
    // 바닥 충돌
    if (newPosition.y < minY) {
      newPosition.y = minY;
      newVelocity.y = 0;
    }
    
    // 천장 충돌
    if (newPosition.y > maxY) {
      newPosition.y = maxY;
      newVelocity.y = 0;
    }
    
    setPlayerPosition(newPosition);
    setVelocity(newVelocity);
  });

  return null;
}

export default function SceneViewer() {
  const userExperience = useAppStore((state) => state.userExperience);
  const mapBounds = useAppStore((state) => state.mapBounds);
  const setMapBounds = useAppStore((state) => state.setMapBounds);
  
  // 플레이어 상태
  const [playerPosition, setPlayerPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 45, 0));
  const [velocity, setVelocity] = useState<THREE.Vector3>(new THREE.Vector3());
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  
  // 상호작용 상태
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [currentAssetInfo, setCurrentAssetInfo] = useState<AssetInfo | null>(null);
  const [collectedAssets, setCollectedAssets] = useState<Set<string>>(new Set());
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);

  // 맵 크기 파악 콜백
  const handleBoundsCalculated = (bounds: THREE.Box3) => {
    //console.log('Map bounds calculated:', bounds);
    setMapBounds(bounds);
  };

  // 에셋 상호작용 처리
  const handleAssetInteraction = () => {
    console.log('Asset interaction triggered');
  };

  const handleShowModal = (assetInfo: AssetInfo) => {
    setCurrentAssetInfo(assetInfo);
    setIsInteractionModalOpen(true);
    
    // 모달이 열릴 때 마우스 잠금 해제
    document.exitPointerLock();
  };

  const handleCollectAsset = () => {
    if (currentAssetInfo) {
      setCollectedAssets(prev => new Set([...prev, currentAssetInfo.id]));
      setIsInteractionModalOpen(false);
      
      // 모달 닫을 때 마우스 락 다시 활성화
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.requestPointerLock();
      }
      
      // 모든 에셋을 수집했는지 확인
      const allAssets = ['broken_mirror', 'medieval_water_tub', 'wooden_ladder'];
      const newCollected = new Set([...collectedAssets, currentAssetInfo.id]);
      
      if (allAssets.every(asset => newCollected.has(asset))) {
        setIsCompletionModalOpen(true);
      }
    }
  };

  const handleCloseModal = () => {
    setIsInteractionModalOpen(false);
    
    // 모달 닫을 때 마우스 락 다시 활성화
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.requestPointerLock();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  // 플레이어 시작 위치
  const getPlayerStartPosition = () => {
    return new THREE.Vector3(0, 45, 0);
  };

  // 카메라 설정
  const getCameraSettings = () => {
    return { height: 3, distance: 8 };
  };
  
  // 감정이 변경되면 플레이어 위치 재설정
  useEffect(() => {
    setPlayerPosition(getPlayerStartPosition());
  }, []);

  // 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set([...prev, e.code]));
      
      // Tab키로 마우스 고정 해제
      if (e.code === 'Tab') {
        e.preventDefault();
        document.exitPointerLock();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.code);
        return newKeys;
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playerPosition, collectedAssets]); // playerPosition과 collectedAssets를 의존성 배열에 추가

  // 마우스 이벤트
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPointerLocked) {
        setMousePosition(prev => ({
          x: prev.x - e.movementX * 0.002,
          y: prev.y - e.movementY * 0.002  // 수직 회전 활성화
        }));
      }
    };
    
    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement !== null);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [isPointerLocked]);

  // 클릭 시 포인터 락
  const handleCanvasClick = () => {
    const canvas = document.querySelector('canvas');
    if (canvas && !isPointerLocked) {
      canvas.requestPointerLock();
    }
  };

  return (
    <div className="w-full h-screen relative">
      {/* 감정 메시지 표시 */}
      {/* 디버그 정보 */}
      <div className="absolute top-4 right-4 z-10 bg-black/80 backdrop-blur-md border border-gray-700/50 rounded-lg p-4 text-white font-mono text-xs shadow-2xl">
        <div className="text-gray-400">현재 감정: {userExperience?.analyzedEmotion || '없음'}</div>
        <div className="text-gray-400">X: {playerPosition.x.toFixed(2)}</div>
        <div className="text-gray-400">Y: {playerPosition.y.toFixed(2)}</div>
        <div className="text-gray-400">Z: {playerPosition.z.toFixed(2)}</div>
        <div className="text-gray-400">수집된 에셋: {collectedAssets.size}/3</div>
        {userExperience?.analyzedEmotion && (
          <div className="mt-2 text-red-400">
            감정: {userExperience.analyzedEmotion}
          </div>
        )}
        {mapBounds && (
          <div className="mt-2 text-blue-400">
            맵 크기: {Math.max(
              mapBounds.max.x - mapBounds.min.x,
              mapBounds.max.z - mapBounds.min.z
            ).toFixed(1)}
          </div>
        )}
      </div>
      
      <Canvas shadows camera={{ position: [0, 10, 5], fov: 75 }} onClick={handleCanvasClick} className="cursor-crosshair" style={{ background: '#000000' }}>
        <MapBounds onBoundsCalculated={handleBoundsCalculated} />
        <EmotionBasedLighting />
        <EmotionParticles />
        <EmotionScene />
        <Player position={playerPosition} velocity={velocity} />
        <FollowCamera playerPosition={playerPosition} mousePosition={mousePosition} cameraSettings={getCameraSettings()} />
        
        {/* 로컬 에셋 배치 */}
        <LocalAsset 
          assetId="broken_mirror" 
          position={[73, 45, 0]} 
          scale={[15, 15, 15]}
          rotation={[0, -90, 0]}
          playerPosition={playerPosition}
          onShowModal={collectedAssets.has('broken_mirror') ? undefined : handleShowModal}
          onInteraction={handleAssetInteraction} 
        />
        
        <LocalAsset 
          assetId="medieval_water_tub" 
          position={[-10, 3, 50]} 
          scale={[15, 15, 15]}
          playerPosition={playerPosition}
          onShowModal={collectedAssets.has('medieval_water_tub') ? undefined : handleShowModal}
          onInteraction={handleAssetInteraction} 
        />
        
        <LocalAsset 
          assetId="wooden_ladder" 
          position={[-70, 100, 15]} 
          rotation={[0, 90, 0]}
          playerPosition={playerPosition}
          onShowModal={collectedAssets.has('wooden_ladder') ? undefined : handleShowModal}
          onInteraction={handleAssetInteraction} 
        />
        
        {/* 플레이어 이동 로직 */}
        <PlayerMovement 
          playerPosition={playerPosition}
          setPlayerPosition={setPlayerPosition}
          velocity={velocity}
          setVelocity={setVelocity}
          keys={keys}
          mousePosition={mousePosition}
          getPlayerStartPosition={getPlayerStartPosition}
        />
        
        {/* 바닥 */}
        <mesh position={[0, 39, 0]} receiveShadow>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        
        <Environment preset="night" />
      </Canvas>
      
      {/* 조작 가이드 */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/80 backdrop-blur-md border border-gray-800/50 rounded-lg p-4 text-white font-mono text-sm shadow-2xl">
        <div className="text-gray-400">WASD: 이동</div>
        <div className="text-gray-400">Space: 점프</div>
        <div className="text-gray-400">마우스: 시점</div>
        <div className="text-gray-400">클릭: 포인터 락</div>
        <div className="text-gray-400">Tab: 마우스 고정 해제</div>
      </div>
      
      {/* 상호작용 모달 */}
      <InteractionModal
        isOpen={isInteractionModalOpen}
        onClose={handleCloseModal}
        assetInfo={currentAssetInfo}
        onCollect={handleCollectAsset}
      />
      
      {/* 완료 모달 */}
      <CompletionModal
        isOpen={isCompletionModalOpen}
        onGoHome={handleGoHome}
      />
    </div>
  );
}
