# Instruções para Deploy no GitHub Pages

## 📁 Preparação das Imagens

### 1. Criar pasta de imagens
```bash
mkdir images
```

### 2. Adicionar as imagens das mulheres
Coloque as seguintes imagens na pasta `images/`:

- `hero-woman.jpg` - Mulher médica (Hero Section)
- `stats-woman.jpg` - Mulher escrevendo (Statistics Section)  
- `stages-woman.jpg` - Mulher em meditação (Stages Section)

### 3. Atualizar o HTML com as imagens reais

Substitua as imagens SVG temporárias por:

```html
<!-- Hero Section -->
<img src="images/hero-woman.jpg" alt="Mulher médica" class="hero-woman-img">

<!-- Statistics Section -->
<img src="images/stats-woman.jpg" alt="Mulher escrevendo" class="woman-writing-img">

<!-- Stages Section -->
<img src="images/stages-woman.jpg" alt="Mulher em meditação" class="woman-meditation-img">
```

## 🚀 Deploy no GitHub

### 1. Inicializar repositório
```bash
git init
git add .
git commit -m "Initial commit - Plena Menopausa Landing Page"
```

### 2. Conectar ao repositório remoto
```bash
git remote add origin https://github.com/plenamenopusa/plenamenopausa.git
git branch -M main
git push -u origin main
```

### 3. Configurar GitHub Pages

1. Acesse: https://github.com/plenamenopusa/plenamenopausa
2. Vá para **Settings** (Configurações)
3. Role até **Pages** no menu lateral
4. Em **Source**, selecione **Deploy from a branch**
5. Escolha **main** branch e **/ (root)**
6. Clique em **Save**

### 4. Acessar o site
O site estará disponível em:
**https://plenamenopusa.github.io/plenamenopausa**

## 📱 Otimização das Imagens

### Tamanhos recomendados:
- **Hero woman**: 400x400px (quadrada)
- **Stats woman**: 300x300px (quadrada)  
- **Stages woman**: 300x300px (quadrada)

### Formatos suportados:
- JPG (recomendado para fotos)
- PNG (para transparência)
- WebP (melhor compressão)

### Compressão:
Use ferramentas como:
- TinyPNG.com
- Squoosh.app
- ImageOptim (Mac)

## 🔧 Configuração do Cloudflare

### 1. Criar conta no Cloudflare
- Acesse: https://dash.cloudflare.com/sign-up
- Crie uma conta gratuita

### 2. Configurar D1 Database
- Vá para "Workers & Pages" > "D1 SQL Database"
- Crie um novo banco: `plena-menopausa-db`
- Execute o SQL:

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

### 3. Obter credenciais
- **Account ID**: My Profile > API Tokens
- **Database ID**: Página do banco D1
- **API Token**: Create Token com permissões D1:Edit

### 4. Atualizar script.js
```javascript
const CLOUDFLARE_API_URL = 'https://api.cloudflare.com/client/v4/accounts/SEU_ACCOUNT_ID/d1/database/SEU_DATABASE_ID/execute';
const CLOUDFLARE_API_TOKEN = 'SEU_API_TOKEN';
```

## 📊 Monitoramento

### Verificar leads no Cloudflare:
```sql
SELECT * FROM leads ORDER BY data_cadastro DESC;
```

### Analytics:
- Google Analytics (opcional)
- GitHub Pages Analytics
- Cloudflare Analytics

## 🎯 Checklist Final

- [ ] Imagens adicionadas na pasta `images/`
- [ ] HTML atualizado com caminhos corretos
- [ ] Repositório criado no GitHub
- [ ] Código enviado para o GitHub
- [ ] GitHub Pages configurado
- [ ] Cloudflare configurado
- [ ] Formulário testado
- [ ] Site acessível via URL

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console do navegador (F12)
2. Confirme se as imagens estão na pasta correta
3. Teste o formulário localmente primeiro
4. Verifique as configurações do Cloudflare

**URL Final**: https://plenamenopusa.github.io/plenamenopausa
