import { describe, it, expect } from 'vitest';
import { filterCourses } from '../../components/demo/screens/admin/AdminCourses';
import { filterLearners } from '../../components/demo/screens/admin/AdminLearners';
import { ALL_COURSES, ALL_LEARNERS } from '../../components/demo/mock-data';

describe('filterCourses', () => {
  it('returns all courses when search is empty and tab is All', () => {
    expect(filterCourses(ALL_COURSES, '', 'All')).toHaveLength(ALL_COURSES.length);
  });

  it('filters by title (case-insensitive)', () => {
    const result = filterCourses(ALL_COURSES, 'excel', 'All');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Excel for HR');
  });

  it('filters by status tab', () => {
    const drafts = filterCourses(ALL_COURSES, '', 'Draft');
    expect(drafts.every(c => c.status === 'Draft')).toBe(true);
  });

  it('combines search and tab filter', () => {
    const result = filterCourses(ALL_COURSES, 'onboarding', 'Active');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Onboarding 2024');
  });

  it('returns empty when no match', () => {
    expect(filterCourses(ALL_COURSES, 'zzznomatch', 'All')).toHaveLength(0);
  });
});

describe('filterLearners', () => {
  it('returns all when search is empty', () => {
    expect(filterLearners(ALL_LEARNERS, '')).toHaveLength(ALL_LEARNERS.length);
  });

  it('filters by name case-insensitive', () => {
    const result = filterLearners(ALL_LEARNERS, 'anna');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Anna Kowalska');
  });

  it('filters by email', () => {
    const result = filterLearners(ALL_LEARNERS, 'j.porter');
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('j.porter@corp.com');
  });

  it('returns empty when no match', () => {
    expect(filterLearners(ALL_LEARNERS, 'zzznobody')).toHaveLength(0);
  });
});
