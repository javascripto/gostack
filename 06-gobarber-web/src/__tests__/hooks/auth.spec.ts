/* eslint-disable @typescript-eslint/camelcase */
import TestRenderer from 'react-test-renderer';

import MockAdapter from 'axios-mock-adapter';
import { renderHook } from '@testing-library/react-hooks';

import api from '../../services/api';
import { AuthProvider, useAuth } from '../../hooks/auth';

const { act } = TestRenderer;

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    apiMock.onPost('/sessions').reply(200, {
      user: {
        email: 'johndoe@example.com',
      },
      token: 'token-123',
    });

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johndoe@example.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(result.current.user.email).toBe('johndoe@example.com');
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify({ email: 'johndoe@example.com' }),
    );
    expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:token', 'token-123');
  });

  it('should restore saved data from storage when authinits', () => {
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation((key: string): string | null => {
        if (key === '@GoBarber:token') return 'token-123';
        if (key === '@GoBarber:user')
          return JSON.stringify({ email: 'johndoe@example.com' });
        return null;
      });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string):
      | string
      | null => {
      if (key === '@GoBarber:token') return 'token-123';
      if (key === '@GoBarber:user')
        return JSON.stringify({ email: 'johndoe@example.com' });
      return null;
    });
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(result.current.user).toBeUndefined();
    expect(removeItemSpy).toHaveBeenCalledTimes(2);
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      email: 'johndoe@example.com',
      name: '',
      id: '',
      avatar: '',
      avatar_url: '',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );
    expect(result.current.user).toEqual(user);
  });
});
