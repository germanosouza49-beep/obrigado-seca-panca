---
description: previsualizar
---

# Instruções

O usuário quer criar um Deploy Preview (PR) para testar antes de ir para produção.

## Por Que Usar Preview?

- Commits para `main` = deploy de produção
- Pull Requests = Deploy Preview (link temporário para testar)

O Deploy Preview é ideal para:
- Testar alterações antes de aprovar
- Mostrar para cliente revisar

---

## Processo Completo

### 1. Criar branch e PR

```bash
# Criar branch
git checkout -b preview/alteracoes

# Commitar alterações
git add .
git commit -m "Preview: Descrição das alterações"

# Push e criar PR
git push -u origin preview/alteracoes
gh pr create --title "Preview: Descrição" --body "Alterações para revisão"
```

### 2. Aguardar o Deploy Preview

Após criar o PR, aguarde o Netlify processar:

```bash
gh pr checks {NUMERO_PR} --watch
```

Este comando aguarda até todos os checks completarem.

### 3. Obter o link do Deploy Preview

Após os checks completarem, extraia o link:

```bash
gh pr checks {NUMERO_PR} --json name,link --jq '.[] | select(.name | contains("netlify")) | .link'
```

Se o comando acima não retornar nada, tente:

```bash
gh pr checks {NUMERO_PR}
```

E procure a linha do Netlify - o link estará na coluna final.

### 4. Informar ao usuário

Forneça:
- O link do Deploy Preview (URL do Netlify)
- O link do PR no GitHub (para referência)

---

## Resumo do Fluxo

```
1. Criar branch e PR
2. Aguardar checks: gh pr checks {PR} --watch
3. Extrair link: gh pr checks {PR} (procurar URL do Netlify)
4. Informar o link do PREVIEW ao usuário (não só o link do PR)
```

**IMPORTANTE:** O valor para o usuário é o **link do preview**, não o link do PR.

---

## Para Aprovar (quando o usuário solicitar)

```bash
gh pr merge {NUMERO_PR} --merge
```

---

## Ao Finalizar

Após fornecer o link do Deploy Preview:
1. **PARE COMPLETAMENTE E AGUARDE**

**NUNCA** faça merge automaticamente.
