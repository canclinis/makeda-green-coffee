import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  ARUBA_SMTP_PASSWORD: {
    schema: (value) => value || undefined
  }
});
