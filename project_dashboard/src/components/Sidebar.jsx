import React from 'react';
import { LayoutDashboard, Settings } from 'lucide-react';

const Sidebar = ({ currentPage, onNavigate }) => {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-20 flex-shrink-0">
            <div className="h-[73px] flex items-center px-6 border-b border-gray-200">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                    Dynamic-Verification
                </span>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                <button
                    onClick={() => onNavigate('dashboard')}
                    className={`flex items-center w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${currentPage === 'dashboard'
                            ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                        }`}
                >
                    <LayoutDashboard className={`w-5 h-5 mr-3 ${currentPage === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    대시보드
                </button>

                <button
                    onClick={() => onNavigate('setup')}
                    className={`flex items-center w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${currentPage === 'setup'
                            ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                        }`}
                >
                    <Settings className={`w-5 h-5 mr-3 ${currentPage === 'setup' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    검증 환경 세팅
                </button>
            </nav>

            <div className="p-4 border-t border-gray-100 text-xs text-center font-medium text-gray-400">
                v1.0.0 Beta
            </div>
        </aside>
    );
};

export default Sidebar;
