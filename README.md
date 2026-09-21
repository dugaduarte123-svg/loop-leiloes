# Loop Leilao local

Projeto local criado a partir do material existente em `loopleiloes.com.br`.

## Executar

Requer Node.js 20 ou mais recente.

```powershell
cd "C:\Users\dugueta\Desktop\loop leilao meu"
npm start
```

Abra `http://localhost:3000`.

Para desenvolvimento com reinicio automatico:

```powershell
npm run dev
```

Para validar o servidor, as APIs e os assets:

```powershell
npm test
```

## Produção

Não existe senha administrativa padrão. Em produção, configure no provedor as
variáveis descritas em `.env.example`; o arquivo `.env` real nunca deve ser enviado
ao Git. Consulte `DEPLOY_HOSTINGER.md` para o passo a passo.

## Estrutura

- `s/`: copia consolidada e sem alteracoes dos 2.414 arquivos unicos das duas capturas recebidas.
- `server.js`: servidor web, backend e camada de compatibilidade das APIs.
- `test/`: testes de integracao executados somente com recursos nativos do Node.js.

O servidor entrega localmente a home e o cadastro originais compilados do Next.js, fontes, imagens, bundles e as rotas capturadas de eventos, lotes, busca, sessão, banners e notícias. As demais famílias de rotas do manifesto possuem telas locais responsivas para recuperação de senha, conta, condicionais, transmissão, notícias e fluxos informativos. Nenhuma dependência precisa ser instalada.

## Limite do material original

As duas pastas recebidas contêm o HTML e os bundles originais da home e do cadastro. O manifesto menciona outras telas, mas os arquivos compilados dessas telas e o banco de dados original não estavam nas capturas. Essas telas foram recriadas com o mesmo sistema visual e dados públicos disponíveis; autenticação, lances, pagamentos, documentos, SMS e transmissão são demonstrações locais e nunca enviam dados ao serviço oficial.
