import { useScrollToTop } from "../../hooks/";
import { useTitle } from "../../hooks/useTitle";

const Admissions = () => {
    useScrollToTop();
    useTitle("Admissions");

    const admissions = [
        {
            id: 1,
            nom: "Lucas Dubois",
            email: "lucas.dubois@email.com",
            telephone: "+33 6 12 34 56 78",
            formation: "Licence en Informatique",
            statut: "En attente",
            dateCandidature: "15 Mars 2024",
            documents: "Complet"
        },
        {
            id: 2,
            nom: "Emma Petit",
            email: "emma.petit@email.com",
            telephone: "+33 6 12 34 56 79",
            formation: "Master en Gestion des Entreprises",
            statut: "Accepté",
            dateCandidature: "10 Mars 2024",
            documents: "Complet"
        },
        {
            id: 3,
            nom: "Thomas Moreau",
            email: "thomas.moreau@email.com",
            telephone: "+33 6 12 34 56 80",
            formation: "BTS en Comptabilité",
            statut: "En cours d'étude",
            dateCandidature: "5 Mars 2024",
            documents: "En attente"
        },
        {
            id: 4,
            nom: "Chloe Roux",
            email: "chloe.roux@email.com",
            telephone: "+33 6 12 34 56 81",
            formation: "Licence en Marketing Digital",
            statut: "Accepté",
            dateCandidature: "1 Mars 2024",
            documents: "Complet"
        }
    ];

    const getStatusColor = (statut: string) => {
        switch (statut) {
            case "Accepté":
                return "bg-green-50 text-green-600";
            case "En attente":
                return "bg-yellow-50 text-yellow-600";
            case "En cours d'étude":
                return "bg-blue-50 text-blue-600";
            case "Refusé":
                return "bg-red-50 text-red-600";
            default:
                return "bg-gray-50 text-gray-600";
        }
    };

    const getDocumentStatus = (statut: string) => {
        return statut === "Complet" ? "✅" : "⏳";
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admissions</h1>
                <p className="text-gray-600">Gestion des candidatures et admissions</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Candidat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Formation
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Documents
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {admissions.map((admission) => (
                                <tr key={admission.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-indigo-600">
                                                        {admission.nom.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {admission.nom}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {admission.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{admission.formation}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(admission.statut)}`}>
                                            {admission.statut}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <span>{getDocumentStatus(admission.documents)}</span>
                                            <span>{admission.documents}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {admission.dateCandidature}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admissions;