// 에셋 로딩을 위한 유틸리티

export interface AssetTextures {
  [key: string]: string;
}

export interface AssetData {
  "license.txt": string;
  "scene.bin": string;
  "scene.gltf": string;
  textures: AssetTextures;
}

export interface AssetResponse {
  [assetName: string]: AssetData;
}

// 에셋 로딩 함수
export const loadAsset = async (assetId: string): Promise<AssetResponse> => {
  try {
    const response = await fetch(`/asset/${assetId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: "나는 밤길을 걷고 싶지 않아."
      })
    });

    if (!response.ok) {
      throw new Error(`Asset loading failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Asset loading error:', error);
    throw error;
  }
};

// GLTF 파일 URL 추출
export const getGltfUrl = (assetResponse: AssetResponse): string | null => {
  // 첫 번째 에셋의 scene.gltf URL을 반환
  const firstAsset = Object.values(assetResponse)[0];
  return firstAsset?.["scene.gltf"] || null;
};

// 텍스처 파일들 추출
export const getTextureUrls = (assetResponse: AssetResponse): string[] => {
  const firstAsset = Object.values(assetResponse)[0];
  if (!firstAsset?.textures) return [];
  
  return Object.values(firstAsset.textures);
};

// 에셋 이름 추출
export const getAssetName = (assetResponse: AssetResponse): string | null => {
  return Object.keys(assetResponse)[0] || null;
}; 