// Import ThoughtSpot SDK
import './style.css';
import './script.js';

import {
  init,
  AppEmbed,
  Page,
  RuntimeFilterOp,
  EmbedEvent,
  AuthType,
  HostEvent,
  logout,
  SearchEmbed,
  SearchBarEmbed,
  LiveboardEmbed,
  SageEmbed,
  Action,
} from '@thoughtspot/visual-embed-sdk';

import {
  actions,
  lbvisibaction,
  drillactions,
  TMLactions,
  MobileActions,
} from './actions.js';

// Embedding the Champagne cluster
/*
const tsClusterUrl = 'https://champagne.thoughtspotstaging.cloud';
const liveboardguid = 'c02bca51-f995-47a4-a729-a8bf4e06faed';
const vizguid = '22968629-a00f-4fd1-ad86-021a10bf199f';
const searchdatasourceguid = 'cd252e5c-b552-49a8-821d-3eadaa049cca';
const searchtokens = '[sales][item type][state].California';
*/

// Embedding the Embed1 cluster

const tsClusterUrl = 'https://embed-1-do-not-delete.thoughtspotstaging.cloud';
const liveboardguid = '410fa63f-944a-4c1b-b906-44666ac2f2b2';
const vizguid = '48ab1b94-1b13-408e-ba9b-76256114c5fa';
const searchdatasourceguid = ['cd252e5c-b552-49a8-821d-3eadaa049cca'];
const searchtokens = '[sales][item type][state].California';

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

console.log('Width:  ' + getWidth());
if (getWidth() < 500) {
  var hideactions = MobileActions;
} else {
  hideactions = [];
}

const logFilters = (response) => {
  const filters = response.data || response;
  console.group('Pinboard Filters');
  console.group('Visible Filters');
  filters.liveboardFilters.forEach((filter) => {
    const name = filter.columnInfo.name;
    const oper = filter.filters[0].filterContent[0].filterType;
    const values = filter.filters[0].filterContent[0].value
      .map((val) => val.key)
      .join(',');
    console.log(`${name} - ${oper} - ${values}`);
  });
  console.groupEnd('Visible Filters');
  console.group('Runtime Filters');
  filters.runtimeFilters.forEach((filter) => {
    const name = filter.columnName;
    const oper = filter.filterType;
    const values = filter.value.join(',');
    console.log(`${name} - ${oper} - ${values}`);
  });
  console.groupEnd('Runtime Filters');
  console.groupEnd('Pinboard Filters');
};

// lbvisibaction = [Action.Monitor];
/*-------------------- INIT ----------------- */

init({
  // Embed1 embed
  thoughtSpotHost: tsClusterUrl,
  authType: AuthType.None,
  customizations: {
    style: {
      // customCSSUrl: 'https://cdn.jsdelivr.net/gh/nrentz-ts/css/dark-theme.css', // location of your style sheet

      // To apply overrides for your style sheet in this init, provide variable values below, eg
      customCSS: {
        variables: {
          //   '--ts-var-button--secondary-background': '#F0EBFF',
          //   '--ts-var-button--secondary--hover-background': '#E3D9FC',
          //   '--ts-var-root-background': '#F7F5FF',
        },
      },
    },
  },
});

/*-------------------- LIVEBOARD EMBED ----------------- */

