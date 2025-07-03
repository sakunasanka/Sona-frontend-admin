import React from 'react' 
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {Sidebar, NavBar} from '../../components/layout';

import { useState } from 'react';
import { ColumnChart } from '../../components/charts';

const Blogs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return ( 
    <div className="flex ">
      <div className="flex  h-screen">
        <div className="w-80 h-full bg-white border-r hidden lg:block">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>
        </div>
      </div>
        
      <div className="flex-1 overflow-auto lg:ml-0">
        <NavBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex gap-20 pl-20 pt-10">
          <Card className="bg-slate-400 shadow-sm rounded-lg p-6 max-h-28 w-60">
            <h2 className="text-lg font-semibold mb-4">Total Sales</h2>
            <p className="text-stone-950">$ 21,025</p>
            <img /> 
          </Card>

          <Card className="bg-slate-400 shadow-sm rounded-lg p-6 max-h-28 w-60">
            <h2 className="text-lg font-semibold mb-4">Total Sessions</h2>
            <p className="text-stone-950">2,025</p>
            <img /> 
          </Card>

          <Card className="bg-slate-400 shadow-sm rounded-lg p-6 max-h-28 w-60">
            <h2 className="text-lg font-semibold mb-4">Total Counselors</h2>
            <p className="text-stone-950">2,025</p>
            <img /> 
          </Card>

          <Card className="bg-slate-400 shadow-sm rounded-lg p-6 max-h-28 w-60">
            <h2 className="text-lg font-semibold mb-4">Total Psychiatrics</h2>
            <p className="text-stone-950">250</p>
            <img /> 
          </Card>
        </div>

        <div className="flex gap-20 pl-20 pt-10">
           <Card className="bg-slate-400 shadow-sm rounded-lg p-6 max-h-28 w-60">
            <ColumnChart />
          </Card>

          <Card className="bg-slate-400 shadow-sm rounded-lg p-6 max-h-28 w-60">
            <h2 className="text-lg font-semibold mb-4">Total Sessions</h2>
            <p className="text-stone-950">2,025</p>
            <img /> 
          </Card>

           
        </div>

        <div className="flex gap-20 pl-20 pt-10">
          <Card className="bg-slate-400 shadow-sm rounded-lg p-6 max-h-28 w-60">
            <h2 className="text-lg font-semibold mb-4">Total Sales</h2>
            <ColumnChart />
          </Card>

          <Card className="bg-slate-400 shadow-sm rounded-lg p-6 max-h-28 w-60">
            <h2 className="text-lg font-semibold mb-4">Total Sessions</h2>
            <p className="text-stone-950">2,025</p>
            <img /> 
          </Card>

          
        </div>
      </div>
  </div>
      
     
  )
}

export default Blogs