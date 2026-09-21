# Publicação na Vercel

1. Suba esta pasta para um repositório Git ou importe-a diretamente na Vercel.
2. Deixe o framework como **Other**. O arquivo `vercel.json` já aponta todas as rotas para a função Node.
3. Configure a variável de ambiente `LOOP_ADMIN_PASSWORD` com uma senha forte para o painel `/admin`.
4. Faça o deploy e teste `/`, `/estoque`, um lote e `/admin`.

O cache local de fotos não é enviado: ele ocupa mais de 11 GB e o servidor usa o fallback oficial das imagens. O banco local do painel usa `/tmp` na Vercel; para métricas persistentes em produção, conecte depois um banco externo através de `LOOP_DB_FILE`/API.
