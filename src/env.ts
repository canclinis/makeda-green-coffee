import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  ARUBA_SMTP_PASSWORD: {
    schema: (value) => value || undefined
  },
  ADMIN_EMAILS: {
    schema: (value) => value || undefined
  },
  DEV_ADMIN_BYPASS: {
    schema: (value) => value || undefined
  },
  AUTH_SECRET: {
    schema: (value) => value || undefined
  },
  BLOB_READ_WRITE_TOKEN: {
    schema: (value) => value || undefined
  }
});
