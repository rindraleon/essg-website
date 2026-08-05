import { useScrollToTop } from '../../hooks/';
import { useTitle } from '../../hooks/useTitle';
import { StatCard, RecentActivity, QuickActions, NewsList } from '../../components';
import { useEffect, useState } from 'react';
import { getDashboardStats, getRecentActivities } from '../../services/dashboard.service';
import type { Activity, DashboardStats } from '../../types';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const Dashboard = () => {
  useScrollToTop();
  useTitle('Dashboard');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData] = await Promise.all([
        getDashboardStats(),
        getRecentActivities(),
      ]);
      setStats(statsData);
      setActivities(activitiesData);
    } catch (err) {
      console.error('Erreur lors du chargement des données du dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats
    ? [
        {
          title: 'Utilisateurs',
          value: stats.totalUsers.toLocaleString(),
          change: stats.usersChange,
          icon: <PeopleIcon />,
          color: 'primary' as const,
        },
        {
          title: 'Formations',
          value: stats.totalFormations.toLocaleString(),
          change: stats.formationsChange,
          icon: <SchoolIcon />,
          color: 'secondary' as const,
        },
        {
          title: 'Actualités',
          value: stats.totalNews.toLocaleString(),
          change: stats.newsChange,
          icon: <ArticleIcon />,
          color: 'success' as const,
        },
        {
          title: 'Projets',
          value: stats.totalProjects.toLocaleString(),
          change: stats.projectsChange,
          icon: <RocketLaunchIcon />,
          color: 'info' as const,
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto py-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading && !stats
          ? ['users', 'formations', 'news', 'projects'].map((id) => (
              <StatCard key={`skeleton-${id}`} title="" value="" loading={true} />
            ))
          : statCards.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        <RecentActivity activities={activities} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
