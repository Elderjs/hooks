const fetch = require('node-fetch');

/**
 * How to Use:
 * 1. Add this hook into your hooks.js.
 * 2. The data returned on the mutable data object will now be available on all hooks,
 *    in your Layout.svelte, your RouteName.svelte, and the all({data}) and data({data})
 *    functions for each route.
 * 3. In this example it means that in each of these locations you can access data.companies
 *    and have access to the all of the SP500 company data.
 *
 * Notes:
 * *  It is important to note that this data is available in ALL routes and hooks, so naming is important. Also be careful of naming conflicts.
 * *  If you only need to hit an API for a single route, you may want to do this in your route's data function. The same code should work.
 */

const hooks = [
  {
    hook: 'bootstrap',
    name: 'addDataFromRemoteApi',
    description: `
        Fetch data from a remote API using node-fetch and add it to the "data" object available 
        in hooks and in each route\'s all({data}) and data({data}) functions.    
        
        In this example we're fetching data on the SP500 companies, doing a small amount of 
        transformation, and adding it to the data object. 
      `,
    priority: 50,
    run: async ({ data }) => {
      const companyData = await fetch(
        'https://opendata.arcgis.com/datasets/a4d813c396934fc09d0b801a0c491852_0.geojson',
      ).then((res) => res.json());
      const companies = Object.values(companyData.features).map((entry) => entry.properties);

      return { data: { ...data, companies } };
    },
  },
];
module.exports = hooks;
