// @flow
import { createSelector } from 'reselect';
import moment from 'moment';
import groupBy from 'lodash.groupby';
import filter from 'lodash.filter';

import { getUserData } from './profile';

import type {
  IssuesState,
  IssueFilters,
  IssuesMap,
  IssueTypesMap,
  IssueStatusesMap,
  Issue,
  IssueTransition,
  Id,
} from '../types';

export const getIssuesIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.allIds;

export const getIssuesMap =
  ({ issues }: { issues: IssuesState }): IssuesMap => issues.byId;

export const getAllIssues = createSelector(
  [getIssuesIds, getIssuesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getIssueTypesIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.issueTypesIds;

export const getIssueTypesMap =
  ({ issues }: { issues: IssuesState }): IssueTypesMap => issues.issueTypesById;

export const getIssueStatusesIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.issueStatusesIds;

export const getIssueStatusesMap =
  ({ issues }: { issues: IssuesState }): IssueStatusesMap => issues.issueStatusesById;

export const getFoundIssueIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.foundIds;

export const getIssueTypes = createSelector(
  [getIssueTypesIds, getIssueTypesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getIssueStatuses = createSelector(
  [getIssueStatusesIds, getIssueStatusesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getSidebarIssues = createSelector(
  [getAllIssues, getFoundIssueIds, getIssuesMap],
  (allItems, foundIds, map) => {
    if (foundIds.length > 0) {
      return foundIds.map(id => map[id]);
    }
    return allItems;
  },
);

export const getRecentIssueIds =
  ({ issues }: { issues: IssuesState }): Array<Id> => issues.recentIds;

export const getRecentIssuesTotalCount = createSelector(
  [getRecentIssueIds],
  (ids) => ids.length,
);

export const getRecentIssues = createSelector(
  [getRecentIssueIds, getIssuesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getRecentItems = createSelector(
  [getRecentIssues, getIssuesMap, getUserData],
  (map, iMap, self) => {
    const selfKey = self ? self.key : '';
    const recentWorklogs =
      map
        .reduce((worklogs, value) => worklogs.concat(value.fields.worklog.worklogs), []);
    const _recentWorklogs = recentWorklogs.map(w => {
      const _w = w;
      _w.issue = iMap[_w.issueId];
      return _w;
    });
    const recentWorklogsFiltered =
      filter(
        _recentWorklogs,
        (w) =>
          moment(w.started).isSameOrAfter(moment().subtract(4, 'weeks')) &&
          w.author.key === selfKey,
      );
    const grouped =
      groupBy(recentWorklogsFiltered, (value) => moment(value.started).startOf('day').format());
    return grouped;
  },
);

export const getIssuesFetching =
  ({ issues }: { issues: IssuesState }): boolean => issues.meta.fetching;

export const getRecentIssuesFetching =
  ({ issues }: { issues: IssuesState }): boolean => issues.meta.recentFetching;

export const getIssuesSearching =
  ({ issues }: { issues: IssuesState }): boolean => issues.meta.searching;

export const getIssuesTotalCount =
  ({ issues }: { issues: IssuesState }): number => (issues.meta.totalCount > 0
    ? issues.meta.totalCount
    : 0);

export const getSelectedIssueId =
  ({ issues }: { issues: IssuesState }): Id | null => issues.meta.selectedIssueId;

export const getTrackingIssueId =
  ({ issues }: { issues: IssuesState }): Id | null => issues.meta.trackingIssueId;

export const getIssuesSearchValue =
  ({ issues }: { issues: IssuesState }): string => issues.meta.searchValue;

export const getSelectedIssue =
  ({ issues }: { issues: IssuesState }): Issue | null => issues.meta.selectedIssue;

export const getTrackingIssue =
  ({ issues }: { issues: IssuesState }): Issue | null => issues.meta.trackingIssue;

export const getIssueFilters =
  ({ issues }: { issues: IssuesState }): IssueFilters => issues.meta.filters;

export const getFiltersApplied = createSelector(
  [getIssueFilters],
  (filters) => (!!filters.type.length || !!filters.status.length || !!filters.assignee.length),
);

export const getAvailableTransitions =
  ({ issues }: { issues: IssuesState }): Array<IssueTransition> => issues.meta.availableTransitions;

export const getAvailableTransitionsFetching =
  ({ issues }: { issues: IssuesState }): boolean => issues.meta.availableTransitionsFetching;
