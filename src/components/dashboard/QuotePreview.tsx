'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  Send,
  Pencil,
  Printer,
  Paintbrush,
  FileText,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Sample quote data                                                 */
/* ------------------------------------------------------------------ */

const QUOTE_NUMBER = 'QC-2025-004';
const QUOTE_DATE = 'January 11, 2025';
const VALID_UNTIL = 'February 10, 2025';

const COMPANY = {
  name: 'ProCoat Painters',
  tagline: 'Professional Painting Services',
  address: '3300 Highway 7 W, Suite 600, Vaughan ON L4K 4M3',
  phone: '(437) 535-0494',
  email: 'infoinandoutdemolition@gmail.com',
  website: 'www.procoatpainters.com',
  license: 'License #BC-7842',
  hstNumber: 'HST 84739 2651 RT0001',
};

const CLIENT = {
  name: 'Jennifer Adams',
  address: '123 Queen Street',
  city: 'Mississauga, ON L5M 1A2',
  phone: '(905) 555-9012',
  email: 'j.adams@email.com',
  project: 'Kitchen Cabinet Refinishing — 20 Doors + 8 Drawer Fronts',
};

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

const LINE_ITEMS: LineItem[] = [
  {
    description: 'Cabinet door refinishing — sanding, priming, painting (20 doors)',
    quantity: 20,
    unitPrice: 85.0,
  },
  {
    description: 'Drawer front refinishing — sanding, priming, painting (8 fronts)',
    quantity: 8,
    unitPrice: 65.0,
  },
  {
    description: 'Hardware upgrade — soft-close hinges & brushed nickel handles',
    quantity: 28,
    unitPrice: 15.0,
  },
  {
    description: 'Surface preparation — masking, drop cloths, cleanup supplies',
    quantity: 1,
    unitPrice: 250.0,
  },
  {
    description: 'Premium Benjamin Moore Advance paint — satin finish (espresso)',
    quantity: 3,
    unitPrice: 45.0,
  },
];

const SUBTOTAL = LINE_ITEMS.reduce(
  (sum, item) => sum + item.quantity * item.unitPrice,
  0
);
const HST_RATE = 0.13;
const HST = parseFloat((SUBTOTAL * HST_RATE).toFixed(2));
const GRAND_TOTAL = parseFloat((SUBTOTAL + HST).toFixed(2));

const TERMS = [
  'This quote is valid for 30 days from the date of issue. Prices are guaranteed upon acceptance and deposit.',
  'A 50% deposit is required upon acceptance. The remaining balance is due upon project completion.',
  'All work carries a 5-year workmanship warranty. Paint manufacturer warranty applies separately.',
  'Cancellation within 48 hours of scheduled start date will incur a $150 rescheduling fee.',
];

const PAYMENT_SCHEDULE = [
  { label: 'Deposit (50%)', amount: '$1,587.65', due: 'Upon acceptance' },
  { label: 'Final Payment (50%)', amount: '$1,587.65', due: 'Upon completion' },
];

/* ------------------------------------------------------------------ */
/*  Quote Document (printable)                                        */
/* ------------------------------------------------------------------ */

