
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Bell, AtSign, Handshake, MessageSquare, User, Trash2 } from "lucide-react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "mention" | "partnership";
  message: string;
  read: boolean;
  date: string;
  link: string;
}

const Notifications = () => {
  const { user, loading } = useAuth();
  
  // Estado local para gerenciar notificações
  const [notifications, setNotifications] = useState<Notification[]>([
    // Deixaremos o array vazio para mostrar a interface quando não há notificações
  ]);
  
  // Filtra notificações por tipo
  const mentions = notifications.filter(n => n.type === "mention");
  const partnerships = notifications.filter(n => n.type === "partnership");
  
  // Conta notificações não lidas
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Função para marcar notificação como lida
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    toast({
      description: "Notificação marcada como lida",
    });
  };
  
  // Função para apagar uma notificação
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast({
      description: "Notificação removida com sucesso",
    });
  };
  
  // Função para apagar todas as notificações de um tipo
  const deleteAllNotifications = (type: "mention" | "partnership") => {
    setNotifications(prev => prev.filter(notification => notification.type !== type));
    toast({
      description: `Todas as notificações de ${type === "mention" ? "menções" : "parcerias"} foram removidas`,
    });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center">
        <div className="animate-pulse text-lg">Carregando...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "mention":
        return <AtSign className="h-5 w-5 text-blue-500" />;
      case "partnership":
        return <Handshake className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" /> Notificações
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Menções */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AtSign className="h-5 w-5" /> Menções
            </CardTitle>
            {mentions.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => deleteAllNotifications("mention")}
                className="h-8 text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Limpar todas
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {mentions.length > 0 ? (
              <div className="space-y-4">
                {mentions.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-md border ${notification.read ? 'bg-white' : 'bg-blue-50 border-blue-100'}`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                        <div className="flex gap-2 mt-2">
                          {!notification.read && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs" 
                              onClick={() => markAsRead(notification.id)}
                            >
                              Marcar como lida
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-100" 
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Remover
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AtSign className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Nenhuma menção recente</p>
                <p className="text-sm text-gray-400 mt-1">
                  Quando alguém mencionar você, as notificações aparecerão aqui.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Solicitações de Parceria */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Handshake className="h-5 w-5" /> Solicitações de Parceria
            </CardTitle>
            {partnerships.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => deleteAllNotifications("partnership")}
                className="h-8 text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Limpar todas
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {partnerships.length > 0 ? (
              <div className="space-y-4">
                {partnerships.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-md border ${notification.read ? 'bg-white' : 'bg-blue-50 border-blue-100'}`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                        <div className="flex gap-2 mt-2">
                          {!notification.read && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs" 
                              onClick={() => markAsRead(notification.id)}
                            >
                              Marcar como lida
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-100" 
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Remover
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Handshake className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Nenhuma solicitação de parceria</p>
                <p className="text-sm text-gray-400 mt-1">
                  Quando alguém solicitar uma parceria, as notificações aparecerão aqui.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
