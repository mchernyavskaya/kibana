/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiButton } from '@elastic/eui';
import type { FunctionComponent } from 'react';
import React from 'react';
import { useBehaviorSubject } from '../../use_behavior_subject';
import { useFilePickerContext } from '../context';
import { i18nTexts } from '../i18n_texts';

export interface Props {
  onClick: (selectedFiles: string[]) => void;
}

export const SelectButton: FunctionComponent<Props> = ({ onClick }) => {
  const { state } = useFilePickerContext();
  const selectedFiles = useBehaviorSubject(state.selectedFileIds$);
  return (
    <EuiButton
      data-test-subj="selectButton"
      disabled={!state.hasFilesSelected()}
      onClick={() => onClick(selectedFiles)}
    >
      {selectedFiles.length > 1
        ? i18nTexts.selectFilesLabel(selectedFiles.length)
        : i18nTexts.selectFileLabel}
    </EuiButton>
  );
};
