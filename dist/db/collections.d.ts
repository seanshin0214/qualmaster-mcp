export interface CollectionConfig {
    name: string;
    metadata: {
        description: string;
    };
}
export declare const COLLECTIONS: Record<string, CollectionConfig>;
export type CollectionCategory = keyof typeof COLLECTIONS;
//# sourceMappingURL=collections.d.ts.map