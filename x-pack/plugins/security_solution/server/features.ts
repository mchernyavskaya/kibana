/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';

import type { KibanaFeatureConfig } from '@kbn/features-plugin/common';
import { DEFAULT_APP_CATEGORIES } from '@kbn/core/server';
import { DATA_VIEW_SAVED_OBJECT_TYPE } from '@kbn/data-views-plugin/common';
import { createUICapabilities } from '@kbn/cases-plugin/common';

import { APP_ID, CASES_FEATURE_ID, SERVER_APP_ID } from '../common/constants';
import { savedObjectTypes } from './saved_objects';
import type { ConfigType } from './config';

export const getCasesKibanaFeature = (): KibanaFeatureConfig => {
  const casesCapabilities = createUICapabilities();

  return {
    id: CASES_FEATURE_ID,
    name: i18n.translate('xpack.securitySolution.featureRegistry.linkSecuritySolutionCaseTitle', {
      defaultMessage: 'Cases',
    }),
    order: 1100,
    category: DEFAULT_APP_CATEGORIES.security,
    app: [CASES_FEATURE_ID, 'kibana'],
    catalogue: [APP_ID],
    cases: [APP_ID],
    privileges: {
      all: {
        api: ['casesSuggestUserProfiles', 'bulkGetUserProfiles'],
        app: [CASES_FEATURE_ID, 'kibana'],
        catalogue: [APP_ID],
        cases: {
          create: [APP_ID],
          read: [APP_ID],
          update: [APP_ID],
          push: [APP_ID],
        },
        savedObject: {
          all: [],
          read: [],
        },
        ui: casesCapabilities.all,
      },
      read: {
        api: ['casesSuggestUserProfiles', 'bulkGetUserProfiles'],
        app: [CASES_FEATURE_ID, 'kibana'],
        catalogue: [APP_ID],
        cases: {
          read: [APP_ID],
        },
        savedObject: {
          all: [],
          read: [],
        },
        ui: casesCapabilities.read,
      },
    },
    subFeatures: [
      {
        name: i18n.translate('xpack.securitySolution.featureRegistry.deleteSubFeatureName', {
          defaultMessage: 'Delete',
        }),
        privilegeGroups: [
          {
            groupType: 'independent',
            privileges: [
              {
                api: [],
                id: 'cases_delete',
                name: i18n.translate(
                  'xpack.securitySolution.featureRegistry.deleteSubFeatureDetails',
                  {
                    defaultMessage: 'Delete cases and comments',
                  }
                ),
                includeIn: 'all',
                savedObject: {
                  all: [],
                  read: [],
                },
                cases: {
                  delete: [APP_ID],
                },
                ui: casesCapabilities.delete,
              },
            ],
          },
        ],
      },
    ],
  };
};

// Same as the plugin id defined by Cloud Security Posture
const CLOUD_POSTURE_APP_ID = 'csp';
// Same as the saved-object type for rules defined by Cloud Security Posture
const CLOUD_POSTURE_SAVED_OBJECT_RULE_TYPE = 'csp_rule';

