-- Empresas
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT,
  owner_id UUID REFERENCES auth.users(id),
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Períodos contábeis
CREATE TABLE periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  year INT NOT NULL,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, year, month)
);

-- Contas do plano de contas
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('receita', 'custo', 'despesa', 'ativo', 'passivo', 'pl')),
  parent_id UUID REFERENCES accounts(id),
  order_index INT DEFAULT 0
);

-- Lançamentos do DRE
CREATE TABLE dre_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  period_id UUID REFERENCES periods(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id),
  value NUMERIC(15, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lançamentos do Balancete
CREATE TABLE balancete_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  period_id UUID REFERENCES periods(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id),
  debit NUMERIC(15, 2) DEFAULT 0,
  credit NUMERIC(15, 2) DEFAULT 0,
  balance NUMERIC(15, 2) GENERATED ALWAYS AS (debit - credit) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
