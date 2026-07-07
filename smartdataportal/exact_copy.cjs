const fs = require('fs');

// 1. Completely copy MileDataMap to CityDataMap, just renaming the component
let mileCode = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDataMap.tsx', 'utf-8');
mileCode = mileCode.replace(/MileDataMap/g, 'CityDataMap');
mileCode = mileCode.replace(/activeTab/g, 'activeTabProp'); // we don't pass activeTab from App.tsx since we removed it from App.tsx for cityMap
// Actually, App.tsx renders: <CityDataMap onShowToast={triggerToast} /> without activeTab.
// So we need to make activeTab internal state in CityDataMap.
mileCode = mileCode.replace(/interface CityDataMapProps {[\s\S]*?}/, 'interface CityDataMapProps {\n  onShowToast: (msg: string) => void;\n}');
mileCode = mileCode.replace(/export default function CityDataMap\(\{ activeTabProp, onTabChange, onShowToast \}: CityDataMapProps\) \{/, 'export default function CityDataMap({ onShowToast }: CityDataMapProps) {\n  const [activeTab, setActiveTab] = useState<\'energy\' | \'mobility\' | \'safety\' | \'data\'>(\'energy\');');

// Update handleMileChange to just set internal state
mileCode = mileCode.replace(/onTabChange\(mile\);/, 'setActiveTab(mile);');

fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/CityDataMap.tsx', mileCode, 'utf-8');

// 2. Fix Breadcrumb in App.tsx
let appCode = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/App.tsx', 'utf-8');

// Replace the breadcrumb part for cityMap
// Current breadcrumb logic in App.tsx:
// {currentPage === 'map' ? (
//   ...
// ) : (
//   <>
//     ...
//     {currentPage === 'intro' ? '사업소개' : '자료실'}
//   </>
// )}

appCode = appCode.replace(
  /\{currentPage === 'intro' \? '사업소개' : '자료실'\}/,
  "{currentPage === 'intro' ? '사업소개' : currentPage === 'archive' ? '자료실' : '광명시 데이터'}"
);

fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/App.tsx', appCode, 'utf-8');

console.log('Copied MileDataMap exactly and fixed breadcrumb.');
