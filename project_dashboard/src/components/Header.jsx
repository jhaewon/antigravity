import React from 'react';
import { Activity } from 'lucide-react';
import { versions } from '../data/mockData';

const Header = ({ currentVersion, onVersionChange }) => {
    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <header className="glass-panel sticky top-0 z-50 shadow-sm relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Activity className="w-8 h-8 mr-3 text-indigo-600" />
                    동적 검증 실무 대시보드
                </h1>
                <div className="flex items-center space-x-4">
                    
                    {/* 버전 선택 드롭다운 */}
                    <div className="flex items-center mt-1 sm:mt-0">
                        <label htmlFor="version-select" className="sr-only">버전 선택</label>
                        <select
                            id="version-select"
                            value={currentVersion}
                            onChange={(e) => onVersionChange(e.target.value)}
                            className="block w-full pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm border font-semibold bg-indigo-50 text-indigo-900 cursor-pointer hover:bg-indigo-100 transition-colors"
                        >
                            {versions.map(v => (
                                <option key={v} value={v}>버전: {v}</option>
                            ))}
                        </select>
                    </div>

                    <span className="text-sm text-gray-500 font-medium">조회일: {today}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
