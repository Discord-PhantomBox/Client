'use client';
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../lib/store';
import { getSceneByEmotion } from '../lib/emotionMapper';

function BuildingHallway() {
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

function FollowCamera({ playerPosition }: { playerPosition: THREE.Vector3 }) {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(playerPosition.x, playerPosition.y + 10.0, playerPosition.z + 5);
    camera.lookAt(playerPosition);
  }, [camera, playerPosition]);

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

export default function SceneViewer() {
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(5.23, 40, 518.87));
  const [velocity, setVelocity] = useState(new THREE.Vector3());
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  
  const userExperience = useAppStore((state) => state.userExperience);
  const sceneConfig = userExperience?.analyzedEmotion ? 
    getSceneByEmotion(userExperience.analyzedEmotion as any, userExperience.intensity) : null;

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
          x: prev.x + e.movementX * 0.002,
          y: prev.y + e.movementY * 0.002
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

  // 플레이어 이동 로직
  useFrame(() => {
    const speed = 0.5;
    const jumpSpeed = 0.8;
    const gravity = -0.02;
    
    const newVelocity = velocity.clone();
    const newPosition = playerPosition.clone();
    
    // 중력 적용
    newVelocity.y += gravity;
    
    // 키보드 입력 처리
    const moveVector = new THREE.Vector3();
    
    if (keys.has('KeyW')) moveVector.z -= 1;
    if (keys.has('KeyS')) moveVector.z += 1;
    if (keys.has('KeyA')) moveVector.x -= 1;
    if (keys.has('KeyD')) moveVector.x += 1;
    
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
    if (keys.has('Space') && newPosition.y <= 40.1) {
      newVelocity.y = jumpSpeed;
    }
    
    // 위치 업데이트
    newPosition.add(newVelocity);
    
    // 바닥 충돌
    if (newPosition.y < 40) {
      newPosition.y = 40;
      newVelocity.y = 0;
    }
    
    // 천장 충돌
    if (newPosition.y > 80) {
      newPosition.y = 80;
      newVelocity.y = 0;
    }
    
    setPlayerPosition(newPosition);
    setVelocity(newVelocity);
  });

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
      </div>
      
      <Canvas
        shadows
        camera={{ position: [0, 10, 5], fov: 75 }}
        onClick={handleCanvasClick}
        className="cursor-crosshair"
      >
        <EmotionBasedLighting />
        <EmotionParticles />
        
        <BuildingHallway />
        <Player position={playerPosition} velocity={velocity} />
        <FollowCamera playerPosition={playerPosition} />
        
        {/* 바닥 */}
        <mesh position={[0, 39, 0]} receiveShadow>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        
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
