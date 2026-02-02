# Método Zero v17

Framework de landing pages com zero build step. Sem npm, node, webpack. Apenas HTML, CSS e JavaScript puros com infraestrutura 100% Netlify.

---

## Fluxo de Criação

```
/copy → /design → /layout → /build → /main
```

Cada workflow PARA completamente ao finalizar. O usuário deve chamar explicitamente o próximo comando.

### 1. `/copy`
Cria os textos persuasivos da landing page. Gera o arquivo `copy.md` com toda a copy estruturada por seções.

### 2. `/design`
Define a identidade visual criando uma **demonstração real**: Hero + primeira seção. Coleta referências, cores e preferências do usuário.

### 3. `/layout`
Transforma a copy e o design aprovado em uma **especificação exaustiva** de diretor de arte. Gera o arquivo `layout.md` detalhando cada seção.

### 4. `/build`
Constrói a página completa seguindo fielmente a especificação do `layout.md`.

### 5. `/main`
Faz o deploy para produção. Configura Git + GitHub + Netlify com CI/CD automático.

---

## Workflows Opcionais

| Comando | Função |
|---------|--------|
| `/otimizar` | Aplica checklist de performance (PageSpeed 90+) |
| `/preview` | Cria Deploy Preview via Pull Request |
| `/visualizar` | Inicia servidor local (porta 8888) |

---

## Estrutura do Projeto

```
projeto/
├── index.html      # Página principal
├── style.css       # Estilos (mobile-first)
├── script.js       # JavaScript (AOS + Forms)
├── netlify.toml    # Configuração Netlify
├── images/         # Imagens do projeto
├── copy.md         # [gerado] Copy estruturada
└── layout.md       # [gerado] Especificação de layout
```

---

## Regras dos Workflows

1. Cada workflow tem **escopo definido** e não faz mais do que deve
2. Ao finalizar, o workflow **PARA** e aguarda comando explícito
3. Mesmo com aprovação ("ok", "aprovado"), o workflow **não continua automaticamente**
4. O usuário deve digitar o próximo comando explicitamente

---

## Servidor Local (Netlify Dev)

O Netlify Dev é **obrigatório** para visualização local porque:
- CDN de imagens (`/.netlify/images`) só funciona com ele
- Simula redirects do netlify.toml
- Testa formulários Netlify
- Mostra o site exatamente como vai ao ar

### Portas Utilizadas

| Porta | Função | Flag CLI |
|-------|--------|----------|
| **8888** | Porta principal (acesso ao site) | `--port` |
| **3999** | Porta interna (live reload/funções) | `--functions-port` |

### Iniciando o Servidor

**Padrão:**
```bash
netlify dev
```

**Evitar conflitos (usar portas alternativas):**
```bash
netlify dev --port 8889 --functions-port 4000
```

---

## Troubleshooting

### Erro: `EADDRINUSE ::1:3999`

**Causa:** A porta INTERNA 3999 está ocupada por outro processo Netlify (provavelmente rodando em outro projeto).

**Solução A (Preferida) - Usar porta alternativa:**
```bash
netlify dev --functions-port 4000
```

**Solução B - Matar o processo:**
```bash
# Identificar e matar
kill -9 $(lsof -t -i :3999)

# Iniciar servidor
netlify dev
```

**IMPORTANTE:** Mudar apenas a porta principal (8888 → 8889) **NÃO** resolve este erro! Use `--functions-port`.

---

### Erro: `Could not acquire required 'port': '8888'`

**Causa:** A porta principal 8888 está ocupada.

**Solução:**
```bash
# Opção A: Usar outra porta
netlify dev --port 8889

# Opção B: Matar processo existente
kill -9 $(lsof -t -i :8888)
netlify dev
```

---

### Erro: `netlify: command not found`

**Causa:** Netlify CLI não está instalado.

**Solução:**
```bash
npm install -g netlify-cli
```

---

### Diagnóstico Completo

Execute este script para verificar todas as portas:

```bash
echo "=== Diagnóstico de Portas Netlify ===" && \
echo "" && \
echo "Porta 3999 (interna):" && \
(lsof -i :3999 2>/dev/null || echo "  LIVRE") && \
echo "" && \
echo "Porta 8888 (principal):" && \
(lsof -i :8888 2>/dev/null || echo "  LIVRE") && \
echo "" && \
echo "Processos Netlify rodando:" && \
(pgrep -fl "netlify" || echo "  Nenhum")
```

---

## Começando

```bash
# Copie o framework para uma nova pasta
cp -r framework-v17 meu-projeto
cd meu-projeto

# Inicie o servidor local
netlify dev

# Comece pelo workflow de copy
# Use: /copy
```
