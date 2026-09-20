# Sistema de Autenticação JWT

Este é um projeto fullstack de um **Sistema de Login e Cadastro de Usuários**, desenvolvido com Node.js, Express e MongoDB no backend, e uma interface web moderna em HTML, CSS e JavaScript puro no frontend. O sistema utiliza **JSON Web Tokens (JWT)** para autenticação e segurança de rotas privadas.

---

##  Funcionalidades

- **Cadastro de Usuários (`/auth/register`):** Validação de campos, verificação de e-mails duplicados e criptografia de senha com `bcrypt`.
- **Login de Usuários (`/auth/login`):** Autenticação segura que retorna um Token JWT e o nome do usuário.
- **Armazenamento Local (`localStorage`):** O token e o nome do usuário são salvos no navegador para gerenciar a sessão.
- **Rota Protegida (`/user/:id`):** Exemplo de rota privada verificada por um middleware de token (`checkToken`).

---

##  Tecnologias Utilizadas

### **Backend:**
- **Node.js** & **Express** (Framework para API)
- **MongoDB & Mongoose** (Banco de dados NoSQL e ODM)
- **Bcrypt** (Criptografia de senhas)
- **JSON Web Token (JWT)** (Autenticação baseada em tokens)
- **CORS** (Liberação de requisições entre origens)
- **Dotenv** (Gerenciamento de variáveis de ambiente)
- **Nodemon** (Reinicialização automática do servidor durante o desenvolvimento)

### **Frontend:**
- **HTML5 & CSS3** (Interface e estilização)
- **JavaScript (Vanilla)** (Manipulação do DOM e requisições via `Fetch API`)
