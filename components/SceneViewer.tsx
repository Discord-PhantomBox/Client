'use client';
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../lib/store';
import { getSceneByEmotion } from '../lib/emotionMapper';
import InteractiveAsset from './InteractiveAsset';

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
  const userExperience = useAppStore((state) => state.userExperience);
  const analyzedEmotion = userExperience?.analyzedEmotion;
  const preloadedEmotion = useAppStore((state) => state.preloadedEmotion);
  
  // 프리로딩된 감정이 있으면 우선 사용, 없으면 분석된 감정 사용
  const currentEmotion = preloadedEmotion || analyzedEmotion;
  
  // 감정별 씬 매핑
  const sceneMapping: Record<string, { path: string; rotation: number; position: [number, number, number] }> = {
    '고립된': {
      path: '/isolated/scene.gltf',
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '배신당한': {
      path: '/betrayed/scene.gltf',
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '질투하는': {
      path: '/jealous/scene.gltf',
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '불안': {
      path: '/nervous/scene.gltf',
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '가난한, 불우한': {
      path: '/poor/scene.gltf',
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '회의적인': {
      path: '/skeptical/scene.gltf',
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '취약한': {
      path: '/vulnerable/scene.gltf',
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '상처': {
      path: '/wound/scene.gltf',
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '희생된': {
      path: '/sacrificed/scene.gltf',
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '혼란스러운': {
      path: '/confused/scene.gltf',
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '초조한': {
      path: '/unrest/scene.gltf',
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    // 누락된 감정들 추가
    '걱정스러운': {
      path: '/nervous/scene.gltf', // 걱정스러운은 불안과 유사하므로 nervous 씬 사용
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '괴로워하는': {
      path: '/wound/scene.gltf', // 괴로움은 상처와 유사하므로 wound 씬 사용
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '당혹스러운': {
      path: '/confused/scene.gltf', // 당혹스러운은 혼란스러운과 유사하므로 confused 씬 사용
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '두려운': {
      path: '/nervous/scene.gltf', // 두려운은 불안과 유사하므로 nervous 씬 사용
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '버려진': {
      path: '/isolated/scene.gltf', // 버려진은 고립된과 유사하므로 isolated 씬 사용
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '스트레스 받는': {
      path: '/nervous/scene.gltf', // 스트레스 받는은 불안과 유사하므로 nervous 씬 사용
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '억울한': {
      path: '/wound/scene.gltf', // 억울한은 상처와 유사하므로 wound 씬 사용
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '조심스러운': {
      path: '/skeptical/scene.gltf', // 조심스러운은 회의적인과 유사하므로 skeptical 씬 사용
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    },
    '충격 받은': {
      path: '/confused/scene.gltf', // 충격 받은은 혼란스러운과 유사하므로 confused 씬 사용
      rotation: Math.PI / 2,
      position: [0, 0, 0]
    }
  };
  
  // 감정에 따른 씬 로딩
  if (currentEmotion && sceneMapping[currentEmotion]) {
    const sceneConfig = sceneMapping[currentEmotion];
    const { scene } = useGLTF(sceneConfig.path);
    
    useEffect(() => {
      // 모델을 설정된 회전값으로 회전
      scene.rotation.y = sceneConfig.rotation;
      scene.position.set(...sceneConfig.position);
    }, [scene, sceneConfig]);

    return <primitive object={scene} />;
  }
  
  // 기본 building_hallway 씬 (매핑되지 않은 감정이거나 감정이 없을 때)
  const { scene } = useGLTF('/building_hallway/scene.gltf');
  
  useEffect(() => {
    // 모델을 90도 회전
    scene.rotation.y = Math.PI / 2;
  }, [scene]);

  return <primitive object={scene} />;
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
    // 맵별 카메라 설정 적용
    const cameraHeight = Math.max(playerPosition.y + cameraSettings.height, cameraSettings.height);
    const cameraDistance = cameraSettings.distance;
    
    // 마우스 회전에 따른 카메라 위치 계산
    const horizontalAngle = mousePosition.x;
    const verticalAngle = Math.max(-0.5, Math.min(0.5, mousePosition.y)); // 수직 회전 제한
    
    const cosH = Math.cos(horizontalAngle);
    const sinH = Math.sin(horizontalAngle);
    const cosV = Math.cos(verticalAngle);
    const sinV = Math.sin(verticalAngle);
    
    // 카메라 위치 계산 (수평 + 수직 회전 적용)
    camera.position.set(
      playerPosition.x - cameraDistance * sinH * cosV,
      cameraHeight + cameraDistance * sinV,
      playerPosition.z - cameraDistance * cosH * cosV
    );
    
    // 플레이어를 바라보되 약간 위쪽을 보도록 설정
    camera.lookAt(
      playerPosition.x,
      playerPosition.y + 2, // 플레이어 머리 높이
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
      {/* 기본 조명 */}
      <ambientLight intensity={0.1} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.3} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* 감정 기반 동적 조명 */}
      {sceneConfig && (
        <>
          {/* 감정 색상 기반 포인트 라이트 */}
          <pointLight
            position={[0, 5, 0]}
            intensity={sceneConfig.particles / 20}
            color={sceneConfig.color}
            distance={20}
          />
          
          {/* 추가 분위기 조명 */}
          <pointLight
            position={[10, 3, 10]}
            intensity={0.5}
            color={sceneConfig.color}
            distance={15}
          />
          
          <pointLight
            position={[-10, 3, -10]}
            intensity={0.3}
            color={sceneConfig.color}
            distance={15}
          />
        </>
      )}
      
      {/* 기본 폐병원 조명 (감정 분석이 없는 경우) */}
      {!sceneConfig && (
        <>
          <pointLight position={[0, 5, 0]} intensity={0.8} color="#8b0000" distance={20} />
          <pointLight position={[10, 3, 10]} intensity={0.5} color="#4a4a4a" distance={15} />
          <pointLight position={[-10, 3, -10]} intensity={0.3} color="#2a2a2a" distance={15} />
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
    
    if (keys.has('KeyW')) moveVector.z += 1; // 앞으로
    if (keys.has('KeyS')) moveVector.z -= 1; // 뒤로
    if (keys.has('KeyA')) moveVector.x -= 1; // 왼쪽
    if (keys.has('KeyD')) moveVector.x += 1; // 오른쪽
    
    // 카메라 방향에 따른 이동
    if (moveVector.length() > 0) {
      moveVector.normalize();
      moveVector.multiplyScalar(speed);
      
      // 마우스 회전에 따른 이동 방향 조정
      const angle = mousePosition.x;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      const adjustedMoveVector = new THREE.Vector3(
        moveVector.x * cos - moveVector.z * sin,
        0,
        moveVector.x * sin + moveVector.z * cos
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
  const analyzedEmotion = userExperience?.analyzedEmotion;
  const preloadedEmotion = useAppStore((state) => state.preloadedEmotion);
  const isPreloading = useAppStore((state) => state.isPreloading);
  const mapBounds = useAppStore((state) => state.mapBounds);
  const setMapBounds = useAppStore((state) => state.setMapBounds);
  
  // 프리로딩된 감정이 있으면 우선 사용, 없으면 분석된 감정 사용
  const currentEmotion = preloadedEmotion || analyzedEmotion;
  
  // 맵 크기 파악 콜백
  const handleBoundsCalculated = (bounds: THREE.Box3) => {
    setMapBounds(bounds);
    console.log('Map bounds:', {
      min: bounds.min,
      max: bounds.max,
      size: bounds.getSize(new THREE.Vector3()),
      center: bounds.getCenter(new THREE.Vector3())
    });
  };

  // 에셋 상호작용 처리
  const handleAssetInteraction = () => {
    console.log('Asset interacted!');
    // 여기에 상호작용 로직 추가
  };

  // 감정별 플레이어 시작 위치 설정
  const getPlayerStartPosition = () => {
    switch (currentEmotion) {
      case '고립된':
        return new THREE.Vector3(0, 2, 0); // isolated 씬 - 작은 방
      case '배신당한':
        return new THREE.Vector3(0, 2, 0); // betrayed 씬 - 좁은 공간
      case '질투하는':
        return new THREE.Vector3(0, 2, 0); // jealous 씬 - 밀폐된 공간
      case '불안':
        return new THREE.Vector3(0, 2, 0); // nervous 씬 - 긴 복도
      case '가난한, 불우한':
        return new THREE.Vector3(0, 2, 0); // poor 씬 - 작은 방
      case '회의적인':
        return new THREE.Vector3(0, 2, 0); // skeptical 씬 - 의심스러운 공간
      case '취약한':
        return new THREE.Vector3(0, 2, 0); // vulnerable 씬 - 열린 공간
      case '상처':
        return new THREE.Vector3(0, 2, 0); // wound 씬 - 상처받은 공간
      case '희생된':
        return new THREE.Vector3(0, 2, 0); // sacrificed 씬 - 제단
      case '혼란스러운':
        return new THREE.Vector3(0, 2, 0); // confused 씬 - 미로
      case '초조한':
        return new THREE.Vector3(0, 2, 0); // unrest 씬 - 불안한 공간
      // 누락된 감정들 추가
      case '걱정스러운':
        return new THREE.Vector3(0, 2, 0); // nervous 씬과 동일
      case '괴로워하는':
        return new THREE.Vector3(0, 2, 0); // wound 씬과 동일
      case '당혹스러운':
        return new THREE.Vector3(0, 2, 0); // confused 씬과 동일
      case '두려운':
        return new THREE.Vector3(0, 2, 0); // nervous 씬과 동일
      case '버려진':
        return new THREE.Vector3(0, 2, 0); // isolated 씬과 동일
      case '스트레스 받는':
        return new THREE.Vector3(0, 2, 0); // nervous 씬과 동일
      case '억울한':
        return new THREE.Vector3(0, 2, 0); // wound 씬과 동일
      case '조심스러운':
        return new THREE.Vector3(0, 2, 0); // skeptical 씬과 동일
      case '충격 받은':
        return new THREE.Vector3(0, 2, 0); // confused 씬과 동일
      default:
        return new THREE.Vector3(5.23, 45, 518.87); // 기본 building_hallway 위치
    }
  };

  // 맵별 카메라 설정
  const getCameraSettings = () => {
    switch (currentEmotion) {
      case '고립된':
        return { height: 6, distance: 8 }; // 작은 방 - 가까운 시점
      case '배신당한':
        return { height: 8, distance: 10 }; // 좁은 공간 - 중간 시점
      case '질투하는':
        return { height: 7, distance: 9 }; // 밀폐된 공간
      case '불안':
        return { height: 10, distance: 15 }; // 긴 복도 - 넓은 시점
      case '가난한, 불우한':
        return { height: 5, distance: 7 }; // 작은 방 - 가까운 시점
      case '회의적인':
        return { height: 8, distance: 12 }; // 의심스러운 공간
      case '취약한':
        return { height: 12, distance: 18 }; // 열린 공간 - 넓은 시점
      case '상처':
        return { height: 6, distance: 8 }; // 상처받은 공간
      case '희생된':
        return { height: 9, distance: 11 }; // 제단
      case '혼란스러운':
        return { height: 8, distance: 10 }; // 미로
      case '초조한':
        return { height: 7, distance: 9 }; // 불안한 공간
      // 누락된 감정들
      case '걱정스러운':
        return { height: 10, distance: 15 }; // nervous 씬과 동일
      case '괴로워하는':
        return { height: 6, distance: 8 }; // wound 씬과 동일
      case '당혹스러운':
        return { height: 8, distance: 10 }; // confused 씬과 동일
      case '두려운':
        return { height: 10, distance: 15 }; // nervous 씬과 동일
      case '버려진':
        return { height: 6, distance: 8 }; // isolated 씬과 동일
      case '스트레스 받는':
        return { height: 10, distance: 15 }; // nervous 씬과 동일
      case '억울한':
        return { height: 6, distance: 8 }; // wound 씬과 동일
      case '조심스러운':
        return { height: 8, distance: 12 }; // skeptical 씬과 동일
      case '충격 받은':
        return { height: 8, distance: 10 }; // confused 씬과 동일
      default:
        return { height: 10, distance: 12 }; // 기본 설정
    }
  };
  
  const [playerPosition, setPlayerPosition] = useState(getPlayerStartPosition());
  const [velocity, setVelocity] = useState(new THREE.Vector3());
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  
  const sceneConfig = currentEmotion ? 
    getSceneByEmotion(currentEmotion as any, userExperience?.intensity || 5) : null;

  // 감정이 변경되면 플레이어 위치 재설정
  useEffect(() => {
    setPlayerPosition(getPlayerStartPosition());
  }, [currentEmotion]);

  // 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.code));
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
  }, []);

  // 마우스 이벤트
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPointerLocked) {
        setMousePosition(prev => ({
          x: prev.x - e.movementX * 0.002, // 방향 반전
          y: prev.y - e.movementY * 0.002  // 방향 반전
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
      {sceneConfig && (
        <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md border border-gray-700/50 rounded-lg p-4 text-white font-mono">
          <h3 className="text-lg font-bold mb-2">{sceneConfig.name}</h3>
          <p className="text-sm text-gray-300">{sceneConfig.message}</p>
        </div>
      )}
      
      {/* 좌표 디버그 */}
      <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md border border-gray-700/50 rounded-lg p-4 text-white font-mono text-sm">
        <div>X: {playerPosition.x.toFixed(2)}</div>
        <div>Y: {playerPosition.y.toFixed(2)}</div>
        <div>Z: {playerPosition.z.toFixed(2)}</div>
        {sceneConfig && (
          <div className="mt-2 text-red-400">
            감정: {userExperience?.analyzedEmotion}
          </div>
        )}
        {currentEmotion && (
          <div className="mt-2 text-green-400">
            로딩된 씬: {currentEmotion}
          </div>
        )}
        {isPreloading && (
          <div className="mt-2 text-blue-400">
            프리로딩 중...
          </div>
        )}
        {mapBounds && (
          <div className="mt-2 text-yellow-400">
            맵 크기: {mapBounds.getSize(new THREE.Vector3()).toArray().map(v => v.toFixed(1)).join(' x ')}
            <br />
            맵 범위: X({mapBounds.min.x.toFixed(1)} ~ {mapBounds.max.x.toFixed(1)}) 
            Z({mapBounds.min.z.toFixed(1)} ~ {mapBounds.max.z.toFixed(1)})
            <br />
            배치 모드: {mapBounds.getSize(new THREE.Vector3()).x < 50 || mapBounds.getSize(new THREE.Vector3()).z < 50 ? '고정 위치' : '동적 배치'}
            <br />
            카메라 설정: 높이 {getCameraSettings().height}, 거리 {getCameraSettings().distance}
          </div>
        )}
      </div>
      
      <Canvas
        shadows
        camera={{ position: [0, 10, 5], fov: 75 }}
        onClick={handleCanvasClick}
        className="cursor-crosshair"
      >
        <MapBounds onBoundsCalculated={handleBoundsCalculated} />
        <EmotionBasedLighting />
        <EmotionParticles />
        
        <EmotionScene />
        <Player position={playerPosition} velocity={velocity} />
        <FollowCamera 
          playerPosition={playerPosition} 
          mousePosition={mousePosition}
          cameraSettings={getCameraSettings()}
        />
        
        {/* 상호작용 가능한 에셋들 */}
        {mapBounds ? (
          <>
            {/* 맵 크기에 따른 동적 배치 */}
            {(() => {
              const mapSize = mapBounds.getSize(new THREE.Vector3());
              const mapCenter = mapBounds.getCenter(new THREE.Vector3());
              
              // 맵이 너무 작으면 고정 위치 사용 (임계값을 더 낮게 조정)
              if (mapSize.x < 50 || mapSize.z < 50) {
                return (
                  <>
                    {/* 고정 위치 에셋들 - 더 작은 크기로 조정 */}
                    <InteractiveAsset
                      position={[5, 1, 0]}
                      rotation={[0, Math.PI, 0]}
                      scale={[0.2, 0.2, 0.2]}
                      assetId="1"
                      onInteraction={handleAssetInteraction}
                    />
                    
                    <InteractiveAsset
                      position={[-5, 1, 0]}
                      rotation={[0, 0, 0]}
                      scale={[0.2, 0.2, 0.2]}
                      assetId="1"
                      onInteraction={handleAssetInteraction}
                    />
                    
                    <InteractiveAsset
                      position={[0, 1, 5]}
                      rotation={[0, Math.PI / 2, 0]}
                      scale={[0.2, 0.2, 0.2]}
                      assetId="1"
                      onInteraction={handleAssetInteraction}
                    />
                  </>
                );
              }
              
              // 맵이 충분히 크면 동적 배치
              return (
                <>
                  {/* 벽에 붙은 거울 에셋 */}
                  <InteractiveAsset
                    position={[mapBounds.max.x - 5, mapBounds.max.y - 2, mapCenter.z]}
                    rotation={[0, Math.PI, 0]}
                    scale={[0.5, 0.5, 0.5]}
                    assetId="1"
                    onInteraction={handleAssetInteraction}
                  />
                  
                  {/* 다른 위치의 에셋들 */}
                  <InteractiveAsset
                    position={[mapBounds.min.x + 5, mapBounds.max.y - 2, mapCenter.z]}
                    rotation={[0, 0, 0]}
                    scale={[0.5, 0.5, 0.5]}
                    assetId="1"
                    onInteraction={handleAssetInteraction}
                  />
                  
                  {/* 추가 에셋들 */}
                  <InteractiveAsset
                    position={[mapCenter.x, mapBounds.max.y - 2, mapBounds.max.z - 5]}
                    rotation={[0, Math.PI / 2, 0]}
                    scale={[0.5, 0.5, 0.5]}
                    assetId="1"
                    onInteraction={handleAssetInteraction}
                  />
                </>
              );
            })()}
          </>
        ) : (
          // 맵 크기가 아직 계산되지 않았을 때 기본 에셋들
          <>
            <InteractiveAsset
              position={[5, 1, 0]}
              rotation={[0, Math.PI, 0]}
              scale={[0.2, 0.2, 0.2]}
              assetId="1"
              onInteraction={handleAssetInteraction}
            />
            
            <InteractiveAsset
              position={[-5, 1, 0]}
              rotation={[0, 0, 0]}
              scale={[0.2, 0.2, 0.2]}
              assetId="1"
              onInteraction={handleAssetInteraction}
            />
            
            <InteractiveAsset
              position={[0, 1, 5]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[0.2, 0.2, 0.2]}
              assetId="1"
              onInteraction={handleAssetInteraction}
            />
          </>
        )}
        
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
        
        {/* 바닥 - 감정이 없을 때만 표시 */}
        {!currentEmotion && (
          <mesh position={[0, 39, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
        )}
        
        <Environment preset="night" />
      </Canvas>
      
      {/* 조작 가이드 */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-md border border-gray-700/50 rounded-lg p-4 text-white font-mono text-sm">
        <div>WASD: 이동</div>
        <div>Space: 점프</div>
        <div>마우스: 시점</div>
        <div>클릭: 포인터 락</div>
      </div>
    </div>
  );
}
