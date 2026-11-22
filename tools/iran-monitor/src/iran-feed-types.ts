type SourceKind='newsroom'|'official'|'civil-society'|'state-affiliated';
export type NewsItem={id:string;title:string;url:string;publishedAt:string;timestampKind:'published'|'updated';source:string;topics:string[];scope:'iran'|'regional';matchedTerms:string[]};
export type FeedIssue='timeout'|'upstream_unavailable'|'redirect_rejected'|'invalid_feed';
export type SourceState={id:string;name:string;home:string;kind:SourceKind;affiliationNote:string;status:'current'|'stale'|'unavailable';fetchedAt:string|null;attemptedAt:string;matchingItems:number;feedEntries:number;skippedUndated:number;skippedFuture:number;issue?:FeedIssue};
export type IranFeed={checkedAt:string;retryAfterSeconds:number;sources:SourceState[];items:NewsItem[]};
