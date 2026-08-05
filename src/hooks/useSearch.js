import Fuse from 'fuse.js';
import { useMemo } from 'react';

export function useSearch(data, keys, query, enabled) {
	const fuse = useMemo(() => {
		if (!data) return [];
		const index = Fuse.createIndex(keys, data);

		return new Fuse(data, { keys, threshold: 0.4 }, index);
	}, [data, query]);

	return query && enabled && data?.length ? fuse.search(query) : [];
}
