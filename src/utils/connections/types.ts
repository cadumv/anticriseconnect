
/**
 * Common types for connection-related functionality
 */
export interface ConnectionUser {
  id: string;
  name: string;
  avatar_url: string | null;
  engineering_type: string | null;
}

export type ConnectionType = "connections" | "followers" | "following";
export type ConnectionStatus = 'pending' | 'accepted' | 'declined';

export interface ConnectionRequest {
  targetId: string;
  message: string;
  timestamp: string;
  status: ConnectionStatus;
  senderName: string;
}
