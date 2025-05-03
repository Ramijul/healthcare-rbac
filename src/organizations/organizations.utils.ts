import { Organization, Organizations } from './organizations.constants';

/**
 *
 * @param parentOrg
 * @returns a list of sub organization IDs along with the parent organization ID
 */
export function getAllOrgs(parentOrg: string): string[] {
  // given that org structure is 2-levels deep, if requested org is not parent
  // we can avoid seraching for sub orgs
  const org = Organizations.find(
    (o) => o.id === parentOrg && o.parent === null,
  );
  if (!org) return [parentOrg];

  const subOrgs = Organizations.filter((o) => o.parent === parentOrg).map(
    (o) => o.id,
  );
  return [parentOrg, ...subOrgs];
}

export function getOrg(orgId: string): Organization | undefined {
  return Organizations.find((o) => o.id === orgId);
}
