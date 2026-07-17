    import { Route, Routes } from "react-router-dom";
    import { Home, FormationsPage, FormationDetailPage, PartenairesPage, ProjetsPage, ProjetDetailPage, ActualitesPage, ActualiteDetailPage, FaqPage, AdmissionPage, ContactPage } from "../pages";
    import { routesStatic } from ".";

    const AppRoutes = () => {
        return (
            <Routes>
                <Route path={routesStatic.home} element={<Home />} />
                <Route path={routesStatic.formations} element={<FormationsPage />} />
                <Route path={routesStatic.formationDetail} element={<FormationDetailPage />} />
                <Route path={routesStatic.actualites} element={<ActualitesPage />} />
                <Route path={routesStatic.actualiteDetail} element={<ActualiteDetailPage />} />
                <Route path={routesStatic.partenaires} element={<PartenairesPage />} />
                <Route path={routesStatic.projets} element={<ProjetsPage />} />
                <Route path={routesStatic.projetDetail} element={<ProjetDetailPage />} />
                <Route path={routesStatic.faq} element={<FaqPage />} />
                <Route path={routesStatic.admission} element={<AdmissionPage />} />
                <Route path={routesStatic.contact} element={<ContactPage />} />
            </Routes>
        )
    }

    export default AppRoutes;