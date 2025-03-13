
/**
 * Utilitário para redimensionar imagens para um tamanho padrão antes do upload
 */

// Tamanho padrão para as imagens do feed (1080x1080 pixels)
export const STANDARD_IMAGE_SIZE = 1080;

/**
 * Redimensiona uma imagem para o tamanho padrão do feed
 * Mantém a proporção e centraliza a imagem se necessário
 */
export const resizeImageToStandard = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error("Não foi possível criar o contexto do canvas"));
      return;
    }
    
    // Configura o canvas para o tamanho padrão
    canvas.width = STANDARD_IMAGE_SIZE;
    canvas.height = STANDARD_IMAGE_SIZE;
    
    // Preenche o canvas com fundo branco (para imagens transparentes)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    img.onload = () => {
      const { width, height } = img;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = width;
      let sourceHeight = height;
      
      // Calcula as dimensões para manter a proporção e centralizar
      if (width > height) {
        // Imagem paisagem: corta os lados
        sourceX = (width - height) / 2;
        sourceWidth = height;
      } else if (height > width) {
        // Imagem retrato: corta acima e abaixo
        sourceY = (height - width) / 2;
        sourceHeight = width;
      }
      
      // Desenha a imagem no canvas, centralizada e recortada para formato quadrado
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, STANDARD_IMAGE_SIZE, STANDARD_IMAGE_SIZE
      );
      
      // Converte canvas para blob
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Falha ao converter imagem"));
          return;
        }
        
        // Cria um novo arquivo com o mesmo nome mas redimensionado
        const resizedFile = new File([blob], file.name, {
          type: file.type,
          lastModified: file.lastModified
        });
        
        resolve(resizedFile);
      }, file.type);
    };
    
    img.onerror = () => {
      reject(new Error("Erro ao carregar imagem"));
    };
    
    // Carrega a imagem do arquivo
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = () => {
      reject(new Error("Erro ao ler o arquivo"));
    };
    reader.readAsDataURL(file);
  });
};
