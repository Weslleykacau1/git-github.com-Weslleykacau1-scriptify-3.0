import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const handleImageUpload = (
  file: File,
  callback: (dataUri: string) => void
) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }
};


export const convertJsonToCsv = (jsonData: any[]) => {
  if (!jsonData || jsonData.length === 0) {
    return "";
  }
  const keys = Object.keys(jsonData[0]);
  const csvRows = [
    keys.join(','), // header row
    ...jsonData.map(row => 
      keys.map(key => {
        let value = row[key];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`; 
        }
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ];
  return csvRows.join('\n');
};
