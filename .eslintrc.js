module.exports = {
  root: true,
  extends: '@basis-theory/eslint-config/typescript',
  rules: {
    camelcase: [
      'error',
      {
        allow: [
          'expiration_month',
          'expiration_year',
          'snake_case',
          'total_items',
          'page_number',
          'page_size',
          'total_pages',
          'created_at',
          'modified_at',
          'created_by',
          'modified_by',
          'first_nested',
          'second_nested',
          'tenant_id',
          'session_key',
          'expires_at',
          'owner_id',
          'token_report',
          'metrics_by_type',
          'monthly_active_tokens',
          'included_monthly_active_tokens',
        ],
      },
    ],
  },
};
