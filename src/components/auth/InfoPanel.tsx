
import { Link } from "react-router-dom";

interface InfoPanelProps {
  isRecovery: boolean;
}

export const InfoPanel = ({ isRecovery }: InfoPanelProps) => {
  return (
    <div className="bg-white md:w-1/2 p-8 flex flex-col justify-between relative">
      <div className="absolute top-0 left-0 w-16 h-16 bg-blue-600 transform rotate-0">
        <div className="w-full h-full transform rotate-45 origin-bottom-left"></div>
      </div>
      
      <div className="mt-16">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Anticrise Connect</h1>
        
        {!isRecovery && (
          <div className="text-gray-700 mt-8 text-sm space-y-4">
            <p className="font-bold">Chegou o Anticrise Connect!</p>
            
            <p>A rede social exclusiva para engenheiros(as) que querem se conectar, criar oportunidades e fechar parcerias com profissionais de todo o Brasil!</p>

            <div className="space-y-1.5">
              <p>🔹 Networking estratégico</p>
              <p>🔹 Novas oportunidades de negócios</p>
              <p>🔹 Conexão com engenheiros de todas as áreas</p>
            </div>

            <p>Junte-se agora e faça parte dessa revolução na engenharia!</p>
          </div>
        )}
        
        {isRecovery && (
          <div className="text-gray-700 mt-8 text-sm">
            <p className="font-bold">Recupere seu acesso ao Anticrise Connect!</p>
            <p className="mt-2">
              Digite seu email e clique em "Enviar Link" para receber as instruções de definição de senha diretamente no seu email de cadastro.
            </p>
            <p className="mt-2">
              Simples, rápido e seguro!
            </p>
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 mt-auto">
        <p>Copyright 2025 Anticrise. Todos os direitos reservados.</p>
        <div className="flex gap-2 mt-1">
          <Link to="#" className="text-xs text-blue-600 hover:underline">Termos de Utilização</Link>
          <span>|</span>
          <Link to="#" className="text-xs text-blue-600 hover:underline">Política de Privacidade</Link>
        </div>
      </div>
    </div>
  );
};
