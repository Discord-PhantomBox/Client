'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// GLTF 모델 컴포넌트
function BuildingHallway() {
  const gltf = useGLTF('/building_hallway/scene.gltf');
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (modelRef.current) {
      // 90도 회전 (Y축 기준)
      modelRef.current.rotation.y = Math.PI / 2;
      
      // 모델 크기 조정
      modelRef.current.scale.setScalar(1);
      
      // 모델 위치 조정
      modelRef.current.position.set(0, 0, 0);
    }
  }, []);

  return (
    <primitive 
      ref={modelRef}
      object={gltf.scene} 
    />
  );
}

// 충돌 감지 유틸리티
function checkCollision(position: THREE.Vector3, bounds: { x: number, z: number }): THREE.Vector3 {
  const newPosition = position.clone();
  
  // 맵 경계 체크 (매우 큰 값으로 설정하여 사실상 제한 없음)
  if (Math.abs(newPosition.x) > bounds.x) {
    newPosition.x = Math.sign(newPosition.x) * bounds.x;
  }
  if (Math.abs(newPosition.z) > bounds.z) {
    newPosition.z = Math.sign(newPosition.z) * bounds.z;
  }
  
  // 건물 내부 영역 제한 제거 (매우 큰 값으로 설정)
  const hallwayWidth = 10000;
  const hallwayLength = 10000;
  
  // 복도 영역 밖으로 나가지 못하도록 제한 (사실상 제한 없음)
  if (Math.abs(newPosition.x) > hallwayWidth) {
    newPosition.x = Math.sign(newPosition.x) * hallwayWidth;
  }
  
  if (Math.abs(newPosition.z) > hallwayLength) {
    newPosition.z = Math.sign(newPosition.z) * hallwayLength;
  }
  
  return newPosition;
}

