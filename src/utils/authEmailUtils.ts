
import { supabase } from '@/lib/supabase';

// Helper function to send custom emails
export const sendCustomEmail = async (type: "signup" | "magiclink" | "recovery" | "invite", email: string, url: string) => {
  try {
    let data: Record<string, any> = {};
    
    switch (type) {
      case "signup":
        data = { confirmationURL: url };
        break;
      case "recovery":
        data = { recoveryURL: url };
        break;
      case "magiclink":
        data = { magicLinkURL: url };
        break;
      case "invite":
        data = { inviteURL: url };
        break;
    }
    
    const response = await supabase.functions.invoke("custom-auth-emails", {
      body: { type, email, data },
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error sending custom ${type} email:`, error);
    throw error;
  }
};
