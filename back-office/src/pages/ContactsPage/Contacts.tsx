import { useState, useEffect, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MessageTable from "../../components/MessageComponents/MessageTable";
import { ConfirmDialog } from "../../components";

const ITEMS_PER_PAGE = 10;

const Contacts = () => {
  useScrollToTop();
  useTitle("Messages de contact");

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);

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

  const handleClearSearch = () => {
    setSearchQuery("");
    loadMessages(1);
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

  const handleViewMessage = useCallback((message: Message) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);
    if (!message.lu) {
      handleMarkAsRead(message.id);
    }
  }, [currentPage, searchQuery]);

  const handleDeleteRequest = useCallback((id: number) => {
    const message = messages.find((m) => m.id === id);
    if (message) {
      setMessageToDelete(message);
      setDeleteDialogOpen(true);
    }
  }, [messages]);

  const handleConfirmDelete = useCallback(async () => {
    if (messageToDelete) {
      try {
        await deleteMessage(messageToDelete.id);
        toast.success("Message supprimé avec succès");
        loadMessages(currentPage, searchQuery || undefined);
        if (selectedMessage?.id === messageToDelete.id) {
          setSelectedMessage(null);
          setViewDialogOpen(false);
        }
        setDeleteDialogOpen(false);
        setMessageToDelete(null);
      } catch (error) {
        toast.error("Erreur lors de la suppression du message");
        console.error(error);
      }
    }
  }, [messageToDelete, currentPage, searchQuery, selectedMessage]);

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

  // Stats
  const unreadCount = messages.filter((m) => !m.lu).length;

  return (
    <div className="space-y-2 p-2 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">{totalItems}</div>
          <div className="text-sm text-gray-500">Total messages</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-green-600">
            {totalItems - unreadCount}
          </div>
          <div className="text-sm text-gray-500">Lus</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-amber-500">{unreadCount}</div>
          <div className="text-sm text-gray-500">Non lus</div>
        </div>
      </div>

      {/* Search + Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            <h2 className="text-lg font-bold text-gray-800 whitespace-nowrap">
              Messages de contact
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({totalItems} message{totalItems !== 1 ? "s" : ""})
              </span>
            </h2>
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <Input
                type="text"
                placeholder="Rechercher par nom, email ou contenu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Rechercher</Button>
              {searchQuery && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearSearch}
                >
                  Effacer
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <MessageTable
          data={messages}
          totalCount={totalItems}
          page={currentPage - 1}
          rowsPerPage={ITEMS_PER_PAGE}
          onPageChange={(page: number) =>
            loadMessages(page + 1, searchQuery || undefined)
          }
          onRowsPerPageChange={() => {}}
          onView={handleViewMessage}
          onDelete={handleDeleteRequest}
          onMarkAsRead={handleMarkAsRead}
          loading={loading}
          emptyMessage={
            searchQuery ? "Aucun résultat trouvé" : "Aucun message trouvé"
          }
        />
      </div>

      {/* View Dialog */}
      {selectedMessage && (
        <ConfirmDialog
          open={viewDialogOpen}
          title="Détails du message"
          message={
            <div className="space-y-4 text-left">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedMessage.prenom} {selectedMessage.nom}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 mt-2">
                    <p>📧 {selectedMessage.email}</p>
                    {selectedMessage.telephone && (
                      <p>📞 {selectedMessage.telephone}</p>
                    )}
                    <p>🕐 {formatDate(selectedMessage.creeLe)}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {getSujetLabel(selectedMessage.sujet)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Message :</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            </div>
          }
          confirmLabel="Fermer"
          cancelLabel=""
          onConfirm={() => {
            setViewDialogOpen(false);
            setSelectedMessage(null);
          }}
          onCancel={() => {
            setViewDialogOpen(false);
            setSelectedMessage(null);
          }}
          severity="info"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer le message"
        message={
          messageToDelete
            ? `Êtes-vous sûr de vouloir supprimer le message de "${messageToDelete.prenom} ${messageToDelete.nom}" ? Cette action est irréversible.`
            : ""
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setMessageToDelete(null);
        }}
        severity="error"
      />
    </div>
  );
};

export default Contacts;