import { Context, createContext, closeContext } from "./context";
import { getKeys, createKey, deleteKey, sign, KeyType } from "./model/keys";
import { addMapping, getMapping } from "./model/mapping";

export interface KeyStore {
    getKeys(): Promise<string[]>;
    createKey(params: { passphrase?: string }): Promise<string>;
    deleteKey(params: { publicKey: string, passphrase: string }): Promise<boolean>;
    sign(params: { publicKey: string, message: string, passphrase: string }): Promise<string>;
}

class CCKey {
    public static CCKey = CCKey;

    public static async create(params: {
        useMemoryDB?: boolean
    } = {}): Promise<CCKey> {
        const useMemoryDB = params.useMemoryDB || false;
        const context = await createContext({ useMemoryDB });
        return new CCKey(context);
    }

    public platform: KeyStore = {
        getKeys: () => {
            return getKeys(this.context, { keyType: KeyType.Platform });
        },

        createKey: (params: { passphrase?: string }) => {
            return createKey(this.context, { ...params, keyType: KeyType.Platform });
        },

        deleteKey: (params: { publicKey: string, passphrase: string }) => {
            return deleteKey(this.context, { ...params, keyType: KeyType.Platform });
        },

        sign: (params: { publicKey: string, message: string, passphrase: string }) => {
            return sign(this.context, { ...params, keyType: KeyType.Platform });
        }
    }

    public asset: KeyStore = {
        getKeys: () => {
            return getKeys(this.context, { keyType: KeyType.Asset });
        },

        createKey: (params: { passphrase?: string }) => {
            return createKey(this.context, { ...params, keyType: KeyType.Asset });
        },

        deleteKey: (params: { publicKey: string, passphrase: string }) => {
            return deleteKey(this.context, { ...params, keyType: KeyType.Asset });
        },

        sign: (params: { publicKey: string, message: string, passphrase: string }) => {
            return sign(this.context, { ...params, keyType: KeyType.Asset });
        }
    }

    public mapping = {
        add: (params: { key: string; value: string }) => {
            return addMapping(this.context, params);
        },

        get: (params: { key: string }) => {
            return getMapping(this.context, params);
        }
    }

    private context: Context;

    private constructor(context: Context) {
        this.context = context;
    }

    public close(): Promise<void> {
        return closeContext(this.context);
    }
}

export { CCKey };

module.exports = CCKey;
