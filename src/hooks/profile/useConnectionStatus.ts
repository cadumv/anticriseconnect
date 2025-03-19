
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

interface UseConnectionStatusReturn {
  isConnectionAccepted: boolean;
}

export const useConnectionStatus = (profileId: string | undefined, user: User | null): UseConnectionStatusReturn => {
  const [isConnectionAccepted, setIsConnectionAccepted] = useState(false);

  useEffect(() => {
    const checkConnectionStatus = () => {
      if (user && profileId && profileId !== ":id") {
        const connectionKey = `connection_requests_${profileId}`;
        const existingRequests = localStorage.getItem(connectionKey);
        
        if (existingRequests) {
          const requests = JSON.parse(existingRequests);
          const acceptedRequest = requests.find((req: any) => 
            req.targetId === user.id && req.status === 'accepted'
          );
          
          const userConnectionKey = `connection_requests_${user.id}`;
          const userRequests = localStorage.getItem(userConnectionKey);
          let userAcceptedRequest = false;
          
          if (userRequests) {
            const parsedUserRequests = JSON.parse(userRequests);
            userAcceptedRequest = parsedUserRequests.some((req: any) => 
              req.targetId === profileId && req.status === 'accepted'
            );
          }
          
          setIsConnectionAccepted(!!acceptedRequest || userAcceptedRequest);
        }
        
        if (profileId === "demo") {
          setIsConnectionAccepted(true);
        }
      }
    };

    checkConnectionStatus();
  }, [profileId, user]);

  return { isConnectionAccepted };
};
