import { useScrollToTop } from "../../hooks/";
import { useTitle } from "../../hooks/useTitle";

const Contacts = () => {
    useScrollToTop();
    useTitle("Contacts");

    const contacts = [
        {
            id: 1,
            nom: "Jean Dupont",
            email: "jean.dupont@essg.com",
            telephone: "+33 1 23 45 67 89",
            fonction: "Directeur des admissions",
            departement: "Admissions",
            disponibilite: "Lun-Ven, 9h-17h"
        },
        {
            id: 2,
            nom: "Marie Martin",
            email: "marie.martin@essg.com",
            telephone: "+33 1 23 45 67 90",
            fonction: "Responsable pédagogique",
            departement: "Formations",
            disponibilite: "Lun-Ven, 8h30-16h30"
        },
        {
            id: 3,
            nom: "Pierre Bernard",
            email: "pierre.bernard@essg.com",
            telephone: "+33 1 23 45 67 91",
            fonction: "Chef de projet",
            departement: "Projets",
            disponibilite: "Lun-Ven, 9h-18h"
        },
        {
            id: 4,
            nom: "Sophie Leroy",
            email: "sophie.leroy@essg.com",
            telephone: "+33 1 23 45 67 92",
            fonction: "Responsable communication",
            departement: "Communication",
            disponibilite: "Lun-Ven, 9h-17h"
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
                <p className="text-gray-600">Annuaire des contacts de l'ESSG</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contacts.map((contact) => (
                    <div
                        key={contact.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-lg font-semibold text-indigo-600">
                                        {contact.nom.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {contact.nom}
                                </h3>
                                <p className="text-sm text-indigo-600 font-medium mb-3">
                                    {contact.fonction}
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span>📧</span>
                                        <a href={`mailto:${contact.email}`} className="hover:text-indigo-600 transition-colors">
                                            {contact.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span>📞</span>
                                        <a href={`tel:${contact.telephone}`} className="hover:text-indigo-600 transition-colors">
                                            {contact.telephone}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span>🏢</span>
                                        <span>{contact.departement}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span>🕐</span>
                                        <span>{contact.disponibilite}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Contacts;