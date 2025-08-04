
// src/components/features/product-gallery.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, Trash2, Download, Box } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { convertJsonToCsv } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';


export function ProductGallery() {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadProducts = () => {
      try {
        const storedProducts = localStorage.getItem('fg-products');
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        }
      } catch (error) {
        console.error("Failed to load products from localStorage", error);
        toast({ title: "Erro ao carregar produtos", variant: "destructive" });
      }
    };
    loadProducts();
    
    const handleStorageChange = () => loadProducts();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [toast]);

  const handleExport = (product: Product) => {
    try {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(product, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${product.name || 'product'}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast({ title: `"${product.name}" exportado com sucesso!` });
    } catch (error) {
        console.error("Export failed:", error);
        toast({ title: 'Erro ao exportar', variant: 'destructive' });
    }
  };
  
  const handleDelete = (productId?: string, productName?: string) => {
    if (!productId) return;
    if (window.confirm(`Tem a certeza que quer eliminar o produto "${productName || 'este produto'}"?`)) {
      try {
        const updatedProducts = products.filter(p => p.id !== productId);
        localStorage.setItem('fg-products', JSON.stringify(updatedProducts));
        setProducts(updatedProducts);
        window.dispatchEvent(new Event('storage'));
        toast({ title: `"${productName}" foi eliminado.` });
      } catch (error) {
        console.error("Delete failed:", error);
        toast({ title: 'Erro ao eliminar', variant: 'destructive' });
      }
    }
  };

  const handleLoad = (product: Product) => {
    const event = new CustomEvent('loadProduct', { detail: product });
    window.dispatchEvent(event);
    toast({
      title: `Produto "${product.name}" carregado!`,
      description: 'O produto está pronto para ser integrado numa cena.',
    });
  };
  
  const handleExportAll = () => {
     if (products.length === 0) {
       toast({ title: 'Nada para exportar', description: 'A sua galeria de produtos está vazia.', variant: 'destructive' });
       return;
     }

    try {
      const allProductsText = products.map(p => 
`Nome do Produto: ${p.name || ''}
Marca: ${p.brand || ''}
Descrição: ${p.description || ''}
---------------------------------`
      ).join('\n\n');

      const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(allProductsText);
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `todos_os_produtos.txt`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast({ title: `Todos os produtos foram exportados para .txt!` });
    } catch (error) {
        console.error("Export all failed:", error);
        toast({ title: 'Erro ao exportar tudo', variant: 'destructive' });
    }
  }

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <Box className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-headline">Galeria de Produtos</h2>
            <p className="text-sm text-muted-foreground">
              Produtos que você salvou. Carregue um para usar numa cena.
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleExportAll} className="w-full md:w-auto">
            <Download className="mr-2 h-4 w-4" />
            EXPORTA EM .TXT
        </Button>
      </div>
      
      {products.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
            <p className="text-muted-foreground text-center py-8">A sua galeria de produtos está vazia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{product.name || "Produto Sem Nome"}</CardTitle>
                <CardDescription>{product.brand}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-4">{product.description}</p>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <div className="flex w-full gap-2">
                  <Button className="flex-1" onClick={() => handleLoad(product)}><UploadCloud className="mr-2 h-4 w-4"/>Carregar</Button>
                </div>
                <div className="flex w-full justify-between items-center mt-2">
                  <Button variant="ghost" size="sm" onClick={() => handleExport(product)}><FileText className="mr-2 h-4 w-4"/>Exportar</Button>
                  <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive" onClick={() => handleDelete(product.id, product.name)}><Trash2 className="h-4 w-4"/></Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
