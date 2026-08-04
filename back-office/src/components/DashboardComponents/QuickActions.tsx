import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routesStatic } from '../../routes';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    { label: 'Nouvelle Formation', icon: <AddIcon />, path: routesStatic.formations },
    { label: 'Actualiser', icon: <RefreshIcon />, onClick: () => window.location.reload() },
    { label: 'Projets', icon: <SettingsIcon />, path: routesStatic.projets },
    { label: 'Actualités', icon: <HelpIcon />, path: routesStatic.actualites },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => (action.onClick ? action.onClick() : navigate(action.path))}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-indigo-300 transition-colors text-left"
          >
            <span className="text-indigo-600 text-xl">{action.icon}</span>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
