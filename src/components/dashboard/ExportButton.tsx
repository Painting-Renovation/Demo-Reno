'use client';

import { useState } from 'react';
import { Download, Clipboard, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import {
  generateCSV,
  generateTSV,
  downloadFile,
  copyToClipboard,
  type ExportColumn,
} from '@/lib/csv-export';

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename: string;
  columns: ExportColumn[];
}

export default function ExportButton({ data, filename, columns }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const csv = generateCSV(data, columns);
      downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
      toast({
        title: 'Exported',
        description: `${filename}.csv has been downloaded.`,
      });
    } catch {
      toast({
        title: 'Export failed',
        description: 'Could not generate the CSV file.',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  const handleCopyClipboard = async () => {
    setExporting(true);
    try {
      const tsv = generateTSV(data, columns);
      const success = await copyToClipboard(tsv);
      if (success) {
        toast({
          title: 'Copied to clipboard',
          description: 'Data has been copied as tab-separated values.',
        });
      } else {
        toast({
          title: 'Copy failed',
          description: 'Could not copy to clipboard.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard.',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-navy h-8 gap-1.5"
          disabled={exporting || data.length === 0}
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Export</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyClipboard}>
          <Clipboard className="h-4 w-4 mr-2" />
          Copy to Clipboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
