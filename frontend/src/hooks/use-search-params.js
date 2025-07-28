import React from 'react';
import { useSearchParams as useNextSearchParams } from 'react-router-dom';

export default function useSearchParams() {
  const [searchParams, setSearchParams] = useNextSearchParams();

  const getCurrentParams = React.useCallback((currentParams) => {
    const params = {};
    for (const [key, value] of currentParams) {
      params[key] = value;
    }
    return params;
  }, []);

  const setParams = React.useCallback(
    (key, value, options) =>
      setSearchParams(
        (currentParams) => ({
          ...getCurrentParams(currentParams.entries()),
          [key]: value,
        }),
        options
      ),
    [setSearchParams, getCurrentParams]
  );

  const setMultipleParams = React.useCallback(
    (params, options) => {
      setSearchParams((currentParams) => {
        const newParams = Object.entries(params).reduce(
          (acc, item) => ({
            ...acc,
            [item[0]]: item[1].toString(),
          }),
          {}
        );
        return { ...getCurrentParams(currentParams.entries()), ...newParams };
      }, options);
    },
    [setSearchParams, getCurrentParams]
  );

  const removeParam = React.useCallback(
    (name, options) => {
      setSearchParams((prevParams) => {
        const newParams = {};
        prevParams.forEach((value, key) => {
          if (key !== name) newParams[key] = value;
        });

        return newParams;
      }, options);
    },
    [setSearchParams]
  );

  const removeParams = React.useCallback(
    (keys, options) => {
      setSearchParams((prevParams) => {
        const newParams = {};
        prevParams.forEach((value, key) => {
          if (!keys.includes(key)) newParams[key] = value;
        });

        return newParams;
      }, options);
    },
    [setSearchParams]
  );

  const result = React.useMemo(() => {
    return {
      get: (item) => searchParams.get(item),
      set: setParams,
      update: setMultipleParams,
      remove: removeParam,
      delete: removeParams,
    };
  }, [searchParams, setMultipleParams, setParams, removeParam, removeParams]);

  return result;
}
