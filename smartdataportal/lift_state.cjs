const fs = require('fs');

// 1. Update App.tsx
let appCode = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/App.tsx', 'utf-8');
// It doesn't have activeMileTab yet, let's insert it inside `export default function App() {`
if (!appCode.includes('activeMileTab')) {
  appCode = appCode.replace(
    'export default function App() {\n',
    'export default function App() {\n  const [activeMileTab, setActiveMileTab] = useState<\'energy\' | \'mobility\' | \'safety\' | \'data\'>(\'energy\');\n'
  );
  appCode = appCode.replace(
    '<MileDataMap onShowToast={triggerToast} />',
    '<MileDataMap activeTab={activeMileTab} onTabChange={setActiveMileTab} onShowToast={triggerToast} />'
  );
  appCode = appCode.replace(
    '<MileDashboard onShowToast={triggerToast} />',
    '<MileDashboard activeTab={activeMileTab} onTabChange={setActiveMileTab} onShowToast={triggerToast} />'
  );
  fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/App.tsx', appCode, 'utf-8');
}

// 2. Update MileDataMap.tsx
let mapCode = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDataMap.tsx', 'utf-8');
if (!mapCode.includes('activeTab?:')) {
  mapCode = mapCode.replace(
    'interface MileDataMapProps {\n  onShowToast: (message: string) => void;\n}',
    'interface MileDataMapProps {\n  onShowToast: (message: string) => void;\n  activeTab: \'energy\' | \'mobility\' | \'safety\' | \'data\';\n  onTabChange: (tab: \'energy\' | \'mobility\' | \'safety\' | \'data\') => void;\n}'
  );
  mapCode = mapCode.replace(
    'export default function MileDataMap({ onShowToast }: MileDataMapProps) {',
    'export default function MileDataMap({ activeTab, onTabChange, onShowToast }: MileDataMapProps) {'
  );
  mapCode = mapCode.replace(
    "const [activeMile, setActiveMile] = useState<'energy' | 'mobility' | 'safety' | 'data'>('energy');",
    ""
  );
  mapCode = mapCode.replace(/activeMile/g, 'activeTab');
  mapCode = mapCode.replace(/setActiveMile/g, 'onTabChange');
  fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDataMap.tsx', mapCode, 'utf-8');
}

// 3. Update MileDashboard.tsx
let dashCode = fs.readFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', 'utf-8');
if (!dashCode.includes('activeTab:')) {
  dashCode = dashCode.replace(
    'interface MileDashboardProps {\n  onShowToast: (message: string) => void;\n}',
    'interface MileDashboardProps {\n  onShowToast: (message: string) => void;\n  activeTab: string;\n  onTabChange: (tab: string) => void;\n}'
  );
  // sometimes it might be inline interface or no interface? Let's check:
  // if not found, we can use regex to replace props.
}
// It's probably easier to just replace `export default function MileDashboard({ onShowToast }: MileDashboardProps) {`
if(dashCode.includes('export default function MileDashboard({ onShowToast }: MileDashboardProps) {')) {
    dashCode = dashCode.replace(
        'export default function MileDashboard({ onShowToast }: MileDashboardProps) {',
        'export default function MileDashboard({ activeTab, onTabChange, onShowToast }: MileDashboardProps) {'
    );
    dashCode = dashCode.replace(
        "const [activeTab, setActiveTab] = useState('energy');",
        ""
    );
    dashCode = dashCode.replace(/setActiveTab/g, 'onTabChange');
    fs.writeFileSync('c:/Users/hrjeong/Desktop/광명 스마트데이터포털/src/components/MileDashboard.tsx', dashCode, 'utf-8');
}

console.log("State lifted to App.tsx successfully.");
