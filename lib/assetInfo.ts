export interface AssetInfo {
  id: string;
  title: string;
  description: string;
  symbol: string;
}

export const assetInfo: Record<string, AssetInfo> = {
  broken_mirror: {
    id: 'broken_mirror',
    title: '깨진 거울',
    description: '내면의 분열과 혼란스러운 자아를 상징합니다. 거울이 깨져 있는 것은 자신의 정체성에 대한 혼란과 분열된 내면 세계를 나타냅니다.',
    symbol: '자아의 균열'
  },
  medieval_water_tub: {
    id: 'medieval_water_tub',
    title: '중세 목욕통',
    description: '세속의 욕망과 정화를 상징합니다. 물을 담는 목욕통은 씻김과 정화를 의미하며, 중세 시대의 세속적 욕망과 정신적 정화의 대비를 보여줍니다.',
    symbol: '세속의 욕망'
  },
  wooden_ladder: {
    id: 'wooden_ladder',
    title: '나무 사다리',
    description: '승화와 성장을 상징합니다. 사다리는 위로 올라가는 도구로, 정신적 성장과 내면의 승화 과정을 나타냅니다.',
    symbol: '정신적 승화'
  }
};

export const getAssetInfo = (assetId: string): AssetInfo | null => {
  return assetInfo[assetId] || null;
}; 