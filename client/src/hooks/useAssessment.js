import { useState, useCallback } from 'react';
import api from '../utils/api';

const STORAGE_KEY = 'Health Vector_assessment_draft';

export const useAssessment = () => {
  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const draft = loadDraft();

  const [currentIndex, setCurrentIndex] = useState(draft?.currentIndex || 0);
  const [wellnessResponses, setWellnessResponses] = useState(draft?.wellnessResponses || []);
  const [prakritiResponses, setPrakritiResponses] = useState(draft?.prakritiResponses || []);
  const [section, setSection] = useState(draft?.section || 'wellness'); // 'wellness' | 'prakriti' | 'done'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const save = useCallback((state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, []);

  const answerWellness = useCallback((questionId, answer) => {
    setWellnessResponses((prev) => {
      const filtered = prev.filter((r) => r.questionId !== questionId);
      const updated = [...filtered, { questionId, answer }];
      save({ wellnessResponses: updated, prakritiResponses, currentIndex, section });
      return updated;
    });
  }, [prakritiResponses, currentIndex, section, save]);

  const answerPrakriti = useCallback((questionId, answer) => {
    setPrakritiResponses((prev) => {
      const filtered = prev.filter((r) => r.questionId !== questionId);
      const updated = [...filtered, { questionId, answer }];
      save({ wellnessResponses, prakritiResponses: updated, currentIndex, section });
      return updated;
    });
  }, [wellnessResponses, currentIndex, section, save]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => {
      const next = i + 1;
      save({ wellnessResponses, prakritiResponses, currentIndex: next, section });
      return next;
    });
  }, [wellnessResponses, prakritiResponses, section, save]);

  const goBack = useCallback(() => {
    setCurrentIndex((i) => {
      const prev = Math.max(0, i - 1);
      save({ wellnessResponses, prakritiResponses, currentIndex: prev, section });
      return prev;
    });
  }, [wellnessResponses, prakritiResponses, section, save]);

  const startPrakriti = useCallback(() => {
    setSection('prakriti');
    setCurrentIndex(0);
    save({ wellnessResponses, prakritiResponses, currentIndex: 0, section: 'prakriti' });
  }, [wellnessResponses, prakritiResponses, save]);

  const submit = useCallback(async (skipPrakriti = false) => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await api.post('/assessment/submit', {
        wellnessResponses,
        prakritiResponses: skipPrakriti ? [] : prakritiResponses,
        skippedPrakriti: skipPrakriti,
      });
      localStorage.removeItem(STORAGE_KEY);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assessment');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [wellnessResponses, prakritiResponses]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setWellnessResponses([]);
    setPrakritiResponses([]);
    setSection('wellness');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getWellnessAnswer = (questionId) => {
    return wellnessResponses.find((r) => r.questionId === questionId)?.answer || null;
  };

  const getPrakritiAnswer = (questionId) => {
    return prakritiResponses.find((r) => r.questionId === questionId)?.answer || null;
  };

  return {
    currentIndex, section,
    wellnessResponses, prakritiResponses,
    submitting, error,
    answerWellness, answerPrakriti,
    getWellnessAnswer, getPrakritiAnswer,
    goNext, goBack, startPrakriti, submit, reset,
    wellnessProgress: Math.round((wellnessResponses.length / 25) * 100),
  };
};
