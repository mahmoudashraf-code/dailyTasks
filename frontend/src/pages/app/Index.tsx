import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="bg-gray-100 p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-semibold">Daily Tasks</span>
        </div>
        <Button variant="outline" size="icon" className="hover:text-red-600" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      <Menubar>
      <MenubarMenu>
          <MenubarTrigger onClick={() => navigate('')}>Home</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger onClick={() => navigate('tasks')}>Tasks</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger onClick={() => navigate('profile')}>Profile</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
      <Outlet />
    </div>
  );
}
