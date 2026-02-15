import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Clock, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Mock Real-time Data
  const [queueStats, setQueueStats] = useState({
    high: 4, medium: 12, low: 8, total: 24, avgWait: 18
  });
  
  const [deptLoad, setDeptLoad] = useState([
    { name: 'Emergency', capacity: 78 },
    { name: 'Cardiology', capacity: 45 },
    { name: 'Gen Med', capacity: 62 },
    { name: 'Neuro', capacity: 30 },
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'critical', msg: 'High-risk patient arrived - Bed 3', time: '2m ago' },
    { id: 2, type: 'warning', msg: 'Sepsis protocol - PT-0156', time: '12m ago' },
    { id: 3, type: 'info', msg: 'Shift change in 30 mins', time: '45m ago' },
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
        setQueueStats(prev => ({
            ...prev,
            total: prev.total + (Math.random() > 0.7 ? 1 : 0),
            avgWait: Math.floor(15 + Math.random() * 5)
        }));
        setDeptLoad(prev => prev.map(d => ({
            ...d,
            capacity: Math.min(100, Math.max(0, d.capacity + Math.floor(Math.random() * 5 - 2)))
        })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const pieData = [
    { name: 'High', value: queueStats.high, color: '#DC2626' },
    { name: 'Medium', value: queueStats.medium, color: '#F59E0B' },
    { name: 'Low', value: queueStats.low, color: '#10B981' },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar space-y-4 p-1">
      {/* Queue Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Current Queue</h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Users className="mx-auto text-blue-500 mb-1" size={20} />
                <div className="text-2xl font-black text-gray-800">{queueStats.total}</div>
                <div className="text-xs text-gray-500">Waiting</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Clock className="mx-auto text-blue-500 mb-1" size={20} />
                <div className="text-2xl font-black text-gray-800">{queueStats.avgWait}</div>
                <div className="text-xs text-gray-500">Avg Mins</div>
            </div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Risk Distribution</h3>
        <div className="h-40 relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="text-xs font-bold text-gray-400">LIVE</span>
             </div>
        </div>
        <div className="flex justify-center gap-4 text-xs">
            {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
                    <span>{d.name}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Dept Load */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Department Load</h3>
        <div className="space-y-3">
            {deptLoad.map(dept => (
                <div key={dept.name}>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">{dept.name}</span>
                        <span className="text-gray-500">{dept.capacity}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                                dept.capacity > 80 ? 'bg-red-500' : dept.capacity > 60 ? 'bg-amber-400' : 'bg-green-500'
                            }`} 
                            style={{width: `${dept.capacity}%`}}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
         <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Live Alerts</h3>
         <div className="space-y-3">
            {alerts.map(alert => (
                <div key={alert.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <AlertTriangle size={16} className={`mt-0.5 flex-shrink-0 ${
                        alert.type === 'critical' ? 'text-red-500' : alert.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                    }`} />
                    <div>
                        <div className="text-xs font-medium text-gray-800">{alert.msg}</div>
                        <div className="text-[10px] text-gray-400">{alert.time}</div>
                    </div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;