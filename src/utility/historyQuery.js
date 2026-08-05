import {
	getDocumentFilterAllTime,
	getDocumentFilterMonth,
	getDocumentFilterToday,
	getDocumentFilterYesterday
} from './queries';

export default [
	{
		field: 'all_time',
		queryFn: getDocumentFilterAllTime
	},
	{
		field: 'today',
		queryFn: getDocumentFilterToday
	},
	{
		field: 'yesterday',
		queryFn: getDocumentFilterYesterday
	},
	{
		field: 'this_month',
		queryFn: getDocumentFilterMonth
	}
];