function QuoteDocument() {
  return (
    <div className="quote-document bg-white max-w-[850px] mx-auto">
      {/* Header */}
      <div className="bg-navy text-white px-10 py-8 rounded-t-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold">
                <Paintbrush className="h-5 w-5 text-navy" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  {COMPANY.name}
                </h1>
                <p className="text-xs text-gold/90">{COMPANY.tagline}</p>
              </div>
            </div>
            <div className="mt-4 space-y-0.5 text-xs text-white/80">
              <p>{COMPANY.address}</p>
              <p>{COMPANY.phone} · {COMPANY.email}</p>
              <p>{COMPANY.website}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block bg-white/10 rounded-lg px-4 py-2 mb-2">
              <p className="text-[10px] uppercase tracking-widest text-gold/80">
                Quote
              </p>
              <p className="text-2xl font-bold">{QUOTE_NUMBER}</p>
            </div>
            <div className="text-xs text-white/70 space-y-0.5">
              <p>Date: {QUOTE_DATE}</p>
              <p>Valid Until: {VALID_UNTIL}</p>
              <p className="mt-1 text-[10px] text-white/50">{COMPANY.license}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gold accent line */}
      <div className="h-1 bg-gradient-to-r from-gold via-gold/70 to-gold" />

      {/* Body */}
      <div className="px-10 py-8">
        {/* Client info & Project */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              Bill To
            </p>
            <div className="text-sm">
              <p className="font-semibold text-navy">{CLIENT.name}</p>
              <p className="text-muted-foreground">{CLIENT.address}</p>
              <p className="text-muted-foreground">{CLIENT.city}</p>
              <p className="text-muted-foreground mt-1">{CLIENT.phone}</p>
              <p className="text-muted-foreground">{CLIENT.email}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              Project Details
            </p>
            <div className="text-sm">
              <p className="font-medium text-navy">{CLIENT.project}</p>
              <Badge
                variant="outline"
                className="mt-2 border-gold/30 text-gold bg-gold/5 text-xs"
              >
                Cabinet Refinishing
              </Badge>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border rounded-lg overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Description
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">
                  Qty
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-28">
                  Unit Price
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-28">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {LINE_ITEMS.map((item, i) => {
                const lineTotal = item.quantity * item.unitPrice;
                return (
                  <tr
                    key={i}
                    className={cn(
                      'border-t border-border/50',
                      i % 2 === 0 ? 'bg-white' : 'bg-muted/20'
                    )}
                  >
                    <td className="px-4 py-3 text-sm">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      ${lineTotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${SUBTOTAL.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">HST (13%)</span>
              <span className="font-medium">${HST.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base">
              <span className="font-bold text-navy">Grand Total</span>
              <span className="font-bold text-navy text-lg">
                ${GRAND_TOTAL.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="bg-muted/30 rounded-lg p-5 mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Payment Schedule
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PAYMENT_SCHEDULE.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md bg-white px-4 py-2.5 border"
              >
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.due}</p>
                </div>
                <span className="text-sm font-bold text-navy">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Terms &amp; Conditions
          </p>
          <ol className="space-y-2">
            {TERMS.map((term, i) => (
              <li
                key={i}
                className="flex gap-2 text-xs text-muted-foreground leading-relaxed"
              >
                <span className="text-gold font-semibold shrink-0">
                  {i + 1}.
                </span>
                <span>{term}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* HST Number */}
        <p className="text-[10px] text-muted-foreground mb-6">
          {COMPANY.hstNumber}
        </p>

        <Separator className="mb-6" />

        {/* Signature Lines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Client Acceptance
            </p>
            <div className="border-b border-dashed border-muted-foreground/40 pb-1 mb-2" />
            <p className="text-xs text-muted-foreground">
              Signature · Date
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Authorized Representative
            </p>
            <div className="border-b border-dashed border-muted-foreground/40 pb-1 mb-2" />
            <p className="text-xs text-muted-foreground">
              James Mitchell · {QUOTE_DATE}
            </p>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="bg-muted/30 px-10 py-4 rounded-b-xl">
        <p className="text-center text-xs text-muted-foreground">
          Thank you for choosing{' '}
          <span className="font-semibold text-navy">{COMPANY.name}</span>.
          We look forward to working with you!
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function QuotePreview() {
  const [showChrome, setShowChrome] = useState(true);

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleSendToClient = () => {
    toast({
      title: 'Quote Sent',
      description: `Quote ${QUOTE_NUMBER} has been sent to ${CLIENT.email}.`,
    });
  };

  const handleEditQuote = () => {
    toast({
      title: 'Edit Mode',
      description: 'Opening quote editor for ' + QUOTE_NUMBER + '.',
    });
  };

  return (
    <>
      {/* Action bar — hidden during print */}
      <div className="print:hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-navy">Quote Preview</h2>
            <p className="text-sm text-muted-foreground">
              {QUOTE_NUMBER} · {QUOTE_DATE}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChrome(!showChrome)}
            >
              {showChrome ? (
                <EyeOff className="h-4 w-4 mr-1.5" />
              ) : (
                <Eye className="h-4 w-4 mr-1.5" />
              )}
              {showChrome ? 'Focus Mode' : 'Show Chrome'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditQuote}
            >
              <Pencil className="h-4 w-4 mr-1.5" />
              Edit Quote
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendToClient}
            >
              <Send className="h-4 w-4 mr-1.5" />
              Send to Client
            </Button>
            <Button
              size="sm"
              className="bg-navy hover:bg-navy/90 text-white"
              onClick={handleDownloadPDF}
            >
              <Download className="h-4 w-4 mr-1.5" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Status bar */}
        {showChrome && (
          <Card className="dashboard-card">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-4 flex-wrap text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gold" />
                  <span className="font-medium text-navy">{QUOTE_NUMBER}</span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 text-xs"
                >
                  Sent
                </Badge>
                <span className="text-muted-foreground">
                  Client: <span className="font-medium text-foreground">{CLIENT.name}</span>
                </span>
                <span className="text-muted-foreground">
                  Total: <span className="font-bold text-navy">${GRAND_TOTAL.toFixed(2)}</span>
                </span>
                <span className="text-muted-foreground ml-auto hidden sm:inline">
                  Valid until {VALID_UNTIL}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quote document */}
      <div className={cn('mt-4', showChrome ? '' : 'mt-0')}>
        <QuoteDocument />
      </div>
    </>
  );
}
