import * as lowdb from "lowdb";

export async function initialize(db: lowdb.LowdbAsync<any>): Promise<void> {
    await db
        .defaults({
            platform_keys: [],
            asset_keys: [],
            mapping: {}
        })
        .write();
}