export const getKibanaPrivilegesFeaturePrivileges = (
  ruleTypes: string[],
  experimentalFeatures: ConfigType['experimentalFeatures']
): KibanaFeatureConfig => ({
  id: SERVER_APP_ID,
  name: i18n.translate('xpack.securitySolution.featureRegistry.linkSecuritySolutionTitle', {
    defaultMessage: 'Security',
  }),
  order: 1100,
  category: DEFAULT_APP_CATEGORIES.security,
  app: [APP_ID, CLOUD_POSTURE_APP_ID, 'kibana'],
  catalogue: [APP_ID],
  management: {
    insightsAndAlerting: ['triggersActions'],
  },
  alerting: ruleTypes,
  privileges: {
    all: {
      app: [APP_ID, CLOUD_POSTURE_APP_ID, 'kibana'],
      catalogue: [APP_ID],
      api: [
        APP_ID,
        'lists-all',
        'lists-read',
        'lists-summary',
        'rac',
        'cloud-security-posture-all',
        'cloud-security-posture-read',
      ],
      savedObject: {
        all: [
          'alert',
          'exception-list',
          'exception-list-agnostic',
          DATA_VIEW_SAVED_OBJECT_TYPE,
          ...savedObjectTypes,
          CLOUD_POSTURE_SAVED_OBJECT_RULE_TYPE,
        ],
        read: [],
      },
      alerting: {
        rule: {
          all: ruleTypes,
        },
        alert: {
          all: ruleTypes,
        },
      },
      management: {
        insightsAndAlerting: ['triggersActions'],
      },
      ui: ['show', 'crud'],
    },
    read: {
      app: [APP_ID, CLOUD_POSTURE_APP_ID, 'kibana'],
      catalogue: [APP_ID],
      api: [APP_ID, 'lists-read', 'rac', 'cloud-security-posture-read'],
      savedObject: {
        all: [],
        read: [
          'exception-list',
          'exception-list-agnostic',
          DATA_VIEW_SAVED_OBJECT_TYPE,
          ...savedObjectTypes,
          CLOUD_POSTURE_SAVED_OBJECT_RULE_TYPE,
        ],
      },
      alerting: {
        rule: {
          read: ruleTypes,
        },
        alert: {
          all: ruleTypes,
        },
      },
      management: {
        insightsAndAlerting: ['triggersActions'],
      },
      ui: ['show'],
    },
  },
  subFeatures: experimentalFeatures.endpointRbacEnabled
    ? [
        {
          name: i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.endpointList', {
            defaultMessage: 'Endpoint List',
          }),
          privilegeGroups: [
            {
              groupType: 'mutually_exclusive',
              privileges: [
                {
                  api: [`${APP_ID}-writeEndpointList`, `${APP_ID}-readEndpointList`],
                  id: 'endpoint_list_all',
                  includeIn: 'all',
                  name: 'All',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['writeEndpointList', 'readEndpointList'],
                },
                {
                  api: [`${APP_ID}-readEndpointList`],
                  id: 'endpoint_list_read',
                  includeIn: 'read',
                  name: 'Read',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['readEndpointList'],
                },
              ],
            },
          ],
        },
        {
          name: i18n.translate(
            'xpack.securitySolution.featureRegistry.subFeatures.trustedApplications',
            {
              defaultMessage: 'Trusted Applications',
            }
          ),
          privilegeGroups: [
            {
              groupType: 'mutually_exclusive',
              privileges: [
                {
                  api: [`${APP_ID}-writeTrustedApplications`, `${APP_ID}-readTrustedApplications`],
                  id: 'trusted_applications_all',
                  includeIn: 'all',
                  name: 'All',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['writeTrustedApplications', 'readTrustedApplications'],
                },
                {
                  api: [`${APP_ID}-readTrustedApplications`],
                  id: 'trusted_applications_read',
                  includeIn: 'read',
                  name: 'Read',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['readTrustedApplications'],
                },
              ],
            },
          ],
        },
        {
          name: i18n.translate(
            'xpack.securitySolution.featureRegistry.subFeatures.hostIsolationExceptions',
            {
              defaultMessage: 'Host Isolation Exceptions',
            }
          ),
          privilegeGroups: [
            {
              groupType: 'mutually_exclusive',
              privileges: [
                {
                  api: [
                    `${APP_ID}-writeHostIsolationExceptions`,
                    `${APP_ID}-readHostIsolationExceptions`,
                  ],
                  id: 'host_isolation_exceptions_all',
                  includeIn: 'all',
                  name: 'All',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['writeHostIsolationExceptions', 'readHostIsolationExceptions'],
                },
                {
                  api: [`${APP_ID}-readHostIsolationExceptions`],
                  id: 'host_isolation_exceptions_read',
                  includeIn: 'read',
                  name: 'Read',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['readHostIsolationExceptions'],
                },
              ],
            },
          ],
        },
        {
          name: i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.blockList', {
            defaultMessage: 'Blocklist',
          }),
          privilegeGroups: [
            {
              groupType: 'mutually_exclusive',
              privileges: [
                {
                  api: [`${APP_ID}-writeBlocklist`, `${APP_ID}-readBlocklist`],
                  id: 'blocklist_all',
                  includeIn: 'all',
                  name: 'All',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['writeBlocklist', 'readBlocklist'],
                },
                {
                  api: [`${APP_ID}-readBlocklist`],
                  id: 'blocklist_read',
                  includeIn: 'read',
                  name: 'Read',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['readBlocklist'],
                },
              ],
            },
          ],
        },
        {
          name: i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.eventFilters', {
            defaultMessage: 'Event Filters',
          }),
          privilegeGroups: [
            {
              groupType: 'mutually_exclusive',
              privileges: [
                {
                  api: [`${APP_ID}-writeEventFilters`, `${APP_ID}-readEventFilters`],
                  id: 'event_filters_all',
                  includeIn: 'all',
                  name: 'All',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['writeEventFilters', 'readEventFilters'],
                },
                {
                  api: [`${APP_ID}-readEventFilters`],
                  id: 'event_filters_read',
                  includeIn: 'read',
                  name: 'Read',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['readEventFilters'],
                },
              ],
            },
          ],
        },
        {
          name: i18n.translate(
            'xpack.securitySolution.featureRegistry.subFeatures.policyManagement',
            {
              defaultMessage: 'Policy Management',
            }
          ),
          privilegeGroups: [
            {
              groupType: 'mutually_exclusive',
              privileges: [
                {
                  api: [`${APP_ID}-writePolicyManagement`, `${APP_ID}-readPolicyManagement`],
                  id: 'policy_management_all',
                  includeIn: 'all',
                  name: 'All',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['writePolicyManagement', 'readPolicyManagement'],
                },
                {
                  api: [`${APP_ID}-readPolicyManagement`],
                  id: 'policy_management_read',
                  includeIn: 'read',
                  name: 'Read',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['readPolicyManagement'],
                },
              ],
            },
          ],
        },
        {
          name: i18n.translate(
            'xpack.securitySolution.featureRegistry.subFeatures.actionsLogManagement',
            {
              defaultMessage: 'Actions Log Management',
            }
          ),
          privilegeGroups: [
            {
              groupType: 'mutually_exclusive',
              privileges: [
                {
                  api: [
                    `${APP_ID}-writeActionsLogManagement`,
                    `${APP_ID}-readActionsLogManagement`,
                  ],
                  id: 'actions_log_management_all',
                  includeIn: 'all',
                  name: 'All',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['writeActionsLogManagement', 'readActionsLogManagement'],
                },
                {
                  api: [`${APP_ID}-readActionsLogManagement`],
                  id: 'actions_log_management_read',
                  includeIn: 'read',
                  name: 'Read',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['readActionsLogManagement'],
                },
              ],
            },
          ],
        },
        {
          name: i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.hostIsolation', {
            defaultMessage: 'Host Isolation',
          }),
          privilegeGroups: [
            {
              groupType: 'mutually_exclusive',
              privileges: [
                {
                  api: [`${APP_ID}-writeHostIsolation`],
                  id: 'host_isolation_all',
                  includeIn: 'all',
                  name: 'All',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['writeHostIsolation'],
                },
              ],
            },
          ],
        },
        {
          name: i18n.translate(
            'xpack.securitySolution.featureRegistry.subFeatures.processOperations',
            {
              defaultMessage: 'Process Operations',
            }
          ),
          privilegeGroups: [
            {
              groupType: 'mutually_exclusive',
              privileges: [
                {
                  api: [`${APP_ID}-writeProcessOperations`],
                  id: 'process_operations_all',
                  includeIn: 'all',
                  name: 'All',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['writeProcessOperations'],
                },
              ],
            },
          ],
        },
        {
          name: i18n.translate('xpack.securitySolution.featureRegistr.subFeatures.fileOperations', {
            defaultMessage: 'File Operations',
          }),
          privilegeGroups: [
            {
              groupType: 'mutually_exclusive',
              privileges: [
                {
                  api: [`${APP_ID}-writeFileOperations`],
                  id: 'file_operations_all',
                  includeIn: 'all',
                  name: 'All',
                  savedObject: {
                    all: [],
                    read: [],
                  },
                  ui: ['writeFileOperations'],
                },
              ],
            },
          ],
        },
      ]
    : [],
});
