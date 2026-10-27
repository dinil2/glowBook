export interface PlatformBankSettings {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  bankCode: string;
  branchCode: string;
  instructions: string;
  approvalSlaText: string;
}

export const DEFAULT_PLATFORM_BANK_SETTINGS: PlatformBankSettings = {
  bankName: 'Hatton National Bank (HNB)',
  accountName: 'Glowbook LK Technologies (Pvt) Ltd',
  accountNumber: 'SAMPLE-0089-XXXX-4812',
  branch: 'Colombo 03 Corporate Branch',
  bankCode: '7083',
  branchCode: '089',
  instructions:
    'Transfer the exact subscription amount via HNB digital banking, online banking, or counter deposit. Enter your Salon Billing Code in the transfer reference/remarks field.',
  approvalSlaText: "We're checking your payment. Usually approved within 24 hours.",
};

export const DEFAULT_BANK_DETAILS = {
  bank_name: DEFAULT_PLATFORM_BANK_SETTINGS.bankName,
  account_name: DEFAULT_PLATFORM_BANK_SETTINGS.accountName,
  account_number: DEFAULT_PLATFORM_BANK_SETTINGS.accountNumber,
  branch: DEFAULT_PLATFORM_BANK_SETTINGS.branch,
  instructions: DEFAULT_PLATFORM_BANK_SETTINGS.instructions,
  approval_sla_text: DEFAULT_PLATFORM_BANK_SETTINGS.approvalSlaText,
};

