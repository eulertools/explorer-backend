export const query =
`WITH $tokenIn AS TOKEN_IN, $tokenOut AS TOKEN_OUT, $amountIn AS AMOUNT_IN, $fees as FEES
WITH *,
$tokens as TOKENS,$factory_addresses AS FACTORYS,
$priority_factory AS PRIORITY_FACTORYS
MATCH x = (t1:Token{address:TOKEN_IN})-[r:Pool*..2]-(t2:Token{address:TOKEN_OUT})
WHERE all(e in relationships(x) where apoc.coll.contains(TOKENS,e.base_token) AND apoc.coll.contains(TOKENS,e.quote_token) AND apoc.coll.contains(FACTORYS,e.factory)
  AND e.quote_reserves > 100 AND e.base_reserves > 100)
WITH *,
    REDUCE(s = {
        amount100: AMOUNT_IN, amount90: AMOUNT_IN * 0.9, amount80: AMOUNT_IN * 0.8, amount70: AMOUNT_IN * 0.7,
        amount60: AMOUNT_IN * 0.6, amount50: AMOUNT_IN * 0.5, amount40: AMOUNT_IN * 0.4, amount30: AMOUNT_IN * 0.3,
        amount20: AMOUNT_IN * 0.2,amount10: AMOUNT_IN * 0.1,
        ta:TOKEN_IN
    }, e IN r |
    apoc.map.merge(s,
    {
        amount100: (case when s.ta = e.base_token
            then (s.amount100 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.quote_reserves) / (e.base_reserves + (s.amount100 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            else (s.amount100 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.base_reserves) / (e.quote_reserves + (s.amount100 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            end),
        amount90: (case when s.ta = e.base_token
            then (s.amount90 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.quote_reserves) / (e.base_reserves + (s.amount90 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            else (s.amount90 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.base_reserves) / (e.quote_reserves + (s.amount90 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            end),
        amount80: (case when s.ta = e.base_token
            then (s.amount80 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.quote_reserves) / (e.base_reserves + (s.amount80 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            else (s.amount80 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.base_reserves) / (e.quote_reserves + (s.amount80 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            end),
        amount70: (case when s.ta = e.base_token
            then (s.amount70 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.quote_reserves) / (e.base_reserves + (s.amount70 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            else (s.amount70 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.base_reserves) / (e.quote_reserves + (s.amount70 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            end),
        amount60: (case when s.ta = e.base_token
            then (s.amount60 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.quote_reserves) / (e.base_reserves + (s.amount60 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            else (s.amount60 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.base_reserves) / (e.quote_reserves + (s.amount60 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            end),
        amount50: (case when s.ta = e.base_token
            then (s.amount50 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.quote_reserves) / (e.base_reserves + (s.amount50 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            else (s.amount50 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.base_reserves) / (e.quote_reserves + (s.amount50 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            end),
        amount40: (case when s.ta = e.base_token
            then (s.amount40 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.quote_reserves) / (e.base_reserves + (s.amount40 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            else (s.amount40 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.base_reserves) / (e.quote_reserves + (s.amount40 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            end),
        amount30: (case when s.ta = e.base_token
            then (s.amount30 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.quote_reserves) / (e.base_reserves + (s.amount30 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            else (s.amount30 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.base_reserves) / (e.quote_reserves + (s.amount30 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            end),
        amount20: (case when s.ta = e.base_token
            then (s.amount20 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.quote_reserves) / (e.base_reserves + (s.amount20 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            else (s.amount20 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.base_reserves) / (e.quote_reserves + (s.amount20 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            end),
        amount10: (case when s.ta = e.base_token
            then (s.amount10 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.quote_reserves) / (e.base_reserves + (s.amount10 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            else (s.amount10 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES) * e.base_reserves) / (e.quote_reserves + (s.amount10 * COALESCE((toFloat(e.fees) / toFloat(e.percentage)),FEES)))
            end),
        ta: (case when s.ta = e.base_token then e.quote_token else e.base_token end)
    })) as out
RETURN
    [e in r | e.address] as pools,
    [e in r | e.factoryLabel] as factoryLabel,
    [e in nodes(x) | e.symbol] as tokenLabel,
    (COALESCE(t1.sell_tax,0) * 100 + COALESCE(t2.buy_tax,0) * 100) as slippageEstimation,
    apoc.coll.sum([e in r | apoc.map.get(PRIORITY_FACTORYS,"addr_" + COALESCE(e.factory, ""), 1)]) as filterFactory,
    out.amount100 as amount100,
    out.amount90 as amount90,
    out.amount80 as amount80,
    out.amount70 as amount70,
    out.amount60 as amount60,
    out.amount50 as amount50,
    out.amount40 as amount40,
    out.amount30 as amount30,
    out.amount20 as amount20,
    out.amount10 as amount10
order by filterFactory, out.amount100 desc
limit 10;
`
