import { query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return ctx.db.query('users').collect();
    },
});

