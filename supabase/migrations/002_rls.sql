-- Enable RLS em todas as tabelas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE dre_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE balancete_entries ENABLE ROW LEVEL SECURITY;

-- Companies: owner acessa apenas suas empresas
CREATE POLICY "owner_companies" ON companies
  FOR ALL USING (owner_id = auth.uid());

-- Periods: acessa períodos das suas empresas
CREATE POLICY "owner_periods" ON periods
  FOR ALL USING (
    company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
  );

-- Accounts: acessa contas das suas empresas
CREATE POLICY "owner_accounts" ON accounts
  FOR ALL USING (
    company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
  );

-- DRE entries: acessa lançamentos das suas empresas
CREATE POLICY "owner_dre_entries" ON dre_entries
  FOR ALL USING (
    company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
  );

-- Balancete entries: acessa lançamentos das suas empresas
CREATE POLICY "owner_balancete_entries" ON balancete_entries
  FOR ALL USING (
    company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
  );
