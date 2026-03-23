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
                    </div>
                </div>
                {/* 프로그레스 바 배경 */}
                <div className="absolute bottom-0 left-0 h-1 bg-gray-100 w-full">
                    <div 
                        className={`h-full ${data.status === 'Delayed' ? 'bg-red-500' : 'bg-indigo-500'}`} 
                        style={{ width: `${data.progress}%` }}
                    ></div>
                </div>
            </div>

            {/* 일정 현황 */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 flex flex-col justify-center bg-red-50 transition-transform hover:-translate-y-1 duration-300">
                <div className="text-sm font-medium text-red-600 mb-1">목표 일정 준수 여부</div>
                <div className="text-xl font-bold text-red-700">심각한 지연 (At Risk)</div>
                <div className="mt-2 text-sm text-red-600 flex justify-between">
                    <span>목표: {data.targetDate}</span>
                    <span className="font-semibold">현재: {data.currentDate}</span>
                </div>
            </div>
        </section>
    );
};

export default KpiCards;
