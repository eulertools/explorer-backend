import * as Utils from 'web3-utils';

export const split1Combination = (mapResult:Map<number,any>, amountIn:any) => {

  const maxSplit = mapResult.get(100).reduce((prev: any, current: any) => (prev.amount > current.amount) ? prev : current);

  return formatSplit(amountIn, [{
    percentage: 100,
    pools: maxSplit.pools,
    amount: maxSplit.amount,
    factoryLabel: maxSplit.factoryLabel,
    tokenLabel: maxSplit.tokenLabel,
    slippageEstimation: maxSplit.slippageEstimation
  }]);
}

export const split2Combination = (mapResult:Map<number,any>, amountIn:any) => {

  const combinationPercentages = [ [90,10] ,[80,20], [70,30], [60,40] ,[50,50] ];

  let maxSplit:any = { amountOut:0 };

  // console.time('split2');
  combinationPercentages.forEach((percetanges) => {

    const listA = mapResult.get(percetanges[0]);
    const listB = mapResult.get(percetanges[1]);

    listA.forEach((a: any) => {
      listB.forEach((b: any) => {

        if(maxSplit.amountOut < (a.amount + b.amount) && !intersection2(a.pools, b.pools) ) {

          maxSplit = formatSplit(amountIn,
            [
              { percentage: percetanges[0],  pools: a.pools, amount: a.amount,
                factoryLabel: a.factoryLabel, tokenLabel: a.tokenLabel,slippageEstimation: a.slippageEstimation
              },
              { percentage: percetanges[1],  pools: b.pools, amount: b.amount,
                factoryLabel: b.factoryLabel, tokenLabel: b.tokenLabel,slippageEstimation: b.slippageEstimation
              }
            ]);
        }
      });
    });
  });
  // console.timeEnd('split2');

  return maxSplit;
}

export const split3Combination = (mapResult:Map<number,any>, amountIn:any) => {

  const combinationPercentages = [
    [80,10,10] ,[70,20,10], [60,30,10], [60,20,20] ,
    [50,40,10], [50,30,20], [40,40,20], [40,30,30]
  ];

  let maxSplit:any = { amountOut:0 };

  // console.time('split3');
  combinationPercentages.forEach((percetanges) => {

    const listA = mapResult.get(percetanges[0]);
    const listB = mapResult.get(percetanges[1]);
    const listC = mapResult.get(percetanges[2]);

    listA.forEach((a: any) => {
      listB.forEach((b: any) => {
        listC.forEach((c: any) => {

          if(maxSplit.amountOut < (a.amount + b.amount + c.amount) && !intersection3(a.pools, b.pools, c.pools) ) {

            maxSplit = formatSplit(amountIn,
              [
                { percentage: percetanges[0],  pools: a.pools, amount: a.amount,
                  factoryLabel: a.factoryLabel, tokenLabel: a.tokenLabel, slippageEstimation: a.slippageEstimation
                },
                { percentage: percetanges[1],  pools: b.pools, amount: b.amount,
                  factoryLabel: b.factoryLabel, tokenLabel: b.tokenLabel, slippageEstimation: b.slippageEstimation
                },
                { percentage: percetanges[2],  pools: c.pools, amount: c.amount,
                  factoryLabel: c.factoryLabel, tokenLabel: c.tokenLabel, slippageEstimation: c.slippageEstimation
                },
              ]);
          }
        });
      });
    });
  });
  // console.timeEnd('split3');

  return maxSplit;
}

export const split4Combination = (mapResult:Map<number,any>, amountIn:any) => {

  const combinationPercentages = [
    [70,10,10,10] ,[60,20,10,10], [50,30,10,10], [50,20,20,10] ,
    [40,40,10,10], [40,30,20,10], [40,20,20,20], [30,30,30,10]
  ];

  let maxSplit:any = { amountOut:0 };

  // console.time('split4');
  combinationPercentages.forEach((percetanges) => {

    const listA = mapResult.get(percetanges[0]);
    const listB = mapResult.get(percetanges[1]);
    const listC = mapResult.get(percetanges[2]);
    const listD = mapResult.get(percetanges[3]);

    listA.forEach((a: any) => {
      listB.forEach((b: any) => {
        listC.forEach((c: any) => {
          listD.forEach((d: any) => {

            if(maxSplit.amountOut < (a.amount + b.amount + c.amount + d.amount) && !intersection4(a.pools, b.pools, c.pools, d.pools) ) {

              maxSplit = formatSplit(amountIn,
                [
                  { percentage: percetanges[0],  pools: a.pools, amount: a.amount,
                    factoryLabel: a.factoryLabel, tokenLabel: a.tokenLabel, slippageEstimation: a.slippageEstimation
                  },
                  { percentage: percetanges[1],  pools: b.pools, amount: b.amount ,
                    factoryLabel: b.factoryLabel, tokenLabel: b.tokenLabel, slippageEstimation: b.slippageEstimation
                  },
                  { percentage: percetanges[2],  pools: c.pools, amount: c.amount ,
                    factoryLabel: c.factoryLabel, tokenLabel: c.tokenLabel, slippageEstimation: c.slippageEstimation
                  },
                  { percentage: percetanges[3],  pools: d.pools, amount: d.amount ,
                    factoryLabel: d.factoryLabel, tokenLabel: d.tokenLabel, slippageEstimation: d.slippageEstimation
                  },
                ]);
            }
          });
        });
      });
    });
  });
  // console.timeEnd('split4');

  return maxSplit;
}

export const formatSplit = (amountIn:any, lines:any[]) => {

  const split:{ amountOut: any; combination: any[] }
    = { amountOut:0, combination:[] };

  lines.forEach((line) => {
    split.amountOut += line.amount;

    split.combination.push({
      percentage: line.percentage,
      amountIn: Utils.fromWei(amountIn.mul(Utils.toBN(line.percentage)).div(Utils.toBN(100))).toString(),
      pools: line.pools,
      amountOut: line.amount.toFixed(18),
      factoryLabel: line.factoryLabel,
      tokenLabel: line.tokenLabel,
      slippageEstimation: line.slippageEstimation
    });
  });

  return split;
}

export const intersection2 = (array1:[], array2:[]):boolean => {
  return array1.filter(value => array2.includes(value)).length > 0;
}

export const intersection3 = (array1:[], array2:[], array3:[]):boolean => {
  let intersection = array1.filter(value => array2.includes(value)).length > 0;
  intersection = intersection || array1.filter(value => array3.includes(value)).length > 0;
  intersection = intersection || array2.filter(value => array3.includes(value)).length > 0;
  return intersection;
}

export const intersection4 = (array1:[], array2:[], array3:[], array4:[]):boolean => {
  let intersection = array1.filter(value => array2.includes(value)).length > 0;
  intersection = intersection || array1.filter(value => array3.includes(value)).length > 0;
  intersection = intersection || array1.filter(value => array4.includes(value)).length > 0;
  intersection = intersection || array2.filter(value => array3.includes(value)).length > 0;
  intersection = intersection || array2.filter(value => array4.includes(value)).length > 0;
  intersection = intersection || array3.filter(value => array4.includes(value)).length > 0;
  return intersection;
}
