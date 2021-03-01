import i18n from '@kmwork/front-core/lib/common/utils/i18n-utils';

import moduleName from './module-name';

export const NAMESPACE = `feature-${moduleName}`;

function i18nWrapper(key, ...other) {
  const namespaceFinal = key.indexOf(':') < 0
    ? `${NAMESPACE}:`
    : '';

  return i18n(`${namespaceFinal}${key}`, ...other);
}

export default i18nWrapper;
