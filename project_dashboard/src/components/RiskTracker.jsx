import React from 'react';
import { AlertCircle } from 'lucide-react';

const RiskTracker = ({ issues }) => {
    return (
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="p-5 border-b border-gray-100 bg-gray-50 rounded-t-xl flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    Risk Tracker
                </h2>
                <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                    {issues.length} Critical
                </span>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
                {issues.map((issue) => {
                    const isBlocker = issue.type === 'Blocker';
                    return (
                        <div 
                            key={issue.id} 
                            className={`border rounded-lg p-4 duration-200 hover:shadow-md transition-shadow 
                                ${isBlocker ? 'border-red-200 bg-red-50 left-border' : 'border-orange-200 bg-orange-50'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm 
                                    ${isBlocker ? 'bg-red-600' : 'bg-orange-500'}`}>
                                    {issue.type}
                                </span>
                                {issue.dateRange && (
                                    <span className={`text-xs font-medium ${isBlocker ? 'text-red-500' : 'text-orange-500'}`}>
                                        {issue.dateRange}
                                    </span>
                                )}
                            </div>
                            
                            <h3 className={`font-bold text-sm mb-1 ${isBlocker ? 'text-red-900' : 'text-orange-900'}`}>
                                {issue.title}
                            </h3>
                            <p className={`text-xs leading-relaxed mb-3 ${isBlocker ? 'text-red-700' : 'text-orange-700'}`}>
                                {issue.description}
                            </p>
                            
                            {issue.impact && issue.impact.length > 0 && (
                                isBlocker ? (
                                    <div className="pt-2 border-t border-red-200/50 flex justify-between text-xs">
                                        <span className="font-semibold text-red-800">{issue.impact[0].label}:</span>
                                        <span className="text-red-700">{issue.impact[0].value}</span>
                                    </div>
                                ) : (
                                    <ul className="text-xs space-y-2 mt-2 border-t border-orange-200/50 pt-2">
                                        {issue.impact.map((imp, idx) => (
                                            <li key={idx} className="flex justify-between items-center">
                                                <span className="text-orange-800 font-medium">{imp.label}</span>
                                                <span className="bg-orange-200 text-orange-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                                    {imp.value}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default RiskTracker;
