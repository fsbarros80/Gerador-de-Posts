import { SavedPost } from '../types';

/**
 * Escapa um campo de string para uso em um arquivo CSV.
 * Envolve o campo em aspas duplas e escapa quaisquer aspas duplas existentes dentro dele.
 * @param field A string a ser escapada.
 * @returns A string escapada segura para CSV.
 */
// FIX: Updated the function signature to accept `string | number` to handle numeric `id` property from SavedPost.
const escapeCsvField = (field: string | number): string => {
  if (field === null || field === undefined) {
    return '';
  }
  const str = String(field);
  // Se o campo contém vírgulas, aspas duplas ou quebras de linha, ele deve ser envolvido em aspas.
  // Quaisquer aspas duplas existentes dentro do campo devem ser escapadas com outra aspa dupla.
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Converte um array de objetos SavedPost em uma string CSV.
 * @param data O array de posts a ser convertido.
 * @returns Uma string formatada em CSV.
 */
const convertToCSV = (data: SavedPost[]): string => {
  if (data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]) as (keyof SavedPost)[];
  const headerRow = headers.join(',');

  const bodyRows = data.map(row => {
    return headers.map(header => escapeCsvField(row[header])).join(',');
  });

  return [headerRow, ...bodyRows].join('\n');
};


/**
 * Aciona o download de um arquivo no navegador.
 * @param content O conteúdo do arquivo.
 * @param fileName O nome do arquivo a ser salvo.
 * @param mimeType O tipo MIME do arquivo.
 */
const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.setAttribute('download', fileName);
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};


/**
 * Exporta uma lista de posts salvos para um arquivo JSON ou CSV.
 * @param posts O array de SavedPost a ser exportado.
 * @param format O formato de exportação desejado, 'json' ou 'csv'.
 */
export const exportSavedPosts = (posts: SavedPost[], format: 'json' | 'csv'): void => {
    if (format === 'json') {
        const jsonContent = JSON.stringify(posts, null, 2);
        downloadFile(jsonContent, 'saved-posts.json', 'application/json');
    } else if (format === 'csv') {
        const csvContent = convertToCSV(posts);
        downloadFile(csvContent, 'saved-posts.csv', 'text/csv;charset=utf-8;');
    }
};