// 플레이어 컴포넌트
function Player({ position, onPositionChange }: { 
  position: THREE.Vector3; 
  onPositionChange: (pos: THREE.Vector3) => void;
}) {
  const playerRef = useRef<THREE.Mesh>(null);
  const velocity = useRef(new THREE.Vector3());
  const keys = useRef<Set<string>>(new Set());
  const isOnGround = useRef(true);
  const isCrouching = useRef(false);
  const isRunning = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });

  // 키 입력 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keys.current.add(event.code);
      
      // 점프
      if (event.code === 'Space' && isOnGround.current) {
        velocity.current.y = 35;
        isOnGround.current = false;
      }
      
      // 앉기
      if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
        isCrouching.current = true;
      }
      
      // 달리기
      if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        isRunning.current = true;
      }
      
      // 상호작용
      if (event.code === 'KeyF') {
        console.log('상호작용!');
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keys.current.delete(event.code);
      
      // 앉기 해제
      if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
        isCrouching.current = false;
      }
      
      // 달리기 해제
      if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        isRunning.current = false;
      }
    };

    // 마우스 움직임 처리
    const handleMouseMove = (event: MouseEvent) => {
      const sensitivity = 0.002;
      mouseRef.current.x += event.movementX * sensitivity;
      mouseRef.current.y += event.movementY * sensitivity;
      
      // 수직 회전 제한
      mouseRef.current.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseRef.current.y));
    };

    // 마우스 포인터 잠금
    const handleClick = () => {
      document.body.requestPointerLock();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const speed = isRunning.current ? 70 : 40;
    const moveSpeed = isCrouching.current ? speed * 0.5 : speed;
    
    // 이동 처리 (카메라 방향 기준)
    const moveVector = new THREE.Vector3();
    
    // 전후 이동 (W/S)
    if (keys.current.has('KeyW')) moveVector.z -= 1;
    if (keys.current.has('KeyS')) moveVector.z += 1;
    
    // 좌우 이동 (A/D)
    if (keys.current.has('KeyA')) moveVector.x -= 1;
    if (keys.current.has('KeyD')) moveVector.x += 1;
    
    // 벡터가 0이 아닐 때만 정규화
    if (moveVector.length() > 0) {
      moveVector.normalize();
    }
    moveVector.multiplyScalar(moveSpeed * delta);
    
    // 카메라 회전에 따른 이동 방향 조정
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationY(-mouseRef.current.x);
    moveVector.applyMatrix4(rotationMatrix);
    
    // 새로운 위치 계산
    const newPosition = position.clone().add(moveVector);
    
    // 중력 적용
    velocity.current.y -= 25 * delta;
    newPosition.y += velocity.current.y * delta;
    
    // 바닥 충돌 체크
    if (newPosition.y < 50) {
      newPosition.y = 50;
      velocity.current.y = 0;
      isOnGround.current = true;
    }
    
    // 천장 충돌 체크
    if (newPosition.y > 60) {
      newPosition.y = 60;
      velocity.current.y = 0;
    }
    
    // 충돌 감지 및 위치 조정
    const adjustedPosition = checkCollision(newPosition, { x: 10000, z: 10000 });
    onPositionChange(adjustedPosition);
  });

  return (
    <mesh ref={playerRef} position={position} visible={false}>
      <boxGeometry args={[0.5, isCrouching.current ? 0.5 : 1, 0.5]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

// 메인 SceneViewer 컴포넌트
export default function SceneViewer() {
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(5.23, 40, 518.87));

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 50, 0], fov: 90 }}
        shadows
      >
        {/* 조명 */}
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* 복도 조명 (가로등 효과) */}
        <pointLight
          position={[0, 35, 0]}
          intensity={5.0}
          distance={30}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* 추가 조명들 */}
        <pointLight
          position={[0, 35, 20]}
          intensity={4.0}
          distance={25}
          castShadow
        />
        
        <pointLight
          position={[0, 35, -20]}
          intensity={4.0}
          distance={25}
          castShadow
        />
        
        {/* 바닥 */}
        {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#444" />
        </mesh> */}
        
        {/* 건물 모델 */}
        <BuildingHallway />
        
        {/* 플레이어 */}
        <Player 
          position={playerPosition} 
          onPositionChange={setPlayerPosition}
        />
        
        {/* 카메라가 플레이어를 따라가도록 */}
        <FollowCamera target={playerPosition} />
        
        {/* 맵 경계 표시 (디버그용) */}
        <MapBoundaries />
      </Canvas>
      
      {/* 컨트롤 안내 */}
      <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-4 rounded">
        <h3 className="font-bold mb-2">컨트롤:</h3>
        <p>WASD - 이동</p>
        <p>Space - 점프</p>
        <p>Ctrl - 앉기</p>
        <p>Shift - 달리기</p>
        <p>F - 상호작용</p>
        <p>마우스 - 카메라 회전</p>
        <p>클릭 - 마우스 잠금</p>
      </div>
      
      {/* 디버그 좌표 표시 */}
      <div className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-4 rounded font-mono">
        <h3 className="font-bold mb-2">좌표:</h3>
        <p>X: {playerPosition.x.toFixed(2)}</p>
        <p>Y: {playerPosition.y.toFixed(2)}</p>
        <p>Z: {playerPosition.z.toFixed(2)}</p>
      </div>
    </div>
  );
}

// 맵 경계 표시 컴포넌트 (디버그용)
function MapBoundaries() {
  return (
    <group>
      {/* 복도 경계 표시 */}
      <lineSegments>
        <edgesGeometry>
          <boxGeometry args={[6, 0.1, 30]} />
        </edgesGeometry>
        <lineBasicMaterial color="yellow" />
      </lineSegments>
    </group>
  );
}

// 카메라가 플레이어를 따라가는 컴포넌트 (1인칭)
function FollowCamera({ target }: { target: THREE.Vector3 }) {
  const mouseRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const sensitivity = 0.002;
      mouseRef.current.x += event.movementX * sensitivity;
      mouseRef.current.y += event.movementY * sensitivity;
      
      // 수직 회전 제한
      mouseRef.current.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseRef.current.y));
    };

    const handleClick = () => {
      document.body.requestPointerLock();
    };

    // 포인터 잠금 상태 변경 감지
    const handlePointerLockChange = () => {
      if (document.pointerLockElement) {
        document.addEventListener('mousemove', handleMouseMove);
      } else {
        document.removeEventListener('mousemove', handleMouseMove);
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    window.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);
  
  useFrame(({ camera }) => {
    // 카메라 위치를 플레이어 위치로 설정
    camera.position.copy(target);
    camera.position.y += 10.0; // 플레이어 눈 높이
    
    // 마우스 움직임에 따른 카메라 방향 설정
    camera.rotation.x = 0; // 상하 회전 제한
    camera.rotation.y = -mouseRef.current.x;
  });
  
  return null;
}
