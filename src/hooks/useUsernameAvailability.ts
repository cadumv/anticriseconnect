
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { isValidUsernameFormat, looksLikeInvalidContent, getInvalidUsernameMessage } from "@/utils/usernameValidation";

interface UseUsernameAvailabilityProps {
  username: string;
  user: User;
}

interface UseUsernameAvailabilityReturn {
  usernameError: string;
  usernameAvailable: boolean;
  checkUsernameAvailability: (username: string) => Promise<void>;
}

export const useUsernameAvailability = ({ username, user }: UseUsernameAvailabilityProps): UseUsernameAvailabilityReturn => {
  const [usernameError, setUsernameError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);

  const checkUsernameAvailability = async (username: string) => {
    if (!username) {
      setUsernameError("");
      setUsernameAvailable(true);
      return;
    }

    if (username === user?.user_metadata?.username) {
      // User is not changing their username
      setUsernameError("");
      setUsernameAvailable(true);
      return;
    }

    // Username format validation
    if (!isValidUsernameFormat(username)) {
      setUsernameError(getInvalidUsernameMessage('format'));
      setUsernameAvailable(false);
      return;
    }

    // Prevent usernames that look like phones, CPFs, etc.
    if (looksLikeInvalidContent(username)) {
      setUsernameError(getInvalidUsernameMessage('content'));
      setUsernameAvailable(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUsernameError("Este nome de usuário já está em uso.");
        setUsernameAvailable(false);
      } else {
        setUsernameError("");
        setUsernameAvailable(true);
      }
    } catch (error: any) {
      console.error("Erro ao verificar disponibilidade do nome de usuário:", error);
      setUsernameError("Erro ao verificar disponibilidade.");
      setUsernameAvailable(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username) {
        checkUsernameAvailability(username);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  return {
    usernameError,
    usernameAvailable,
    checkUsernameAvailability
  };
};
