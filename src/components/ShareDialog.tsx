
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Search, Share2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (userIds: string[]) => void;
  postId: string;
}

export function ShareDialog({ isOpen, onClose, onShare, postId }: ShareDialogProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<Array<{id: string, name: string, avatar_url?: string}>>([]);
  const [filteredUsers, setFilteredUsers] = useState<Array<{id: string, name: string, avatar_url?: string}>>([]);
  
  // Fetch connected users
  useEffect(() => {
    if (!user) return;
    
    // In a real app, we would fetch this from the database
    // For now, we'll use localStorage to simulate connections/following
    const followingKey = `following_${user.id}`;
    const followingData = localStorage.getItem(followingKey);
    
    if (followingData) {
      const parsedData = JSON.parse(followingData);
      setUsers(parsedData);
      setFilteredUsers(parsedData);
    } else {
      // Mock data if no connections
      const mockUsers = [
        { id: 'user1', name: 'João Silva', avatar_url: 'https://github.com/shadcn.png' },
        { id: 'user2', name: 'Maria Oliveira', avatar_url: 'https://github.com/shadcn.png' },
        { id: 'user3', name: 'Pedro Santos', avatar_url: 'https://github.com/shadcn.png' },
        { id: 'user4', name: 'Ana Costa', avatar_url: 'https://github.com/shadcn.png' },
        { id: 'user5', name: 'Carlos Pereira', avatar_url: 'https://github.com/shadcn.png' },
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      
      // Save mock data to localStorage
      localStorage.setItem(followingKey, JSON.stringify(mockUsers));
    }
  }, [user]);
  
  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);
  
  // Handle user selection
  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    } else {
      setSelectedUsers(prev => [...prev, userId]);
    }
  };
  
  // Submit share action
  const handleShare = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Nenhum usuário selecionado",
        description: "Selecione pelo menos um usuário para compartilhar a publicação.",
        variant: "destructive",
      });
      return;
    }
    
    onShare(selectedUsers);
    onClose();
    
    toast({
      title: "Publicação compartilhada",
      description: `Compartilhado com ${selectedUsers.length} engenheiro${selectedUsers.length !== 1 ? 's' : ''} da sua rede.`,
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar publicação</DialogTitle>
          <DialogDescription>
            Selecione os engenheiros com quem deseja compartilhar esta publicação
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 my-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar engenheiros..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {filteredUsers.length > 0 ? (
            <ul className="space-y-2">
              {filteredUsers.map((user) => (
                <li 
                  key={user.id}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted ${
                    selectedUsers.includes(user.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{user.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  {selectedUsers.includes(user.id) && (
                    <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Nenhum engenheiro encontrado</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex space-x-2 sm:space-x-0">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" onClick={handleShare} disabled={selectedUsers.length === 0} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span>Compartilhar</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
