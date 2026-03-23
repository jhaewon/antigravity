import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { AlertTriangle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SubsystemChart = ({ data, bottlenecks = [] }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { family: "'Pretendard', sans-serif" }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleFont: { family: "'Pretendard', sans-serif", size: 14 },
                bodyFont: { family: "'Pretendard', sans-serif", size: 13 },
                padding: 12,
                callbacks: {
                    afterBody: function(context) {
                        const completed = context[0].raw;
                        const remaining = context[1].raw;
                        const total = completed + remaining;
                        const percent = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;
                        return `\n총 할당량: ${total}건\n진행률: ${percent}%`;
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                grid: { display: false },
                ticks: { font: { family: "'Pretendard', sans-serif", weight: 'bold' } }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                grid: { color: '#f3f4f6' },
                ticks: { font: { family: "'Pretendard', sans-serif" } }
            }
        },
        animation: { duration: 1500, easing: 'easeOutQuart' }
    };

    return (
        <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">서브시스템별 상세 현황</h2>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">완료 vs 잔여 (건수)</span>
            </div>
            <div className="relative h-80 w-full">
                <Bar options={options} data={data} />
            </div>
            {bottlenecks.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100 text-sm text-red-800 flex items-start animate-fade-in">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold">병목 구간 경고:</span> {bottlenecks.join(', ')} 서브시스템의 진행률이 현재 0%로 병목 구간에 해당되어 프로젝트 일정에 영향을 줄 수 있습니다. 
                    </div>
                </div>
            )}
        </section>
    );
};

export default SubsystemChart;
