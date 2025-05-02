
type status = 'todo' | 'done' | 'idea';
interface kanban_item {
  title: string;
  description: string;
  status: status;
}

export const kanban_items: kanban_item[] = [
  {
    title: 'List More Tokens',
    description: `
      Either try and engage the community to request more tokens or start showing off that a token is listed on Finbyte.
    `,
    status: 'todo'
  },
  {
    title: 'NFT Support',
    description: `
      Always room for adoption and support, saying that we should add support for NFT assets on Cardano to go with our community system.
    `,
    status: 'todo'
  },
  {
    title: 'Team Members',
    description: `
      To help build the Finbyte platform, we'll need to increase our team size.
      Currently, we're looking for somebody to tell us what we need to do on this platform I.E: What needs to be added/removed, Feature Requests, General Project Leader.
    `,
    status: 'idea'
  },
  {
    title: 'Working "Beta"',
    description: `
      The platform is now stable enough for people to use and explore.
    `,
    status: 'done'
  },
];

interface recent_item {
  title: string;
  description: string;
  date: string;
}

/**
 * @note find a better way to do this, we shouldn't really rely on hardcoded data for this data.
 * @idea follow forums logic.
 **/
export const recent_items: recent_item[] = [
  {
    title: 'Welcome Cardano',
    description: `
      Finbyte launches its beta allowing people to use and explore the website however they please.
    `,
    date: '17/04/25'
  },
  {
    title: 'General Update',
    description: `
      Extends a good portion of the community logic as well a new theme, Slate.
    `,
    date: '29/04/25'
  },
  {
    title: 'Another Update',
    description: `
      Fixes the recent theme update. Adds this page to view more Finbyte related items.
      Adds 2 tokens. Adds further clarification on how we're doing things.
    `,
    date: '02/05/25'
  },
];