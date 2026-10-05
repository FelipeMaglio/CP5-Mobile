# CheckPoint 5 — App com Autenticação e Firestore (Lista de Tarefas)

**Curso:** Tecnologia em Desenvolvimento de Sistemas - 2TDS
**Componente Curricular:** Mobile Application Development
**Professor:** Fernando Pinéo
**Turma:** 2TDS

## Integrantes
- Felipe Maglio Filho — RM563512
- Mateus Granja dos Santos — RM564930

## Descrição do projeto
Aplicativo mobile desenvolvido em **React Native (Expo)** com integração ao **Firebase Authentication**, permitindo cadastro, login, logout, recuperação de senha, exclusão de conta e persistência de sessão via **AsyncStorage**.

### Funcionalidades implementadas
- Cadastro de usuário (nome, e-mail, senha, confirmação) com validações de campos obrigatórios, formato de e-mail e senhas iguais
- Login com e-mail e senha, com mensagens de erro adequadas
- Persistência da sessão: o app reabre já autenticado, sem exigir novo login
- Logout, removendo a sessão local
- Recuperação de senha via e-mail (Firebase)
- Exclusão de conta, com confirmação prévia, removendo o usuário do Firebase e os dados locais
- Bloqueio de acesso às telas autenticadas para usuários não logados

### Evolução do CheckPoint 5 (Cloud Firestore)
Tema: **Lista de tarefas** (título, descrição, data e status).
- **Create:** formulário com 4 campos e validação (campos vazios e data inválida)
- **Read:** listagem carregada do Firestore, com mensagem "Nenhum registro encontrado." e pull-to-refresh
- **Update:** edição de uma tarefa existente, refletida na lista
- **Delete:** exclusão com confirmação e feedback de sucesso
- **Perfil:** nome, e-mail, logout e exclusão de conta (Firebase Auth)
- Cada usuário vê apenas seus registros: `usuarios/{uid}/registros/{id}`

## Tecnologias utilizadas
- Cloud Firestore (`firebase/firestore`)
- React Native + Expo
- Firebase Authentication (`firebase` JS SDK)
- AsyncStorage (`@react-native-async-storage/async-storage`)
- React Navigation (native-stack)

## Configuração do Firebase
1. Crie um projeto em https://console.firebase.google.com
2. Ative o método de login **E-mail/Senha** em *Authentication > Sign-in method*
3. Copie as credenciais do projeto (Configurações do projeto > Seus apps > Web)
4. Crie o banco em *Firestore Database* e publique as regras do arquivo `firestore.rules` (aba Regras)
5. Cole os valores em `src/config/firebase.js` no objeto `firebaseConfig`

## Instalação e execução
```bash
npm install
npx expo start
```
Escaneie o QR code com o app **Expo Go** (Android/iOS) ou rode em um emulador.

## Estrutura do projeto
```
CP5-Mobile/
├── App.js
├── app.json
├── package.json
├── firestore.rules          # regras de segurança do Firestore
└── src/
    ├── config/firebase.js       # inicialização do Firebase + persistência
    ├── context/AuthContext.js   # regras de negócio de autenticação
    ├── services/tarefasService.js  # CRUD no Firestore
    ├── navigation/index.js      # rotas públicas/privadas
    └── screens/
        ├── LoginScreen.js
        ├── SignUpScreen.js
        ├── ForgotPasswordScreen.js
        ├── HomeScreen.js
        ├── TarefasListScreen.js
        ├── TarefaFormScreen.js
        └── ProfileScreen.js
```
