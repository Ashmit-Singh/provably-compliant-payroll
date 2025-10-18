import React from 'react';

const ChartContainer = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 h-full">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">{title}</h3>
        <div className="h-72">
            {children}
        </div>
    </div>
);

export default ChartContainer;