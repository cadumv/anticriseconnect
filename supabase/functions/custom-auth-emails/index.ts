
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ACTIVECAMPAIGN_API_URL = Deno.env.get("ACTIVECAMPAIGN_API_URL");
const ACTIVECAMPAIGN_API_KEY = Deno.env.get("ACTIVECAMPAIGN_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequestBody {
  type: "signup" | "magiclink" | "recovery" | "invite";
  email: string;
  data?: Record<string, any>;
}

async function sendActiveCampaignEmail(
  email: string, 
  subject: string, 
  templateContent: string,
  fromEmail: string = "no-reply@fsw-engenharia.com",
  fromName: string = "FSW Engenharia"
) {
  try {
    // First, find or create contact
    const contactResponse = await fetch(`${ACTIVECAMPAIGN_API_URL}/api/3/contacts`, {
      method: "POST",
      headers: {
        "Api-Token": ACTIVECAMPAIGN_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact: {
          email: email,
          firstName: "",
          lastName: "",
        },
      }),
    });
    
    const contactData = await contactResponse.json();
    let contactId;
    
    if (contactResponse.ok) {
      contactId = contactData.contact?.id;
      console.log("Contact created or updated:", contactId);
    } else {
      // If the contact already exists, let's try to fetch it
      const lookupResponse = await fetch(
        `${ACTIVECAMPAIGN_API_URL}/api/3/contacts?email=${encodeURIComponent(email)}`,
        {
          headers: {
            "Api-Token": ACTIVECAMPAIGN_API_KEY!,
          },
        }
      );
      
      const lookupData = await lookupResponse.json();
      if (lookupResponse.ok && lookupData.contacts && lookupData.contacts.length > 0) {
        contactId = lookupData.contacts[0].id;
        console.log("Found existing contact:", contactId);
      } else {
        throw new Error("Failed to create or find contact");
      }
    }

    // Then send a transactional email
    // Note: ActiveCampaign requires setting up transactional email first
    // For simplicity, we're using their direct email API
    const emailResponse = await fetch(`${ACTIVECAMPAIGN_API_URL}/api/3/emails`, {
      method: "POST",
      headers: {
        "Api-Token": ACTIVECAMPAIGN_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: {
          subject: subject,
          to: email,
          from: fromEmail,
          fromname: fromName,
          html: templateContent,
          reply_to: fromEmail,
        },
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("ActiveCampaign email sending failed:", errorData);
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
    }

    return await emailResponse.json();
  } catch (error) {
    console.error("Error sending ActiveCampaign email:", error);
    throw error;
  }
}

function generateSignupEmailTemplate(email: string, signupUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6e6e6; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #333;">Bem-vindo à FSW Engenharia</h1>
      </div>
      <div style="margin-bottom: 30px;">
        <p>Olá,</p>
        <p>Obrigado por se cadastrar na FSW Engenharia. Para confirmar sua conta, clique no botão abaixo:</p>
      </div>
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${signupUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Confirmar minha conta</a>
      </div>
      <div style="color: #666; font-size: 14px;">
        <p>Se você não solicitou esta conta, pode ignorar este e-mail com segurança.</p>
        <p>Atenciosamente,<br>Equipe FSW Engenharia</p>
      </div>
    </div>
  `;
}

function generateResetPasswordEmailTemplate(email: string, resetUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6e6e6; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #333;">Redefinir sua senha</h1>
      </div>
      <div style="margin-bottom: 30px;">
        <p>Olá,</p>
        <p>Recebemos uma solicitação para redefinir sua senha. Se você fez esta solicitação, clique no botão abaixo para escolher uma nova senha:</p>
      </div>
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${resetUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Redefinir minha senha</a>
      </div>
      <div style="color: #666; font-size: 14px;">
        <p>Se você não solicitou a redefinição de senha, pode ignorar este e-mail com segurança.</p>
        <p>Atenciosamente,<br>Equipe FSW Engenharia</p>
      </div>
    </div>
  `;
}

function generateMagicLinkEmailTemplate(email: string, magicLinkUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6e6e6; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #333;">Seu link de acesso</h1>
      </div>
      <div style="margin-bottom: 30px;">
        <p>Olá,</p>
        <p>Clique no botão abaixo para acessar sua conta FSW Engenharia:</p>
      </div>
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${magicLinkUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Acessar minha conta</a>
      </div>
      <div style="color: #666; font-size: 14px;">
        <p>Se você não solicitou este link, pode ignorar este e-mail com segurança.</p>
        <p>Atenciosamente,<br>Equipe FSW Engenharia</p>
      </div>
    </div>
  `;
}

function generateInviteEmailTemplate(email: string, inviteUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6e6e6; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #333;">Convite FSW Engenharia</h1>
      </div>
      <div style="margin-bottom: 30px;">
        <p>Olá,</p>
        <p>Você foi convidado(a) para se juntar à FSW Engenharia. Clique no botão abaixo para aceitar o convite:</p>
      </div>
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${inviteUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Aceitar convite</a>
      </div>
      <div style="color: #666; font-size: 14px;">
        <p>Se você não esperava este convite, pode ignorar este e-mail com segurança.</p>
        <p>Atenciosamente,<br>Equipe FSW Engenharia</p>
      </div>
    </div>
  `;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ACTIVECAMPAIGN_API_URL || !ACTIVECAMPAIGN_API_KEY) {
      throw new Error("Missing ActiveCampaign configuration");
    }

    const { type, email, data } = await req.json() as EmailRequestBody;
    
    if (!email) {
      throw new Error("Email is required");
    }

    let result;
    
    switch (type) {
      case "signup":
        if (!data?.confirmationURL) {
          throw new Error("Confirmation URL is required for signup emails");
        }
        result = await sendActiveCampaignEmail(
          email,
          "Confirme seu cadastro na FSW Engenharia",
          generateSignupEmailTemplate(email, data.confirmationURL)
        );
        break;
        
      case "recovery":
        if (!data?.recoveryURL) {
          throw new Error("Recovery URL is required for password reset emails");
        }
        result = await sendActiveCampaignEmail(
          email,
          "Redefinição de senha FSW Engenharia",
          generateResetPasswordEmailTemplate(email, data.recoveryURL)
        );
        break;
        
      case "magiclink":
        if (!data?.magicLinkURL) {
          throw new Error("Magic link URL is required");
        }
        result = await sendActiveCampaignEmail(
          email,
          "Seu link de acesso FSW Engenharia",
          generateMagicLinkEmailTemplate(email, data.magicLinkURL)
        );
        break;
        
      case "invite":
        if (!data?.inviteURL) {
          throw new Error("Invite URL is required");
        }
        result = await sendActiveCampaignEmail(
          email,
          "Convite para FSW Engenharia",
          generateInviteEmailTemplate(email, data.inviteURL)
        );
        break;
        
      default:
        throw new Error(`Unsupported email type: ${type}`);
    }

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
    
  } catch (error) {
    console.error("Error in custom-auth-emails function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
