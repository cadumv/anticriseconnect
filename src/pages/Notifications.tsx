
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { 
  Bell, 
  AtSign, 
  Handshake, 
  User, 
  Trash2, 
  Calendar, 
  CalendarClock, 
  CalendarDays, 
  Check, 
  X, 
  ExternalLink
} from "lucide-react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Notification {
  id: string;
  type: "mention" | "partnership";
  message: string;
  read: boolean;
  date: string;
  link: string;
  // For partnership notifications
  senderId?: string;
}

type TimeFilter = "all" | "day" | "week" | "month";

const Notifications = () => {
  const { user, loading } = useAuth();
  
  // Estado local para gerenciar notificações
  const [notifications, setNotifications] = useState<Notification[]>([
    // Deixaremos o array vazio para mostrar a interface quando não há notificações
  ]);

  // Estado para filtro de tempo
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  
  // Filtra notificações por tempo e tipo
  const filterNotificationsByTime = (notifications: Notification[]) => {
    if (timeFilter === "all") return notifications;
    
    const now = new Date();
    const filterDate = new Date();
    
    switch (timeFilter) {
      case "day":
        filterDate.setDate(now.getDate() - 1);
        break;
      case "week":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "month":
        filterDate.setMonth(now.getMonth() - 1);
        break;
    }
    
    return notifications.filter(n => new Date(n.date) >= filterDate);
  };
  
  // Filtra notificações por tipo e tempo
  const mentions = filterNotificationsByTime(notifications.filter(n => n.type === "mention"));
  const partnerships = filterNotificationsByTime(notifications.filter(n => n.type === "partnership"));
  
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

  // Função para aceitar uma solicitação de parceria
  const acceptPartnership = (id: string, senderId?: string) => {
    // Lógica para aceitar parceria será implementada aqui
    // Por enquanto, apenas marca como lida e mostra toast
    markAsRead(id);
    toast({
      description: "Solicitação de parceria aceita com sucesso!",
    });
  };

  // Função para recusar uma solicitação de parceria
  const declinePartnership = (id: string) => {
    // Lógica para recusar parceria será implementada aqui
    // Por enquanto, apenas remove a notificação
    deleteNotification(id);
    toast({
      description: "Solicitação de parceria recusada.",
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

  // Componente que mostra o seletor de filtro de tempo
  const TimeFilterSelector = () => (
    <Select 
      value={timeFilter} 
      onValueChange={(value) => setTimeFilter(value as TimeFilter)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrar por período" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Todos</span>
          </div>
        </SelectItem>
        <SelectItem value="day">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            <span>Último dia</span>
          </div>
        </SelectItem>
        <SelectItem value="week">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Última semana</span>
          </div>
        </SelectItem>
        <SelectItem value="month">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Último mês</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
  
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
        {/* Removed the top-level TimeFilterSelector here */}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Menções */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AtSign className="h-5 w-5" /> Menções
            </CardTitle>
            <div className="flex items-center gap-2">
              <TimeFilterSelector />
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
            </div>
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
                        <div className="flex flex-wrap gap-2 mt-2">
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
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs text-blue-600"
                            asChild
                          >
                            <Link to={notification.link}>
                              <ExternalLink className="h-3 w-3 mr-1" /> Visualizar menção
                            </Link>
                          </Button>
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
            <div className="flex items-center gap-2">
              <TimeFilterSelector />
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
            </div>
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
                        <div className="flex flex-wrap gap-2 mt-2">
                          {!notification.read && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs text-green-600" 
                                onClick={() => acceptPartnership(notification.id, notification.senderId)}
                              >
                                <Check className="h-3 w-3 mr-1" /> Aceitar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs text-red-600" 
                                onClick={() => declinePartnership(notification.id)}
                              >
                                <X className="h-3 w-3 mr-1" /> Recusar
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            asChild
                          >
                            <Link to={notification.senderId ? `/profile/${notification.senderId}` : "#"}>
                              <User className="h-3 w-3 mr-1" /> Visitar perfil
                            </Link>
                          </Button>
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
