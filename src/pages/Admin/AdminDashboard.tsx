import React from 'react';
import { useState, useEffect } from 'react';
import { NavBar, Sidebar } from '../../components/layout';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const metrics = [
  { label: 'Total Counselors', value: 24 },
  { label: 'Total Sessions', value: 128 },
  { label: 'Total Psychiatrists', value: 8 },
  { label: 'Total Revenue', value: '$12,450' },
];

const lineData1 = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 200 },
  { name: 'May', value: 400 },
];

const lineData2 = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 28 },
  { name: 'Thu', value: 60 },
  { name: 'Fri', value: 50 },
];

const pieData1 = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const pieData2 = [
  { name: 'Completed', value: 240 },
  { name: 'Pending', value: 120 },
  { name: 'Cancelled', value: 60 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>
       <NavBar />
      
      <main className="flex-1  overflow-y-auto pt-[4.5rem] bg-white rounded-tl-3xl shadow-md">
      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8 overflow-auto">
        {/* First line: Metric Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-white shadow rounded-lg p-6 flex flex-col justify-between"
            >
              <span className="text-gray-500">{m.label}</span>
              <span className="text-3xl font-semibold mt-2">{m.value}</span>
            </div>
          ))}
        </div>

        {/* Second line: Two Line Charts */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Monthly Users</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData1}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Daily Sessions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData2}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Third line: Two Pie Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">User Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData1}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData1.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Session Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData2}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData2.map((entry, index) => (
                    <Cell key={`cell2-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        </main>
      </main>
    </div>
  );
}
