import React from 'react';

const KpiCards = ({ data }) => {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 총 검증 대상 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center transition-transform hover:-translate-y-1 duration-300">
                <div className="text-sm font-medium text-gray-500 mb-1">총 검증대상 요구사항 (Req)</div>
                <div className="text-3xl font-bold text-gray-900">{data.total.toLocaleString()}</div>
            </div>
            
            {/* 완료 건수 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center transition-transform hover:-translate-y-1 duration-300">
                <div className="text-sm font-medium text-gray-500 mb-1">완료 요구사항 (Req)</div>
                <div className="text-3xl font-bold text-indigo-600">{data.completed.toLocaleString()}</div>
                <div className="text-sm text-gray-400 mt-2">
                    잔여: <span className="font-medium text-gray-600">{data.remaining.toLocaleString()}</span> 건
                </div>
            </div>

            {/* 진행률 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center relative overflow-hidden transition-transform hover:-translate-y-1 duration-300">
                <div className="relative z-10">
                    <div className="text-sm font-medium text-gray-500 mb-1">전체 진행률</div>
                    <div className="flex items-baseline space-x-2">
                        <div className="text-3xl font-bold text-gray-900">{data.progress}%</div>
                        {data.status === 'Delayed' && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                {data.status}
                            </span>
                        )}
                        {data.status === 'On-Track' && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                {data.status}
                            </span>
                        )}
                        {data.status === '완료' && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                                {data.status}
                            </span>
                        )}
                    </div>
                </div>
                {/* 프로그레스 바 배경 */}
                <div className="absolute bottom-0 left-0 h-1 bg-gray-100 w-full">
                    <div 
                        className={`h-full ${data.status === 'Delayed' ? 'bg-red-500' : data.status === '완료' ? 'bg-blue-500' : 'bg-green-500'}`} 
                        style={{ width: `${data.progress}%` }}
                    ></div>
                </div>
            </div>

            {/* 일정 현황 (하드코딩 제거 및 상태별 동적 UI 변경) */}
            <div className={`rounded-xl shadow-sm border p-6 flex flex-col justify-center transition-transform hover:-translate-y-1 duration-300 ${
                data.status === '완료' ? 'bg-blue-50 border-blue-200' :
                data.status === 'Delayed' ? 'bg-red-50 border-red-200' :
                'bg-green-50 border-green-200'
            }`}>
                <div className={`text-sm font-medium mb-1 ${
                    data.status === '완료' ? 'text-blue-600' :
                    data.status === 'Delayed' ? 'text-red-600' :
                    'text-green-600'
                }`}>목표 일정 준수 여부</div>
                <div className={`text-xl font-bold ${
                    data.status === '완료' ? 'text-blue-700' :
                    data.status === 'Delayed' ? 'text-red-700' :
                    'text-green-700'
                }`}>
                    {data.status === '완료' ? '개발 완료 (Completed)' : 
                     data.status === 'Delayed' ? '심각한 지연 (At Risk)' : 
                     '정상 진행 (On-Track)'}
                </div>
                <div className={`mt-2 text-sm flex justify-between ${
                    data.status === '완료' ? 'text-blue-600' :
                    data.status === 'Delayed' ? 'text-red-600' :
                    'text-green-600'
                }`}>
                    <span>목표: {data.targetDate}</span>
                    <span className="font-semibold">현재: {data.currentDate}</span>
                </div>
            </div>
        </section>
    );
};

export default KpiCards;
