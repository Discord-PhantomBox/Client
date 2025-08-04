import axios from 'axios';

// API 기본 URL 설정 - 환경 변수 또는 기본값 사용
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

console.log('API Base URL:', BASE_URL); // 디버깅용

// 에셋 로딩을 위한 유틸리티

export interface AssetTextures {
  [key: string]: string;
}

export interface AssetFiles {
  "license.txt": string;
  "scene.bin": string;
  "scene.gltf": string;
  textures: AssetTextures;
}

export interface AssetData {
  title: string;
  description: string;
  files: AssetFiles;
}

export interface AssetResponse {
  [assetName: string]: AssetData;
}

// 에셋 로딩 함수
export const loadAsset = async (): Promise<AssetResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/asset/1`, {
      text: "나는 밤길을 걷고 싶지 않아."
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Asset loading error:', error);
    
    // Network Error 시 실제 S3 데이터 사용
    const realAssets: AssetResponse = {
      'broken_mirror': {
        title: "깨진 거울 - 내면의 분열",
        description: "자아의 균열과 혼란스러운 내면 세계를 상징하는 오브젝트입니다.",
        files: {
          "license.txt": "https://hitons.s3.ap-northeast-2.amazonaws.com/broken_mirror/license.txt",
          "scene.bin": "https://hitons.s3.ap-northeast-2.amazonaws.com/broken_mirror/scene.bin",
          "scene.gltf": "https://hitons.s3.ap-northeast-2.amazonaws.com/broken_mirror/scene.gltf",
          textures: {
            "material_1_baseColor.jpeg": "https://hitons.s3.ap-northeast-2.amazonaws.com/broken_mirror/textures/material_1_baseColor.jpeg",
            "material_1_metallicRoughness.png": "https://hitons.s3.ap-northeast-2.amazonaws.com/broken_mirror/textures/material_1_metallicRoughness.png",
            "material_baseColor.jpeg": "https://hitons.s3.ap-northeast-2.amazonaws.com/broken_mirror/textures/material_baseColor.jpeg",
            "material_metallicRoughness.png": "https://hitons.s3.ap-northeast-2.amazonaws.com/broken_mirror/textures/material_metallicRoughness.png",
            "material_normal.png": "https://hitons.s3.ap-northeast-2.amazonaws.com/broken_mirror/textures/material_normal.png"
          }
        }
      },
      'medieval_water_tub': {
        title: "중세 목욕통 - 세속의 욕망",
        description: "물을 담는 목욕통은 씻김과 정화를 상징합니다.",
        files: {
          "license.txt": "https://hitons.s3.ap-northeast-2.amazonaws.com/medieval_water_tub/license.txt",
          "scene.bin": "https://hitons.s3.ap-northeast-2.amazonaws.com/medieval_water_tub/scene.bin",
          "scene.gltf": "https://hitons.s3.ap-northeast-2.amazonaws.com/medieval_water_tub/scene.gltf",
          textures: {
            "Rotten_Wood_baseColor.jpeg": "https://hitons.s3.ap-northeast-2.amazonaws.com/medieval_water_tub/textures/Rotten_Wood_baseColor.jpeg",
            "Rotten_Wood_normal.png": "https://hitons.s3.ap-northeast-2.amazonaws.com/medieval_water_tub/textures/Rotten_Wood_normal.png",
            "Rusty_metal_baseColor.jpeg": "https://hitons.s3.ap-northeast-2.amazonaws.com/medieval_water_tub/textures/Rusty_metal_baseColor.jpeg",
            "Rusty_metal_metallicRoughness.png": "https://hitons.s3.ap-northeast-2.amazonaws.com/medieval_water_tub/textures/Rusty_metal_metallicRoughness.png",
            "Rusty_metal_normal.png": "https://hitons.s3.ap-northeast-2.amazonaws.com/medieval_water_tub/textures/Rusty_metal_normal.png"
          }
        }
      },
      'watchman_of_doom_shield': {
        title: "파멸의 수호자 방패",
        description: "절망과 종말의 시대를 지키는 마지막 방패를 의미합니다.",
        files: {
          "license.txt": "https://hitons.s3.ap-northeast-2.amazonaws.com/watchman_of_doom_shield/license.txt",
          "scene.bin": "https://hitons.s3.ap-northeast-2.amazonaws.com/watchman_of_doom_shield/scene.bin",
          "scene.gltf": "https://hitons.s3.ap-northeast-2.amazonaws.com/watchman_of_doom_shield/scene.gltf",
          textures: {
            "Material.002_baseColor.png": "https://hitons.s3.ap-northeast-2.amazonaws.com/watchman_of_doom_shield/textures/Material.002_baseColor.png",
            "Material.002_emissive.jpeg": "https://hitons.s3.ap-northeast-2.amazonaws.com/watchman_of_doom_shield/textures/Material.002_emissive.jpeg"
          }
        }
      }
    };
    
    console.log('Using real S3 data due to API server error');
    return realAssets;
  }
};

// S3 URL을 프록시를 통해 로딩하도록 변환
export const getProxiedUrl = (url: string): string => {
  if (url.includes('hitons.s3.ap-northeast-2.amazonaws.com')) {
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
};

// GLTF URL 추출 (프록시 적용)
export const getGltfUrl = (assetResponse: AssetResponse): string | null => {
  const firstAsset = Object.values(assetResponse)[0];
  if (!firstAsset || !firstAsset.files || !firstAsset.files['scene.gltf']) {
    return null;
  }
  
  const gltfUrl = firstAsset.files['scene.gltf'];
  // 모의 데이터인 경우 null 반환
  if (gltfUrl === 'mock') {
    return null;
  }
  
  // S3 URL인 경우 프록시를 통해 로딩
  return getProxiedUrl(gltfUrl);
};

// GLTF 파일을 다운로드하고 텍스처 URL을 S3 URL로 수정
export const getModifiedGltfUrl = async (assetResponse: AssetResponse): Promise<string | null> => {
  const firstAsset = Object.values(assetResponse)[0];
  if (!firstAsset || !firstAsset.files || !firstAsset.files['scene.gltf']) {
    return null;
  }
  
  const gltfUrl = firstAsset.files['scene.gltf'];
  if (gltfUrl === 'mock') {
    return null;
  }
  
  try {
    // GLTF 파일 다운로드 (프록시를 통해)
    const response = await fetch(getProxiedUrl(gltfUrl));
    
    if (!response.ok) {
      console.error('Failed to fetch GLTF:', gltfUrl, 'Status:', response.status);
      return null;
    }
    
    const gltfContent = await response.text();
    
    console.log('Original GLTF content preview:', gltfContent.substring(0, 500));
    
    // 에셋 이름 추출 (URL에서)
    const assetName = Object.keys(assetResponse)[0];
    
    // GLTF 내용을 파싱하여 텍스처 URL과 scene.bin URL을 S3 URL로 수정
    let modifiedGltf = gltfContent.replace(
      /"uri":\s*"textures\/([^"]+)"/g,
      (match, texturePath) => {
        const s3Url = `https://hitons.s3.ap-northeast-2.amazonaws.com/${assetName}/textures/${texturePath}`;
        const proxiedUrl = getProxiedUrl(s3Url);
        return `"uri": "${proxiedUrl}"`;
      }
    );
    
    // buffers 섹션에서 scene.bin 경로 수정
    modifiedGltf = modifiedGltf.replace(
      /"buffers":\s*\[\s*\{\s*"uri":\s*"([^"]*scene\.bin[^"]*)"\s*,\s*"byteLength":\s*\d+\s*\}/g,
      (match, uri) => {
        const s3Url = `https://hitons.s3.ap-northeast-2.amazonaws.com/${assetName}/scene.bin`;
        const proxiedUrl = getProxiedUrl(s3Url);
        return match.replace(uri, proxiedUrl);
      }
    );
    
    // scene.bin 경로도 수정 (더 정확한 패턴)
    modifiedGltf = modifiedGltf.replace(
      /"uri":\s*"scene\.bin"/g,
      (match) => {
        const s3Url = `https://hitons.s3.ap-northeast-2.amazonaws.com/${assetName}/scene.bin`;
        const proxiedUrl = getProxiedUrl(s3Url);
        return `"uri": "${proxiedUrl}"`;
      }
    );
    
    // scene.bin 경로도 수정 (다른 패턴)
    modifiedGltf = modifiedGltf.replace(
      /"uri":\s*"\.\/scene\.bin"/g,
      (match) => {
        const s3Url = `https://hitons.s3.ap-northeast-2.amazonaws.com/${assetName}/scene.bin`;
        const proxiedUrl = getProxiedUrl(s3Url);
        return `"uri": "${proxiedUrl}"`;
      }
    );
    
    // scene.bin 경로도 수정 (절대 경로)
    modifiedGltf = modifiedGltf.replace(
      /"uri":\s*"\/scene\.bin"/g,
      (match) => {
        const s3Url = `https://hitons.s3.ap-northeast-2.amazonaws.com/${assetName}/scene.bin`;
        const proxiedUrl = getProxiedUrl(s3Url);
        return `"uri": "${proxiedUrl}"`;
      }
    );
    
    console.log('Modified GLTF content preview:', modifiedGltf.substring(0, 500));
    
    // 수정된 GLTF를 Blob으로 생성
    const blob = new Blob([modifiedGltf], { type: 'model/gltf+json' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Failed to modify GLTF:', error);
    return null;
  }
};

// GLTF 파일을 파싱하고 내부 경로를 절대 URL로 수정
export const loadGLTFWithAbsolutePaths = async (assetId: string): Promise<string> => {
  try {
    // S3에서 GLTF 파일 직접 가져오기
    const gltfUrl = `https://hitons.s3.ap-northeast-2.amazonaws.com/${assetId}/scene.gltf`;
    console.log('GLTF URL:', gltfUrl, "assetId:", assetId);
    const response = await axios.get(gltfUrl);
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch GLTF: ${response.status}`);
    }
    const gltfJson = response.data;
    
    // base URL 설정
    const baseUrl = `https://hitons.s3.ap-northeast-2.amazonaws.com/${assetId}/`;
    
    // buffer uri 수정
    if (gltfJson.buffers) {
      gltfJson.buffers.forEach((buffer: any) => {
        if (buffer.uri && !buffer.uri.startsWith('http')) {
          buffer.uri = baseUrl + buffer.uri;
        }
      });
    }
    
    // image uri 수정 (텍스처)
    if (gltfJson.images) {
      gltfJson.images.forEach((image: any) => {
        if (image.uri && !image.uri.startsWith('http')) {
          image.uri = baseUrl + image.uri;
        }
      });
    }
    
    // 수정된 GLTF를 Blob으로 생성
    const blob = new Blob([JSON.stringify(gltfJson)], { type: 'model/gltf+json' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Failed to load GLTF with absolute paths:', error);
    throw error;
  }
};

// 텍스처 파일들 추출
export const getTextureUrls = (assetResponse: AssetResponse): string[] => {
  const firstAsset = Object.values(assetResponse)[0];
  if (!firstAsset?.files?.textures) return [];
  
  return Object.values(firstAsset.files.textures);
};

// 에셋 이름 추출
export const getAssetName = (assetResponse: AssetResponse): string | null => {
  return Object.keys(assetResponse)[0] || null;
};

// 에셋 제목 추출
export const getAssetTitle = (assetResponse: AssetResponse): string | null => {
  const firstAsset = Object.values(assetResponse)[0];
  return firstAsset?.title || null;
};

// 에셋 설명 추출
export const getAssetDescription = (assetResponse: AssetResponse): string | null => {
  const firstAsset = Object.values(assetResponse)[0];
  return firstAsset?.description || null;
}; 

// 에셋 ID 목록 추출
export const getAssetIds = (assetResponse: AssetResponse): string[] => {
  return Object.keys(assetResponse);
};

// 특정 에셋 데이터 가져오기
export const getAssetData = (assetResponse: AssetResponse, assetId: string): AssetData | null => {
  return assetResponse[assetId] || null;
}; 