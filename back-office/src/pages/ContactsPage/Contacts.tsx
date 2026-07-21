import { useState, useEffect } from "react";
import { useScrollToTop } from "../../hooks/";
import { useTitle } from "../../hooks/useTitle";
import {
    getAllMessages,
    searchMessages,
    updateMessage,
    deleteMessage,
    type Message,
    type PaginationResponse,
} from "../../services/messages.service";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const Contacts = () => {
    useScrollToTop();
    useTitle("Messages de contact");

    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    const loadMessages = async (page: number, query?: string) => {
        try {
            setLoading(true);
            let response: PaginationResponse<Message>;

            if (query && query.trim()) {
                response = await searchMessages(query, {
                    page,
                    limit: ITEMS_PER_PAGE,
                    sortBy: "creeLe",
                    sortOrder: "DESC",
                });
            } else {
                response = await getAllMessages({
                    page,
                    limit: ITEMS_PER_PAGE,
                    sortBy: "creeLe",
                    sortOrder: "DESC",
                });
            }

            setMessages(response.data);
            setTotalPages(Math.ceil(response.total / response.limit));
            setTotalItems(response.total);
            setCurrentPage(response.page);
        } catch (error) {
            toast.error("Erreur lors du chargement des messages");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages(1);
    }, []);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loadMessages(1, searchQuery);
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await updateMessage(id, true);
            toast.success("Message marqué comme lu");
            loadMessages(currentPage, searchQuery || undefined);
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du message");
            console.error(error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
            return;
        }

        try {
            await deleteMessage(id);
            toast.success("Message supprimé avec succès");
            loadMessages(currentPage, searchQuery || undefined);
            if (selectedMessage?.id === id) {
                setSelectedMessage(null);
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression du message");
            console.error(error);
        }
    };

    const handleViewMessage = async (message: Message) => {
        setSelectedMessage(message);
        if (!message.lu) {
            await handleMarkAsRead(message.id);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const getSujetLabel = (sujet: string) => {
        const labels: Record<string, string> = {
            information: "Demande d'information",
            admission: "Admission",
            partenariat: "Partenariat",
            autre: "Autre",
        };
        return labels[sujet] || sujet;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Messages de contact
                </h1>
                <p className="text-gray-600">
                    {totalItems} message{totalItems > 1 ? "s" : ""} reçu
                    {totalItems > 1 ? "s" : ""}
                </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Rechercher par nom, email ou contenu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Rechercher
                </button>
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearchQuery("");
                            loadMessages(1);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Effacer
                    </button>
                )}
            </form>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Messages List */}
                <div className="lg:col-span-1 space-y-3">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">
                            Chargement...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Aucun message trouvé
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => handleViewMessage(msg)}
                                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                    selectedMessage?.id === msg.id
                                        ? "border-indigo-500 bg-indigo-50"
                                        : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                                } ${!msg.lu ? "border-l-4 border-l-indigo-500" : ""}`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">
                                            {msg.prenom} {msg.nom}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {msg.email}
                                        </p>
                                    </div>
                                    {!msg.lu && (
                                        <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded">
                                            Nouveau
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                    {getSujetLabel(msg.sujet)}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {msg.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    {formatDate(msg.creeLe)}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-2">
                    {selectedMessage ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {selectedMessage.prenom} {selectedMessage.nom}
                                    </h2>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p>📧 {selectedMessage.email}</p>
                                        {selectedMessage.telephone && (
                                            <p>📞 {selectedMessage.telephone}</p>
                                        )}
                                        <p>🕐 {formatDate(selectedMessage.creeLe)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleMarkAsRead(selectedMessage.id)
                                        }
                                        className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Marquer comme lu
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(selectedMessage.id)
                                        }
                                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-4">
                                <span className="inline-block px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-700 rounded">
                                    {getSujetLabel(selectedMessage.sujet)}
                                </span>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    Message :
                                </h3>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {selectedMessage.message}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <svg
                                    className="mx-auto h-12 w-12"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <p className="text-gray-500">
                                Sélectionnez un message pour voir les détails
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-sm text-gray-600">
                        Page {currentPage} sur {totalPages} ({totalItems}{" "}
                        message{totalItems > 1 ? "s" : ""})
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() =>
                                loadMessages(currentPage - 1, searchQuery || undefined)
                            }
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Précédent
                        </button>
                        <button
                            onClick={() =>
                                loadMessages(currentPage + 1, searchQuery || undefined)
                            }
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contacts;