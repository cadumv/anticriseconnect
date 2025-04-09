
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

interface UseConnectionStatusReturn {
  isConnectionAccepted: boolean;
  isConnectionPending: boolean;
}

export const useConnectionStatus = (profileId: string | undefined, user: User | null): UseConnectionStatusReturn => {
  const [isConnectionAccepted, setIsConnectionAccepted] = useState(false);
  const [isConnectionPending, setIsConnectionPending] = useState(false);

  useEffect(() => {
    const checkConnectionStatus = () => {
      if (user && profileId && profileId !== ":id") {
        // Check for connections made by this profile to current user
        const connectionKey = `connection_requests_${profileId}`;
        const existingRequests = localStorage.getItem(connectionKey);
        
        if (existingRequests) {
          const requests = JSON.parse(existingRequests);
          const acceptedRequest = requests.find((req: any) => 
            req.targetId === user.id && req.status === 'accepted'
          );
          
          const pendingRequest = requests.find((req: any) =>
            req.targetId === user.id && req.status === 'pending'
          );
          
          // Check for connections made by current user to this profile
          const userConnectionKey = `connection_requests_${user.id}`;
          const userRequests = localStorage.getItem(userConnectionKey);
          let userAcceptedRequest = false;
          let userPendingRequest = false;
          
          if (userRequests) {
            const parsedUserRequests = JSON.parse(userRequests);
            userAcceptedRequest = parsedUserRequests.some((req: any) => 
              req.targetId === profileId && req.status === 'accepted'
            );
            
            userPendingRequest = parsedUserRequests.some((req: any) =>
              req.targetId === profileId && req.status === 'pending'
            );
          }
          
          setIsConnectionAccepted(!!acceptedRequest || userAcceptedRequest);
          setIsConnectionPending(!!pendingRequest || userPendingRequest);
        } else {
          // Check for connections made by current user to this profile
          const userConnectionKey = `connection_requests_${user.id}`;
          const userRequests = localStorage.getItem(userConnectionKey);
          
          if (userRequests) {
            const parsedUserRequests = JSON.parse(userRequests);
            const userAcceptedRequest = parsedUserRequests.some((req: any) => 
              req.targetId === profileId && req.status === 'accepted'
            );
            
            const userPendingRequest = parsedUserRequests.some((req: any) =>
              req.targetId === profileId && req.status === 'pending'
            );
            
            setIsConnectionAccepted(userAcceptedRequest);
            setIsConnectionPending(userPendingRequest);
          }
        }
        
        // Special handling for demo profile
        if (profileId === "demo") {
          setIsConnectionAccepted(true);
          setIsConnectionPending(false);
        }
      }
    };

    checkConnectionStatus();
  }, [profileId, user]);

  return { isConnectionAccepted, isConnectionPending };
};
