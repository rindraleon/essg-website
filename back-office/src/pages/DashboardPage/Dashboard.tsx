import { useScrollToTop } from '../../hooks/';
import { useTitle } from '../../hooks/useTitle';
import { StatCard, RecentActivity } from '../../components';
import { useEffect, useState } from 'react';
import { getDashboardStats, getRecentActivities } from '../../services';
import type { Activity, DashboardStats } from '../../types';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const Dashboard = () => {
  useScrollToTop();
  useTitle('Tableau de bord');

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

  const formatCount = (value: number | string | undefined) => {
    const numericValue = Number(value ?? 0);
    return Number.isFinite(numericValue) ? numericValue.toLocaleString() : '0';
  };

  const statCards = stats
    ? [
        {
          title: 'Utilisateurs',
          value: formatCount(stats.totalUsers),
          change: stats.usersChange,
          icon: <PeopleIcon />,
          color: 'primary' as const,
        },
        {
          title: 'Formations',
          value: formatCount(stats.totalFormations),
          change: stats.formationsChange,
          icon: <SchoolIcon />,
          color: 'secondary' as const,
        },
        {
          title: 'Actualités',
          value: formatCount(stats.totalNews),
          change: stats.newsChange,
          icon: <ArticleIcon />,
          color: 'success' as const,
        },
        {
          title: 'Projets',
          value: formatCount(stats.totalProjects),
          change: stats.projectsChange,
          icon: <RocketLaunchIcon />,
          color: 'info' as const,
        },
        {
          title: 'Partenariats',
          value: formatCount(stats.totalPartnerships ?? stats.totalPartners),
          change: stats.partnershipsChange,
          icon: <RocketLaunchIcon />,
          color: 'warning' as const,
        },
        {
          title: 'Ressources',
          value: formatCount(stats.totalResources),
          change: stats.resourcesChange,
          icon: <RocketLaunchIcon />,
          color: 'secondary' as const,
        },
        {
          title: 'Admissions',
          value: formatCount(stats.totalAdmissions),
          change: stats.admissionsChange,
          icon: <RocketLaunchIcon />,
          color: 'error' as const,
        },
        {
          title: 'Contacts',
          value: formatCount(stats.totalContacts),
          change: stats.contactsChange,
          icon: <RocketLaunchIcon />,
          color: 'info' as const,
        }

      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto py-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading && !stats
          ? ['users', 'formations', 'news', 'projects', 'partnerships', 'resources', 'admissions', 'contacts'].map((id) => (
              <StatCard key={`skeleton-${id}`} title="" value="" loading={true} />
            ))
          : statCards.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols gap-6 mb-6">
        
        <RecentActivity activities={activities} loading={loading} />
      </div>

    </div>
  );
};

export default Dashboard;
