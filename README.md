## ts-node-dev

- NPM Script: `ts-node-dev --transpileOnly --ignore-watch node_modules index.ts`
- ts-node-dev = tsc + node + nodemon
- `--transpileOnly`
  - Nao verifica se o codigo esta certo nem a tipagem, só executa. o vscode ja faz essa checagem durante desenvolvimento
- `--ignore-watch node_modules`
  - Nao precisa ficar escutando alterações no node_modules
- `--inspect`
  - Usado para debugger
- `--respawn`
  - Não deixa nenhum processo vivo e faz o restart da aplicação
- `--no-notify`
  - Desabilita notificação ao reiniciar a aplicação

## tsconfig.json

- `allowJs` - Permite usar javascript no projeto. Geralmente é usado para migrar a linguagem do projeto aos poucos
- `typeRoots` - Configuraçào dos diretorios onde os tipos serão procurados
- `resolveJsonModule` - Permite a importanção de arquivos json
- `paths` - Importação de paths personalizados como `import UsersController from '@contorllers/UsersController'`
  - Para que os paths funcionem com o ts-node-dev é necessario adicionar uma dependencia de desenvolvimento: `npm i -D tsconfig-paths` e uma flag no comando do ts-node-dev para executar um script antes da transpilação: `ts-node-dev -r tsconfig=paths/register --respawn --transpileOnly --ignore-watch node_modules index.ts`
  - Exemplo:

  ```json
  {
    "baseURL": ".",
    "compilerOptions": {
      "paths": {
        "@controllers/*": ["./src/controllers/*"]
      }
    }
  }
  ```
