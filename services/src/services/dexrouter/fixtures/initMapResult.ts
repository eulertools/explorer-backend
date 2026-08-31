export const initMapResult = (result:any, noSplit:boolean) => {

  // eslint-disable-next-line no-underscore-dangle
  const keys = result.records[0]._fieldLookup;

  const mapResult = new Map<number,any>();

  const pools = new Set();

  const percentages = [ 100, 90 ,80, 70, 60 ,50 ,40, 30, 20, 10];

  percentages.forEach((percentage) =>  mapResult.set(percentage,[]));

  const factoryFilter = result.records[0].get(keys.filterFactory) === 0;

  result.records.forEach((record: any) => {

    let find = false;

    const recordPools = record.get(keys.pools);

    recordPools.forEach((pool:any) => { find = find || pools.has(pool); });

    if(!find && (!factoryFilter || factoryFilter && record.get(keys.filterFactory) === 0)) {

      recordPools.forEach((pool:any) => { pools.add(pool) });

      mapResult.get(100).push({ pools: recordPools, factoryLabel: record.get(keys.factoryLabel),
        tokenLabel: record.get(keys.tokenLabel), slippageEstimation: record.get(keys.slippageEstimation),
        amount: record.get(keys.amount100) });
      if(!noSplit) {
        mapResult.get(90).push({ pools: record.get(keys.pools), factoryLabel: record.get(keys.factoryLabel),
          tokenLabel: record.get(keys.tokenLabel),slippageEstimation: record.get(keys.slippageEstimation),
          amount: record.get(keys.amount90) });
        mapResult.get(80).push({ pools: record.get(keys.pools), factoryLabel: record.get(keys.factoryLabel),
          tokenLabel: record.get(keys.tokenLabel),slippageEstimation: record.get(keys.slippageEstimation),
          amount: record.get(keys.amount80) });
        mapResult.get(70).push({ pools: record.get(keys.pools), factoryLabel: record.get(keys.factoryLabel),
          tokenLabel: record.get(keys.tokenLabel),slippageEstimation: record.get(keys.slippageEstimation),
          amount: record.get(keys.amount70) });
        mapResult.get(60).push({ pools: record.get(keys.pools), factoryLabel: record.get(keys.factoryLabel),
          tokenLabel: record.get(keys.tokenLabel),slippageEstimation: record.get(keys.slippageEstimation),
          amount: record.get(keys.amount60) });
        mapResult.get(50).push({ pools: record.get(keys.pools), factoryLabel: record.get(keys.factoryLabel),
          tokenLabel: record.get(keys.tokenLabel),slippageEstimation: record.get(keys.slippageEstimation),
          amount: record.get(keys.amount50) });
        mapResult.get(40).push({ pools: record.get(keys.pools), factoryLabel: record.get(keys.factoryLabel),
          tokenLabel: record.get(keys.tokenLabel),slippageEstimation: record.get(keys.slippageEstimation),
          amount: record.get(keys.amount40) });
        mapResult.get(30).push({ pools: record.get(keys.pools), factoryLabel: record.get(keys.factoryLabel),
          tokenLabel: record.get(keys.tokenLabel),slippageEstimation: record.get(keys.slippageEstimation),
          amount: record.get(keys.amount30) });
        mapResult.get(20).push({ pools: record.get(keys.pools), factoryLabel: record.get(keys.factoryLabel),
          tokenLabel: record.get(keys.tokenLabel),slippageEstimation: record.get(keys.slippageEstimation),
          amount: record.get(keys.amount20) });
        mapResult.get(10).push({ pools: record.get(keys.pools), factoryLabel: record.get(keys.factoryLabel),
          tokenLabel: record.get(keys.tokenLabel),slippageEstimation: record.get(keys.slippageEstimation),
          amount: record.get(keys.amount10) });
      }
    }
  });

  // console.log('length', mapResult.get(100).length);

  return mapResult;
}
