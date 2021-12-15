enum DataClassification {
  GENERAL = 'general',
  BANK = 'bank',
  PCI = 'pci',
  PII = 'pii',
}

enum DataImpact {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
}

enum DataRestrictionPolicy {
  MASK = 'mask',
  REDACT = 'redact',
}

export { DataClassification, DataImpact, DataRestrictionPolicy };
