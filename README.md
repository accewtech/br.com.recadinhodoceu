# Message from Heaven

Aplicação Next.js para criar cards de mensagens e baixar a arte em PNG.

## Executar

```bash
yarn install
yarn dev
```

Configure a autenticação antes de acessar o editor:

1. Copie `.env.example` para `.env.local`.
2. Defina `AUTH_USERNAME` com o usuário de acesso em `.env.local` (por exemplo, `AUTH_USERNAME=admin`).
3. Gere o hash scrypt da senha com Node.js:

   ```bash
   node -e "const {randomBytes,scryptSync}=require('node:crypto'); const readline=require('node:readline').createInterface({input:process.stdin,output:process.stdout}); readline.question('Senha: ', password => {const salt=randomBytes(16); console.log(salt.toString('hex')+String.fromCharCode(92,36)+scryptSync(password,salt,64).toString('hex')); readline.close();})"
   ```

   Copie o resultado, incluindo a barra invertida antes de `$`, para `AUTH_PASSWORD_HASH`. O Next.js usa `$` para expansão de variáveis no `.env`; a barra invertida preserva o separador, e a aplicação recebe o valor sem a barra. O valor contém um salt aleatório de 16 bytes e um hash scrypt de 64 bytes, ambos em hexadecimal e separados por `$`.

4. Gere um segredo JWT com pelo menos 32 bytes:

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
   ```

   Copie o resultado para `JWT_SECRET`. Não compartilhe nem versione `.env.local`.

Abra `http://localhost:3000`. A página inicial `/` é pública; `/login` permite autenticação. As páginas `/v1` e `/v2` exigem a sessão JWT no cookie `HttpOnly`. As APIs de geração de imagem aceitam essa sessão pelo cookie ou pelo header `Authorization: Bearer <token>`. Para clientes de API, use o valor JWT do cookie `recadinho_session` recebido no header `Set-Cookie` pela resposta de login como bearer token. O JWT é assinado e verificado com `jsonwebtoken` usando HS256, expira após uma hora e o cookie usa `Secure` em produção. Para encerrar a sessão do navegador, use a opção de sair no editor.

Credenciais ou segredo ausentes ou inválidos deixam a autenticação indisponível; configure as variáveis de ambiente corretamente antes de iniciar a aplicação.

## Contribuir

Instale as dependências com `yarn install`. O Husky configura automaticamente o hook `pre-commit`, que executa `yarn lint` antes de cada commit. Commits com erros de lint são bloqueados.

No Windows, a API usa uma instalação local do Google Chrome. Se ele estiver em um caminho diferente do padrão, defina `CHROME_EXECUTABLE_PATH`. Em ambientes serverless Linux, o Chromium é fornecido pela dependência do projeto; reserve pelo menos 512 MB de memória para a função.

## API

As interfaces estão disponíveis em `/v1` e `/v2`. A rota `/` mantém a interface da v1. A API atual permanece disponível em `POST /api/message` e também em `POST /api/v1/message`.

As páginas ficam em `pages/`, usando o Pages Router. As regras e componentes de cada versão ficam em `src/v1` e `src/v2`; os recursos compartilhados ficam em `src/shared`. As Route Handlers das APIs permanecem organizadas em `app/api/v1` e `app/api/v2`.

`POST /api/v1/message` recebe `gospel`, `book`, `messageOfDay` e `account` como campos obrigatórios e aceita `color` opcional, que deve ser um valor da paleta do projeto. A v1 trata `messageOfDay` como texto simples.

`POST /api/v2/message` recebe os mesmos campos e gera uma imagem WebP (`image/webp`) de 896 × 1120. Na v2, `messageOfDay` aceita Markdown, incluindo negrito, itálico, listas e links. Use `<mark>texto</mark>` para destacar explicitamente um trecho; apenas essa tag, sem atributos, ativa o destaque. HTML arbitrário no conteúdo é escapado. Sem `color`, ambas as APIs sorteiam uma opção da paleta. Na tela, os botões baixam a prévia como PNG de 1080 × 1350.

```json
{
  "gospel": "NÃO TE DIGO ATÉ SETE VEZES, MAS ATÉ SETENTA VEZES SETE.",
  "book": "Mateus 18, 22",
  "messageOfDay": "**Perdoar** é um ato de <mark>amor e liberdade</mark>.",
  "account": "@recadinhodoceu__"
}
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/v1/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
