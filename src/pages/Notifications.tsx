
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Bell, AtSign, Handshake, MessageSquare, User } from "lucide-react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Notifications = () => {
  const { user, loading } = useAuth();
  
  // Mock notification data - in a real app, would fetch from API
  const notifications = [
    {
      id: "1",
      type: "mention",
      message: "Você foi mencionado em um post por @maria.silva",
      read: false,
      date: "2 horas atrás",
      link: "#"
    },
    {
      id: "2",
      type: "partnership",
      message: "Nova solicitação de parceria de Ricardo Mendes",
      read: false,
      date: "Ontem",
      link: "#"
    },
    {
      id: "3",
      type: "mention",
      message: "Você foi mencionado em um comentário por @carlos.eng",
      read: true,
      date: "3 dias atrás",
      link: "#"
    },
    {
      id: "4",
      type: "partnership",
      message: "Sua solicitação de parceria foi aceita por Ana Santos",
      read: true,
      date: "1 semana atrás",
      link: "#"
    }
  ];
  
  // Filter notifications by type
  const mentions = notifications.filter(n => n.type === "mention");
  const partnerships = notifications.filter(n => n.type === "partnership");
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AtSign className="h-5 w-5" /> Menções
            </CardTitle>
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AtSign className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Nenhuma menção recente</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Solicitações de Parceria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Handshake className="h-5 w-5" /> Solicitações de Parceria
            </CardTitle>
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Handshake className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Nenhuma solicitação de parceria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
