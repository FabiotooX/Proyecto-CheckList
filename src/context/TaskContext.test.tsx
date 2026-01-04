import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { TaskProvider, useTask } from './TaskContext';
import React from 'react';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Wrapper for Provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TaskProvider>{children}</TaskProvider>
);

describe('TaskContext', () => {
    beforeEach(() => {
        localStorage.clear();
        // Reset uuid mock if we were using one, but crypto.randomUUID needs to be available
        // JSDOM might not have crypto.randomUUID, let's mock it
        Object.defineProperty(globalThis, 'crypto', {
            value: {
                randomUUID: () => Math.random().toString(36).substring(7)
            }
        });
    });

    it('should initialize with empty tasks', () => {
        const { result } = renderHook(() => useTask(), { wrapper });
        expect(result.current.items).toEqual([]);
        expect(result.current.count).toBe(0);
        expect(result.current.total).toBe(0);
    });

    it('should add a new task', () => {
        const { result } = renderHook(() => useTask(), { wrapper });

        act(() => {
            result.current.add({
                title: 'Test Task',
                description: 'Description',
                priority: 'Media',
                category: 'Personal'
            });
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].title).toBe('Test Task');
        expect(result.current.total).toBe(1);
    });

    it('should toggle task completion', () => {
        const { result } = renderHook(() => useTask(), { wrapper });

        act(() => {
            result.current.add({
                title: 'Task to Complete',
                description: '',
                priority: 'Baja',
                category: 'Hogar'
            });
        });

        const taskId = result.current.items[0].id;

        act(() => {
            result.current.toggleComplete(taskId);
        });

        expect(result.current.items[0].completed).toBe(true);
        expect(result.current.count).toBe(1); // Completed count
        expect(result.current.pendingCount).toBe(0);
    });

    it('should remove a task', () => {
        const { result } = renderHook(() => useTask(), { wrapper });

        act(() => {
            result.current.add({ title: 'Task 1', description: '', priority: 'Alta', category: 'Trabajo' });
        });

        const taskId = result.current.items[0].id;

        act(() => {
            result.current.remove(taskId);
        });

        expect(result.current.items).toHaveLength(0);
        expect(result.current.total).toBe(0);
    });
});
