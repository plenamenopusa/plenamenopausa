# Plena Menopausa - Landing Page

Landing page para captação de leads da Plena Menopausa, plataforma de telemedicina especializada no cuidado da saúde da mulher no climatério e menopausa.

## 🚀 Funcionalidades

- **Design Responsivo**: Otimizado para mobile e desktop
- **Formulário de Captura**: Coleta nome, data de nascimento, email e WhatsApp
- **Validação em Tempo Real**: Validação de dados durante o preenchimento
- **Integração Cloudflare**: Armazenamento seguro dos dados
- **Fallback de Envio**: Sistema alternativo caso o Cloudflare não esteja disponível
- **Otimizado para GitHub Pages**: Pronto para deploy

## 📱 Campos do Formulário

- **Nome Completo**: Validação de mínimo 2 caracteres
- **Data de Nascimento**: Validação de idade (18-100 anos)
- **E-mail**: Validação de formato de email
- **WhatsApp**: Máscara automática (11) 99999-9999

## 🎨 Design

- **Paleta de Cores**: Rosa (#E91E63), Teal (#009688), Branco
- **Tipografia**: Inter (Google Fonts)
- **Ícone da Marca**: Borboleta (🦋)
- **Layout**: Mobile-first, responsivo

## ⚙️ Configuração do Cloudflare

### 1. Criar Conta e Banco de Dados

1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Vá para "Workers & Pages" > "D1 SQL Database"
3. Crie um novo banco de dados
4. Execute o SQL abaixo para criar a tabela:

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

### 2. Obter Credenciais

1. **Account ID**: Encontre em "My Profile" > "API Tokens"
2. **Database ID**: Encontre na página do seu banco D1
3. **API Token**: Crie um token com permissões D1:Edit

### 3. Configurar no Código

Edite o arquivo `script.js` e atualize as constantes:

```javascript
const CLOUDFLARE_API_URL = 'https://api.cloudflare.com/client/v4/accounts/SEU_ACCOUNT_ID/d1/database/SEU_DATABASE_ID/execute';
const CLOUDFLARE_API_TOKEN = 'SEU_API_TOKEN';
```

## 🚀 Deploy no GitHub Pages

### 1. Criar Repositório

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/plena-menopausa.git
git push -u origin main
```

### 2. Configurar GitHub Pages

1. Vá para "Settings" do repositório
2. Role até "Pages"
3. Em "Source", selecione "Deploy from a branch"
4. Escolha "main" branch e "/ (root)"
5. Clique em "Save"

### 3. Acessar o Site

O site estará disponível em:
`https://SEU_USUARIO.github.io/plena-menopausa`

## 📊 Monitoramento dos Dados

### Acessar Dados no Cloudflare

1. Acesse o dashboard do Cloudflare
2. Vá para "Workers & Pages" > "D1 SQL Database"
3. Selecione seu banco de dados
4. Use a aba "Console" para executar queries:

```sql
-- Ver todas as leads
SELECT * FROM leads ORDER BY data_cadastro DESC;

-- Contar total de leads
SELECT COUNT(*) as total_leads FROM leads;

-- Leads por mês
SELECT 
    strftime('%Y-%m', data_cadastro) as mes,
    COUNT(*) as total
FROM leads 
GROUP BY strftime('%Y-%m', data_cadastro)
ORDER BY mes DESC;
```

## 🔧 Alternativas de Armazenamento

Se preferir não usar Cloudflare, você pode:

### 1. EmailJS (Recomendado para início)

1. Crie conta em [EmailJS](https://www.emailjs.com/)
2. Configure um template de email
3. Substitua a função `sendEmailFallback` no `script.js`

### 2. Formspree

1. Crie conta em [Formspree](https://formspree.io/)
2. Configure o endpoint no formulário
3. Atualize o `action` do formulário

### 3. Netlify Forms

1. Deploy no Netlify
2. Adicione `netlify` ao formulário
3. Configure no dashboard do Netlify

## 📱 Otimizações Mobile

- **Viewport**: Configurado para dispositivos móveis
- **Touch Targets**: Botões com tamanho adequado (44px+)
- **Formulário**: Campos otimizados para teclado mobile
- **Performance**: Carregamento rápido em 3G
- **Acessibilidade**: Suporte a leitores de tela

## 🎯 SEO e Performance

- **Meta Tags**: Configuradas para SEO
- **Favicon**: Ícone da borboleta
- **Lazy Loading**: Imagens otimizadas
- **Compressão**: CSS e JS minificados
- **Core Web Vitals**: Otimizado para métricas do Google

## 📞 Contato

- **WhatsApp**: (11) 94348-4300
- **CEO**: Dr. Romão Ferreira
- **Website**: www.plenamenopausa.com.br

## 📄 Licença

© 2024 Plena Menopausa. Todos os direitos reservados.
