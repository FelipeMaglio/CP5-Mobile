# CheckPoint 5 — App com Autenticação e Firestore (Lista de Tarefas)

**Curso:** Tecnologia em Desenvolvimento de Sistemas - 2TDS
**Componente Curricular:** Mobile Application Development
**Professor:** Fernando Pinéo

## Integrantes
- Felipe Maglio Filho — RM563512
- Mateus Granja dos Santos — RM564930

## Vídeo de demonstração
https://youtu.be/lwUeggh1Gvc

## Descrição do projeto
Aplicativo mobile de **lista de tarefas** desenvolvido em **React Native (Expo)**, evolução do CheckPoint 4. Mantém toda a autenticação com **Firebase Authentication** e adiciona o **Cloud Firestore** como banco de dados, com CRUD completo e dados isolados por usuário.

### Autenticação (CP4, mantida)
- Cadastro (nome, e-mail, senha e confirmação) com validações
- Login com mensagens de erro adequadas
- Persistência da sessão com AsyncStorage (o app reabre já autenticado)
- Logout
- Recuperação de senha por e-mail
- Exclusão de conta, com confirmação prévia
- Telas autenticadas inacessíveis para usuários não logados
- A senha não é armazenada no Firestore nem no AsyncStorage

### Firestore (CP5)
Tema: **lista de tarefas**, com os campos título, descrição, data e status.

| Operação | Funcionalidade |
|---|---|
| Create | Formulário com 4 campos e validação (campos vazios e data inválida) |
| Read | Listagem carregada do Firestore, com a mensagem "Nenhum registro encontrado." quando vazia |
| Update | Edição de uma tarefa existente; a lista mostra o dado atualizado |
| Delete | Exclusão com confirmação ("Tem certeza que deseja excluir este registro?") e feedback de sucesso |

Também há uma tela de **Minha conta** com nome, e-mail, logout e exclusão de conta, obtidos do Firebase Authentication.

### Relação dos dados com o usuário autenticado
Os registros ficam em uma subcoleção do usuário:

```
usuarios
 └── {uid do usuário}
      └── registros
           ├── {id da tarefa}
           └── {id da tarefa}
```

As regras de segurança (`firestore.rules`) permitem que cada usuário leia e escreva somente em `usuarios/{seu uid}/registros`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{uid}/registros/{registroId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## Tecnologias utilizadas
- React Native + Expo
- Firebase Authentication
- Cloud Firestore
- AsyncStorage (`@react-native-async-storage/async-storage`)
- React Navigation (native-stack)

## Como executar
Pré-requisito: Node.js (LTS) e o app **Expo Go** no celular (ou um emulador Android).

```bash
git clone https://github.com/FelipeMaglio/CP5-Mobile.git
cd CP5-Mobile
npm install
npx expo start
```

Escaneie o QR code com o Expo Go, ou aperte `a` para abrir no emulador Android.

A configuração do Firebase está em `src/config/firebase.js`. Para usar outro projeto Firebase:
1. Ative **E-mail/senha** em Authentication.
2. Crie o banco em Firestore Database e publique as regras do arquivo `firestore.rules`.
3. Troque os valores de `firebaseConfig` em `src/config/firebase.js`.

> O arquivo `metro.config.js` é necessário para o Firebase Auth funcionar com o Expo atual. Não remova.

## Estrutura do projeto
```
CP5-Mobile/
├── App.js
├── app.json
├── package.json
├── metro.config.js
├── firestore.rules             # regras de segurança do Firestore
└── src/
    ├── config/firebase.js      # inicialização do Firebase, Auth e Firestore
    ├── context/AuthContext.js  # regras de negócio de autenticação
    ├── services/tarefasService.js  # CRUD no Firestore
    ├── navigation/index.js     # rotas públicas/privadas
    └── screens/
        ├── LoginScreen.js
        ├── SignUpScreen.js
        ├── ForgotPasswordScreen.js
        ├── HomeScreen.js
        ├── TarefasListScreen.js
        ├── TarefaFormScreen.js
        └── ProfileScreen.js
```
