
import React from "react";
import { Trash2, Check, X, ExternalLink, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NotificationType } from "./types";
import { useAuth } from "@/hooks/useAuth";

interface NotificationItemProps {
  notification: NotificationType;
  icon: React.ReactNode;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAccept?: (id: string, senderId?: string) => void;
  onDecline?: (id: string, senderId?: string) => void;
  onCancel?: (id: string, targetId?: string) => void;
}

export const NotificationItem = ({
  notification,
  icon,
  onMarkAsRead,
  onDelete,
  onAccept,
  onDecline,
  onCancel
}: NotificationItemProps) => {
  const { user } = useAuth();
  // Check if this notification is for a partnership request sent by this user
  const isUsersSentRequest = notification.type === "partnership" && 
                             notification.senderId === user?.id;

  return (
    <div 
      className={`p-3 rounded-md border ${notification.read ? 'bg-white' : 'bg-blue-50 border-blue-100'}`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          {icon}
        </div>
        <div className="flex-1">
          <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {!notification.read && (
              <>
                {notification.type === "partnership" && !isUsersSentRequest && onAccept && onDecline ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-xs text-green-600" 
                      onClick={() => onAccept(notification.id, notification.senderId)}
                    >
                      <Check className="h-3 w-3 mr-1" /> Aceitar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-xs text-red-600" 
                      onClick={() => onDecline(notification.id, notification.senderId)}
                    >
                      <X className="h-3 w-3 mr-1" /> Recusar
                    </Button>
                  </>
                ) : isUsersSentRequest && onCancel ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs text-orange-600" 
                    onClick={() => onCancel(notification.id, notification.link.split('/').pop())}
                  >
                    <X className="h-3 w-3 mr-1" /> Cancelar solicitação
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs" 
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    Marcar como lida
                  </Button>
                )}
              </>
            )}
            
            {notification.type === "mention" ? (
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
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                asChild
              >
                <Link to={notification.link}>
                  <User className="h-3 w-3 mr-1" /> Visitar perfil
                </Link>
              </Button>
            )}

            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-100" 
              onClick={() => onDelete(notification.id)}
            >
              <Trash2 className="h-3 w-3 mr-1" /> Remover
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
