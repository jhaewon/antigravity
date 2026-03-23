import React, { useState } from 'react';
import Header from './components/Header';
import KpiCards from './components/KpiCards';
import SubsystemChart from './components/SubsystemChart';
import RiskTracker from './components/RiskTracker';
import { dashboardData, versions } from './data/mockData';

function App() {
  // 첫 번째 버전을 기본값으로 설정 (예: T0020)
  const [selectedVersion, setSelectedVersion] = useState(versions[0]);
  
  // 현재 선택된 버전에 해당하는 데이터 블록
  const currentData = dashboardData[selectedVersion];

  return (
    <>
      <Header 
        currentVersion={selectedVersion} 
        onVersionChange={setSelectedVersion} 
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* KPI: On-Track, Delayed 등 상태에 따라 UI 색상이 자동 변경됨 */}
        <KpiCards data={currentData.kpi} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SubsystemChart data={currentData.chart} />
          <RiskTracker issues={currentData.issues} />
        </div>
      </main>
    </>
  );
}

export default App;
