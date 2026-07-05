import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { analyzePcap, ApiError } from '../services/api';
import type { AnalyzeResponse, BlockingRules } from '../types';

export function useAnalyze() {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation<AnalyzeResponse, ApiError, { file: File; rules: BlockingRules }>({
    mutationFn: ({ file, rules }) => {
      setProgress(0);
      return analyzePcap(file, rules, setProgress);
    },
  });

  return { ...mutation, progress };
}
