import React from 'react';
import { StageSection } from './SupplySections';

/* =====================================================================
   CONTROL ROOM — the operations desk, told as a stage deep-dive

   This used to be a dark browser mock with draggable satellite panels,
   then a wave-board table. It now uses the same section as Procurement,
   Warehouse and Logistics: the film on one side, the argument on the
   other. One page, one way of showing a screen.
   ===================================================================== */

const CONTROL = {
  id: 'control',
  kicker: 'Control room',
  title: 'A desk, not a dashboard.',
  accent: 'One board, every site.',
  body: 'Controllers do not want nine tabs and a spreadsheet. Every open wave across the network sits on one board, in the order it needs attention, reading the same records procurement and the warehouse are writing as the shift runs.',
  points: [
    'Every open wave across nine sites on a single board',
    'Progress against plan per wave, not a percentage per site',
    'Transport, supplier OTIF and stock alerts in the same view',
    'Exceptions routed to whoever can actually clear them',
  ],
  video: '/images/4.mp4',
};

export const ControlWorkbench = () => <StageSection stage={CONTROL} flip />;

export default ControlWorkbench;
