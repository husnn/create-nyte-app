# Create NYTE App

Generate a new TypeScript boilerplate monorepo using Yarn Workspaces and clean architecture principles.

**N** - Next.js
**Y** - Yarn Workspaces
**T** - TypeScript
**E** - Express

## Usage

### NOTE: Until published on npm

1. Clone the repo
2. `npm run build`
3. `npm link`
4. `create-nyte-app` in desired directory

#### npm

    npx create-nyte-app

#### Yarn

    yarn create nyte-app

## Background

This project structure was developed over time to best serve my own needs for full-stack projects of all sizes. It has served me quite well and would like to share it with everyone. Of course, it's nothing complicated or unique, it is simply a collection of standards/practices that happen to work best for my purposes.

## Architecture

### Example project

- your-project/
  - packages/ - can depend on each other but **not** on a service
    - core/ - model, interfaces and business logic. can only depend on _shared_ package.
    - shared/ - helpers, DTOs, enums and types shared across services. cannot depend on any other package.
    - postgres/ - example of a db package containing specific config, schemas and repositories.
    - your-package/
  - services/ - can depend on each other **and** packages
    - api/ - Express app
    - web/ - React/Next.js app
    - your-service/
  - package.json

### Imports

To import something from a different package/service, it first needs to exported in the index.ts file of the owning package. It can then be imported on a dependant package with a destructured import like `import { Login } from '@your-app/core'`.

### Docker

A docker-compose.yml file and/or a base Dockerfile can be created in the root of the project. Separate Dockerfiles can be added to individual services.

### The _core_ package

Independent of any internal/external dependency, it cannot be reliant on a specific library or technology. It should only contain core entities, interfaces, use cases, etc. It should logically be a complete app by itself.

Even database implementations should only be injected later on, from within a service (in your Express app for example). The _core_ package will, for example, contain the IUserRepository interface but then your database package (MySql, PostgresDB, MongoDB, etc.) will implement this interface and create a concrete UserRepository. ORMs like Mongoose, Sequelize and TypeORM will also be installed in your database package, not in the _core_ package.

```TypeScript
// ./packages/core/src/repositories/UserRepository.ts

interface UserRepository {
    findByUsername(id: string): Promise<User>;
}

// ./packages/mongodb/src/repositories/UserRepository.ts

import { UserRepository as IUserRepository } from '@your-app/core'

class UserRepository implements IUserRepository {
    async findByUsername(username: string): Promise<User> {
        ...
    }
}
```

### Use cases

Use cases can be thought of the different tasks your user or app can perform (for example Login). Using NYTE principles, a use case will not depend on any external implementation.

A Login use case for instance, will take in the username and password, query the user repository for that username, match the password and return an appropriate response back to the calling service (like Express). _core_ will never expose itself to the user directly.

```TypeScript
// ./packages/core/src/usecases/Login.ts

import { CurrentUserDTO } from '@your-app/shared';
import { UserRepository } from '../repositories';

type LoginInput = {
    username: string;
    password: string;
}

type LoginOutput = {
    user?: CurrentUserDTO;
}

export class Login {
    private userRepository: UserRepository;

    // An instance of a concrete UserRepository from a database package
    // will be passed by your service
    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(data: LoginInput): Promise<LoginOutput> {
        const user = await this.userRepository.findByUsername(data.username);
        ...
    }
}
```

Also, before returning the database entity of the logged in user, the use case could take the user information, remove sensitive fields (like the hashed password) and return it as a CurrentUserDTO. A DTO will typically be stored in the _shared_ package and is simply a another version of the entity but is more suited to a specific purpose.

We want this to be something we feel comfortable moving around and doesn't expose things which are too senstive or unnecessary. In this case, CurrentUserDTO can simply be a data class containing the user's name and email address.

### Services

The _core_ package cannot interact with any internal/external services. So how would a use case, like ResetPassword, send a reset email?

Quite simply, _core_ will contain an interface for any service it may want to utilise. The actual service will implement this and be passed to the use case by the utilising service.

```TypeScript
// ./packages/core/src/base/Email.ts

export class Email {
  emailAddress: string;
  subject: string;
  content: string;

  constructor(emailAddress: string, subject: string, content: string) {
    this.emailAddress = emailAddress;
    this.subject = subject;
    this.content = content;
  }
}

// ./packages/core/src/services/EmailService.ts

export interface EmailService {
  sendEmail(email: Email): Promise<void>;
}

// ./packages/api/src/services/EmailService.ts

import { EmailService as IEmailService } from '@your-app/core';

export class EmailService implements IEmailService {
  sendEmail(email: Email): Promise<void> {
    const msg = {
      to: email.emailAddress,
      from: process.env.FROM_EMAIL_ADDRESS,
      subject: email.subject,
      text: email.content
    };

    // Your service can have external dependencies
    // and rely on specific technologies.
    sendgrid.send(msg);
  }
}
```

```TypeScript
// ./packages/api/src/controllers/UserController.ts

import { EmailService, ResetPassword } from '@your-app/core';

export class UserController {
  private resetPasswordUseCase: ResetPassword;

  constructor(emailService: EmailService) {
    this.resetPasswordUseCase = new ResetPassword(emailService);
  }
}

// ./packages/api/src/App.ts

import { UserController } from './controllers';
import { EmailService } from './services'; // Actual service implementation

const emailService = new EmailService();
const userController = new UserController(emailService);
```
