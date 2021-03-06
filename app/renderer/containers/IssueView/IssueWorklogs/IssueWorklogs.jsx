// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Id,
  Issue,
  Worklog,
  Dispatch,
} from 'types';

import {
  Flex,
  AutosizableList as List,
} from 'components';
import {
  uiActions,
  screenshotsActions,
} from 'actions';
import {
  noIssuesImage,
} from 'utils/data/assets';
import {
  H600,
} from 'styles/typography';
import {
  getSelectedIssueWorklogs,
  getSelectedIssue,
  getUiState,
  getBaseUrl,
} from 'selectors';

import WorklogItem from './WorklogItem';


type Props = {
  worklogs: Array<Worklog>,
  issue: Issue,
  selectedWorklogId: Id | null,
  scrollToIndex: number,
  baseUrl: string,
  dispatch: Dispatch,
};

const IssueWorklogs: StatelessFunctionalComponent<Props> = ({
  worklogs,
  issue,
  selectedWorklogId,
  scrollToIndex,
  dispatch,
  baseUrl,
}: Props): Node => (
  <Flex column style={{ flexGrow: 1 }}>
    <Flex column style={{ flexGrow: 1 }}>
      <List
        autoSized
        noRowsRenderer={
          () => (
            <Flex row justifyCenter>
              <Flex column alignCenter justifyCenter>
                <img src={noIssuesImage} alt="not found" width="100px" />
                <H600>
                  No work logged for this issue
                </H600>
              </Flex>
            </Flex>
          )}
        listProps={{
          rowCount: worklogs.length,
          rowHeight: 120,
          rowRenderer: ({ index, key, style }: { index: number, key: string, style: any }) => {
            const worklog = worklogs[index];
            return (
              <WorklogItem
                style={style}
                key={key}
                worklog={worklog}
                selected={selectedWorklogId === worklog.id}
                issueKey={issue.key}
                baseUrl={baseUrl}
                showScreenshotsViewer={() => {
                  dispatch(screenshotsActions.showScreenshotsViewerWindow({
                    issueId: issue.id,
                    worklogId: worklog.id,
                  }));
                }}
                onEditWorklog={() => {
                  dispatch(uiActions.setUiState({
                    editWorklogId: worklog.id,
                    worklogFormIssueId: issue.id,
                    modalState: {
                      _merge: true,
                      worklog: true,
                    },
                  }));
                }}
                onDeleteWorklog={() => {
                  dispatch(uiActions.setUiState({
                    deleteWorklogId: worklog.id,
                    modalState: {
                      _merge: true,
                      confirmDeleteWorklog: true,
                    },
                  }));
                }}
              />
            );
          },
          noRowsRenderer:
            () => (
              <Flex row justifyCenter>
                <Flex column alignCenter justifyCenter>
                  <img src={noIssuesImage} alt="not found" width="100px" />
                  <H600>
                    No work logged for this issue
                  </H600>
                </Flex>
              </Flex>
            ),
          scrollToIndex,
        }}
      />
    </Flex>
  </Flex>
);

function mapStateToProps(state) {
  return {
    worklogs: getSelectedIssueWorklogs(state),
    issue: getSelectedIssue(state),
    baseUrl: getBaseUrl(state),
    selectedWorklogId: getUiState('selectedWorklogId')(state),
    scrollToIndex: getUiState('issueViewWorklogsScrollToIndex')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(IssueWorklogs);
