# Publicação na Hostinger

O deploy recomendado usa o GitHub. As fotos pesadas de `public-media` ficam fora do
repositório; quando uma foto local não existe, o servidor usa a URL pública indexada.

## Configuração do aplicativo

1. No hPanel, escolha **Adicionar site → Aplicação web Node.js → Importar GitHub**.
2. Selecione `dugaduarte123-svg/loop-leiloes`, branch `main`.
3. Use o tipo **Other**, Node.js 20 ou superior e a raiz do repositório.
4. Arquivo de entrada: `server.js`.
5. Comando inicial: `npm start`.
6. O projeto não possui etapa de build nem dependências externas.

## Variáveis obrigatórias no hPanel

```text
NODE_ENV=production
LOOP_ADMIN_PASSWORD=UMA_SENHA_UNICA_COM_PELO_MENOS_16_CARACTERES
LOOP_TRUST_PROXY=true
LOOP_SECURE_COOKIES=true
```

Não coloque a senha em arquivos do projeto, commits ou mensagens públicas. Sem uma
senha válida, o painel `/admin` permanece desativado por segurança.

## Persistência

Por padrão, os dados locais ficam em `data/local-db.json`, que não é enviado ao GitHub.
Para preservar métricas e cadastros entre novos deploys, configure `LOOP_DB_FILE` com
um caminho gravável e persistente fora da pasta de build da aplicação. O diretório é
criado automaticamente pelo servidor. Reinícios preservam o arquivo; novos deploys só
o preservam quando o caminho configurado fica fora da pasta substituída.

Depois do deploy, confirme que `/health` responde com `{"status":"ok"}` e que o
domínio abre usando HTTPS.
