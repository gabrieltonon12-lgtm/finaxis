import type { Account } from '@/types/dre'

type AccountTemplate = Omit<Account, 'id' | 'company_id' | 'parent_id'> & { tempId: string; tempParentId?: string }

export const DEFAULT_ACCOUNTS: AccountTemplate[] = [
  // RECEITAS
  { tempId: 'r1', code: '3', name: 'RECEITA OPERACIONAL BRUTA', type: 'receita', order_index: 10 },
  { tempId: 'r1.1', code: '3.1', name: 'Venda de Produtos', type: 'receita', tempParentId: 'r1', order_index: 11 },
  { tempId: 'r1.2', code: '3.2', name: 'Prestação de Serviços', type: 'receita', tempParentId: 'r1', order_index: 12 },
  { tempId: 'r1.3', code: '3.3', name: 'Outras Receitas Operacionais', type: 'receita', tempParentId: 'r1', order_index: 13 },

  // DEDUÇÕES
  { tempId: 'd1', code: '4', name: 'DEDUÇÕES DA RECEITA', type: 'receita', order_index: 20 },
  { tempId: 'd1.1', code: '4.1', name: 'Impostos sobre Vendas (PIS/COFINS/ISS)', type: 'receita', tempParentId: 'd1', order_index: 21 },
  { tempId: 'd1.2', code: '4.2', name: 'Devoluções e Cancelamentos', type: 'receita', tempParentId: 'd1', order_index: 22 },

  // CMV/CPV
  { tempId: 'c1', code: '5', name: 'CMV / CPV', type: 'custo', order_index: 30 },
  { tempId: 'c1.1', code: '5.1', name: 'Custo de Mercadorias Vendidas', type: 'custo', tempParentId: 'c1', order_index: 31 },
  { tempId: 'c1.2', code: '5.2', name: 'Custo de Serviços Prestados', type: 'custo', tempParentId: 'c1', order_index: 32 },

  // DESPESAS OPERACIONAIS
  { tempId: 'op1', code: '6', name: 'DESPESAS OPERACIONAIS', type: 'despesa', order_index: 40 },
  { tempId: 'op1.1', code: '6.1', name: 'Despesas Comerciais', type: 'despesa', tempParentId: 'op1', order_index: 41 },
  { tempId: 'op1.1.1', code: '6.1.1', name: 'Comissões sobre Vendas', type: 'despesa', tempParentId: 'op1.1', order_index: 42 },
  { tempId: 'op1.1.2', code: '6.1.2', name: 'Marketing e Publicidade', type: 'despesa', tempParentId: 'op1.1', order_index: 43 },
  { tempId: 'op1.2', code: '6.2', name: 'Despesas Administrativas', type: 'despesa', tempParentId: 'op1', order_index: 44 },
  { tempId: 'op1.2.1', code: '6.2.1', name: 'Salários e Encargos', type: 'despesa', tempParentId: 'op1.2', order_index: 45 },
  { tempId: 'op1.2.2', code: '6.2.2', name: 'Aluguel e Condomínio', type: 'despesa', tempParentId: 'op1.2', order_index: 46 },
  { tempId: 'op1.2.3', code: '6.2.3', name: 'Serviços de Terceiros', type: 'despesa', tempParentId: 'op1.2', order_index: 47 },
  { tempId: 'op1.2.4', code: '6.2.4', name: 'Utilidades (energia, água, internet)', type: 'despesa', tempParentId: 'op1.2', order_index: 48 },
  { tempId: 'op1.3', code: '6.3', name: 'Outras Despesas', type: 'despesa', tempParentId: 'op1', order_index: 49 },

  // RESULTADO FINANCEIRO
  { tempId: 'rf1', code: '7', name: 'RESULTADO FINANCEIRO', type: 'despesa', order_index: 50 },
  { tempId: 'rf1.1', code: '7.1', name: 'Receitas Financeiras', type: 'receita', tempParentId: 'rf1', order_index: 51 },
  { tempId: 'rf1.2', code: '7.2', name: 'Despesas Financeiras', type: 'despesa', tempParentId: 'rf1', order_index: 52 },
  { tempId: 'rf1.3', code: '7.3', name: 'Variação Cambial', type: 'despesa', tempParentId: 'rf1', order_index: 53 },

  // IR e CSLL
  { tempId: 'ir1', code: '8', name: 'IR e CSLL', type: 'despesa', order_index: 60 },
  { tempId: 'ir1.1', code: '8.1', name: 'Imposto de Renda', type: 'despesa', tempParentId: 'ir1', order_index: 61 },
  { tempId: 'ir1.2', code: '8.2', name: 'Contribuição Social sobre Lucro Líquido', type: 'despesa', tempParentId: 'ir1', order_index: 62 },

  // ATIVO
  { tempId: 'a1', code: '1', name: 'ATIVO', type: 'ativo', order_index: 100 },
  { tempId: 'a1.1', code: '1.1', name: 'ATIVO CIRCULANTE', type: 'ativo', tempParentId: 'a1', order_index: 101 },
  { tempId: 'a1.1.1', code: '1.1.1', name: 'Caixa e Equivalentes', type: 'ativo', tempParentId: 'a1.1', order_index: 102 },
  { tempId: 'a1.1.2', code: '1.1.2', name: 'Contas a Receber', type: 'ativo', tempParentId: 'a1.1', order_index: 103 },
  { tempId: 'a1.1.3', code: '1.1.3', name: 'Estoques', type: 'ativo', tempParentId: 'a1.1', order_index: 104 },
  { tempId: 'a1.2', code: '1.2', name: 'ATIVO NÃO CIRCULANTE', type: 'ativo', tempParentId: 'a1', order_index: 105 },
  { tempId: 'a1.2.1', code: '1.2.1', name: 'Imobilizado', type: 'ativo', tempParentId: 'a1.2', order_index: 106 },
  { tempId: 'a1.2.2', code: '1.2.2', name: 'Intangível', type: 'ativo', tempParentId: 'a1.2', order_index: 107 },

  // PASSIVO
  { tempId: 'p1', code: '2', name: 'PASSIVO', type: 'passivo', order_index: 200 },
  { tempId: 'p1.1', code: '2.1', name: 'PASSIVO CIRCULANTE', type: 'passivo', tempParentId: 'p1', order_index: 201 },
  { tempId: 'p1.1.1', code: '2.1.1', name: 'Fornecedores', type: 'passivo', tempParentId: 'p1.1', order_index: 202 },
  { tempId: 'p1.1.2', code: '2.1.2', name: 'Obrigações Fiscais', type: 'passivo', tempParentId: 'p1.1', order_index: 203 },
  { tempId: 'p1.1.3', code: '2.1.3', name: 'Obrigações Trabalhistas', type: 'passivo', tempParentId: 'p1.1', order_index: 204 },
  { tempId: 'p1.2', code: '2.2', name: 'PASSIVO NÃO CIRCULANTE', type: 'passivo', tempParentId: 'p1', order_index: 205 },
  { tempId: 'p1.2.1', code: '2.2.1', name: 'Empréstimos e Financiamentos', type: 'passivo', tempParentId: 'p1.2', order_index: 206 },

  // PATRIMÔNIO LÍQUIDO
  { tempId: 'pl1', code: '2.3', name: 'PATRIMÔNIO LÍQUIDO', type: 'pl', tempParentId: 'p1', order_index: 210 },
  { tempId: 'pl1.1', code: '2.3.1', name: 'Capital Social', type: 'pl', tempParentId: 'pl1', order_index: 211 },
  { tempId: 'pl1.2', code: '2.3.2', name: 'Reservas de Lucros', type: 'pl', tempParentId: 'pl1', order_index: 212 },
  { tempId: 'pl1.3', code: '2.3.3', name: 'Lucros/Prejuízos Acumulados', type: 'pl', tempParentId: 'pl1', order_index: 213 },
]
