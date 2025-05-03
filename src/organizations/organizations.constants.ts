//self referencing entity
export interface Organization {
  id: string;
  name: string;
  parent: string | null;
}

export const Organizations: Organization[] = [
  { id: 'parentorg1', name: 'Org1', parent: null },
  { id: 'suborg1', name: 'Sub-Org1', parent: 'parentorg1' },
  { id: 'suborg2', name: 'Sub-Org2', parent: 'parentorg1' },
  { id: 'parentorg2', name: 'Org2', parent: null },
  { id: 'suborg3', name: 'Sub-Org3', parent: 'parentorg2' },
  { id: 'suborg4', name: 'Sub-Org4', parent: 'parentorg2' },
];
