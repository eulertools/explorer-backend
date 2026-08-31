export const query =
`WITH $tokenIn AS TOKEN_IN, $tokenOut AS TOKEN_OUT, $amountIn AS AMOUNT_IN, $fees as FEES
WITH *,
$tokens as TOKENS,$factory_addresses AS FACTORYS,
$priority_factory AS PRIORITY_FACTORYS
MATCH x = (t1:TestnetToken{address:TOKEN_IN})-[r:TestnetPool*..2]-(t2:TestnetToken{address:TOKEN_OUT})
WHERE all(e in relationships(x) where apoc.coll.contains(TOKENS,e.base_token) AND apoc.coll.contains(TOKENS,e.quote_token) AND apoc.coll.contains(FACTORYS,e.factory))
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
            then (s.amount100 * FEES * e.quote_reserves) / (e.base_reserves + (s.amount100 * FEES))
            else (s.amount100 * FEES * e.base_reserves) / (e.quote_reserves + (s.amount100 * FEES))
            end),
        amount90: (case when s.ta = e.base_token
            then (s.amount90 * FEES * e.quote_reserves) / (e.base_reserves + (s.amount90 * FEES))
            else (s.amount90 * FEES * e.base_reserves) / (e.quote_reserves + (s.amount90 * FEES))
            end),
        amount80: (case when s.ta = e.base_token
            then (s.amount80 * FEES * e.quote_reserves) / (e.base_reserves + (s.amount80 * FEES))
            else (s.amount80 * FEES * e.base_reserves) / (e.quote_reserves + (s.amount80 * FEES))
            end),
        amount70: (case when s.ta = e.base_token
            then (s.amount70 * FEES * e.quote_reserves) / (e.base_reserves + (s.amount70 * FEES))
            else (s.amount70 * FEES * e.base_reserves) / (e.quote_reserves + (s.amount70 * FEES))
            end),
        amount60: (case when s.ta = e.base_token
            then (s.amount60 * FEES * e.quote_reserves) / (e.base_reserves + (s.amount60 * FEES))
            else (s.amount60 * FEES * e.base_reserves) / (e.quote_reserves + (s.amount60 * FEES))
            end),
        amount50: (case when s.ta = e.base_token
            then (s.amount50 * FEES * e.quote_reserves) / (e.base_reserves + (s.amount50 * FEES))
            else (s.amount50 * FEES * e.base_reserves) / (e.quote_reserves + (s.amount50 * FEES))
            end),
        amount40: (case when s.ta = e.base_token
            then (s.amount40 * FEES * e.quote_reserves) / (e.base_reserves + (s.amount40 * FEES))
            else (s.amount40 * FEES * e.base_reserves) / (e.quote_reserves + (s.amount40 * FEES))
            end),
        amount30: (case when s.ta = e.base_token
            then (s.amount30 * FEES * e.quote_reserves) / (e.base_reserves + (s.amount30 * FEES))
            else (s.amount30 * FEES * e.base_reserves) / (e.quote_reserves + (s.amount30 * FEES))
            end),
        amount20: (case when s.ta = e.base_token
            then (s.amount20 * FEES * e.quote_reserves) / (e.base_reserves + (s.amount20 * FEES))
            else (s.amount20 * FEES * e.base_reserves) / (e.quote_reserves + (s.amount20 * FEES))
            end),
        amount10: (case when s.ta = e.base_token
            then (s.amount10 * FEES * e.quote_reserves) / (e.base_reserves + (s.amount10 * FEES))
            else (s.amount10 * FEES * e.base_reserves) / (e.quote_reserves + (s.amount10 * FEES))
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
order by out.amount100 desc
limit 10;
`

