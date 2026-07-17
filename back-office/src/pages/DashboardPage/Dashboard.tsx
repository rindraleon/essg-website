import { useScrollToTop } from "../../hooks/";
import { useTitle } from "../../hooks/useTitle";
import { Typography, Container, Paper, Grid } from "@mui/material";
import { StatCard, RecentActivity, QuickActions, NewsList } from "../../components";
import { useEffect, useState } from "react";
import { getDashboardStats, getRecentActivities } from "../../services/dashboard.service";
import type { Activity, DashboardStats } from "../../types";
import People from "@mui/icons-material/People";
import School from "@mui/icons-material/School";
import Article from "@mui/icons-material/Article";
import RocketLaunch from "@mui/icons-material/RocketLaunch";


const Dashboard = () => {
    useScrollToTop();
    useTitle("Dashboard");

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [statsData, activitiesData] = await Promise.all([
                getDashboardStats(),
                getRecentActivities(),
            ]);
            setStats(statsData);
            setActivities(activitiesData);
        } catch (err) {
            setError("Erreur lors du chargement des données du dashboard");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = stats ? [
        { 
            title: "Utilisateurs", 
            value: stats.totalUsers.toLocaleString(), 
            change: stats.usersChange, 
            icon: <People />, 
            color: "primary" as const 
        },
        { 
            title: "Formations", 
            value: stats.totalFormations.toLocaleString(), 
            change: stats.formationsChange, 
            icon: <School />, 
            color: "secondary" as const 
        },
        { 
            title: "Actualités", 
            value: stats.totalNews.toLocaleString(), 
            change: stats.newsChange, 
            icon: <Article />, 
            color: "success" as const 
        },
        { 
            title: "Projets", 
            value: stats.totalProjects.toLocaleString(), 
            change: stats.projectsChange, 
            icon: <RocketLaunch />, 
            color: "info" as const 
        },
    ] : [];

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            
            {/* <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={loadDashboardData}
                    disabled={loading}
                >
                    Actualiser
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )} */}

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {loading && !stats ? (
                    ['users', 'formations', 'news', 'projects'].map((id) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`skeleton-${id}`}>
                            <StatCard title="" value="" loading={true} />
                        </Grid>
                    ))
                ) : (
                    statCards.map((stat) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
                            <StatCard {...stat} />
                        </Grid>
                    ))
                )}
            </Grid>

            {/* Quick Actions and Recent Activity */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <QuickActions />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <RecentActivity activities={activities} loading={loading} />
                </Grid>
            </Grid>

            {/* News Section */}
            <Paper elevation={0} sx={{ p: 3, bgcolor: "background.default" }}>
                <Typography variant="h4" component="h2" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
                    Actualités
                </Typography>
                <NewsList />
            </Paper>
        </Container>
    );
};

export default Dashboard;