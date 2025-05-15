/* eslint-disable @typescript-eslint/no-unused-expressions */
import type { AtomEffect } from "recoil";
import { atom } from "recoil";

import { randomString } from "@/helpers";

const store = typeof window !== "undefined" ? window.localStorage : null;

const defaultOrder = randomString();

export const localStorageEffect: (key: string) => AtomEffect<any> =
  (key) =>
  ({ setSelf, onSet }) => {
    try {
      if (store) {
        const savedValue = store.getItem(key);
        if (savedValue != null) {
          setSelf(JSON.parse(savedValue));
        }

        onSet((newValue, _, isReset) => {
          isReset
            ? store.removeItem(key)
            : store.setItem(key, JSON.stringify(newValue));
        });
      }
    } catch (e) {
      if (store) {
        store.removeItem(key);
      }
    }
  };

export const sessionStorageEffect: (key: string) => AtomEffect<any> =
  (key) =>
  ({ setSelf, onSet }) => {
    try {
      const store = window.sessionStorage;

      const savedValue = store.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }

      onSet((newValue, _, isReset) => {
        if (isReset) {
          store.removeItem(key);
        } else {
          store.setItem(key, JSON.stringify(newValue));
        }
      });
    } catch (e) {
      console.error(
        `Error interacting with sessionStorage for key "${key}":`,
        e
      );
    }
  };

export const profileState = atom<any>({
  key: "PROFILE_STATE",
  default: {
    data: null,
    isLoading: false,
    refetch: null,
  },
});

export const posRouterState = atom<any>({
  key: "POS_STATE",
  default: false,
});

export const provinceState = atom<any>({
  key: "PROVINCE_STATE",
  default: null,
});

export const notificationState = atom<any>({
  key: "NOTIFICATION_STATE",
  default: {
    total: null,
    invitation: null,
    expiration: null,
  },
});

export const branchStateSession = atom<any>({
  key: "BRANCH_STATE",
  default: null,
  effects: [sessionStorageEffect("BRANCH_STATE")],
});

export const orderActiveState = atom<string | "">({
  key: "ORDER_ACTIVE_STATE",
  default: defaultOrder,
  effects: [localStorageEffect("ORDER_ACTIVE_STATE")],
});

export const searchState = atom<string | "">({
  key: "SEARCH_STATE",
  default: "",
});

export const selectedColumnsState = atom<string[]>({
  key: "SELECTED_COLUMNS_STATE",
  default: [],
  effects_UNSTABLE: [sessionStorageEffect("SELECTED_COLUMNS_STATE")],
});
