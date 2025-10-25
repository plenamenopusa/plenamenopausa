# Configuração do Cloudflare para Plena Menopausa

Este guia detalha como configurar o Cloudflare D1 para armazenar os dados das leads capturadas na landing page.

## 📋 Pré-requisitos

- Conta no Cloudflare (gratuita)
- Acesso ao dashboard do Cloudflare
- Repositório da landing page no GitHub

## 🚀 Passo a Passo

### 1. Criar Conta no Cloudflare

1. Acesse [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Crie uma conta gratuita
3. Verifique seu email se necessário

### 2. Configurar Banco de Dados D1

1. **Acesse o Dashboard**
   - Faça login no Cloudflare
   - Vá para "Workers & Pages" no menu lateral

2. **Criar Novo Banco**
   - Clique em "D1 SQL Database"
   - Clique em "Create database"
   - Nome: `plena-menopausa-db`
   - Clique em "Create"

3. **Criar Tabela**
   - Clique no banco criado
   - Vá para a aba "Console"
   - Execute o SQL abaixo:

```sql
CREATE TABLE leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    data_nascimento TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    data_cadastro TEXT NOT NULL
);
```

### 3. Obter Credenciais

#### Account ID
1. Vá para "My Profile" (ícone do usuário no canto superior direito)
2. Role até "API Tokens"
3. Copie o "Account ID" (formato: `1234567890abcdef`)

#### Database ID
1. Volte para "Workers & Pages" > "D1 SQL Database"
2. Clique no seu banco de dados
3. Na URL, copie o ID após `/database/` (formato: `abc123def456`)

#### API Token
1. Em "My Profile" > "API Tokens"
2. Clique em "Create Token"
3. Use o template "Custom token"
4. Configure:
   - **Token name**: `Plena Menopausa D1`
   - **Permissions**: 
     - `Account:Cloudflare D1:Edit`
   - **Account Resources**: `Include - All accounts`
5. Clique em "Continue to summary" > "Create Token"
6. **IMPORTANTE**: Copie o token imediatamente (não será mostrado novamente)

### 4. Configurar no Código

1. **Edite o arquivo `script.js`**
2. **Substitua as constantes**:

```javascript
// Substitua pelos seus valores reais
const CLOUDFLARE_API_URL = 'https://api.cloudflare.com/client/v4/accounts/SEU_ACCOUNT_ID/d1/database/SEU_DATABASE_ID/execute';
const CLOUDFLARE_API_TOKEN = 'SEU_API_TOKEN_AQUI';
```

**Exemplo real**:
```javascript
const CLOUDFLARE_API_URL = 'https://api.cloudflare.com/client/v4/accounts/1234567890abcdef/d1/database/abc123def456/execute';
const CLOUDFLARE_API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 5. Testar a Configuração

1. **Faça commit das alterações**:
```bash
git add script.js
git commit -m "Configure Cloudflare integration"
git push
```

2. **Teste o formulário**:
   - Acesse sua landing page
   - Preencha o formulário
   - Verifique se os dados aparecem no Cloudflare

3. **Verificar no Cloudflare**:
   - Vá para seu banco D1
   - Na aba "Console", execute:
   ```sql
   SELECT * FROM leads ORDER BY data_cadastro DESC LIMIT 10;
   ```

## 🔍 Monitoramento dos Dados

### Queries Úteis

```sql
-- Ver todas as leads
SELECT * FROM leads ORDER BY data_cadastro DESC;

-- Contar total de leads
SELECT COUNT(*) as total_leads FROM leads;

-- Leads por dia
SELECT 
    DATE(data_cadastro) as dia,
    COUNT(*) as total
FROM leads 
GROUP BY DATE(data_cadastro)
ORDER BY dia DESC;

-- Leads por mês
SELECT 
    strftime('%Y-%m', data_cadastro) as mes,
    COUNT(*) as total
FROM leads 
GROUP BY strftime('%Y-%m', data_cadastro)
ORDER BY mes DESC;

-- Exportar dados (CSV)
SELECT 
    nome,
    data_nascimento,
    email,
    whatsapp,
    data_cadastro
FROM leads 
ORDER BY data_cadastro DESC;
```

### Dashboard Personalizado

Você pode criar um dashboard simples usando:

1. **Google Sheets**: Conecte via API
2. **Airtable**: Importe os dados
3. **Zapier**: Automatize notificações
4. **Webhook**: Envie dados para outros serviços

## 🛠️ Troubleshooting

### Erro 401 (Unauthorized)
- Verifique se o API Token está correto
- Confirme se o token tem permissões D1:Edit

### Erro 404 (Not Found)
- Verifique se o Account ID está correto
- Confirme se o Database ID está correto

### Erro 400 (Bad Request)
- Verifique se a tabela `leads` foi criada
- Confirme se os nomes das colunas estão corretos

### Dados não aparecem
- Verifique o console do navegador (F12)
- Confirme se não há erros de CORS
- Teste a API diretamente via Postman/Insomnia

## 🔒 Segurança

### Boas Práticas

1. **Nunca commite o API Token**:
   - Use variáveis de ambiente
   - Configure no GitHub Secrets
   - Use um proxy/backend para esconder o token

2. **Rate Limiting**:
   - Implemente validação no frontend
   - Configure limites no Cloudflare

3. **Validação de Dados**:
   - Sempre valide no backend
   - Use sanitização de inputs

### Configuração Segura (Recomendada)

Para produção, configure um backend que:
1. Recebe os dados do frontend
2. Valida e sanitiza os dados
3. Envia para o Cloudflare com o token seguro
4. Retorna resposta para o frontend

## 📊 Analytics e Relatórios

### Métricas Importantes

- **Taxa de conversão**: Leads / Visitantes
- **Horários de pico**: Quando mais pessoas preenchem
- **Dispositivos**: Mobile vs Desktop
- **Origem do tráfego**: Google, Facebook, etc.

### Relatórios Automáticos

Configure notificações para:
- Novas leads (email/Slack)
- Relatórios diários/semanais
- Alertas de picos de tráfego

## 🆘 Suporte

Se encontrar problemas:

1. **Verifique a documentação**: [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
2. **Console do navegador**: F12 > Console para erros
3. **Logs do Cloudflare**: Dashboard > Analytics
4. **Teste a API**: Use Postman para testar diretamente

## 📈 Próximos Passos

1. **Integração com CRM**: Conecte com HubSpot, Pipedrive, etc.
2. **Automação**: Configure workflows no Zapier
3. **Analytics**: Integre com Google Analytics
4. **A/B Testing**: Teste diferentes versões do formulário
5. **Backup**: Configure backup automático dos dados
