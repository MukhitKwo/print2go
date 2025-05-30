## Configuração e Execução do Website Print2Go

Antes de executar o website Print2Go, é necessário garantir que o ambiente de desenvolvimento está devidamente configurado. Para tal, devem ser seguidos os seguintes passos:


1. **Instalar o PostgreSQL**  
   Assegure-se de que o PostgreSQL está instalado e corretamente configurado. [https://www.postgresql.org/].

2. **Instalar o Node.js**  
   Certifique-se de que o Node.js está instalado no seu sistema. Pode fazer o download em: [https://nodejs.org/].

3. **Conexão à Internet**  
   É importante ter acesso à Internet para carregar as bibliotecas externas (como Bootstrap e Three.js via CDN) e para proceder à instalação das dependências do projeto.

4. **Instalar as dependências do projeto**  
   Na **linha de comandos (cmd)**, na raiz do projeto, execute o seguinte comando para instalar todas as bibliotecas e pacotes necessários:

   npm install

5. **Executar o script de configuração da base de dados**  
   Para criar a base de dados e as suas respetivas tabelas, execute o seguinte comando:  

   npm run setup  

   Será solicitado o fornecimento dos dados de ligação à base de dados (host, porta, utilizador e palavra-passe).
   Como o host, a porta e o utilizador parecem ser sempre os mesmos, será apenas necessário indicar a palavra-passe e um nome para a base de dados.

6. **Iniciar o servidor**  
   Após a conclusão do procedimento de configuração, o servidor será iniciado automaticamente. Para iniciar a aplicação manualmente no futuro, basta executar:  

   npm start

Após estes procedimentos, a aplicação estará disponível localmente através do seguinte endereço: [http://localhost:3000]
