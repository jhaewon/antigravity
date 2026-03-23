import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import KpiCards from './components/KpiCards';
import SubsystemChart from './components/SubsystemChart';
import RiskTracker from './components/RiskTracker';
import { useDashboardData } from './hooks/useDashboardData';

function App() {
  const { data: dashboardData, versions, loading, error } = useDashboardData();
  const [selectedVersion, setSelectedVersion] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');

  // 버전 데이터가 로드되면 첫 번째 버전을 기본값으로 설정
  useEffect(() => {
    if (versions && versions.length > 0 && !selectedVersion) {
      setSelectedVersion(versions[0]);
    }
  }, [versions, selectedVersion]);

  // 페이지 내용 렌더러 함수
  const renderContent = () => {
    // 1. 공통 로딩 상태
    if (loading) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <span className="text-sm text-gray-600 font-medium">최신 데이터를 구글 시트에서 불러오는 중...</span>
          </div>
        </div>
      );
    }

    // 2. 공통 에러 상태
    if (error) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100 max-w-md w-full">
            <h2 className="text-red-600 font-bold mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              데이터 로드 실패
            </h2>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{error}</p>
            <button onClick={() => window.location.reload()} className="w-full bg-red-50 text-red-600 px-4 py-2 rounded font-medium text-sm hover:bg-red-100 transition-colors">
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    // 3. 검증 환경 세팅 페이지 (준비중)
    if (currentPage === 'setup') {
      return (
        <main className="h-full flex flex-col items-center justify-center p-8 animate-fade-in relative z-10 bg-gray-50/50">
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100 shadow-inner">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 block">검증 환경 세팅</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              검증 환경 세팅을 위한 챗봇 기능이 곧 제공될 예정입니다.
            </p>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              업데이트 준비 중 (Coming Soon)
            </span>
          </div>
        </main>
      );
    }

    // 4. 대시보드 페이지 - 데이터 없을 때 방어 코드
    if (!dashboardData || !selectedVersion || !dashboardData[selectedVersion]) {
      return (
        <div className="h-full flex items-center justify-center">
          <span className="text-gray-400 font-medium bg-white px-6 py-3 rounded-lg border border-gray-100 shadow-sm">
            조회 가능한 버전 데이터가 없습니다. (요약 시트를 확인해 주세요)
          </span>
        </div>
      );
    }

    // 5. 대시보드 페이지 렌더링
    const currentData = dashboardData[selectedVersion];

    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in relative z-10 w-full">
        <KpiCards data={currentData.kpi} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SubsystemChart data={currentData.chart} bottlenecks={currentData.bottlenecks} />
          <RiskTracker issues={currentData.issues} />
        </div>
      </main>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* 고정된 좌측 사이드바 구조 */}
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* 우측 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* 헤더 (대시보드 페이지에서만 버전 선택 노출) */}
        {currentPage === 'dashboard' && (
          <Header
            currentVersion={selectedVersion}
            onVersionChange={setSelectedVersion}
            versions={versions}
          />
        )}

        {/* 내부 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto w-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