const liveboardembed = () => {
  const embed = new LiveboardEmbed('#embed', {
    frameParams: {
      width: '100%',
      height: '100%',
    },
    // fullHeight: true,
    //Embed 1 liveboard:
    liveboardId: liveboardguid,

    // visibleVizs:["48ab1b94-1b13-408e-ba9b-76256114c5fa", "d799376a-6850-4eba-b101-4128b4dba7a4"],
    // hiddenActions: [Action.Explore, Action.Pin, Action.Share],
    // disabledActions: [Action.DrillDown, Action.Pin, Action.SpotIQAnalyze],
    // disabledActionReason: 'Please upgrade to Pro',

    /* runtimeFilters: [
      {
        columnName: 'item type',
        operator: RuntimeFilterOp.EQ,
        values: [],
      },
      {
        columnName: 'state',
        operator: RuntimeFilterOp.EQ,
        values: ['California'],
      },
    ],
    */
  });
  embed
    .on(EmbedEvent.FilterChanged, (payload) => {
      console.log('Filter Changed', payload);
    })
    .on(EmbedEvent.FilterChanged, logFilters)
    .render();

  document.getElementById('getFilters').addEventListener('click', (e) => {
    embed.trigger(HostEvent.GetFilters).then(logFilters);
  });

  document.getElementById('updateFilters2').addEventListener('click', (e) => {
    embed.trigger(HostEvent.UpdateFilters, {
      filters: [
        {
          column: 'city',
          operator: RuntimeFilterOp.EQ,
          values: ['Alpharetta'],
        },
        /*,{
          column: 'item type',
          operator: RuntimeFilterOp.IN,
          values: ['jackets', 'jeans'],
        },*/
      ],
    });
  });
};

/*-------------------- VIZ EMBED ----------------- */
const vizembed = () => {
  const embed = new LiveboardEmbed('#embed', {
    //Embed 1 liveboard:
    liveboardId: liveboardguid,
    vizId: '48ab1b94-1b13-408e-ba9b-76256114c5fa',
  });
  embed.render();
};

/*-------------------- FULL APP EMBED ----------------- */

const fullappembed = () => {
  const embed = new AppEmbed('#embed', {
    pageId: Page.Liveboards,
    liveboardV2: true,
    showPrimaryNavbar: true,
    // pageId: Page.Liveboards,
    // disabledActions: TMLactions,
    // disabledActionReason: 'Please upgrade',
    // visibleActions: [],
  });
  embed.render();
};

/*-------------------- SEARCH EMBED ----------------- */
const searchembed = () => {
  const embed = new SearchEmbed('#embed', {
    // Embed 1 SearchEmbed
    dataSources: ['42a6c051-aabd-4b5c-a2a9-3bf64a1a4190'],
    searchOptions: {
      searchTokenString: '[item price][product type][state].California', //write a TML query
      executeSearch: true,
    },
  });
  embed
    .on(EmbedEvent.Data, (payload) => {
      console.log('Data', payload);
    })
    .on(EmbedEvent.ExportTML, (payload) => {
      console.log('Export TML', payload);
    })
    .render();
};

/*-------------------- SEARCHBAR EMBED ----------------- */

const searchbarembed = () => {
  const embed = new SearchBarEmbed('#embed', {
    // Embed 1 SearchEmbed
    dataSources: ['42a6c051-aabd-4b5c-a2a9-3bf64a1a4190'],
    searchOptions: {
      searchTokenString: '[item price][product type][state].California', //write a TML query
      executeSearch: true,
    },
  });
  embed
    .on(EmbedEvent.Data, (payload) => {
      console.log('Data', payload);
    })
    .on(EmbedEvent.ExportTML, (payload) => {
      console.log('Export TML', payload);
    })
    .render();
};

/*-------------------- SAGE EMBED ----------------- */
const sageembed = () => {
  const embed = new SageEmbed('#embed', {
    //   cd252e5c-b552-49a8-821d-3eadaa049cca
    //Worksheet controls
    // disableWorksheetChange:true,
    // hideWorksheetSelector:true,
    // Search experience
    //  showObjectResults:true,
    // showObjectSuggestions:true,
  });
  embed.render();
};

/*-------------------- Default state ----------------- */
liveboardembed();
// sageembed();
// vizembed();
// fullappembed();
// searchembed();
// searchbarembed();

/*--------------------  WIRE BUTTONS ----------------- */

document.getElementById('search-link').addEventListener('click', searchembed);
document
  .getElementById('searchbar-link')
  .addEventListener('click', searchbarembed);
document
  .getElementById('liveboard-link')
  .addEventListener('click', liveboardembed);
document.getElementById('sage-link').addEventListener('click', sageembed);
document
  .getElementById('full-app-link')
  .addEventListener('click', fullappembed);
