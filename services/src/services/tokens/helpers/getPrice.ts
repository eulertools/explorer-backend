export const PRICE_QUERY = `WITH $tokenIn AS TOKEN_IN, $tokenOut AS TOKEN_OUT, 1 AS AMOUNT_IN
        WITH *,
        $tokenList as TOKENS
         MATCH x = (t1:Token{address:TOKEN_IN})-[r:Pool*..2]-(t2:Token{address:TOKEN_OUT})
         WHERE all(e in relationships(x) where apoc.coll.contains(TOKENS,e.base_token) AND apoc.coll.contains(TOKENS,e.quote_token) and e.last_update >= (datetime().epochMillis / 1000) - 3600 AND e.quote_reserves > 100 AND e.base_reserves > 100)
         WITH *,
             REDUCE(s = {
                 amount: AMOUNT_IN,
                 ta:TOKEN_IN
             }, e IN r |
             apoc.map.merge(s,
             {
                 amount: (case when s.ta = e.base_token
                     then (s.amount * e.quote_reserves) / (e.base_reserves)
                     else (s.amount * e.base_reserves) / (e.quote_reserves)
                     end),
                 ta: (case when s.ta = e.base_token then e.quote_token else e.base_token end)
             })) as out
         RETURN percentileCont(out.amount, 0.75) as price`;
